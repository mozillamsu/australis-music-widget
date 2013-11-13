var audio = document.getElementById('sound-player');

self.port.on('loadTags', function(fileInfo) {
    console.log('inside of loadTags');
    let encodedData = btoa(fileInfo.Bytes);

    let dataURI = 'data:';
    dataURI += fileInfo.ContentType;
    dataURI += ';base64,';
    dataURI += encodedData;

    let asset = AV.Asset.fromURL(dataURI);

    let tagData = {};

    asset.on('metadata', function(meta) {
        tagData.Title = meta.title;
        tagData.Album = meta.album;
        tagData.Artist = meta.artist;
        if (typeof(meta.coverArt) != 'undefined') {
            tagData.CoverURL = meta.coverArt.toBlobURL();
        } else {
            tagData.CoverURL = null;
        }
    });

    asset.get('duration', function(msec) {
        tagData.Duration = msec;
        asset.stop();

        self.port.emit('tagsLoaded', tagData);
    });

    asset.start();
});