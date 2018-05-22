jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"gdprcockpit/test/integration/NavigationJourneyPhone",
		"gdprcockpit/test/integration/NotFoundJourneyPhone",
		"gdprcockpit/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});