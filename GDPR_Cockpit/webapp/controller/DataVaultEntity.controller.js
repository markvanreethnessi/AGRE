sap.ui.define([
	"gdprcockpit/controller/BaseController",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.DataVaultEntity", {
		
		
		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */
		/**
		 * This method is executed once when initialising the controller
		 */
		onInit: function() {
			
			this.getRouter().getRoute("datavaultentity").attachPatternMatched(this.handleRouteMatched, this);
		},
		handleRouteMatched: function(oEvent) {

			var id = oEvent.getParameter("arguments").id;
			if (id) {
				BaseController.VaultEntityId = id;
			}
			
			if (BaseController.VaultEntityId) {
				this.bindEntityIfMDL();
			} else {
				// If no source is selected yet, show the source selection panel
				var oSelect = this.getView().byId("select");
				oSelect.setExpanded(true);
				
				var oProperties = this.getView().byId("properties");
				var oControl = this.getView().byId("control");
				oProperties.setExpanded(false);
				oControl.setExpanded(false);
				
			}

		},
		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */
			
		/**
		 *  Bind entity if metadata loaded
		 *  Check if the metadata is loaded. If yes, bind the view. If not, load the metadata and then bind the view.
		 */
		 bindEntityIfMDL: function() {
		 	if (BaseController.MetadataLoaded) {
		 		this.bindEntity();
		 	} else {
		 		var that = this;
		 		this.getModel().metadataLoaded().then( function() {
		 			BaseController.MetadataLoaded = true;
		 			that.bindEntity();
		 		});
		 	}
		 },
		 /**
		  * Bind an entity to this view
		  */
		 bindEntity: function() {
		 	var oModel = this.getModel();
		 	var id =  BaseController.VaultEntityId;
		 	var sPath = "/" + oModel.createKey("VaultEntitySet", {
							EntityId: id
				});
			this.getView().bindElement({path: sPath});
		 }
	});
}, /* bExport= */ true);