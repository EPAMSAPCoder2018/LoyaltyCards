sap.ui.define([], function () {
	"use strict";
	return {
		boldText: function(sText) {
        	this.addStyleClass("boldText"); 
            return sText;
        }
	};
});