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
    AlbumArtwork: "msu-music-img-album-artwork"
};

function ViewModel(doc, theView) {
    let document = doc;
    let view = theView;
    let model = new Model();

    let btnPrevious = null;
    let btnNext = null;
    let btnPlayPause = null;

    let btnSetLibrary = null;

    let lblElapsed = null;
    let lblRemaining = null;
    let sliderPlaybackProgress = null;

    let vLibrary = null;

    let vContainer = null;

    let imgAlbumArtwork = null;

    function metaDataLoaded(data) {
        let window = document.defaultView;
        console.log(imgAlbumArtwork);
        console.log('img src: ' + imgAlbumArtwork.src);
        console.log('setting src to ' + data.CoverURL);
        imgAlbumArtwork.setAttribute('src', data.CoverURL);
        imgAlbumArtwork.src = data.CoverURL;
        console.log('now src: ' + imgAlbumArtwork.src);
    }

    function fillMetaData() {
        console.log('filling metadata in view model');
        let metaData = model.getMetaData();
        console.log(metaData);

        console.log(imgAlbumArtwork);
        console.log('src before: ' + imgAlbumArtwork.src);
        imgAlbumArtwork.src = metaData.CoverURL;
        console.log('src after: ' + imgAlbumArtwork.src);
    }

    function fillLibrary() {
        console.log('===fillLibrary()===');

        let lst = model.getFileList();

        for each (let file in model.getFileList()) {
            let strCopy = String.concat('', file.toString());
            let strFilePath = String.concat('', file.getPath());
            let fileData = file.getData();

            let fileInfo = {
                displayName: String.concat('', fileData.displayName),
                contentType: String.concat('', fileData.contentType),
                data: String.concat('', fileData.data)
            };

            let lbl = document.createElement('label');

            lbl.setAttribute('value', file.toString());
            lbl.addEventListener('mouseover', function() {
                lbl.setAttribute('style', 'background-color: #0066cc;');
            });
            lbl.addEventListener('mouseout', function() {
                lbl.setAttribute('style', '');
            });
            lbl.addEventListener('click', function() {
//                model.setSong(strFilePath);
//                console.log('Audio File: ' + strFilePath);
                console.log('Audio File Selected: ' + fileInfo.displayName);
                model.setData(fileInfo);
//                model.setURL(strFilePath);
            });
            vLibrary.appendChild(lbl);
        }
        let lbl = document.createElement('label');
        vLibrary.appendChild(lbl);
    }

    function btnSetLibraryClicked() {
        console.log('===btnSetLibraryClicked()===');
        model.resetLibrary();
        fillLibrary();
    }

    function togglePlayback() {
        model.togglePlayback();

        if (model.isPlaying()) {
            btnPlayPause.innerHTML = 'Pause';
        } else {
            btnPlayPause.innerHTML = 'Play';
        }
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

        fillLibrary();
        fillMetaData();

        btnSetLibrary.addEventListener('command', btnSetLibraryClicked);
        btnPlayPause.addEventListener('command', togglePlayback);

        if (model.isPlaying()) {
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