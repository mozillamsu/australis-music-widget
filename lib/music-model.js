var MusicLibrary = require('./music-library').MusicLibrary;

function Model() {
    let musicLibrary = null;
    let isPlaying = false;

    return {
        isPlaying: function() { return isPlaying; },
        togglePlayback: function() { isPlaying = !isPlaying; },
        resetLibrary: function() { musicLibrary = new MusicLibrary(); }
    };
}

exports.Model = Model;