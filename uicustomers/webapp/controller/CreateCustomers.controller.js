sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("com.epam.uicreatecustomer.controller.CreateCustomers", {
		onSave : function () {
			var lName = this.getView().byId("inlastName").getValue();
			var fName = this.getView().byId("infirstName").getValue();
			var mName = this.getView().byId("inmiddleName").getValue();
			var bDate = this.getView().byId("inbDay").getValue();
			var sex = this.getView().byId("insex").getValue();
			var telNum = this.getView().byId("intelNumber").getValue();
			var eMail = this.getView().byId("inemail").getValue();
			var chBox = this.getView().byId("inCheckBox").getSelected();
			if(chBox===true){
				if (lName !== "" && fName !== "" && mName !== "" && bDate !== "" && sex !== "" && telNum !== ""){
					MessageToast.show("Клиент добавлен");	
				}else{
					MessageToast.show("Поля не заполнены");
				}
			}else{
				if (lName !== "" && fName !== "" && mName !== "" && bDate !== "" && sex !== "" && telNum !== "" && eMail !== ""){
					MessageToast.show("Клиент добавлен");	
				}else{
					MessageToast.show("Поля не заполнены");
				}				
			}
		},
		handleSelect : function (evt) {
			var chBox = this.getView().byId("inCheckBox").getSelected(); 
			if (chBox===true){
				this.getView().byId("inemail").setEditable(false);
				this.getView().byId("inemail").setValue("");				
			}else{
				this.getView().byId("inemail").setEditable(true);
			}
		},
		validateMail : function () {
			var email = this.getView().byId("inemail").getValue();
			var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
			if (!mailregex.test(email)) {
				this.getView().byId("inemail").setValueState(sap.ui.core.ValueState.Error);
			}else {
				this.getView().byId("inemail").setValueState(sap.ui.core.ValueState.None);
			}
		}
	});
});