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

    let hProgress = null;
    let lblElapsed = null;
    let lblRemaining = null;

    let vLibrary = null;

    let vbox = null;

    function fillLibrary() {
        console.log('===fillLibrary()===');
        let lst = model.getFileList();
        if (lst == null) { console.log('lst is null'); return; }
        let count = -1;
        for each (let file in model.getFileList()) {
            let strCopy = String.concat('', file.toString());

            let lbl = document.createElement('label');

            lbl.setAttribute('value', file.toString());
            lbl.addEventListener('mouseover', function() {
                lbl.setAttribute('style', 'background-color: #0066cc;');
            });
            lbl.addEventListener('mouseout', function() {
                lbl.setAttribute('style', '');
            });
            lbl.addEventListener('click', function() {
                console.log('Audio File: ' + strCopy);
            });
            vLibrary.appendChild(lbl);
        }
        let lbl = document.createElement('label');
        vLibrary.appendChild(lbl);
    }

    function btnSettingsClicked() {
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
        vbox = document.createElement('vbox');
        vbox.setAttribute('align', 'center');

        console.log('===populateView()===');
        let hControlArea = document.createElement('hbox')
        hControlArea.setAttribute('align', 'center');

        vLibrary = document.createElement('vbox');
        fillLibrary();

        vLibrary.setAttribute('style', 'overflow: auto; height: 500px; width: 200px; background-color: #ffffff; border: 1px #000000; padding: 3px; margin: 3px;')

        btnPlayPause = document.createElement('toolbarbutton');
        btnPlayPause.setAttribute('id', 'msu-music-btn-play-pause');
        if (model.isPlaying()) {
            btnPlayPause.innerHTML = 'Pause';
        } else {
            btnPlayPause.innerHTML = 'Play';
        }

        btnPrevious = document.createElement('toolbarbutton');
        btnPrevious.innerHTML = "&lt;--";

        btnNext = document.createElement('toolbarbutton');
        btnNext.innerHTML = '--&gt;';

        btnSettings = document.createElement('toolbarbutton');
        btnSettings.innerHTML = 'Set Library';

        hProgress = document.createElement('hbox');
        meterPlaybackProgress = document.createElement('scale')
        meterPlaybackProgress.setAttribute('id', 'msu-music-meter-playback-progress');
        // meterPlaybackProgress.setAttribute('mode', 'determined');
        meterPlaybackProgress.setAttribute('value', '38');
        meterPlaybackProgress.setAttribute('min', '0');
        meterPlaybackProgress.setAttribute('max', '165');
        lblElapsed = document.createElement('label');
        lblElapsed.setAttribute('value', '0:38');
        lblElapsed.setAttribute('style', 'margin-top: 5px;');
        lblRemaining = document.createElement('label');
        lblRemaining.setAttribute('value', '-2:07');
        lblRemaining.setAttribute('style', 'margin-top: 5px;');
        hProgress.appendChild(lblElapsed);
        hProgress.appendChild(meterPlaybackProgress);
        hProgress.appendChild(lblRemaining);

//        meterPlaybackProgress.setAttribute('style', 'width: 198px;');

        btnPlayPause.addEventListener('command', togglePlayback);
        btnSettings.addEventListener('command', btnSettingsClicked);

        vbox.appendChild(btnSettings);
        vbox.appendChild(hProgress);
        vbox.appendChild(hControlArea);
        hControlArea.appendChild(btnPrevious);
        hControlArea.appendChild(btnPlayPause);
        hControlArea.appendChild(btnNext);
        vbox.appendChild(vLibrary);
        view.appendChild(vbox);
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