jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 NavigationSet in the list

sap.ui.require([
	"sap/ui/test/Opa5",
	"gdprcockpit/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"gdprcockpit/test/integration/pages/App",
	"gdprcockpit/test/integration/pages/Browser",
	"gdprcockpit/test/integration/pages/Master",
	"gdprcockpit/test/integration/pages/Detail",
	"gdprcockpit/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "gdprcockpit.view."
	});

	sap.ui.require([
		"gdprcockpit/test/integration/MasterJourney",
		"gdprcockpit/test/integration/NavigationJourney",
		"gdprcockpit/test/integration/NotFoundJourney",
		"gdprcockpit/test/integration/BusyJourney"
	], function () {
		QUnit.start();
	});
});