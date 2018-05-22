sap.ui.define([
	"gdprcockpit/controller/BaseController",
	'sap/ui/core/Fragment'
], function(BaseController,Fragment) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.MaintainDescriptions", {
		/* =========================================================== */
		/* Internal attributes                                         */
		/* =========================================================== */
		ObjectType: null,
		
		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */


		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf gdprcockpit.view.MaintainDescriptions
		 */
			onInit: function() {
				this.getRouter().getRoute("descriptions").attachPatternMatched(this.handleRouteMatched, this);
			},
		/**
		 * Check if a description object type is provided in the URL. If so, bind it to the view
		 */
		handleRouteMatched: function(oEvent) {

			this.ObjectType = oEvent.getParameter("arguments").objectType;
			if (this.ObjectType) {
				this.setFilter();
				this.setTableTitle();
			}

		},
		
		
		/**
		 * Add a new description
		 */
		onAddDescription: function(oEvent) {
			
				var oButton = oEvent.getSource();
				
				// create popover
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("popoverDescription","gdprcockpit.view.NewDescriptionKey", this);
				}
				this.getView().addDependent(this._oPopover);
				
				// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
				jQuery.sap.delayedCall(1, this, function () {
					this._oPopover.openBy(oButton);
				});
			
		},
			/**
			 * Event handler for adding a description
			 */
			newDescriptionEntered: function(oEvent) {
				var oDescription = Fragment.byId("popoverDescription", "newdescription");
				var sDescription = oDescription.getValue();
				if (!sDescription) {
					// Do nothing if no description was entered
					return;
				}
				var newLine = {
					ObjectType: this.ObjectType,
					ObjectId: '99999',
					Description: oDescription.getValue()
				};
				
				var oModel = this.getModel();
				var that = this;
				oModel.create("/ObjectDescriptionSet", newLine,
				{
					success: function(response) {
						that.handleCreateDescriptionSuccess(response);
					},
					error: that.handleCreateDescriptionError
				});
				
			},
		 /**
		  * Handle the successfull creation of a new source
		  */
		  handleCreateDescriptionSuccess: function (response) {
				var oDescription = Fragment.byId("popoverDescription", "newdescription");
				oDescription.setValue("");
				this._oPopover.close();
		  },
		 /**
		  * Handle the successfull creation of a new source
		  */
		  handleCreateDescriptionError: function (response) {
		  	
		  },
		/**
		 * Delete a description
		 */
		onDeleteDescription: function(oEvent) {
			this._deleteRow(oEvent);
		},

		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */
		/**
		 * Set the object type filter
		 */
		setFilter: function( ) {
			var typeFilter = new sap.ui.model.Filter("ObjectType","EQ",this.ObjectType);
			var oFilters = [typeFilter];
			var oTable = this.getView().byId("DescriptionTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(oFilters);
		},
		/**
		 * Set the table title
		 */
		setTableTitle: function() {
			
			var sTitle;
			
				switch (this.ObjectType) { 
					case "ZGDPR_DE_SRC_TYPE_ID":
						sTitle = "Source type";
						break;
					default:
						
						break;
				}
			this.getView().byId("DescriptionTableTitle").setText(sTitle);
		}
		
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf gdprcockpit.view.MaintainDescriptions
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf gdprcockpit.view.MaintainDescriptions
		 */
			// onAfterRendering: function() {
			//
			// }

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf gdprcockpit.view.MaintainDescriptions
		 */
		//	onExit: function() {
		//
		//	}

	});

});