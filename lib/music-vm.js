var data = require('sdk/self').data;

var Model = require('./music-model').Model;

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

    let trackList = [];
    let artworkURL = '';

    function filesLoaded(metaFiles) {
        trackList = metaFiles;
    }

    function artworkLoaded(URL) {
        artworkURL = URL;
    }

    let model = new Model(filesLoaded, artworkLoaded);
    model.getTrackList();

    let currentTrack = null;

    function fillMetaData() {
        console.log('===VM::fillMetaData()===')

        lblTitle.setAttribute('value', currentTrack.Title);
        lblArtist.setAttribute('value', currentTrack.Artist);
        lblAlbum.setAttribute('value', currentTrack.Album);

        imgAlbumArtwork.src = currentTrack.CoverURL;

        lblRemaining.setAttribute('value', currentTrack.Duration);

        // console.log('filling metadata in view model');
        // let metaData = model.getMetaData();
        // console.log(metaData);

        // console.log(imgAlbumArtwork);
        // console.log('src before: ' + imgAlbumArtwork.src);
        // imgAlbumArtwork.src = metaData.CoverURL;
        // console.log('src after: ' + imgAlbumArtwork.src);
    }

    function btnNextClick() {
        console.log('=================================================');
        console.log('=================================================');
        console.log(currentTrack.Index);

        currentTrack = trackList[currentTrack.Index + 1];
        console.log(currentTrack.Index);

        console.log('next click: ' + currentTrack.Title);
        fillMetaData();
        if(model.isPlaying) {
            model.togglePlayback();
        }
        model.setFile(currentTrack.dataURI);
        model.togglePlayback();
    }

    function btnPreviousClick() {
        console.log('=================================================');
        console.log('=================================================');
        console.log(currentTrack.Index);

        currentTrack = trackList[currentTrack.Index - 1];
        console.log('prev click: ' + currentTrack.Title);

        fillMetaData();
        if(model.isPlaying) {
            model.togglePlayback();
        }
        model.setFile(currentTrack.dataURI);
        model.togglePlayback();
    }

    function fillLibrary() {
        console.log('===VM::fillLibrary()===');

        let counter = -1;
        for each (var track in trackList) {
            let title = String.concat('', track.Title);
            let album = String.concat('', track.Album);
            let artist = String.concat('', track.Artist);
            let duration = String.concat('', track.Duration);
            let coverURL = String.concat('', track.CoverURL);
            let dataURI = String.concat('', track.dataURI);

            let displayStr = String.concat(track.Artist, ' - ', track.Title);
            let trackId = counter + 1;
            counter++;

            console.log('Adding Track ' + trackId + ': ' + displayStr);

            let trackLabel = document.createElement('label');

            trackLabel.setAttribute('value', displayStr);

            trackLabel.addEventListener('mouseover', function() {
                trackLabel.setAttribute('style', 'background-color: #0066cc;');
            });

            trackLabel.addEventListener('mouseout', function() {
                trackLabel.setAttribute('style', '');
            });

            trackLabel.addEventListener('click', function() {
                console.log('Selected Track #' + trackId);
                console.log('Track Title: ' + displayStr);
                currentTrack = {
                    Index: trackId,
                    Title: title,
                    Album: album,
                    Artist: artist,
                    Duration: duration,
                    CoverURL: coverURL,
                    dataURI: dataURI
                };
                fillMetaData();
                model.setFile(dataURI);
            });

            vLibrary.appendChild(trackLabel);
        }

//        let trackList = model.getTrackList();
//        console.log(trackList);
//        let counter = -1;
//        for each (var track in trackList) {
//            console.log('counter: ' + counter);
//            let displayName = String.concat('', track.toString());
//            let trackId = counter + 1;
//            counter++;
//
//            console.log('Adding Track ' + trackId + ': ' + track.toString());
//
//            let trackLabel = document.createElement('label');
//
//            trackLabel.setAttribute('value', displayName);
//
//            trackLabel.addEventListener('mouseover', function() {
//             trackLabel.setAttribute('style', 'background-color: #0066cc;');
//            });
//
//            trackLabel.addEventListener('mouseout', function() {
//             trackLabel.setAttribute('style', '');
//            });
//
//            trackLabel.addEventListener('click', function() {
//                console.log('Selected Track #' + trackId);
//                console.log('Track Title: ' + displayName);
//                model.setTrackWithId(trackId);
//            });
//
//            vLibrary.appendChild(trackLabel);
//        }
    }

    function btnSetLibraryClicked() {
        console.log('===btnSetLibraryClicked()===');
        model.resetLibrary();
        fillLibrary();
    }

    function togglePlayback() {
        model.togglePlayback();

//        if (model.isPlaying) {
//            btnPlayPause.innerHTML = 'Pause';
//        } else {
//            btnPlayPause.innerHTML = 'Play';
//        }
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

        fillLibrary();
        fillMetaData();

        btnSetLibrary.addEventListener('command', btnSetLibraryClicked);
        btnPlayPause.addEventListener('command', togglePlayback);

        btnNext.addEventListener('click', btnNextClick);
        btnPrevious.addEventListener('click', btnPreviousClick);

        if (model.isPlaying) {
            btnPlayPause.innerHTML = 'Pause';
        } else {
            btnPlayPause.innerHTML = 'Play';
        }
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