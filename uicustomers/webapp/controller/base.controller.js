sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/m/Text',
	"com/epam/uicustomers/util/utils",
], function (Controller, Text, Utils) {
	"use strict";
	return Controller.extend("com.epam.uicustomers.controller.base", {
		onInit: function () {
			if(this.MODELS){
				var modelsNames = Object.keys(this.MODELS);
				for(var i=0; i < modelsNames.length; i++){
					this.getView().setModel(this.MODELS[modelsNames[i]], modelsNames[i]);
				}
			}
		},

		onAfterRendering: function () {
		
		},

		onZoomChanged: function (evt) {
			
		},

		onExit: function () {
			
		},
		
		onHideView : function(evt){
		},

		createPeriodicalyTask: Utils.createPeriodicalyTask
	});
});