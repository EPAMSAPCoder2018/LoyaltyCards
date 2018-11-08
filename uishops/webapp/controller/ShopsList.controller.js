sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/epam/uishop/util/utils",
	"com/epam/uishop/model/models",
	"sap/ui/model/json/JSONModel",
	'sap/ui/model/Filter'
], function (Controller, Utils, models, JSONModel, Filter) {
	"use strict";
	
	return Controller.extend("sap.m.sample.ObjectHeader.ShopsList", {
		onInit: function () {
			var that = this;
			var component = that.getOwnerComponent();
			if(!component.getModel()){
				component.setModel(models.createEmptyJSONModel());
			}
        	this._shopLoadingTask = Utils.createPeriodicalyTask(function () {
        		$.ajax({
		            type: "GET",
					url: "/services/shop?",
					async: false,
					success: function (data, textStatus, jqXHR) {
		                component.getModel().setData(data);
		            },
		            error: function (data, textStatus, jqXHR) {
						console.log("Error to post ", textStatus, data, jqXHR);
					}
        		});
			}, 25000);
			this._shopLoadingTask.start();
		},

		handleLinkObjectAttributePress : function(oEvent) {
			var oSelectedItem = oEvent.getSource();
			var oContext = oSelectedItem.getBindingContext();
			var sName = oContext.getProperty("shopSite");
			sap.m.URLHelper.redirect(sName, true);
		},
		
		onSearch : function (oEvt) {
			var aFilters = [];
			var sQuery = oEvt.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				var filter = new Filter("shopName", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(filter);
			}
			var list = this.byId("list");
			var binding = list.getBinding("items");
			binding.filter(aFilters, "Application");
		}
	});
});