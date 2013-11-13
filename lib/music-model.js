var data = require('sdk/self').data;

var MusicLibrary = require('./music-library').MusicLibrary;

// TODO: Grab Meta Data
function AudioFile(metaData) {
    this.Title = metaData.Title;
    this.Album = metaData.Album;
    this.Artist = metaData.Artist;
    this.Duration = metaData.Duration;
    this.CoverURL = metaData.CoverURL;
    this.dataURI = metaData.dataURI;
}

// TODO: Actual implementation
AudioFile.prototype.toString = function() {
    return String.concat(this.ContentType, ': ', this.Title);
};

function Model(fileCallback, artCallback) {
    this.isPlaying = false;
    this.MusicLibrary = new MusicLibrary();
    let metaDataCallback = fileCallback;
    let artworkCallback = artCallback;

    let otherLib = new MusicLibrary();
    let libraryLength = otherLib.TrackList.length;
    let metaDataList = [];

    let otherWorker = require("sdk/page-worker").Page({
        contentScriptFile: [data.url('aurora.js'), data.url('mp3.js'), data.url('music-player.js')],
        contentURL: data.url('music-player.html')
    });

    function getTrack(index) {
        let file = otherLib.TrackList[index];

        let fileInfo = {
            Bytes: file.getBytes(),
            ContentType: file.ContentType,
            Index: index
        };

        otherWorker.port.emit('getMetaData', fileInfo);
    }

    otherWorker.port.on('metaDataLoaded', function(data) {
        metaDataList.push(new AudioFile(data));
        if(metaDataList.length < libraryLength) {
            getTrack(data.Index + 1);
        } else {
            metaDataCallback(metaDataList);
        }
        // metaDataCallback(data);
    });

    getTrack(0);

    this.PageWorker = require("sdk/page-worker").Page({
        contentScriptFile: [data.url('aurora.js'), data.url('mp3.js'), data.url('music-player.js')],
        contentURL: data.url('music-player.html')
    });

    this.PageWorker.port.on('metaDataLoaded', function(data) {
        metaDataList.push(new AudioFile(data));
        if(data.Index < libraryLength - 1) {
            this.getTrack(data.Index + 1);
        } else {
            metaDataCallback(metaDataList);
        }
        // metaDataCallback(data);
    });

//    return {
//        getMetaData: function() {
//            return {
//                Album: album,
//                Artist: artist,
//                Title: title,
//                CoverURL: artworkURL
//            };
//        }
//    };
}

Model.prototype.createAudioFile = function(file) {
    let fileInfo = {
        Bytes: file.getBytes(),
        ContentType: file.ContentType,
        Index: i
    };
    this.PageWorker.port.emit('getMetaData', fileInfo);
}

Model.prototype.togglePlayback = function() {
    if(this.isPlaying) {
        this.PageWorker.port.emit('pause', null);
    } else {
        this.PageWorker.port.emit('play', null);
    }
    this.isPlaying = !this.isPlaying;
};

Model.prototype.resetLibrary = function() {
    this.MusicLibrary = new MusicLibrary();
};

Model.prototype.getTrack = function(index) {
    console.log('Inside of getTrack: ' + index);
    let file = this.MusicLibrary.TrackList[index];

    let fileInfo = {
        Bytes: file.getBytes(),
        ContentType: file.ContentType,
        Index: index
    };

    this.PageWorker.port.emit('getMetaData', fileInfo);
}

Model.prototype.getTrackList = function() {
    console.log('Getting Track 0');
//    this.getTrack(0);

//    for each (let track in this.MusicLibrary.TrackList) {
//        console.log('getTrackList: Getting metadata for: ' + track.FileName);
//        this.createAudioFile(track);
//    }



    // return this.MusicLibrary.TrackList;
};

Model.prototype.setFile = function(dataURI) {
    this.PageWorker.port.emit('setFile', dataURI)
};

Model.prototype.setAudioTrack = function(track) {
    this.PageWorker.port.emit('setFilePath', track);
};

exports.Model = Model;