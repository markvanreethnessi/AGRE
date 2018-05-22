sap.ui.define([
	"gdprcockpit/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.SourceFields", {
		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf gdprcockpit.view.SourceFields
		 */
		//	onInit: function() {
		//
		//	},
		/**
		 * Handle the creation of a new data source field
		 */
		 onAddSourceField: function(oEvent) {
			var newLine = {
				Source: BaseController.SourceId, 
				SourceField: "00000",
				Field: "00000",
				SourceFieldName: "New field",
				SrcfldActive: false,
				InputAllowed: true
			};
			var oModel = this.getModel();
			var that = this;
			oModel.create("/SourceFieldsSet", newLine,
			{
				success: function(response) {
					//that.handleCreatefieldSuccess(response);
				},
				error: function(response) {
					//that.handleCreatefieldError
				}
			});
		 },
		/**
		 * Delete a field
		 */
		onDeleteField: function(oEvent) {
			this._deleteRow(oEvent);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf gdprcockpit.view.SourceFields
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf gdprcockpit.view.SourceFields
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf gdprcockpit.view.SourceFields
		 */
		//	onExit: function() {
		//
		//	}

	});

});