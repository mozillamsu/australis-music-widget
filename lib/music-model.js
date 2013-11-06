var data = require('sdk/self').data;
var ss = require('sdk/simple-storage').storage;

var MusicLibrary = require('./music-library').MusicLibrary;

function Model() {
    let artist = '';
    let album = '';
    let title = '';
    let artworkURL = '';

    let musicLibrary = null;
    let isPlaying = false;
    let page = require("sdk/page-worker").Page({
        contentScriptFile: [data.url('aurora.js'), data.url('mp3.js'), data.url('music-player.js')],
        contentURL: data.url('music-player.html')
    });

    let updateMetaData = null;

    if (typeof(ss.msuMusicLibraryPath) == 'undefined') {}
    else {
        musicLibrary = new MusicLibrary(ss.msuMusicLibraryPath);
    }

    page.port.on('metaDataLoaded', function(data) {
        console.log('model received metaDataLoaded');

        artist = data.Artist;
        album = data.Album;
        title = data.Title;
        artworkURL = data.CoverURL;
    });

    return {
        isPlaying: function() { return isPlaying; },
        togglePlayback: function() { isPlaying = !isPlaying; },
        resetLibrary: function() {
            musicLibrary = new MusicLibrary();
            console.log(musicLibrary.getRootDir());
            ss.msuMusicLibraryPath = musicLibrary.getRootDir();
        },
        getFileList: function() {
            if (musicLibrary == null) { return null; }

            return musicLibrary.getFileList();
        },
        setSong: function(filePath) {
            console.log('setSong: ' + filePath);
            page.port.emit('setSong', filePath);
        },
        setData: function(fileInfo) {
            page.port.emit('setData', fileInfo);
        },
        setURL: function(fileURL) {
            page.port.emit('setURL', fileURL);
        },

        getMetaData: function() {
            return {
                Album: album,
                Artist: artist,
                Title: title,
                CoverURL: artworkURL
            };
        }
    };
}

exports.Model = Model;