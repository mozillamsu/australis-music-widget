var Model = require('./music-model').Model;

function ViewModel(doc, theView) {
    let document = doc;
    let view = theView;
    let model = new Model();

    let btnPrevious = null;
    let btnNext = null;
    let btnPlayPause = null;
    let btnSettings = null;
    let meterPlaybackProgress = null;

    function btnSettingsClicked() {
        model.resetLibrary();
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
        let vControlArea = document.createElement('hbox')

        btnPlayPause = document.createElement('button');
        btnPlayPause.setAttribute('id', 'msu-music-btn-play-pause');
        if (model.isPlaying()) {
            btnPlayPause.innerHTML = 'Pause';
        } else {
            btnPlayPause.innerHTML = 'Play';
        }

        btnPrevious = document.createElement('button');
        btnPrevious.innerHTML = "&lt;--";

        btnNext = document.createElement('button');
        btnNext.innerHTML = '--&gt;';

        btnSettings = document.createElement('button');
        btnSettings.innerHTML = 'Set Library';

        meterPlaybackProgress = document.createElement('progressmeter')
        meterPlaybackProgress.setAttribute('id', 'msu-music-meter-playback-progress');
        meterPlaybackProgress.setAttribute('mode', 'determined');
        meterPlaybackProgress.setAttribute('value', '25');

        btnPlayPause.addEventListener('command', togglePlayback);
        btnSettings.addEventListener('command', btnSettingsClicked);

        view.appendChild(btnSettings);
        view.appendChild(vControlArea);
        vControlArea.appendChild(btnPrevious);
        vControlArea.appendChild(btnPlayPause);
        vControlArea.appendChild(btnNext);
        view.appendChild(meterPlaybackProgress);
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