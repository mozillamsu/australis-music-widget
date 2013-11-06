var ChromeConstants = require("./xul-manager/chrome-constants.js").ChromeConstants;
var data = require("sdk/self").data;

var ViewModel = require('./music-vm').ViewModel;

function TestWidget () {
    console.log('===TestWidget Constructor===');

    let count = 0;
    let document = null;
    let view = null;
    let vm = new ViewModel();

    function injectUI () {
        console.log('===injectUI()===');
        count++;
        console.log('Count: ' + count);
        console.log(vm);

        vm.injectUI(document, view);
    }

    return {
        CONFIG: {
            id: "test-widget",
            type: "view",
            viewId: "TestWidget-view",
            removable: true,
            defaultArea: ChromeConstants.AREA_PANEL()
        },

        widgetCreated: function(node) {
            console.log("inside of the widgets onCreated");

            let doc = node.ownerDocument;
            let img = doc.createElement("image");
            img.setAttribute("class", "toolbarbutton-icon");
            img.id = "weather-icon";
            img.setAttribute("src", "http://openclipart.org/people/jphandrigan/music_folder_alt.svg");
            img.setAttribute("width", "16px");
            img.setAttribute("height", "16px");

            let lbl = doc.createElement("label");
            lbl.setAttribute("class", "toolbarbutton-text toolbarbutton-label");
            lbl.setAttribute("flex", "1");
            lbl.setAttribute("value", "Music");
            lbl.id = "weather-icon-label";

            node.appendChild(img);
            node.appendChild(lbl);
        },

        viewShowing: function (doc, theView) {
            console.log("populateView");

            // Get the document
            document = doc;



            // Set the view
            view = theView;

            // Write our UI to the panelview
            injectUI();

            // Load our stylesheet
            var css = data.url('styles.css'); // Resource URL to our stylesheet
            let xmlPI = document.createProcessingInstruction('xml-stylesheet', 'href="'+css+'" type="text/css"'); // Create an XML processing instruction for a stylesheet
            document.insertBefore(xmlPI, document.firstElementChild);
        }
    };
}

exports.TestWidget = TestWidget;
