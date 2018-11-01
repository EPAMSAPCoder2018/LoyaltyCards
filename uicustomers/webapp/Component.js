sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/epam/uicustomers/model/models",
	"com/epam/uicustomers/controller/ListSelector",
	"com/epam/uicustomers/mock/mockServer",
	"com/epam/uicustomers/util/utils"
], function (UIComponent, Device, models, ListSelector, MockServer, Utils) {
	return UIComponent.extend("com.epam.uicustomers.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// var oMockServer = MockServer.getInstance();
			// oMockServer.start();
			document.title = this.getModel("i18n").getProperty("appTitle");
			this.oListSelector = new ListSelector();
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.getRouter().initialize();
		}
	});
});