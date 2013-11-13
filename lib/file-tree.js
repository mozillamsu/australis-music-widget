var { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');

var io = require('sdk/io/file');

function File(name, parent) {
    // console.log('===File Constructor===');
    this.Parent = parent;
    this.FileName = name;
    // TODO: Decide whether or not to use this
    this.Extension = '';
    this.ContentType = '';

    let fullPath = this.getPath();
    let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
    file.initWithPath(this.getPath());
    this.ContentType = Cc['@mozilla.org/mime;1'].getService(Ci.nsIMIMEService).getTypeFromFile(file);
    // console.log(this.ContentType + ': ' + this.FileName);
}

File.prototype.getPath = function() {
    return io.join(this.Parent.getPath(), this.FileName);
}

File.prototype.nsIFile = function() {
    let file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsIFile);
    // console.log('Intializing nsIFile');
    file.initWithPath(this.getPath());

    return file;
}

File.prototype.getBytes = function() {
    // console.log('===File::toDataURL()===');
    // console.log(this);

    let file = this.nsIFile();

    // console.log('getting file input stream');
    let fileInputStream = Cc['@mozilla.org/network/file-input-stream;1'].createInstance(Ci.nsIFileInputStream);
    // console.log('initializing file input stream');
    fileInputStream.init(file, 0x01, 0600, 0);

    // console.log('getting binary input stream');
    let binaryInputStream = Cc['@mozilla.org/binaryinputstream;1'].createInstance(Ci.nsIBinaryInputStream);
    // console.log('setting binary input stream');
    binaryInputStream.setInputStream(fileInputStream);

    // console.log('getting encoded bytes');
    let encodedBytes = binaryInputStream.readBytes(binaryInputStream.available());

    return encodedBytes;
}

function isFolder(folderPath) {
    try {
        io.list(folderPath);
    } catch (err) {
        return false;
    }
    return true;
}

function Folder(name, parent) {
    if (typeof(parent) != 'undefined' && parent != null) {
        this.Parent = parent;
    } else {
        this.Parent = null;
    }

    this.Name = name;

    this.Files = [];
    this.Folders = [];

    let folderPath = this.getPath();

    for each (var filename in io.list(folderPath)) {
        if (isFolder(io.join(folderPath, filename))) {
            this.Folders.push(new Folder(filename, this));
        } else {
            if(filename[0] != '.') {
                this.Files.push(new File(filename, this));
            }
        }
    }
}

Folder.prototype.getPath = function() {
    if (this.Parent == null) {
        return this.Name;
    }

    return io.join(this.Parent.getPath(), this.Name);
};

Folder.prototype.getFileList = function(xs) {
    if (typeof(xs) == 'undefined' || xs == null) {
        xs = [];
    }

    for each (var file in this.Files) {
        xs.push(file);
    }

    for each (var folder in this.Folders) {
        folder.getFileList(xs);
    }

    return xs;
};

exports.Folder = Folder;
exports.File = File;