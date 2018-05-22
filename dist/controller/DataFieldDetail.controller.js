sap.ui.define([
	"gdprcockpit/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.DataFieldDetail", {

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf gdprcockpit.view.DataFieldDetail
		 */
		onInit: function() {
			// Also add the odata model to the view as a named model
			this.getView().setModel(this.getOwnerComponent().getModel(),"oData");
			
			this.getRouter().getRoute("fieldDetail").attachPatternMatched(this.handleRouteMatched, this);
		},

		/**
		 * Check if a data source is provided in the URL. If so, bind it to the view
		 */
		handleRouteMatched: function(oEvent) {

			var id = oEvent.getParameter("arguments").id;
			if ( id === "NEW") {
				BaseController.FieldId = null;
				
				// Set create/cancel button visible
				// Set delete button invisible
		 		this.setCreateButtonsVisibility(true);
				// Bind local json model to the view
				this.bindLocalModel();
			}
			else if (id) {
				BaseController.FieldId = id;
				this.bindFieldIfMDL();
				// Set create/cancel button invisible
				// Set delete button visible
		 		this.setCreateButtonsVisibility(false);
			}

		},
		/**
		 * Navigate back to the data field list
		 */
		onNavBack: function(oEvent) {
			this.getRouter().navTo("FIELD");
		},
		/**
		 * Delete a field
		 */
		onDeleteField: function(oEvent) {
		   	var oModel = this.getModel();
		 	var id =  BaseController.FieldId;
		 	var sPath = "/" + oModel.createKey("FieldSet", {
							Id: id
				});
			this._deleteEntity(sPath);
			this.onNavBack();
		},
		/**
		 * Save the new field
		 */
		onSaveNewField: function (oEvent) {
	    	
	    	var oView = this.getView();
	    	var oModel = this.getOwnerComponent().getModel();
	    	var localModel = oView.getModel();
	    	
	    	// Read data from local model
	    	var newLine = localModel.getProperty("/FieldSet");
	    	newLine.Id = "00000";
		 	
			var that = this;
			oModel.create("/FieldSet", newLine,
			{
				success: function(response) {
					that.handleCreatefieldSuccess(response);
				},
				error: that.handleCreatefieldError
			});
			
	    },
		/**
		 * Cancel the creation of a new field
		 */
	    onCancelNewField: function (oEvent) {
	    	
			// Bind the oData model to the view again
	    	// Set oData model again
			this.getView().setModel(this.getOwnerComponent().getModel());
			
			// Navigate to the fields overview
	    	this.onNavBack(oEvent);
	    	
	    },
	    /**
	     * Submit each change to the backend as it is entered
	     * Don't do this for new entities, they need to be saved manually
	     */
	     onChange: function(oEvent) {
	     	if (BaseController.FieldId) {
	     		this.save();
	     	}
	     },
		 /**
		  * Handle the successfull creation of a new field
		  */
		  handleCreatefieldSuccess: function (response) {
	    	// Set oData model again
			this.getView().setModel(this.getOwnerComponent().getModel());
			
		  	BaseController.FieldId = response.Id;
		  	this.getRouter().navTo("fieldDetail", {id: BaseController.FieldId});
		  },
		 /**
		  * Handle errors when creating a new field
		  */
		  handleCreatefieldError: function (response) {
		  	
		  },
		/**
		 * Event handler for pressing ENTER on an input field
		 */
		onSubmit: function(oEvent) {
			if (!BaseController.FieldId) {
				this.onSaveNewField(oEvent);
			}
		},
		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */
		/**
		 *  Bind field if metadata loaded
		 *  Check if the metadata is loaded. If yes, bind the view. If not, load the metadata and then bind the view.
		 */
		 bindFieldIfMDL: function() {
		 	
			// Make sure the odata model is bound to the view
	 		var oModel = this.getOwnerComponent().getModel();
	 		this.getView().setModel(oModel);
	 		
		 	if (BaseController.MetadataLoaded) {
		 		this.bindField();
		 	} else {
		 		var that = this;
		 		oModel.metadataLoaded().then( function() {
		 			BaseController.MetadataLoaded = true;
		 			that.bindField();
		 		});
		 	}
		 },
		 /**
		  * Bind a field to this view
		  */
		 bindField: function() {
		 	var oModel = this.getModel();
		
		 	var sPath = "/" + oModel.createKey("FieldSet", {
							Id: BaseController.FieldId
				});
			this.getView().bindElement({path: sPath});
		 },
		
		/**
		* Show buttons to save / cancel the new field creation
		*/
		setCreateButtonsVisibility: function(create) {
		  var oView = this.getView();
		  var oSave = oView.byId("saveNew");
		  var oCancel = oView.byId("cancelNew");
		  var oDelete = oView.byId("deleteField");
		  var deleteButton = !create;
		  oSave.setVisible(create);
		  oCancel.setVisible(create);
		  oDelete.setVisible(deleteButton);
		},
		/**
		* Bind a local json model to the view to store a new field before pushing it to the backend
		*/
		bindLocalModel: function() {
			
			
			var localModel = new sap.ui.model.json.JSONModel({
				FieldSet: {
					"Description": "New field",
					"Id": "New field",
					"Active": true,
					"Langu": "EN"
				}
			});
			
			var oView = this.getView();
			
			oView.setModel(localModel);
			oView.bindElement("/FieldSet");
		}
		 
		 
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf gdprcockpit.view.DataFieldDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf gdprcockpit.view.DataFieldDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf gdprcockpit.view.DataFieldDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});