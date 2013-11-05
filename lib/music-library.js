var { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');
var WindowUtils = require("sdk/window/utils");

var io = require('sdk/io/file');

function AudioFile(parentDir, file) {
    let title = '';
    let artist = '';
    let fileName = file;
    let parentDirectory = parentDir;

    return {
        getPath: function() {
            return io.join(parentDirectory.getPath(), fileName);
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
    let parentDirectory = theParent;
    let fileName = theFilename;
    let files = [];
    let folders = [];

    function getFullPath() {
        if (parentDirectory == null) {
            return fileName;
        } else {
            return io.join(parentDirectory.getPath(), fileName);
        }
    }

    for each (var file in getFileNames(getFullPath())) {
        if (isAudioFile(getFullPath(), file)) {
            files.push(new AudioFile(getFullPath(), file));
            console.log('Is audio file: ' + file);
        }
    }

    for each (var folder in getFolderNames(getFullPath())) {
        folders.push(new Directory(this, folder));
    }

    return {
        getPath: function() {
            return getFullPath();
        },

        getFileList: function() {
            let xs = [];

            for each (var file in files) {
                xs.push(file);
            }

            for each (var dir in folders) {
                for each (var file in dir.getFileList()) {
                    xs.push(file);
                }
            }

            return xs;
        }
    };
}

function fileToDataURI(audioFile) {

}

function MusicLibrary() {
    let filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
    filePicker.init(WindowUtils.getMostRecentBrowserWindow(), 'Select a Directory', Ci.nsIFilePicker.modeGetFolder);
    filePicker.show();

    let rootDirectory = new Directory(null, filePicker.fileURL.path);

    for each (var file in rootDirectory.getFileList()) {
        console.log(file);
    }
}

exports.MusicLibrary = MusicLibrary;