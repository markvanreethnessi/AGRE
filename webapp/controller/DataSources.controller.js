sap.ui.define([
	"gdprcockpit/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("gdprcockpit.controller.DataSources", {

		/* =========================================================== */
		/* Event handlers                                              */
		/* =========================================================== */
		/**
		 * This method is executed once when initialising the controller
		 */
		onInit: function() {
			// Also add the odata model to the view as a named model
			this.getView().setModel(this.getOwnerComponent().getModel(),"oData");
			
			this.getRouter().getRoute("SOURCE").attachPatternMatched(this.handleRouteMatched, this);
		},
		/**
		 * Check if a data source is provided in the URL. If so, bind it to the view
		 */
		handleRouteMatched: function(oEvent) {

			var id = oEvent.getParameter("arguments").id;
			if (id) {
				BaseController.SourceId = id;
			} else {
				// Get value from the source selector dropdown
				id = this.getView().byId("sourceSelector").getSelectedKey();
				if (id) {
					BaseController.SourceId = id;
				} else {
					BaseController.SourceId = null;
				}
			}

			if (BaseController.SourceId === "NEW") {
				// Set create/cancel button visible
				// Set delete button invisible
				this.setCreateButtonsVisibility(true, false);
				// Set properties panel expanded, selection panel collapsed and control panel hidden
				this.setPanelStates(false, true, false);
				this.setPanelVisibility(false, true, false);
				// Bind local json model to the view
				this.bindLocalModel();
			} else if (BaseController.SourceId) {
				this.bindSourceIfMDL();
			} else {
				// If no source is selected yet, show the source selection panel (hide the other panels)
				this.setPanelStates(true, false, false);
				this.setPanelVisibility(true, false, false);
				// Make create/cancel/delete buttons invisible
				this.setCreateButtonsVisibility(false, false);
				// Make sure the oData model is bound to the view
				this.getView().setModel(this.getOwnerComponent().getModel());

			}
		},

		/**
		 * Handle the selection of a data source
		 */
		onSelectSource: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			if (oItem) {
				BaseController.SourceId = oItem.getProperty("key");
				this.getRouter().navTo("SOURCE", {
					id: BaseController.SourceId
				});
			}
		},

		/**
		 * Filter the list of sources on the source type
		 */
		onSelectSourceType: function(oEvent) {
			var oItem = oEvent.getParameter("selectedItem");
			if (oItem) {
				var srcType = oItem.getProperty("key");
				var oFilters = [new sap.ui.model.Filter("Type", "EQ", srcType)];
				var oSourceSelector = this.getView().byId("sourceSelector");
				var oBinding = oSourceSelector.getBinding("items");
				oBinding.filter(oFilters);
			}
		},

		/**
		 * Handle the creation of a new data source 
		 */
		onAddDataSource: function(oEvent) {

			var oView = this.getView();

			// Set flag to indicate that a new source will be created
			BaseController.CreateNew = true;

			// Update hash
			this.getRouter().navTo("SOURCE", {
			id: "NEW"
			});

		},
		/**
		 * Handle the successfull creation of a new source
		 */
		handleCreatesourceSuccess: function(response) {
			// Set oData model again
			this.getView().setModel(this.getOwnerComponent().getModel());
			// Navigate to the new source
			BaseController.SourceId = response.SrcId;
			this.getRouter().navTo("SOURCE", {
				id: BaseController.SourceId
			});
		},
		/**
		 * Handle the successfull creation of a new source
		 */
		handleCreatesourceError: function(response) {

		},
		/**
		 * Show the screen to maintain source types
		 */
		onMaintainSourceTypes: function() {
			this.showDescriptionMaintenance("ZGDPR_DE_SRC_TYPE_ID");
		},
		/**
		 * Delete a data source
		 */
		onDeleteSource: function(oEvent) {
			var oModel = this.getModel();
			var id = BaseController.SourceId;
			var sPath = "/" + oModel.createKey("SourceSet", {
				SrcId: id
			});
			this._deleteEntity(sPath);

			this.getRouter().navTo("SOURCE");

		},
		/**
		 * Save the new source
		 */
		onSaveNewSource: function(oEvent) {

			var oView = this.getView();
			var oModel = this.getOwnerComponent().getModel();
			var localModel = oView.getModel();

			// Read data from local model
			var newLine = localModel.getProperty("/SourceSet");
			newLine.SrcId = "00000";

			// Create the entity on the backend
			var that = this;
			oModel.create("/SourceSet", newLine, {
				success: function(response) {
					that.handleCreatesourceSuccess(response);
				},
				error: that.handleCreatesourceError
			});

		},
		/**
		 * Cancel the creation of a new source
		 */
		onCancelNewSource: function(oEvent) {
			BaseController.CreateNew = false;
			
			this.getRouter().navTo("SOURCE");
		},
		/**
		 * Submit each change to the backend as it is entered
		 * Don't do this for new entities, they need to be saved manually
		 */
		onChange: function(oEvent) {
			if (!BaseController.CreateNew) {
				this.save();
			}
		},
		/**
		 * Event handler for pressing ENTER on an input field
		 */
		onSubmit: function(oEvent) {
			if (BaseController.CreateNew) {
				this.onSaveNewSource(oEvent);
			}
		},

		/* =========================================================== */
		/* Internal methods                                            */
		/* =========================================================== */

		/**
		 *  Bind source if metadata loaded
		 *  Check if the metadata is loaded. If yes, bind the view. If not, load the metadata and then bind the view.
		 */
		bindSourceIfMDL: function() {
			// Make sure the odata model is bound to the view
			this.getView().setModel(this.getOwnerComponent().getModel());
			
			if (BaseController.MetadataLoaded) {
				this.bindSource();
			} else {
				var that = this;
				this.getModel().metadataLoaded().then(function() {
					BaseController.MetadataLoaded = true;
					that.bindSource();
				});
			}
		},
		/**
		 * Bind a source to this view
		 */
		bindSource: function() {
			var oModel = this.getModel();
			var id = BaseController.SourceId;

			var sPath = "/" + oModel.createKey("SourceSet", {
				SrcId: id
			});
			this.getView().bindElement({
				path: sPath
			});

			// Expand / collapse panels
			// select: collapsed
			// properties and control: expanded
			this.setPanelStates(false, true, true);
			this.setPanelVisibility(true, true, true);

			// Update the source selector dropdown
			var oSelector = this.getView().byId("sourceSelector");
			oSelector.setSelectedKey(BaseController.SourceId);

			// Show delete button
			this.setCreateButtonsVisibility(false, true);

			// If the "create new source" flag is still set but the has now selected an existing source, remove the flag
			BaseController.CreateNew = false;
		},

		/**
		 * Show buttons to save / cancel the new source creation
		 */
		setCreateButtonsVisibility: function(create, deleteButton) {
			var oView = this.getView();
			var oSave = oView.byId("saveNew");
			var oCancel = oView.byId("cancelNew");
			var oDelete = oView.byId("deleteSource");
			oSave.setVisible(create);
			oCancel.setVisible(create);
			oDelete.setVisible(deleteButton);
		},
		/**
		 * Set the collapsed or expanded state for the 3 panels of this view
		 */
		setPanelStates: function(select, properties, control) {
			var oSelect = this.getView().byId("select");
			var oProperties = this.getView().byId("properties");
			var oControl = this.getView().byId("control");

			oSelect.setExpanded(select);
			oProperties.setExpanded(properties);
			oControl.setExpanded(control);
		},
		/**
		 * Set the collapsed or expanded state for the 3 panels of this view
		 */
		setPanelVisibility: function(select, properties, control) {
			var oSelect = this.getView().byId("select");
			var oProperties = this.getView().byId("properties");
			var oControl = this.getView().byId("control");

			oSelect.setVisible(select);
			oProperties.setVisible(properties);
			oControl.setVisible(control);
		},
		/**
		 * Bind a local json model to the view to store a new source before pushing it to the backend
		 */
		bindLocalModel: function() {

			var localModel = new sap.ui.model.json.JSONModel({
				SourceSet: {
					"SrcId": "New Source",
					"Description": "New Source"
				}
			});

			var oView = this.getView();

			oView.setModel(localModel);
			oView.bindElement("/SourceSet");

		}

	});
}, /* bExport= */ true);