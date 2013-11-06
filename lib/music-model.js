var MusicLibrary = require('./music-library').MusicLibrary;

function Model() {
    let musicLibrary = null;
    let isPlaying = false;

    return {
        isPlaying: function() { return isPlaying; },
        togglePlayback: function() { isPlaying = !isPlaying; },
        resetLibrary: function() {
            musicLibrary = new MusicLibrary();
        },
        getFileList: function() {
            if (musicLibrary == null) { return null; }

            return musicLibrary.getFileList();
        },
        setSong: function(filePath) {

        }
    };
}

exports.Model = Model;