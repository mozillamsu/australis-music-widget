const { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');
Cu.import("resource://gre/modules/FileUtils.jsm");

var io = require("sdk/io/file");

function FileTree(dirPath, dirName, parentTree) {
    this.dirPath = dirPath;
    this.subTrees = [];
    this.files = [];
    this.parentTree = parentTree;
    this.dirName = dirName;

    if(parentTree == undefined) {
        this.depth = 0;
    } else {
        this.depth = parentTree.depth + 1;
    }

    try {
        let fileNames = io.list(this.dirPath);

        for(let i = 0; i < fileNames.length; i++) {
            let name = fileNames[i];
            let fullPath = io.join(this.dirPath, name);

            if(this.isDirectory(fullPath)) {
                this.subTrees[this.subTrees.length] = new FileTree(fullPath, name, this);
            } else {
                if(true || this.isValidAudioFileName(name)) {
                    this.files[this.files.length] = name;
                }
            }
        }
    }
    catch(err) {
        console.log(err.toString());
    }
}

FileTree.prototype.isDirectory = function(dirPath) {
    try {
        let fileNames = io.list(dirPath);
    }
    catch(err) {
        return false;
    }
    return true;
}


FileTree.prototype.isValidAudioFileName = function(fileName) {
    return (fileName.endsWith(".mp3") && fileName[0] != ".");
}

FileTree.prototype.createList = function(xs) {
    let list = xs || [];
    for each (var file in this.files) {
        list.push({ fileName: file, filePath: io.join(this.dirPath, file)});
    }
    for each (var tree in this.subTrees) {
        tree.createList(list);
    }
    return list;
}

FileTree.prototype.print = function() {
    let indent = "===";
    let acc = "" + indent;
    for(let i = 0; i < this.depth; i++) {
        acc += "===";
    }

    for(let i = 0; i < this.files.length; i++) {
        console.log(acc + indent + this.files[i] + indent + acc);
    }

    if(this.subTrees.length > 0) { console.log(acc + "Directories" + acc); }
    for(let i = 0; i < this.subTrees.length; i++) {
        console.log(acc + indent + this.subTrees[i].dirName + indent + acc);
        this.subTrees[i].print()
    }

    console.log("\n");
}

function MusicLibrary(window) {
    var { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');

    let filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
    filePicker.init(window, 'Select a Directory', Ci.nsIFilePicker.modeGetFolder);
    filePicker.show();

    this.fileTree = new FileTree(filePicker.fileURL.path);
}

MusicLibrary.prototype.getFileList = function() {
    return this.fileTree.createList();
}

exports.MusicLibrary = MusicLibrary;
