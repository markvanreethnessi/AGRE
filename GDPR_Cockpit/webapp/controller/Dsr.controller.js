sap.ui.define([
	"gdprcockpit/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.Dsr", {

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf gdprcockpit.view.Dsr
		 */
			onInit: function() {
		
			// Also add the odata model to the view as a named model
			this.getView().setModel(this.getOwnerComponent().getModel(),"oData");
			
			this.getRouter().getRoute("dsrdetail").attachPatternMatched(this.handleRouteMatched, this);
			},
		/**
		 * Check if a data source is provided in the URL. If so, bind it to the view
		 */
		handleRouteMatched: function(oEvent) {

			var id = oEvent.getParameter("arguments").dsrId;
			if (id) {
				BaseController.DsrId = id;
			}

			if (BaseController.DsrId === "NEW") {
				// Set create/cancel button visible
				// Set delete button invisible
				this.setButtonsVisibility(true, false);
				// Set properties panel expanded, selection panel collapsed and control panel hidden
				this.setPanelStates(false, false);
				this.setPanelVisibility(false, false, true);
				// Bind local json model to the view
				this.bindLocalModel();
			} else if (BaseController.DsrId) {
				this.bindDsrIfMDL();
			}
		},
		/**
		 * Navigate back to the data subject request list
		 */
		onNavBack: function(oEvent) {
			this.getRouter().navTo("DSR");
		},
		/**
		 * Show the screen to maintain request types
		 */
		onMaintainRequestTypes: function() {
			this.showDescriptionMaintenance("ZGDPR_DE_DSR_TYPE");
		},
		/**
		 * Show the screen to maintain request statuses
		 */
		onMaintainRequestStatuses: function() {
			this.showDescriptionMaintenance("ZGDPR_DE_DSR_STATUS");
		},
		/**
		 * Cancel the creation of a new DSR
		 */
		onCancelNewDsr: function(){
			this.onNavBack();
		},
		/**
		 * Save the new DSR
		 */
		onSaveNewDsr: function(oEvent) {

			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel();
			var localModel = oView.getModel();

			// Read data from local model
			var newLine = localModel.getProperty("/DSRSet");
			newLine.DsrId = "00000";

			// Create the entity on the backend
			var that = this;
			oModel.create("/DSRSet", newLine, {
				success: function(response) {
					that.handleCreatedsrSuccess(response);
				},
				error: that.handleCreatedsrError
			});

		},
		/**
		 * Handle the successfull creation of a new DSR
		 */
		handleCreatedsrSuccess: function(response) {
			// Set oData model again
			this.getView().setModel(this.getOwnerComponent().getModel());
			// Navigate to the new source
			BaseController.DsrId = response.DsrId;
			this.getRouter().navTo("dsrdetail", {
				dsrId: BaseController.DsrId
			});
		},
		/**
		 * Handle errors at creation of a new DSR
		 */
		handleCreatedsrError: function(response) {

		},
		/**
		 * Delete a DSR identifier
		 */
		 onDeleteIdentifier: function(oEvent) {
		 	//this._deleteRow(oEvent);
		 	
			var oEntity = oEvent.getParameter("listItem");
			var oContext = this._getDataContext(oEntity);
			this._deleteEntity(oContext.path);
/*			var oContext = oEntity.getBindingContext();
			var oObject = oContext.getObject();
			BaseController.DsrId = oObject.DsrId;
			
			this.getRouter().navTo("dsrdetail", {dsrId: BaseController.DsrId});*/
		 },
		 /** 
		  * Add a new DSR identifier
		  * @param oEvent
		  */
		 onAddIdentifier: function(oEvent) {
		 	this.getModel().create("/IdentitySet", {DsrId: BaseController.DsrId, IdentifierNr: '00000', Field: '00001'}, {
				success: function(response) {
					//that.handleCreatedsrSuccess(response);
				},
				//error: that.handleCreatedsrError
			});
		 },

		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */
		
		/**
		 *  Bind source if metadata loaded
		 *  Check if the metadata is loaded. If yes, bind the view. If not, load the metadata and then bind the view.
		 */
		bindDsrIfMDL: function() {
			// Make sure the odata model is bound to the view
			this.getView().setModel(this.getOwnerComponent().getModel());
			
			if (BaseController.MetadataLoaded) {
				this.bindDsr();
			} else {
				var that = this;
				this.getModel().metadataLoaded().then(function() {
					BaseController.MetadataLoaded = true;
					that.bindDsr();
				});
			}
		},
		/**
		 * Bind a data subject request to this view
		 */
		bindDsr: function() {
			var oModel = this.getModel();
			var id = BaseController.DsrId;

			var sPath = "/" + oModel.createKey("DSRSet", {
				DsrId: id
			});
			this.getView().bindElement({
				path: sPath
			});
			
			// Show the data vault entities that correspond to this DSR
			this.filterVault(id);

			// Expand / collapse panels
			// select: collapsed
			// properties and control: expanded
			this.setPanelStates(true, true);
			this.setPanelVisibility(true, true, false);

			// Show delete button
			this.setButtonsVisibility(false, true);
			
			// Attach the DataReceived event to the identity table
			this.listenForIdentityData();

		},
		/**
		 * Listen for changes to the identity table, in order to update tables
		 */
		 listenForIdentityData: function() {
		 	var oIdentityTable = this.getView().byId("identityTable");
		 	var oIdentityBinding = oIdentityTable.getBinding("items");
		 	oIdentityBinding.attachEvent("dataReceived", function(oData){ this.refreshVaultResults(); });
		 },
		 /**
		  * Refresh the vault results (e.g. after the identity was changed)
		  */
		  refreshVaultResults: function(){
		  	this.filterVault(BaseController.DsrId);
		  },
		
		
		/**
		 * Show buttons to save / cancel the new source creation
		 */
		setButtonsVisibility: function(create, deleteButton) {
			var oView = this.getView();
			var oSave = oView.byId("saveNew");
			var oCancel = oView.byId("cancelNew");
			var oDelete = oView.byId("deleteDsr");
			oSave.setVisible(create);
			oCancel.setVisible(create);
			oDelete.setVisible(deleteButton);
		},
		/**
		 * Set the collapsed or expanded state for the 2 panels of this view
		 */
		setPanelStates: function(identity, vault) {
			var oIdentity = this.getView().byId("identity");
			var oVault = this.getView().byId("vaultresults");

			oIdentity.setExpanded(identity);
			oVault.setExpanded(vault);
		},
		/**
		 * Set the collapsed or expanded state for the 2 panels of this view
		 */
		setPanelVisibility: function(identity, vault, singleIdentity) {
			var oIdentity = this.getView().byId("identity");
			var oVault = this.getView().byId("vaultresults");
			var oSingle = this.getView().byId("singleIdentity");

			oIdentity.setVisible(identity);
			oVault.setVisible(vault);
			oSingle.setVisible(singleIdentity); 
		},
		/**
		 * Bind a local json model to the view to store a new DSR before pushing it to the backend
		 */
		bindLocalModel: function() {

			var localModel = new sap.ui.model.json.JSONModel({
				DSRSet: {
					"DsrId": "New request",
					"RequestType": "00001",
					"Field": "00001",
					"CreationDate": new Date()
				}
			});

			var oView = this.getView();

			oView.setModel(localModel);
			oView.bindElement("/DSRSet");

		},
		/** 
		 * Filter the data vault
		 * @param DsrId: the data subject request ID for which to show the data vault contents
		 */
		filterVault: function(DsrId){
			// Create the filter
			var oFilters = [];
			oFilters.push( new sap.ui.model.Filter("DsrId","EQ",DsrId) );
			
			// Apply the filter
		 	var oListController = this.getView().byId("vaultList").getController();
		 	oListController.applyFilter(oFilters);
		}
		
		
		/* =========================================================== */
		/* Unused livecycle methods                                    */
		/* =========================================================== */
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf gdprcockpit.view.Dsr
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf gdprcockpit.view.Dsr
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf gdprcockpit.view.Dsr
		 */
		//	onExit: function() {
		//
		//	}

	});

});