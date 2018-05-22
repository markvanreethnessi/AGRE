sap.ui.define([
		"sap/ui/base/Object",
		"sap/m/MessageBox"
	], function (UI5Object, MessageBox) {
		"use strict";

		return UI5Object.extend("gdprcockpit.controller.ErrorHandler", {

			/**
			 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
			 * @class
			 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
			 * @public
			 * @alias gdprcockpit.controller.ErrorHandler
			 */
			constructor : function (oComponent) {
				this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
				this._oComponent = oComponent;
				this._oModel = oComponent.getModel();
				this._bMessageOpen = false;
				this._sErrorText = this._oResourceBundle.getText("errorText");

				this._oModel.attachMetadataFailed(function (oEvent) {
					var oParams = oEvent.getParameters();

					this._showMetadataError(oParams.response);
				}, this);

				this._oModel.attachRequestFailed(function (oEvent) {
					var oParams = oEvent.getParameters();

					// An entity that was not found in the service is also throwing a 404 error in oData.
					// We already cover this case with a notFound target so we skip it here.
					// A request that cannot be sent to the server is a technical error that we have to handle though
					if (oParams.response.statusCode !== "404" || (oParams.response.statusCode === 404 && oParams.response.responseText.indexOf("Cannot POST") === 0)) {
						this._showServiceError(oParams.response);
					}
				}, this);
			},

			/**
			 * Shows a {@link sap.m.MessageBox} when the metadata call has failed.
			 * The user can try to refresh the metadata.
			 * @param {string} sDetails a technical error to be displayed on request
			 * @private
			 */
			_showMetadataError : function (sDetails) {
				MessageBox.error(
					this._sErrorText,
					{
						id : "metadataErrorMessageBox",
						details : sDetails,
						styleClass : this._oComponent.getContentDensityClass(),
						actions : [MessageBox.Action.RETRY, MessageBox.Action.CLOSE],
						onClose : function (sAction) {
							if (sAction === MessageBox.Action.RETRY) {
								this._oModel.refreshMetadata();
							}
						}.bind(this)
					}
				);
			},

			/**
			 * Shows a {@link sap.m.MessageBox} when a service call has failed.
			 * Only the first error message will be display.
			 * @param {string} sDetails a technical error to be displayed on request
			 * @private
			 */
			_showServiceError : function (sDetails) {
				if (this._bMessageOpen) {
					return;
				}
				this._bMessageOpen = true;
				
				// Declare message parameters
				var sShort; // short message text
				var sLong; // details
				
				//Check the message content type
				var contentType = sDetails.headers["Content-Type"];
				var parsedMessage, messageString, longText;
				
				if (contentType) {
					// string.indexOf('substring') will return the position of the substring. If the substring does not occur, the result will be -1.
					// -1 is truthy, but its bitwise inverse (0) is falsy.
					if(~contentType.indexOf('json')) {
						parsedMessage = JSON.parse(sDetails.responseText);
						messageString = parsedMessage.error.message.value;
						longText = parsedMessage.error.innererror;
					} else {
						// XML
						parsedMessage = jQuery.parseXML(sDetails.responseText);
						messageString = parsedMessage.querySelector("message").textContent;
						longText = sDetails.responseText;
					}
				} else {
					messageString = sDetails.message;
					longText = sDetails.responseText;
				}
				
				
				sShort = messageString;
				sLong = JSON.stringify(longText);
				
				/*if ( ~contentType.indexOf('xml')) {
					parsedMessage = jQuery.parseXML(sDetails.responseText);
				} else if(~contentType.indexOf('json')) {
					parsedMessage = JSON.parse(sDetails.responseText);
				} else {
					parsedMessage = jQuery.parseXML(sDetails.responseText);
				}*/
				
				
				/*// Check if the error message is a custom message. If so, only show a clean message. If not, show the standard technical details.
				var sCode = parsedMessage.error.code;
				var sMessageClassPrefix = sCode.charAt(0);
				
				if (sMessageClassPrefix == "Z") {
					sShort = parsedMessage.error.message.value;
					sLong = JSON.stringify(parsedMessage.error.innererror);
					
				} else {
					// Try also shortening the  message for standard sap errors
					sShort = parsedMessage.error.message.value;
					sLong = JSON.stringify(parsedMessage.error.innererror);
					
					sShort = this._sErrorText;
					sLong = sDetails;
					
				}
				*/
				
				
				MessageBox.error(
					sShort,
					{
						id : "serviceErrorMessageBox",
						details : sLong,
						styleClass : this._oComponent.getContentDensityClass(),
						actions : [MessageBox.Action.CLOSE],
						onClose : function () {
							this._bMessageOpen = false;
						}.bind(this)
					}
				);
			}

		});

	}
);