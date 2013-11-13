var audio = document.getElementById('sound-player');

audio.ontimeupdate = function(time) {
    let totalSeconds = Math.round(audio.currentTime);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.round(totalSeconds - (minutes * 60));
    self.port.emit('timeUpdate', { TotalSeconds: totalSeconds, Minutes: minutes, Seconds: seconds});
};

self.port.on('setFileURL', function(fileURL) {
    audio.src = fileURL;
    audio.load();
});

self.port.on('play', function() {
    console.log('play!');
	audio.play();
});

self.port.on('pause', function() {
    console.log('pause!');
	audio.pause();
});