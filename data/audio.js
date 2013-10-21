var audio = document.getElementById('sound-player');

audio.addEventListener('timeupdate', function() {
    self.port.emit('time-update', {
        currentTime: audio.currentTime,
        duration: audio.duration
    });
});

self.port.on('play', function (args) {
    audio.play();
});

self.port.on('pause', function (args) {
    audio.pause();
});

self.port.on('fileSelected', function(fileURL) {
    audio.src = fileURL;
    audio.load();
});