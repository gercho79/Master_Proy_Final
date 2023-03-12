sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (
	Controller,
	MessageToast,
	MessageBox
) {
	"use strict";

	return Controller.extend("emaldi.com.mastersapui5ge.controller.ResumenEmpleado", {

		onInit: function () {
			this._sapId = this.getOwnerComponent().SapId;

			this._splitAppEmployee = this.byId("splitAppEmployee");
		},

		onPressBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//oRouter.navTo(this.byId("RouteMain"));
			oRouter.navTo("RouteMain", {}, true);
		},

		onSearchEmployee: function () {

		},

		onSelectEmployee: function (oEvent) {
			//Navega al Detail Employee
			this._splitAppEmployee.to(this.createId("detailEmployee"));
			//Obtengo el contexto del modelo asociado al master
			var oContext = oEvent.getParameter("listItem").getBindingContext("empModelSrv");
			//Se almacena el contexto del usuario seleccionado en el master.
			this.employeeId = oContext.getProperty("EmployeeId");
			this.LastName = oContext.getProperty("LastName");
			this.FirstName = oContext.getProperty("FirstName");

			var detailEmployee = this.byId("detailEmployee");
			//Se bindea a la vista Details los datos del usuario seleccionado.
			detailEmployee.bindElement("empModelSrv>/Users(EmployeeId='" + this.employeeId + "',SapId='" + this._sapId + "')");

		},


		//Función para eliminar el empleado seleccionado
		onDeleteEmployee: function (oEvent) {
			//Se muestra un mensaje de confirmación
			sap.m.MessageBox.confirm('Esta seguro que desea eliminar el empleado: ' + this.employeeId + '-' + this.FirstName + '-' + this.LastName, {
				title: 'Confirmación',
				onClose: function (oAction) {
					if (oAction === "OK") {
						//Se llama a la función remove
						this.getView().getModel("empModelSrv").remove("/Users(EmployeeId='" + this.employeeId + "',SapId='" + this._sapId+ "')", {
							success: function (data) {
								MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("UserDeleted"));
								//En el detalle se muestra el mensaje "Seleecione empleado"
								this._splitAppEmployee.to(this.createId("detailEmployeeSelected"));
							}.bind(this),
							error: function (oError) {
								MessageBox.error('Se produzco un error :(');
								//sap.base.Log.info(oError);
							}.bind(this)
						});
					}
				}.bind(this)
			});
		},

		onPromotionEmployee: function (oEvent) {
			if (!this.promotionDialog) { //Si no existe la instancia de fragmento se crea y se asigna a la vista
				this.promotionDialog = sap.ui.xmlfragment("emaldi.com.mastersapui5ge/view/fragments/PromocionEmpleado", this);
				this.getView().addDependent(this.promotionDialog);
			}
			//Se setea un nuevo modelo al fragmento
			this.promotionDialog.setModel(new sap.ui.model.json.JSONModel({}), "promotionEmp");

			//Obtengo el modelo asociado a la vista MostrarEmpleado
			this.getView().getModel("empModelSrv").read("/Salaries(EmployeeId='" + this.employeeId + "',SapId='" + this._sapId+ "')",{

				success: function (oData) {
					debugger;
				},

				error: function(oError){
					
				}
			});

			//Se abre el dialogo
			this.promotionDialog.open();
		},

		addPromotion: function () {
			//Se obtiene el modelo asociado
			var oModelPromotion = this.promotionDialog.getModel("promotionEmp");
			//Se obtiene los datos
			var odata = oModelPromotion.getData();
			//Se envia la info nueva a sap
			var body = {
				Amount: odata.Ammount,
				CreationDate: odata.CreationDate,
				Comments: odata.Comments,
				SapId: this._sapId,
				EmployeeId: this.employeeId
			};
			this.getView().setBusy(true);

			this.getView().getModel("empModelSrv").create("/Salaries", body, {
				success: function () {
					this.getView().setBusy(false);
					sap.m.MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("promotionOK"));
					this.onClosePromotionDialog();
				}.bind(this),
				error: function () {
					this.getView().setBusy(false);
					MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("promotionNOK"));
				}.bind(this)
			});
		},
		onClosePromotionDialog: function () {
			this.promotionDialog.close();
		},

		//Evento para subir un nuevo Archivo al id de empleado
		onChangeFile: function (oEvent) {
			var oUploadCollection = oEvent.getSource();
			// Token
			var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
				name: "x-csrf-token",
				value: this.getView().getModel("empModelSrv").getSecurityToken()
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
		},

		onUploadCompleteFile: function (oEvent) {
			var oUploadCollection = oEvent.getSource();
			oUploadCollection.getBinding("items").refresh();
		},

		onBeforeUploadStartFile: function (oEvent) {
			var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
				name: "slug",
				value: this._sapId + ";" + this.employeeId + ";" + oEvent.getParameter("fileName")
			});
			oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
		},

		onFileDeletedFile: function (oEvent) {
			var oUploadCollection = oEvent.getSource();
			var sPath = oEvent.getParameter("item").getBindingContext("empModelSrv").getPath();
			this.getView().getModel("empModelSrv").remove(sPath, {
				success: function () {
					oUploadCollection.getBinding("items").refresh();
				},
				error: function () {
					MessageBox.error('Se prozco un error en la eliminación del archivo. Intente nuevamente.')
				}
			});
		},

		donwloadFile: function(oEvent){
			var sPath = oEvent.getSource().getBindingContext("empModelSrv").getPath();
			window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV"+sPath+"/$value");
		}

	});
});