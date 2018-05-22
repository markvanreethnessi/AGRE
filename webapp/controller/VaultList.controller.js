sap.ui.define([
	"gdprcockpit/controller/BaseController",
], function(BaseController) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.VaultList", {

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf gdprcockpit.view.VaultList
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Show the detail screen when a vault entity is selected
		 */
		onSelectVaultEntity: function(oEvent) {
			var oEntity = oEvent.getParameter("listItem");
			var oContext = oEntity.getBindingContext();
			var oObject = oContext.getObject();
			BaseController.VaultEntityId = oObject.EntityId;
			this.getRouter().navTo("datavaultentity", {id: BaseController.VaultEntityId});
		},
		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */
		
		
		/**
		 * Search for vault entities
		 */
		 applyFilter: function(oFilters) {
		 	
		 	// Apply filter
		 	var vaultTable = this.getView().byId("vaultentitycontent");
		 	vaultTable.getBinding("items").filter(oFilters);
		 	
		 }
		
		/* =========================================================== */
		/* Unused livecycle methods                                    */
		/* =========================================================== */
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf gdprcockpit.view.VaultList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf gdprcockpit.view.VaultList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf gdprcockpit.view.VaultList
		 */
		//	onExit: function() {
		//
		//	}

	});

});