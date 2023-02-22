sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (
	Controller
) {
	"use strict";

	return Controller.extend("emaldi.com.mastersapui5ge.controller.ResumenEmpleado", {

		onInit: function () {
          this.sapId = this.getOwnerComponent().SapId;


		  this.getView().getModel("empModelSrv").read("/Users",, {
			success: function (oData) {
			},
			error: function(){

			}
		})
		},

		onPressBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter .to(this.byId("ResumenPage"));
		},

		onSearchEmployee: function(){

		},

		onSelectEmployee: function(){

		},

		


	});
});