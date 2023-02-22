/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"emaldicom/master_sapui5_ge/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
