const { Cc, Ci, Cu, Cr, Cm, Components } = require("chrome");
const { CustomizableUI } = Cu.import("resource:///modules/CustomizableUI.jsm");
var WindowUtils = require("sdk/window/utils");
var browserWindows = require("sdk/windows").browserWindows;

function AustralisWidget (widget) {
    let customizableWidget = widget.CONFIG;

    function injectPanelView (window) {
        let panelView = window.document.createElement("panelview");
        panelView.id = customizableWidget.viewId;
        panelView.flex = 1;

        let multiView = window.document.getElementById("PanelUI-multiView");
        multiView.appendChild(panelView);
    }

    function windowOpened() {
        for each (var window in WindowUtils.windows()) {
            let panelview = window.document.getElementById(customizableWidget.viewId);
            if (panelview == null) {
                injectPanelView(window);
            }
        }
    }

    // Inject panelview into all open windows
    for each(var window in WindowUtils.windows()) {
        injectPanelView(window);
    }

    // Make sure panelview is injected into newly opened windows
    browserWindows.on("open", windowOpened);

    customizableWidget.onCreated = function (node) {
        console.log("onCreated");
        widget.widgetCreated(node);
    };

    customizableWidget.onViewShowing = function () {
        console.log("onViewShowing");

        let window = WindowUtils.getMostRecentBrowserWindow();
        let view = window.document.getElementById(customizableWidget.viewId);
        view.innerHTML = "";


        widget.viewShowing(window.document, view);

        console.log(view.innerHTML);
    };

    customizableWidget.onViewHiding = function () {
        let window = WindowUtils.getMostRecentBrowserWindow();
        let view = window.document.getElementById(customizableWidget.viewId);

        view.innerHTML = "";
    };

    CustomizableUI.createWidget(customizableWidget);
}

exports.AustralisWidget = AustralisWidget;