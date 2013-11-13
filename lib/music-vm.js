var data = require('sdk/self').data;
var idb = require('indexed-db');
var indexedDB = require('indexed-db').indexedDB;

var MusicPlayer = require('./music-player').MusicPlayer;
var MusicLibrary = require('./music-library').MusicLibrary;

const elementIds = {
    Container: "msu-music-vbox-container",
    SetLibrary: "msu-music-btn-set-library",
    Elapsed: "msu-music-playback-elapsed",
    Remaining: "msu-music-playback-remaining",
    ProgressSlider: "msu-music-playback-progress",
    Previous: "msu-music-btn-previous",
    PlayPause: "msu-music-btn-play-pause",
    Next: "msu-music-btn-next",
    Library: "msu-music-vbox-library",
    AlbumArtwork: "msu-music-img-album-artwork",
    Title: "msu-music-lbl-title",
    Album: "msu-music-lbl-album",
    Artist: "msu-music-lbl-artist"
};

function ViewModel() {
    console.log('===ViewModel Constructor===');

    // let db = null;
    // let request = indexedDB.open("merpDerp", 1);
    // request.onupgradeneeded = function(e) {
    //     db = e.target.result;

    //     if (!db.objectStoreNames.contains("todo")) {
    //         console.log("Creating TODO store in VM");
    //         db.createObjectStore("todo", {
    //             keyPath: "timeStamp"
    //         });
    //     } else {
    //         console.log("Already contains TODO store in VM");
    //     }
    // }

    // request.onsuccess = function(e) {
    //     db = e.target.result;
    //     console.log("Success with indexedDB in VM!");

    //     let trans = db.transaction(["todo"], "readwrite");
    //     var store = trans.objectStore("todo");
    //     var keyRange = idb.IDBKeyRange.lowerBound(0);
    //     let cursorRequest = store.openCursor(keyRange);

    //     cursorRequest.onsuccess = function(e) {
    //         let result = e.target.result;
    //         if (!!result == false) { return; }

    //         console.log("got a result in VM");
    //         console.log(result.value);
    //         result.continue();
    //     }
    // }


    let document = null;
    let view = null;

    let btnPrevious = null;
    let btnNext = null;
    let btnPlayPause = null;

    let btnSetLibrary = null;

    let lblTitle = null;
    let lblAlbum = null;
    let lblArtist = null;

    let lblElapsed = null;
    let lblRemaining = null;
    let sliderPlaybackProgress = null;

    let vLibrary = null;
    let vContainer = null;

    let imgAlbumArtwork = null;

    let currentTrack = null;
    let currentTime = null;

    let trackList = [];

    function trackSelected(track) {
        currentTime = {
            TotalSeconds: 0,
            Minutes: 0,
            Seconds: 0
        };

        if(musicPlayer.isPlaying()) {
            musicPlayer.togglePlayback();
        }

        currentTrack = track;
        updateUI();

        musicPlayer.setFileURL('file://' + track.FilePath);
    }

    function addTrackToPlaylist(track) {
        if (document == null) { return; }

        let title = String.concat('', track.Title);
        let album = String.concat('', track.Album);
        let artist = String.concat('', track.Artist);
        let duration = String.concat('', track.Duration);
        let coverURL = String.concat('', track.CoverURL);
        let filePath = String.concat('', track.FilePath);
        let displayStr = String.concat(artist, ' - ', title);

        console.log('creating a label');
        let trackLabel = document.createElement('label');
        console.log('label created');
        trackLabel.setAttribute('value', displayStr);

        trackLabel.addEventListener('mouseover', function() {
            trackLabel.setAttribute('style', 'background-color: #0066cc;');
        });

        trackLabel.addEventListener('mouseout', function() {
            trackLabel.setAttribute('style', '');
        });

        trackLabel.addEventListener('click', function() {
            console.log('Track Title: ' + displayStr);

            trackSelected({
                Title: title,
                Album: album,
                Artist: artist,
                Duration: duration,
                CoverURL: coverURL,
                FilePath: filePath
            });
        });

        vLibrary.appendChild(trackLabel);
    }

    function convertDuration(duration) {
        let minutes = (duration / 1000) / 60;
    }

    function trackAddedToDB(track) {
        console.log('===fileAddedToDB()===');
        addTrackToPlaylist(track);
    }

    function timeUpdated(time) {
        currentTime = time;
        fillTime();
    }

    let musicPlayer = new MusicPlayer(timeUpdated);
    let musicLibrary = new MusicLibrary(trackAddedToDB);

    function fillMetaData() {
        if(currentTrack != null) {
            lblTitle.setAttribute('value', currentTrack.Title);
            lblArtist.setAttribute('value', currentTrack.Artist);
            lblAlbum.setAttribute('value', currentTrack.Album);

            imgAlbumArtwork.src = currentTrack.CoverURL;
        }
        fillTime();
    }

    function fillLibrary() {
        console.log('===VM::fillLibrary()===');

        vLibrary.innerHTML = '';

        for each (var track in musicLibrary.getTrackList()) { //trackList) {
            console.log('adding a track!');

            addTrackToPlaylist(track);
        }
    }

    function fillTime() {
        if(currentTime == null) { return; }
        let min = currentTime.Minutes;
        let sec = currentTime.Seconds;
        let dsec = '' + sec;

        if (sec < 10) {
            dsec = '0' + sec;
        }

        sliderPlaybackProgress.setAttribute('value', currentTime.TotalSeconds);
        lblElapsed.setAttribute('value', min + ':' + dsec);

        if (currentTrack == null) { return; }
        let totalSeconds = Math.round(currentTrack.Duration / 1000);
        sliderPlaybackProgress.setAttribute('max', totalSeconds);

        totalSeconds -= ((min * 60) + sec);
        min = Math.floor(totalSeconds / 60);
        sec = totalSeconds - (min * 60);
        if (sec < 10) {
            sec = '0' + sec;
        }
        lblRemaining.setAttribute('value', String.concat('-', min, ':', sec));
    }

    function updateUI() {
        console.log('===updateUI()===');
        if (musicPlayer.isPlaying()) {
            btnPlayPause.innerHTML = 'Pause';
        } else {
            btnPlayPause.innerHTML = 'Play';
        }
        fillMetaData();
        fillTime();
        console.log(sliderPlaybackProgress);
    }

    function btnSetLibraryClicked() {
        console.log('Set library clicked');
        musicLibrary.selectRootFolder();
    }

    function togglePlayback() {
        console.log(currentTrack);
        musicPlayer.togglePlayback();

        updateUI();
    }

    function btnNextClick() {
    }

    function btnPreviousClick() {
    }

    function populateView() {
        console.log('===populateView()===');

        let xulToInject = data.load('music-player.xul');

        view.innerHTML = xulToInject;

        btnPrevious = document.getElementById(elementIds.Previous);
        btnNext = document.getElementById(elementIds.Next);
        btnPlayPause = document.getElementById(elementIds.PlayPause);
        btnSetLibrary = document.getElementById(elementIds.SetLibrary);
        lblElapsed = document.getElementById(elementIds.Elapsed);
        lblRemaining = document.getElementById(elementIds.Remaining);
        sliderPlaybackProgress = document.getElementById(elementIds.ProgressSlider);
        vLibrary = document.getElementById(elementIds.Library);
        vContainer = document.getElementById(elementIds.Container);
        imgAlbumArtwork = document.getElementById(elementIds.AlbumArtwork);
        lblTitle = document.getElementById(elementIds.Title);
        lblAlbum = document.getElementById(elementIds.Album);
        lblArtist = document.getElementById(elementIds.Artist);

        btnSetLibrary.addEventListener('command', btnSetLibraryClicked);
        btnPlayPause.addEventListener('command', togglePlayback);

        btnNext.addEventListener('command', btnNextClick);
        btnPrevious.addEventListener('command', btnPreviousClick);

        fillLibrary();
        updateUI();
    }

    return {
        injectUI: function(doc, theView) {
            document = doc;
            view = theView;
            populateView();
        },

        togglePlayback: function() {
            let btn = document.getElementById('msu-music-btn-play-pause');

            if (model.isPlaying) {
                btn.innerHTML = 'Play';
            } else {
                btn.innerHTML = 'Pause';
            }

            model.isPlaying = !model.isPlaying;
        }
    };
}

exports.ViewModel = ViewModel;