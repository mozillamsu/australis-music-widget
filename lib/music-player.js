var data = require('sdk/self').data;
var PageWorker = require('sdk/page-worker');

function MusicPlayer(vmCallback) {
    let isPlaying = false;

    let pageWorker = PageWorker.Page({
        contentScriptFile: data.url('music-player.js'),
        contentURL: data.url('music-player.html')
    });

    pageWorker.port.on('timeUpdate', function(time) {
        vmCallback(time);
    });

    return {
        setFileURL: function(URL) {
            isPlaying = false;
            pageWorker.port.emit('setFileURL', URL);
        },

        isPlaying: function() { return isPlaying; },

        togglePlayback: function() {
            if (isPlaying) {
                pageWorker.port.emit('pause');
            } else {
                pageWorker.port.emit('play');
            }
            isPlaying = !isPlaying;
        }
    };
}

exports.MusicPlayer = MusicPlayer;