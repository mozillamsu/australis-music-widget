var audio = document.getElementById('sound-player');

self.port.on('getMetaData', function(fileInfo) {
    console.log('inside getMetaData of content script');

    let index = fileInfo.Index;

    let encodedData = btoa(fileInfo.Bytes);
    let contentType = fileInfo.ContentType;

    let dataURI = 'data:' + contentType + ';base64,' + encodedData;

    let asset = AV.Asset.fromURL(dataURI);

    let metaData = {};


    asset.on('metadata', function(meta) {
        metaData.Index = index;
        metaData.Title = meta.title;
        metaData.Album = meta.album;
        metaData.Artist = meta.artist;
        metaData.Index = index;
        metaData.dataURI = dataURI;
        if(typeof(meta.coverArt) != 'undefined') {
            metaData.CoverURL = meta.coverArt.toBlobURL();
        } else {
            metaData.CoverURL = null;
        }
    });

    asset.get('duration', function(msec) {
        metaData.Duration = msec;

        self.port.emit('metaDataLoaded', metaData);
    });

    asset.start();
});

self.port.on('setFile', function(dataURI) {
    audio.src = dataURI;
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