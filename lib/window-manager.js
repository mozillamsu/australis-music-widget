var sdkWindows = require('sdk/windows').browserWindows;
var sdkWindowUtils = require('sdk/window/utils');
var sdkData = require('sdk/self').data;

var DOMHelper = require('./dom-helper').DOMHelper;

function WindowManager(widget) {
    let widget = widget;
    let injectedWindows = [];
    let domHelper = null;

    this.__defineGetter__('windows', function() {
        return sdkWindowUtils.windows();
    });

    function addWindow(newWindow) {
        domHelper.populateWindow(newWindow);
    }

    function injectedWindow(newWindow) {
        for each (var window in injectedWindows) {
            if (window === newWindow) { return true; }
        }
        return false;
    }

    function windowsModified() {
        for each (var window in sdkWindowUtils.windows()) {
            if(!injectedWindow(window)) {
                addWindow(window);
            }
        }
    }

    function windowClosed() {
        console.log('Num windows: ' + sdkWindowUtils.windows().length);
    }

    // TODO: Modify the creation of the view so there won't be a bug when no windows are open
    // We should be able to just open a window, grab it's document, and close it if there's no windows open
    let someDoc = sdkWindowUtils.windows()[0].document;
    let doctype = someDoc.doctype;
    let aDocument = someDoc.implementation.createDocument('', '', someDoc.doctype);
    domHelper = new DOMHelper(aDocument, widget.CONFIG.VIEW_ID, sdkData.load(widget.CONFIG.XUL_FILE));
    windowsModified();

    sdkWindows.on('open', windowsModified);
    sdkWindows.on('close', windowClosed);

    return {
        domHelper: domHelper,
        removeInjections: function() {
            domHelper.removeInjections();
        },
        getWindow: function() {
            return sdkWindowUtils.windows()[0];
        }
    };
}

exports.WindowManager = WindowManager;