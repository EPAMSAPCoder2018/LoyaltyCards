sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/epam/uicustomers/controller/base.controller",
	'sap/m/Text',
	"com/epam/uicustomers/model/models",
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Image'
], function (Controller, BaseController, Text, Models, Button, Dialog, Image) {
	"use strict";

	return BaseController.extend("com.epam.uicustomers.controller.Detail", {
		onInit: function () {
			this.MODELS = {
				// "routesFiltersModel": Models.createRoutesFiltersModel(),
				// "requestsModel": Models.createRoutesFiltersModel(),
				// "technicalModel": Models.createEmptyJSONModel(),
				// "orderModel": Models.createEmptyJSONModel(),
				// "carModel": Models.createEmptyJSONModel()
			};

			BaseController.prototype.onInit.apply(this, arguments);
			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
		},

		onAfterRendering: function () {
			BaseController.prototype.onAfterRendering.apply(this, arguments);
		},

		onExit: function () {
			// this._requestsLoadingTask.stop();
		},

		onClickRoute: function (evt) {

		},

		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		_onObjectMatched: function (e) {
			var that = this;
			var oArgs = e.getParameter("arguments");
			var orderId = oArgs.objectId;
			var index = oArgs.index;
			// if (that._requestsLoadingTask) {
			// 	that._requestsLoadingTask.stop();
			// 	delete that._requestsLoadingTask;
			// }

			// this._requestsLoadingTask = this.createPeriodicalyTask(function () {
			// 	$.ajax({
			// 		type: "GET",
			// 		url: "/services/getCustomersRequests?orderId=" + orderId,
			// 		// ifModified : true,
			// 		success: function (data, textStatus, jqXHR) {
			// 			// if(jqXHR.status === 200){
			// 			if (data && data.result) {
			// 				data.result.forEach(function (request, index) {
			// 					request.index = index + 1;
			// 					request.coordinates = request.location;
			// 					request.state = that.STATUSES_MAPPING()[request.status];
			// 					delete request.location;
			// 				});
			// 				that.MODELS.requestsModel.setData(data);
			// 			}
			// 			// }
			// 		},
			// 		error: function (data, textStatus, jqXHR) {
			// 			console.log("error to post " + textStatus, jqXHR, data);
			// 		}
			// 	});
			// }, 25000);
			// that._requestsLoadingTask.start();
			var sObjectPath = "/" + index;
			this._bindView(sObjectPath);
		},

		_bindView: function (sObjectPath) {
			var oView = this.getView();
			oView.setBusy(false);
			oView.bindElement({
				path: sObjectPath,
				// parameters: {
				// 	expand: "Connections"
				// },
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oView.setBusy(true);
					},
					dataReceived: function () {
						oView.setBusy(false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oElementBinding = this.getView().getElementBinding();
			if (oElementBinding && (!oElementBinding.getBoundContext() || !oElementBinding.getBoundContext().getProperty())) {
				this.getRouter().getTargets().display("notFound");
				//this.getOwnerComponent().oListSelector.clearMasterListSelection();
			} else {
				var sPath = oElementBinding.getPath();
				this.getOwnerComponent().oListSelector.selectListItem(sPath);
			}
		},

		onNavBack: function () {
			var sPreviousHash = sap.ui.core.routing.History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var bReplace = true; //Otherwise  we go backward with a forward history
				this.getRouter().navTo("master", {}, bReplace);
			}
		},
		
		onPhotoPress : function (e) {
			this.resizableDialog = new Dialog({
				contentWidth: "800px",
				contentHeight: "600px",
				draggable: true,
				showHeader: false,
				stretch: false,
				content: new Image({
					width : "100%",
					height : "100%",
					src : e.getSource().getSrc()
				}),
				beginButton: new Button({
					text: 'Закрыть',
					press: function () {
						this.resizableDialog.close();
					}.bind(this)
				})
			});

			//to get access to the global model
			this.getView().addDependent(this.resizableDialog);
			this.resizableDialog.open();
		},
		
		onDeletePress : function(){
			
		}
	});
});