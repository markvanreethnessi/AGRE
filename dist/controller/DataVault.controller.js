sap.ui.define([
	"gdprcockpit/controller/BaseController",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, History) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.DataVault", {
		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */
		/**
		 * This method is executed once when initialising the controller
		 */
		onInit: function() {
			this.bindUserIfMDL();
		},
		
		/**
		 * Search for vault entities
		 */
		 onVaultQuery: function() {
		 	
		 	// Read values from input fields
		 	var src = this.getView().byId("sourceSelector").getSelectedKey();
		 	var fld = this.getView().byId("fieldSelector").getSelectedKey();
		 	var value = this.getView().byId("queryfieldvalue").getValue();
		 	var oFilters = [];
		 	
		 	// Create filter for values that are not initial
		 	if(src) {
		 		oFilters.push( new sap.ui.model.Filter("Source","EQ",src) );
		 	}
		 	if(fld) {
		 		oFilters.push( new sap.ui.model.Filter("FilterField","EQ",fld));
		 	}
		 	if(value) {
		 		oFilters.push( new sap.ui.model.Filter("FilterValue","EQ",value));
		 	}
		 	
		 	// Apply filter
		 	var oListController = this.getView().byId("vaultList").getController();
		 	oListController.applyFilter(oFilters);
		 	/*var vaultTable = this.getView().byId("vaultentitycontent");
		 	vaultTable.getBinding("items").filter(oFilters);*/
		 	
		 	// Open results panel
		 	this.getView().byId("result").setExpanded(true);
		 	
		 },
		
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

		_onListItemPress: function(oEvent) {

			var oBindingContext = oEvent.getParameter("listItem").getBindingContext();

			return new Promise(function(fnResolve) {
				this.doNavigate("DataSources", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */
		/**
		 *  Bind user if metadata loaded
		 *  Check if the metadata is loaded. If yes, bind the user display. If not, load the metadata and then bind the user display.
		 */
		 bindUserIfMDL: function() {
		 	if (BaseController.MetadataLoaded) {
		 		this.bindUser();
		 	} else {
		 		var that = this;
		 		this.getOwnerComponent().getModel().metadataLoaded().then( function() {
		 			BaseController.MetadataLoaded = true;
		 			that.bindUser();
		 		});
		 	}
		 },
		 /**
		  * Bind a user to the user display
		  */
		 bindUser: function() {
		 	var oModel = this.getOwnerComponent().getModel();
		 	var sPath = "/" + oModel.createKey("userSet", {
							Username: " "
				});
			var userName = this.getView().byId("username");
			var userFullname = this.getView().byId("userFullname");
			userName.bindElement({path: sPath});
			userFullname.bindElement({path: sPath});
		 }
	});
}, /* bExport= */ true);