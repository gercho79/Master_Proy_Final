sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Library) {
        "use strict";

        return Controller.extend("emaldi.com.mastersapui5ge.controller.Main", {
            onInit: function () {

            },

            onCrearEmpleados: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo('RouteCreaEmp');
            },
            onMostrarEmpleados: function () {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo('RouteResumeEmp');
            },

            openEmployeesV2: function () {
                const url = "https://6df3ee94trial-dev-employees-v2-approuter.cfapps.us10-001.hana.ondemand.com/logaligroupemployeesv2/index.html";
                const { URLHelper } = Library;
                URLHelper.redirect(url);
            }
        });
    });
