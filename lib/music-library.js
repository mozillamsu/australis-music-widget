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
        },

        getData: function() {
            console.log('===AudioFile::getData()===');
            let path = io.join(parentPath, fileName);
            let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
            file.initWithPath(path);

            let contentType = Cc['@mozilla.org/mime;1'].getService(Ci.nsIMIMEService).getTypeFromFile(file);

            console.log('content type: ' + contentType);

            console.log('getting file input stream');
            let fileInputStream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream);
            fileInputStream.init(file, 0x01, 0600, 0);

            console.log('getting binary input stream');
            let binaryInputStream = Cc['@mozilla.org/binaryinputstream;1'].createInstance(Ci.nsIBinaryInputStream);
            binaryInputStream.setInputStream(fileInputStream);

            console.log('getting encoded bytes');
            let encodedBytes = binaryInputStream.readBytes(binaryInputStream.available());

            return {
                displayName: fileName,
                contentType: contentType,
                data: encodedBytes
            };
        },

        toDataURI: function() {
            console.log('===toDataURI()===');
            let path = io.join(parentPath, fileName);
            let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
            file.initWithPath(path);

            let contentType = Cc['@mozilla.org/mime;1'].getService(Ci.nsIMIMEService).getTypeFromFile(file);

            console.log('content type: ' + contentType);

            console.log('getting file input stream');
            let fileInputStream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream);
            fileInputStream.init(file, 0x01, 0600, 0);

            console.log('getting binary input stream');
            let binaryInputStream = Cc['@mozilla.org/binaryinputstream;1'].createInstance(Ci.nsIBinaryInputStream);
            binaryInputStream.setInputStream(fileInputStream);

            console.log('getting encoded bytes');
            let encodedBytes = binaryInputStream.readBytes(binaryInputStream.available());

            console.log('typeof(encodedBytes) == ' + typeof(encodedBytes));
            console.log(encodedBytes);

            console.log('trying btoa');
            console.log(btoa('hello world'));

            console.log('getting encoded data');
            let encodedData = btoa(encodedBytes);

            console.log('end of toDataURI()');
            return 'data:' + contentType + ';base64,' + encodedData;
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

function MusicLibrary(dir) {
    let rootDir = dir;
    if (typeof(dir) == 'undefined') {
        let filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
        filePicker.init(WindowUtils.getMostRecentBrowserWindow(), 'Select a Directory', Ci.nsIFilePicker.modeGetFolder);
        filePicker.show();
        rootDir = filePicker.fileURL.path;
    }

    console.log('rootDir = ' + rootDir);
    let rootDirectory = new Directory(null, rootDir);

    return {
        getFileList: function() {
            return rootDirectory.getFileList();
        },

        getRootDir: function() {
            return rootDirectory.getPath();
        }
    };
}

exports.MusicLibrary = MusicLibrary;