var { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');
var PageWorker = require('sdk/page-worker');
var indexedDB = require('indexed-db').indexedDB;
var WindowUtils = require("sdk/window/utils");

var data = require('sdk/self').data;
var io = require('sdk/io/file');
var ss = require('sdk/simple-storage');

var Folder = require('./file-tree').Folder;

function isAudioType(contentType) {
    console.log('====Checking if valid audio=== ' + contentType);
    return (contentType == 'audio/mpeg');
}

function MusicLibrary(vmCallback) {
    let rootPath = '';
    let rootFolder = null;
    let fileIndex = 0;
    let trackList = [];
    let fileList = [];

    let pageWorker = PageWorker.Page({
        contentScriptFile: [data.url('aurora.js'), data.url('mp3.js'), data.url('tag-getter.js')],
        contentURL: data.url('tag-getter.html')
    });

    pageWorker.port.on('tagsLoaded', function(tagData) {
        console.log('tagsLoaded for track ' + (fileIndex + 1) + ': ');
        console.log(tagData);
        let track = tagData;
        track.Index = fileIndex;
        track.FilePath = fileList[fileIndex].getPath();

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

    function getFileInfo(file) {
        return {
            Bytes: file.getBytes(),
            ContentType: file.ContentType
        };
    }

    function chooseFolder() {
        let filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
        filePicker.init(WindowUtils.getMostRecentBrowserWindow(), 'Select a Music Folder', Ci.nsIFilePicker.modeGetFolder);
        filePicker.show();

        return filePicker.fileURL.path;
    }

    if (typeof(ss.storage.msuMusicPlayerLibraryPath) == 'undefined') {
        rootPath = chooseFolder();
        ss.storage.msuMusicPlayerLibraryPath = rootPath;
    } else {
        rootPath = ss.storage.msuMusicPlayerLibraryPath;
    }
    console.log('===MusicLibrary=== Using ' + rootPath + ' as root dir');


    rootFolder = new Folder(rootPath);

    function getTagDataForFile(fileInfo) {
        pageWorker.port.emit('loadTags', fileInfo);
    }

    function getMetadata() {
        fileIndex = 0;
        fileList = rootFolder.getFileList();
        while(fileIndex < fileList.length) {
            let fileInfo = getFileInfo(fileList[fileIndex]);
            console.log('Checking if audio');
            if (isAudioType(fileInfo.ContentType)) {
                console.log('Is audio. Startin shit');
                getTagDataForFile(fileInfo);
                return;
            }
            fileIndex++;
        }
    }

    getMetadata();

    let db = null;
    let dbRequest = indexedDB.open("msuMusicTagData", 2);
    dbRequest.onupgradeneeded = function(e) {
        db = e.target.result;

        if(!db.objectStore.contains("tagData")) {
            console.log('creating tagData store');
            db.createObjectStore('tagData', {
                keyPath: 'FilePath'
            });
        }
    };
    dbRequest.onerror = function(e) {
        console.log('There was an error opening the indexedDB connection');
        console.log(e);
    };

    // console.log('event set');

    // let db = null;
    // let request = indexedDB.open("merpDerp", 1);
    // request.onupgradeneeded = function(e) {
    //     db = e.target.result;

    //     if (!db.objectStoreNames.contains("todo")) {
    //         console.log("Creating TODO store");
    //         db.createObjectStore("todo", {
    //             keyPath: "timeStamp"
    //         });
    //     } else {
    //         console.log("Already contains TODO store");
    //     }
    // }

    // request.onsuccess = function(e) {
    //     db = e.target.result;
    //     console.log("Success with indexedDB!");

    //     let trans = db.transaction(["todo"], "readwrite");
    //     let store = trans.objectStore("todo");
    //     let req = store.put({
    //         "text": "merpily derp herp :D",
    //         "timeStamp": "booooo a date v2"
    //     });
    //     req.onsuccess = function(e) {
    //         console.log("yayyy we put in data!");
    //     };
    //     req.onerror = function(e) {
    //         console.log("booo an error");
    //         console.log(e.value);
    //     };
    // }
    

    return {
        getTrackList: function() {
            return trackList;
        },

        selectRootFolder: function() {
            fileList = [];
            trackList = [];
            rootPath = chooseFolder();
            rootFolder = new Folder(rootPath);
            getMetadata();
        }
    };
}

exports.MusicLibrary = MusicLibrary;