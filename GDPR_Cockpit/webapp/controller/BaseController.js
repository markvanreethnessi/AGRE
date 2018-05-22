/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/core/routing/History",
		"sap/ui/model/Filter"
	], function (Controller, MessageToast, History,Filter) {
		"use strict";

		return Controller.extend("gdprcockpit.controller.BaseController", {
			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return this.getOwnerComponent().getRouter();
			},

			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @public
			 * @param {string} sName the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Convenience method for getting the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			/**
			 * Event handler for navigating back.
			 * It there is a history entry we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the master route.
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash();

					if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					this.getRouter().navTo("master", {}, true);
				}
			},
			/**
			 * Handle changes in data fields
			 */
			onChange: function () {
				this.save();
			},
			/**
			 * Handle the cancelling of a value help
			 */
			handleValueHelpCancel: function(oEvent) {
				// Do nothing for the moment
			},
			/**
			 * Filter the user value help using the search field
			 */
			handleUserFilter: function (oEvent) {
				var sSearch = oEvent.getParameter("value");
				var oSearchFilters = [];
				oSearchFilters.push( new Filter("Field", sap.ui.model.FilterOperator.EQ, "XUBNAME"));
				oSearchFilters.push( new Filter("Filter1", sap.ui.model.FilterOperator.Contains, sSearch) );
				oSearchFilters.push( new Filter("Filter2", sap.ui.model.FilterOperator.Contains, sSearch) );
				oSearchFilters.push( new Filter("Filter3", sap.ui.model.FilterOperator.Contains, sSearch) );
				oSearchFilters.push( new Filter("Filter4", sap.ui.model.FilterOperator.Contains, sSearch) );
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(oSearchFilters);
			},
			
			
			/**
			 * Open a popup for maintaining object descriptions of a given object type
			 */
			showDescriptionMaintenance: function(ObjectType) {
				
				if(ObjectType) {
					this.getRouter().navTo("descriptions", {objectType: ObjectType});
				}
			},
		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */
			/**
			 * Save the changes to the backend
			 */
			save: function() {
			 	var oBundle = this.getView().getModel("i18n").getResourceBundle();
			 	var oModel = this.getModel();
				oModel.submitChanges(
			 		{
			 			success: function(oData,response) {
			 				MessageToast.show(oBundle.getText("submitSuccess"));
						},
						error: function(e) {
							MessageToast.show(oBundle.getText("submitError"));
						}
			 		});
			},
			/**
			 * Delete a table row
			 */
			_deleteRow: function(oEvent){
				var oRow = this._getTableItemContext(oEvent);
				var sPath = oRow.path;
				this._deleteEntity(sPath);
			},
			/**
			 * Get the context of a table item
			 */
			_getTableItemContext: function(oEvent){
				var oButton = oEvent.getSource();
			 	var oParent = this._getParentItem(oButton);
			 	return this._getDataContext(oParent);
			},
			/**
			 * Get an item's parent
			 */
			_getParentItem: function(oElement){
				var parent = oElement.getParent();
				var parentItem;
				
				while (parentItem == undefined){
					if (parent instanceof sap.m.ListItemBase) {
						parentItem = parent;
					} else {
						parent = parent.getParent();
					}
				}
				return parentItem;
			},
			/**
			 * Get the context of an item
			 */
			_getDataContext: function(oItem){
			    var sPath = oItem.getBindingContextPath();
			    var oModel = this.getView().getModel();
			    return {
			      path : sPath,
			      data : oModel.getObject(sPath)
			    };
			},
			/**
			 * Delete an entity with a given path
			 */
			 _deleteEntity: function(sPath) {
			 	var oModel = this.getView().getModel();
			 	var oBundle = this.getView().getModel("i18n").getResourceBundle();
			 	
			 	oModel.remove(sPath, {
					success: function(data) {
					MessageToast.show(oBundle.getText("deleteSuccess"));
				},
					error: function(e) {
					MessageToast.show(oBundle.getText("deleteError"));
					}
				});
			 },
			 /**
			  * Get the parent view of an object
			  */
			_getParentView: function(oObject) {
				var parent = oObject.getParent();
				var parentView;
				
				while (parentView == undefined){
					if (parent instanceof sap.ui.core.mvc.View) {
						parentView = parent;
					} else {
						parent = parent.getParent();
					}
				}
				return parentView;
			},
			 
		/* =========================================================== */
		/* Show messages	                                           */
		/* =========================================================== */
		/**
		 * Handle the button press to show the messages
		 */
		_onShowMessages: function (oEvent) {
			this._getMessagelistPopover().openBy(oEvent.getSource());
		},
		/**
		 * Get the message list popover instance
		 */
		_getMessagelistPopover: function () {
			// create popover (singleton)
			if (!this._oMessagelistPopover) {
				this._oMessagelistPopover = sap.ui.xmlfragment("gdprcockpit.view.MessagePopover", this);
				this.getView().addDependent(this._oMessagelistPopover);
			}
			return this._oMessagelistPopover;
		},
		
		
		/* =========================================================== */
		/* Internal attributes                                         */
		/* =========================================================== */
			DescriptionSubView: null,
			DescriptionDialog: null

		});

	}
);