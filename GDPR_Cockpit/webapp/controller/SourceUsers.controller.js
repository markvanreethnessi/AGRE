sap.ui.define([
	"gdprcockpit/controller/BaseController",
	"sap/ui/model/Filter"
], function(BaseController,Filter) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.SourceUsers", {

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf gdprcockpit.view.SourceUsers
		 */
		//	onInit: function() {
		//
		//	},
		
		/**
		 * Handle the creation of a new data source user.
		 * In order to create a new user, a popup is first displayed that allows for selecting a user name of the user to be created
		 */
		 onAddSourceUser: function(oEvent) {
		 	if (! this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("gdprcockpit.view.UserNameValueHelp", this);
					this._oDialog.setModel(this.getView().getModel());
				}
	
	 
				// clear the old search filter
				this._oDialog.getBinding("items").filter([ new Filter("Field", sap.ui.model.FilterOperator.EQ, 'XUBNAME') ]);
	 
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
				this._oDialog.open();
		 	
		 },
		 
		 /**
		  * Process the selected username
		  * Create a new user line with the selected username
		  */
		handleUserNameValueHelp: function(oEvent) {
			// Get the selected username
			var oItem = oEvent.getParameter("selectedItem");
			var oContext = oItem.getBindingContext();
			var oObject = oContext.getObject();
			var userName = oObject.Id;
			
			// Create a new line with the selected username
			var newLine = {
				Source: BaseController.SourceId, 
				Username: userName,
				Name: oObject.Description,
				UserActivity: "00003"
			};
			var oModel = this.getModel();
			var that = this;
			oModel.create("/SourceUsersSet", newLine,
			{
				success: function(response) {
					that.handleCreatefieldSuccess(response);
				},
				error: function(response) {
					//that.handleCreateSourceError
				}
			});
		},
		handleCreatefieldSuccess: function(response){
		 	// If a change is made to a user, refresh the binding to ensure the editability is always correct
		 	// New users are added in display mode, so this is not necessary
			//this.refreshSourceBinding();
		},
		/**
		 * Delete a user
		 */
		onDeleteUser: function(oEvent) {
			this._deleteRow(oEvent);
			
		 	// If a change is made to a user, refresh the binding to ensure the editability is always correct
			this.refreshSourceBinding();
		},
		/**
		 * 
		 */
		 onChange: function(){
		 	// If a change is made to a user, refresh the binding to ensure the editability is always correct
		 	this.save();
			this.refreshSourceBinding();
		 },
		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */
		/**
		 * Refresh the binding if a change has been made to the users
		 */
		 refreshSourceBinding: function(){
		 	/* AddSourceUser is a button on the SourceUsers view.
		 		First, we get the parent view of AddSourceUser, which is the SourceUsers view
		 		Next, we get the parent view of the SourceUsers view, which is the DataSources view
		 	*/
			var oSrcView = this._getParentView(this._getParentView(this.getView().byId("AddSourceUser")));
		 	
			var oBinding = oSrcView.getElementBinding();
			
			jQuery.sap.delayedCall(200, this, function () {
				oBinding.refresh();
			});
		 	
		 }
		
		
		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf gdprcockpit.view.SourceUsers
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf gdprcockpit.view.SourceUsers
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf gdprcockpit.view.SourceUsers
		 */
		//	onExit: function() {
		//
		//	}

	});

});