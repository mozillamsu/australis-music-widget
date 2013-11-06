var { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');
var WindowUtils = require("sdk/window/utils");

var io = require('sdk/io/file');
var ss = require('sdk/simple-storage');

var Folder = require('./file-tree').Folder;
var File = require('./file-tree').File;

// TODO: check to see if things are actually audio files
function isAudioFile(file) {
    // console.log('===isAudioFile???===');
    // console.log('Content Type: ' + file.ContentType);

    const validMimeTypes = ['audio/mpeg', 'video/ogg'];
    for each (let mimeType in validMimeTypes) {
        if (file.ContentType == mimeType) {
            return true;
        }
    }
    return false;
}

function MusicLibrary() {
    console.log('===MusicLibrary constructor===');
    this.TrackList = [];

    let rootPath = '';

    if (typeof(ss.storage.msuMusicPlayerLibraryPath) == 'undefined') {
        rootPath = this._chooseRootFolder();
        ss.storage.msuMusicPlayerLibraryPath = rootPath;
    } else {
        rootPath = ss.storage.msuMusicPlayerLibraryPath;
    }

    this._populateTrackList(rootPath);
}

MusicLibrary.prototype._populateTrackList = function(rootPath) {
    this.TrackList = [];

    for each (let file in (new Folder(rootPath)).getFileList()) {
        if (isAudioFile(file)) {
            this.TrackList.push(file);
        }
    }
}

MusicLibrary.prototype._chooseRootFolder = function() {
    console.log('===chooseRootfolder()===');
    let filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
    filePicker.init(WindowUtils.getMostRecentBrowserWindow(), 'Select a Directory', Ci.nsIFilePicker.modeGetFolder);
    filePicker.show();

    return filePicker.fileURL.path;
};

MusicLibrary.prototype.ResetLibraryLocation = function() {
    let rootPath = this._chooseRootFolder();
    this._populateTrackList(rootPath);
}

exports.MusicLibrary = MusicLibrary;