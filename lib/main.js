const { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');
const { CustomizableUI } = Cu.import("resource:///modules/CustomizableUI.jsm");

var sdkWidget = require('sdk/widget').Widget;
var sdkWindowUtils = require('sdk/window/utils');
var sdkUnload = require('sdk/system/unload');

var MusicWidget = require('./music-widget').Widget;
let musicWidget = null;

const CONFIG = {
    ID: 'msu-foo-widget-derp',
    LABEL: 'Foo',
    TOOLTIP: 'Foo Widget v0.1',
    TYPE: 'view',
    VIEW_ID: 'PanelUI-msu-foo',
    DEFAULT_AREA: CustomizableUI.AREA_PANEL,
    REMOVABLE: true,
    XUL_FILE: 'musicPanel.xul',
    ICON_URL: 'http://google.com/favicon.ico'
};

function addonUnload(eventArgs) {
    CustomizableUI.destroyWidget(CONFIG.ID);
    musicWidget.addonUnload(eventArgs);
}

function initWidget() {
    musicWidget = new MusicWidget(CONFIG);
    sdkUnload.when(addonUnload);
    CustomizableUI.createWidget(musicWidget.UXWidget);
}

let useLoadingButtons = false;

if (useLoadingButtons) {
    // Usedful for testing the Loading + Unloading of the extension easily
    var loadWidget = sdkWidget({
        id: 'msu-load-link',
        label: 'Load music addon',
        contentURL: 'http://mozilla.com/favicon.ico',
        onClick: function () {
            initWidget();
        }
    });

    var unloadWidget = sdkWidget({
        id: 'msu-unload-link',
        label: 'Unload music addon',
        contentURL: 'http://jquery.com/favicon.ico',
        onClick: function () {
            addonUnload();
        }
    });
} else {
    initWidget();
}
