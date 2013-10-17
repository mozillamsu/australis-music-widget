var _ = require('./underscore')._;
var msu = require('./msu-util');
var pageBreak = msu.pageBreak;

// let { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');
// var filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
// filePicker.show();
// console.log(filePicker.fileURL.path);

var sdkWindowUtils = require('sdk/window/utils');
var sdkUnload = require('sdk/system/unload');

// var WindowManager = require('./window-manager').WindowManager;
var MusicWidget = require('./music-widget').Widget;

let musicWidget = null;

function initWidget() {
    musicWidget = new MusicWidget(sdkWindowUtils.windows());
}

function addonUnload(eventArgs) {
    msu.log('Unloading: ' + eventArgs);
    musicWidget.unload();
}

sdkUnload.when(addonUnload);

// var sdkWidget = require('sdk/widget').Widget;
// // var loadWidget = sdkWidget({
// //     id: 'msu-load-link',
// //     label: 'Load music addon',
// //     contentURL: 'http://mozilla.com/favicon.ico',
// //     onClick: function() {
// //         initWidget();
// //     }
// // });

// var unloadWidget = sdkWidget({
//     id: 'msu-unload-link',
//     label: 'Unload music addon',
//     contentURL: 'http://jquery.com/favicon.ico',
//     onClick: function() {
//         addonUnload();
//     }
// });

initWidget();
