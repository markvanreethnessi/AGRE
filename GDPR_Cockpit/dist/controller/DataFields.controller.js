sap.ui.define([
	"gdprcockpit/controller/BaseController",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.DataFields", {
		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */
		/**
		 * This method is executed once when initialising the controller
		 */
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("datafields").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			this.setTooltips();
		},
		
		handleRouteMatched: function(oEvent) {

		},
		
		onShowFieldDetails: function(oEvent) {
			BaseController.FieldId = oEvent.getSource().data("field");
			this.getRouter().navTo("fieldDetail", {id: BaseController.FieldId});
		},
		/**
		 * Handle the creation of a new data source 
		 */
		 onAddDataField: function(oEvent) {
		 	
		 	var oView = this.getView();
		 	
		 	// Set flag to indicate that a new source will be created
		  	this.getRouter().navTo("fieldDetail", {id: "NEW"});
		 	
		 	/*
			var newLine = {
				Id: '99999',
				TechnicalType: "CHOOSE",
				UniqueIdentifier: false,
				MultipleValues: false,
				Active: true,
				Langu: "EN",
				Description: "New field"
			};
			var oModel = this.getModel();
			var that = this;
			oModel.create("/FieldSet", newLine,
			{
				success: function(response) {
					that.handleCreatefieldSuccess(response);
				},
				error: that.handleCreatefieldError
			});
			*/
		 },
		 /**
		  * Handle the successfull creation of a new source
		  */
		  handleCreatefieldSuccess: function (response) {
		  	BaseController.FieldId = response.Id;
		  	this.getRouter().navTo("fieldDetail", {id: BaseController.FieldId});
		  },
		 /**
		  * Handle the successfull creation of a new source
		  */
		  handleCreatesourceError: function (response) {
		  	
		  },

		/**
		 * Delete a field
		 */
		onDeleteField: function(oEvent) {
			this._deleteRow(oEvent);
		},
		
		
		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */
		/**
		 * This method sets the tooltips for the column headers
		 */
		 setTooltips: function() {
		 	var oView = this.getView();
		 	var oBundle = this.getResourceBundle();
		 	// var sMsg = oBundle.getText("yoMsg", [sRecipient]); example syntax for passing parameters
		 	
		 	
		 	var oUnique = oView.byId("FieldsColumnUnique");
		 	var sUnique = oBundle.getText("FieldsColumnUniqueTooltip");
			oUnique.setTooltip(sUnique);
			
		 	var oMultiple = oView.byId("FieldsColumnMultiple");
		 	var sMultiple = oBundle.getText("FieldsColumnMultipleTooltip");
			oMultiple.setTooltip(sMultiple);
			
			var oAddButton = oView.byId("AddDataField");
		 	var sAddButton = oBundle.getText("AddButtonTooltip");
			oAddButton.setTooltip(sAddButton);
		 }
	});
}, /* bExport= */ true);