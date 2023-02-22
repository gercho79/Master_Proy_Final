sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
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
            }
        });
    });
