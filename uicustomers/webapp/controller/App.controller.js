sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/epam/uicustomers/util/utils",
	"com/epam/uicustomers/model/models"
], function (Controller, Utils, models) {
	"use strict";

	return Controller.extend("com.epam.uicustomers.controller.App", {
		onInit: function () {
			var that = this;
			var component = that.getOwnerComponent();
			var navigationParameter = component.getComponentData();
			var shopId = navigationParameter && navigationParameter.startupParameters.shopId;
			shopId = shopId || 1000006;
			if (!component.getModel()) {
				component.setModel(models.createEmptyJSONModel());
			}
			var i18n = component.getModel("i18n");
			this._customersLoadingTask = Utils.createPeriodicalyTask(function () {
				$.ajax({
					type: "GET",
					data: {
						shopId: shopId
					},
					async: false,
					url: "/services/customers?",
					success: function (data, textStatus, jqXHR) {
						component.getModel().setData(data);
					},
					error: function (data, textStatus, jqXHR) {
						console.log("error to post " + textStatus, jqXHR, data);
					}
				});
			}, 25000);
			this._customersLoadingTask.start();
		},
		
		onExit : function(){
			this._customersLoadingTask.stop();
		}
	});
});