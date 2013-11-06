var { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');
var WindowUtils = require("sdk/window/utils");

var io = require('sdk/io/file');

function AudioFile(parentDir, file) {
    let title = '';
    let artist = '';
    let fileName = file;
    let parentPath = parentDir.getPath();

    return {
        getPath: function() {
            return io.join(parentPath, fileName);
        },

        toString: function() {
            return fileName;
        }
    };
}

function isFile(filePath) {
    try {
        let fileNames = io.list(filePath);
    } catch (err) {
        return true;
    }

    return false;
}

function getFileNames(path) {
    let files = [];

    for each (var fileName in io.list(path)) {
        if (isFile(io.join(path, fileName))) {
            files.push(fileName);
        }
    }

    return files;
}

function getFolderNames(path) {
    let folders = [];

    for each (var fileName in io.list(path)) {
        if (!isFile(io.join(path, fileName))) {
            folders.push(fileName);
        }
    }

    return folders;
}

function isAudioFile(parentPath, fileName) {
    if (fileName[0] == '.') {
        return false;
    }
    return true;
}

function Directory(theParent, theFilename) {
    this.parentDirectory = theParent;
    this.fileName = theFilename;
    this.files = [];
    this.folders = [];

    for each (var file in getFileNames(this.getPath())) {
        if (isAudioFile(this, file)) {
            this.files.push(new AudioFile(this, file));
        }
    }

    for each (var folder in getFolderNames(this.getPath())) {
        this.folders.push(new Directory(this, folder));
    }
}

Directory.prototype.getPath = function() {
    if (this.parentDirectory == null) {
        return this.fileName;
    } else {
        return io.join(this.parentDirectory.getPath(), this.fileName);
    }
}

Directory.prototype.getFileList = function(xs) {
    if (typeof(xs) == 'undefined' || xs == null) {
        xs = [];
    }

    for each (var file in this.files) {
        xs.push(file);
    }

    for each (var dir in this.folders) {
        dir.getFileList(xs);
    }

    return xs;
}

function fileToDataURI(audioFile) {

}

function MusicLibrary() {
    let filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
    filePicker.init(WindowUtils.getMostRecentBrowserWindow(), 'Select a Directory', Ci.nsIFilePicker.modeGetFolder);
    filePicker.show();

    let rootDirectory = new Directory(null, filePicker.fileURL.path);

    return {
        getFileList: function() {
            return rootDirectory.getFileList();
        }
    };
}

exports.MusicLibrary = MusicLibrary;