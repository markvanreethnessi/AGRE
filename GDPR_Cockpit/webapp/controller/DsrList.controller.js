sap.ui.define([
	"gdprcockpit/controller/BaseController",
	"sap/ui/core/mvc/Controller"
], function(BaseController, Controller) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.DsrList", {

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf gdprcockpit.view.DsrList
		 */
		//	onInit: function() {
		//
		//	},
		/**
		 * Show the details of a data subject request
		 */
		 onDsrSelect: function(oEvent) {
			var oEntity = oEvent.getParameter("listItem");
			var oContext = oEntity.getBindingContext();
			var oObject = oContext.getObject();
			BaseController.DsrId = oObject.DsrId;
			this.getRouter().navTo("dsrdetail", {dsrId: BaseController.DsrId});
		 },
		/**
		 * Show the details of a data subject request
		 */
		 onAddDsr: function(oEvent) {
			this.getRouter().navTo("dsrdetail", {dsrId: "NEW"});
		 }
		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf gdprcockpit.view.DsrList
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf gdprcockpit.view.DsrList
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf gdprcockpit.view.DsrList
		 */
		//	onExit: function() {
		//
		//	}

	});

});