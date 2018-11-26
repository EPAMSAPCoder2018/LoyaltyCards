sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"com/epam/uicustomers/model/models",
	"com/epam/uicustomers/controller/base.controller",
	'sap/ui/model/Filter'
], function (Controller, Device, Models, BaseController, Filter) {
	"use strict";
	return BaseController.extend("com.epam.uicustomers.controller.Master", {

		onInit: function () {
			var oList = this.byId("list");
			this._oList = oList;
			var oRouter = this.getRouter();
			oRouter.getRoute("master").attachPatternMatched(this._onMasterMatched, this);
			oRouter.attachBypassed(this.onBypassed, this);
			this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
			var technicalModel = Models.createEmptyJSONModel();
			technicalModel.setData({
				sortOptions: [{
					name: "Фамилия",
					type: "lastName"
				}, {
					name: "Размер скидки",
					type: "discount"
				}]
			});
			this.getView().setModel(technicalModel, "technicalModel");
		},
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		onSelect: function (e) {
			this._showDetail(e.getParameter("listItem") || e.getSource());
		},
		_showDetail: function (oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("customer/ID"),
				index: oItem.getBindingContext().getProperty("index"),
			}, true);
		},
		onBypassed: function () {
			this._oList.removeSelections(true);
		},
		_onMasterMatched: function (e) {
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(function (mParams) {
				if (mParams.list.getMode() === "None") {
					return;
				}
				var sObjectId = mParams.firstListItem.getProperty("customer/ID");
				var index = mParams.firstListItem.getProperty("index");
				this.getRouter().navTo("object", {
					objectId: sObjectId,
					index: index
				}, true);
			}.bind(this));
		},

		onSortingChange: function () {

		},
		
		onSemanticButtonPress: function (oEvent){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("createCustomers");
		},

		onSearch: function (oEvt) {
			// add filter for search
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				aFilters.push(new Filter("customer/firstName", sap.ui.model.FilterOperator.Contains, sQuery));
				aFilters.push(new Filter("customer/lastName", sap.ui.model.FilterOperator.Contains, sQuery));
				aFilters.push(new Filter("customer/middleName", sap.ui.model.FilterOperator.Contains, sQuery));
				aFilters.push(new Filter("customer/email", sap.ui.model.FilterOperator.Contains, sQuery));
				aFilters.push(new Filter("index", sap.ui.model.FilterOperator.Contains, sQuery));
			}

			// update list binding
			var list = this.byId("list");
			var binding = list.getBinding("items");
			binding.filter(aFilters);
		}
	});

});