var Widgets = require('sdk/widget');

var AustralisWidget = require("./xul-manager/australis-widget.js").AustralisWidget;
var TestWidget = require("./test-widget.js").TestWidget;

function initAddon() {
	var testWidget = new TestWidget();
	var australisWidget = new AustralisWidget(testWidget);
}

let useButtonLoader = false;

if(useButtonLoader) {
    var widgetLoader = Widgets.Widget({
      id: "msu-music-loader",
      label: "Music Loader",
      contentURL: "http://mozilla.org/favicon.ico",
      onClick: function() {
        initAddon();
      }
    });
} else {
    initAddon();
}