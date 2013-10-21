function MusicLibrary() {
    var { Cc, Ci, Cu, Cr, Cm, components } = require('chrome');

    let filePicker = Cc['@mozilla.org/filepicker;1'].createInstance(Ci.nsIFilePicker);
    filePicker.show();
    console.log(filePicker.fileURL.path);
}

exports.MusicLibrary = MusicLibrary;
