var { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');
var PageWorker = require('sdk/page-worker');
var indexedDB = require('indexed-db').indexedDB;
var WindowUtils = require("sdk/window/utils");

var data = require('sdk/self').data;
var io = require('sdk/io/file');
var ss = require('sdk/simple-storage');

var Folder = require('./file-tree').Folder;

function MusicLibrary(vmCallback) {
    function chooseFolder() {
        let filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
        filePicker.init(WindowUtils.getMostRecentBrowserWindow(), 'Select a Music Folder', Ci.nsIFilePicker.modeGetFolder);
        filePicker.show();

        return filePicker.fileURL.path;
    }

    let fileAddedToDB = vmCallback;

    let rootPath = '';
    let rootFolder = null;

    if (typeof(ss.storage.msuMusicPlayerLibraryPath) == 'undefined') {
        rootPath = chooseFolder();
        ss.storage.msuMusicPlayerLibraryPath = rootPath;
    } else {
        rootPath = ss.storage.msuMusicPlayerLibraryPath;
    }
    console.log('===MusicLibrary=== Using ' + rootPath + ' as root dir');


    rootFolder = new Folder(rootPath);
    let fileIndex = 0;
    let fileList = rootFolder.getFileList();
    let trackList = [];

    function getFileInfo(file) {
        return {
            Bytes: file.getBytes(),
            ContentType: file.ContentType
        };
    }

    let pageWorker = PageWorker.Page({
        contentScriptFile: [data.url('aurora.js'), data.url('mp3.js'), data.url('tag-getter.js')],
        contentURL: data.url('tag-getter.html')
    });

    console.log('setting event');

    pageWorker.port.on('tagsLoaded', function(tagData) {
        console.log('tagsLoaded for track ' + (fileIndex + 1) + ': ');
        let track = tagData;
        track.Index = fileIndex;
        track.FileURL = fileList[fileIndex].getPath();

        // TODO: Use indexedDB
        trackList.push(track);
        vmCallback(tagData);

        fileIndex++;
        if (fileIndex < fileList.length) {
            let file = fileList[fileIndex];

            pageWorker.port.emit('loadTags', getFileInfo(file));
        } else {
            // Remove reference to file list
            fileList = null;
        }
    });

    console.log('event set');

    let db = null;
    let request = indexedDB.open("merpDerp", 1);
    request.onupgradeneeded = function(e) {
        db = e.target.result;

        if (!db.objectStoreNames.contains("todo")) {
            console.log("Creating TODO store");
            db.createObjectStore("todo", {
                keyPath: "timeStamp"
            });
        } else {
            console.log("Already contains TODO store");
        }
    }

    request.onsuccess = function(e) {
        db = e.target.result;
        console.log("Success with indexedDB!");

        let trans = db.transaction(["todo"], "readwrite");
        let store = trans.objectStore("todo");
        let req = store.put({
            "text": "merpily derp herp :D",
            "timeStamp": "booooo a date v2"
        });
        req.onsuccess = function(e) {
            console.log("yayyy we put in data!");
        };
        req.onerror = function(e) {
            console.log("booo an error");
            console.log(e.value);
        };
    }
    // if(fileList.length > 0) {
    //     let fileInfo = getFileInfo(fileList[fileIndex]);
    //     pageWorker.port.emit('loadTags', fileInfo);
    // } else {
    //     console.log('No audio files found in file tree');
    // }

    return {
        getTrackList: function() {
            return trackList;
        }
    };
}

exports.MusicLibrary = MusicLibrary;