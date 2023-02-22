sap.ui.define(["sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, MessageToast, MessageBox) {
  "use strict";

  return Controller.extend(
    "emaldi.com.mastersapui5ge.controller.CrearEmpleados",
    {
      /**
       * @override
       */
      onInit: function () {
        this._typeEmployee = 'Interno';
        this.EmployeeId = undefined;
      },
      /**
       * @override
       */
      onBeforeRendering: function () {
        //Se obtiene la instancia del primer paso.
        this._idWizardEmpleado = this.getView().byId("wizardEmpleados");
        //Se crea el modelo asociado a la vista de CrearEmpleados
        this.oModel = new sap.ui.model.json.JSONModel({});
        this.getView().setModel(this.oModel, 'modelCreate');

        var oFirstStep = this._idWizardEmpleado.getSteps()[0];
        this._idWizardEmpleado.discardProgress(oFirstStep);

        oFirstStep.setValidated(false);

      },

      onChangeTab2: function (oEvent) {

        //this.getView().setModel(this.oModel.setData({}));

        //Step 1 Tipo de Empleado
        let sStepEmpleado = this.getView().byId("TipoEmpleadoStep");
        // Step 2 Datos del Empleado
        let sStepDatos = this.getView().byId("DatosEmpleadoStep");

        //Se pasa 2
        if (this._idWizardEmpleado.getCurrentStep() === sStepEmpleado.getId()) {
          this._idWizardEmpleado.nextStep();
        } else {
          this._idWizardEmpleado.goToStep(sStepDatos);
        }

        //Obtenemos el evento de que boton fue presionado.
        let sButton = oEvent.getSource();
        let sValueButton = sButton.getProperty('text');

        console.log(sValueButton);

        let oData = {
          Type: sValueButton
        };

        this.oModel.setData(oData)
        this.getView().setModel(this.oModel);

      },

      ValidacionDNI: function (oEvent) {
        var dni = oEvent.getParameter("value");
        var number;
        var letter;
        var letterList;
        var regularExp = /^\d{8}[a-zA-Z]$/;
        //Se comprueba que el formato es válido
        if (regularExp.test(dni) === true) {
          //Número
          number = dni.substr(0, dni.length - 1);
          //Letra
          letter = dni.substr(dni.length - 1, 1);
          number = number % 23;
          letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
          letterList = letterList.substring(number, number + 1);
          if (letterList !== letter.toUpperCase()) {
            //Error
            this.oModel.setProperty('/_DniState', 'Error');
            MessageToast.show('El formato del DNI es incorrecto, por favor reviselo!!');
          } else {
            //Correcto
            this.oModel.setProperty('/_DniState', 'None');
          }
        } else {
          //Error
          this.oModel.setProperty('/_DniState', 'Error');
          MessageToast.show('El formato del DNI es incorrecto, por favor reviselo!!');
        }
      },

      onSelectionChange: function (oEvent) {
        this._typeEmployee = oEvent.getParameter("item").getText();
      },

      onStep3: function (oEvent) {
        var sPass = this.validateStep2();

        if (sPass) {

          let Salary, Type;
          switch (this._typeEmployee) {
            case "Interno":
              //Salary = 24000;
              Type = "0";
              break;
            case "Autonomo":
              //Salary = 400;
              Type = "1";
              break;
            case "Gerente":
              //Salary = 70000;
              Type = "2";
              break;
            default:
              break;
          }
          //Actualizo el modelo con las propiedades
          this.oModel.setProperty('/_type', this._typeEmployee);
          this.oModel.setProperty('/Type', Type);
          //this.oModel.setProperty('/_Salary', Salary);

          //Si pasa las validaciones de los campos completos navega al paso 3.
          this._idWizardEmpleado.nextStep();

          this.getView().byId('btnStepTo3').setEnabled(false);

        } else {
          this._idWizardEmpleado.invalidateStep(this.byId("DatosEmpleadoStep"));
          MessageBox.error('Complete todos los campos obligatorios');
        }
      },

      validateStep2: function () {

        var object = this.oModel.getData();
        var sPass = true;
        //Campo Nombre
        if (!object.FirstName) {
          object._FirstNameState = "Error";
          sPass = false;
        } else {
          object._FirstNameState = "None";
        }

        //Campo Apellidos
        if (!object.LastName) {
          object._ApellidoState = "Error";
          sPass = false;
        } else {
          object._ApellidoState = "None";
        }

        //Campo Fecha
        if (!object.CreationDate) {
          object._CreationDateState = "Error";
          sPass = false;
        } else {
          object._CreationDateState = "None";
        }

        //Campo DNI
        if (!object.Dni) {
          object._DniState = "Error";
          sPass = false;
        } else {
          object._DniState = "None";
        }

        return sPass;
      },

      onVerificar: function (oEvent) {

        //Se obtiene los archivos subidos
        var uploadCollection = this.byId("UploadCollection");
        //Obtengo los archivos subidos
        var files = uploadCollection.getItems();
        //Cantidad de archivos que se subieron
        var numFiles = uploadCollection.getItems().length;
        this.oModel.setProperty("/_NumFiles", numFiles);

        if (numFiles > 0) {
          var arrayFiles = [];
          for (var i in files) {
            arrayFiles.push({ DocName: files[i].getFileName(), MimeType: files[i].getMimeType() });
          }
          this.oModel.setProperty("/_UserToAttachment", arrayFiles);
        } else {
          this.oModel.setProperty("/_UserToAttachment", []);
        }

        //Se navega a la página review
        var wizardNavContainer = this.byId("wizardNavContainer");
        wizardNavContainer.to(this.byId("ResumenPage"));

      },

      wizardCompleted: function () {
        debugger;
      },

      onSave: function () {
        var jsonData = this.getView().getModel().getData();
        var data = {};

        //Recorro los datos obtenidos del modelo que no comiencen con _ "guion Bajo"
        for (var i in jsonData) {
          if (i.indexOf("_") !== 0) {
            data[i] = jsonData[i];
          }
        }

        data.SapId = this.getOwnerComponent().SapId;

        data.UserToSalary = [{
          Amount: parseFloat(jsonData._Salary).toString(),
          Comments: jsonData.Comments,
          Waers: "EUR"
        }];

        this.getView().setBusy(true);
        this.getView().getModel("empModelSrv").create("/Users", data, {
          success: function (oData) {
            debugger;

            MessageBox.information('Se ha creado el empleado nro: ' + oData.EmployeeId, {

              onClose: function () {
                var wizardNavContainer = this.byId("wizardNavContainer");
                wizardNavContainer.back();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                //Se navega hacia el router "Menu Tiles"
                oRouter.navTo("RouteMain", {}, true);
              }.bind(this)
            });

            this.EmployeeId = oData.EmployeeId;


            this.onFileUpload();
          }.bind(this),
          error: function (oError) {
            debugger
            MessageBox.error('Error');
          }
        });

      },

      onChangeUploadCollection: function (oEvent) {
        var oUploadCollection = oEvent.getSource();
        // Header Token
        var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
          name: "x-csrf-token",
          value: this.getView().getModel("empModelSrv").getSecurityToken()
        });
        oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
      },

      onCancel: function () {
        //Mensaje de Confirmacion
        MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmarCancelar"), {
          onClose: function (oAction) {
            if (oAction === "OK") {
              //Regresamos al menú principal
              //Se obtiene el conjuntos de routers del programa
              var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              //Se navega hacia el router "Menu Tiles"
              oRouter.navTo("RouteMain", {}, true);
            }
          }.bind(this)
        });
      },

      onFileBeforeUpload: function (oEvent) {

        var oCustomerHeaderSlug = new UploadCollectionParameter({
          name: "slug",
          value: this.getOwnerComponent().SapId + ";" + this.newUser + ";" + oEvent.getParameter("fileName")
        });
        oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);

      },

      additionalInfoValidation: function () { },

      onAfterNavigate: function (step) {

        if (typeof step == 'string') {
          var wizardNavContainer = this.byId("wizardNavContainer");

          this._idWizardEmpleado.goToStep(this.byId(step));

          wizardNavContainer.back();
        }
      },

      onEditSetp1: function () {

        this.onAfterNavigate('TipoEmpleadoStep');

      },

      onEditSetp2: function () {
        this.onAfterNavigate('DatosEmpleadoStep');
      },

      onEditSetp3: function () {
        this.onAfterNavigate('InfoAdicionalStep');
      },

      onFileUpload: function () {

        this.byId('UploadCollection').upload();

      }
    }
  );
});
