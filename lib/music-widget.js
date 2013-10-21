var sdkPageWorker = require('sdk/page-worker');
var sdkData = require('sdk/self').data;

var DOMHelper = require('./dom-helper').DOMHelper;
var WindowManager = require('./window-manager').WindowManager;

var MusicLibrary = require('./music-library').MusicLibrary;


const CONFIG = {
    ID: 'msu-foo-widget-derp',
    LABEL: 'Foo',
    TOOLTIP: 'Foo Widget v0.1',
    TYPE: 'view',
    VIEW_ID: 'PanelUI-msu-foo',
    REMOVABLE: true,
    XUL_FILE: 'fooPanel.xul',
    ICON_URL: 'http://google.com/favicon.ico'
};

function Widget(CONFIG) {


    this.CONFIG = CONFIG;
    let windowManager = new WindowManager(this);
    let document = windowManager.domHelper.document;
    let library = null;

    let page = sdkPageWorker.Page({
        contentScriptFile: sdkData.url('audio.js'),
        contentURL: sdkData.url('audio.html')
    });

    let isPlaying = false;
    let btnPlayPause = document.getElementById('msu-music-btn-toggle-playback');

    btnPlayPause.addEventListener('command', function(event) {
        if(isPlaying) {
            btnPlayPause.setAttribute('value', 'Play');
            page.port.emit('pause', '');
        } else {
            btnPlayPause.setAttribute('value', 'Pause');
            page.port.emit('play', '');
        }

        isPlaying = !isPlaying;
    });


    let counter = 0;
    let merp = document.getElementById('msu-music-merp');
    let btnSettings = document.getElementById('msu-music-btn-settings');
    let lstLibrary = document.getElementById('msu-music-library');

    btnSettings.addEventListener('command', function(event) {
        library = new MusicLibrary(windowManager.getWindow());
        let files = library.getFileList();
        let counter = 0;
        for each (var file in files) {
            let lbl = document.createElement('label', { id: 'msu-music-lbl' + counter, value: file.fileName});
            lstLibrary.appendChild(lbl);
            lbl = document.getElementById('msu-music-lbl' + counter);
            lbl.addEventListener('mouseover', function(event) {
                lbl.setAttribute('style', 'background: #0066cc;')
            });
            lbl.addEventListener('mouseout', function(event) {
                lbl.setAttribute('style', '')
            });
            let lblClick = function(filePath) {
                console.log('clicked: ' + filePath);
            }
            let str = "";
            for each (var c in file.filePath) {
                str += c;
            }
            lbl.addEventListener('click', function(event) {
                // lblClick(file.filePath);
                console.log('clicked: ' + str);
                page.port.emit('fileSelected', str);
            });
            console.log('Added ' + str);
            counter++;
        }
    });
//    btnSettings.addEventListener('command', function(event) {
//        counter++;
//        let lbl = document.createElement('label', { id: 'msu-music-lbl-' + counter, value: 'Count: ' + counter });
//        lstLibrary.appendChild(lbl);
//        lbl = document.getElementById('msu-music-lbl-' + counter);
//        lbl.addEventListener('mouseover', function(event) {
//            lbl.setAttribute('style', 'background: #0066cc;')
//        });
//        lbl.addEventListener('mouseout', function(event) {
//            lbl.setAttribute('style', '')
//        });
//        let lblID = 'msu-music-lbl-' + counter;
//        let lblClick = function(id) {
//            console.log('clicked: ' + id);
//        }
//        lbl.addEventListener('click', function(event) {
//            lblClick(lblID);
//        });
//    });

    function onCreated(node) {
        console.log('oncreated called');

        let doc = node.ownerDocument;
        // Curren't doesn't take image size into account.
        let img = doc.createElement('image');
        img.setAttribute('class', 'toolbarbutton-icon');
        img.setAttribute('src', CONFIG.ICON_URL);

        let lbl = doc.createElement('label');
        lbl.setAttribute('class', 'toolbarbutton-text toolbarbutton-label');
        lbl.setAttribute('flex', '1');
        lbl.setAttribute('value', 'Foo Widget');

        node.appendChild(img);
        node.appendChild(lbl);
    }

    function onViewShowing(event) {
        console.log('onViewShowing called for widget');
    }

    function onViewHiding(event) {
        console.log('onViewHiding called for widget');
    }

    function addonUnload(eventArgs) {
        console.log('Unloading: ' + eventArgs);
        windowManager.removeInjections();
        windowManager = null;
    }

    return {
        UXWidget: {
            id: CONFIG.ID,
            label: CONFIG.LABEL,
            tooltiptext: CONFIG.TOOLTIP,
            type: CONFIG.TYPE,
            viewId: CONFIG.VIEW_ID,
            removable: CONFIG.REMOVABLE,
            defaultArea: CONFIG.DEFAULT_AREA,

            onCreated: onCreated,
            onViewShowing: onViewShowing,
            onViewHiding: onViewHiding
        },

        addonUnload: addonUnload
    };
}

exports.Widget = Widget;