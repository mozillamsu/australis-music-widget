var DOMEvent = require('./dom-event').DOMEvent;
var DOMElement = require('./dom-element').DOMElement;

function DOMHelper(aDocument, viewID, XUL) {
    let docList = [];
    let domEvents = [];
    let viewDocument = null;
    let view = null;
    let viewID = viewID;

    viewDocument = aDocument;

    let panel = viewDocument.createElement('panelview');
    panel.setAttribute('id', viewID);
    panel.setAttribute('flex', '1');
    panel.innerHTML = XUL;
    viewDocument.appendChild(panel);
    view = panel;

    // docList.push(viewDocument);

    function wireEvents(window) {
        for each (var event in domEvents) {
            let element = window.document.getElementById(event.ElementId);
            element.addEventListener(event.EventName, event.Callback);
        }
    }

    function saveXUL(doc) {
        let panel = doc.getElementById(viewID);
        view.innerHTML = panel.innerHTML;
    }

    return {
        document: {
            getElementById: function(id) {
                return new DOMElement(id, docList, domEvents, saveXUL);
            },

            getElementsByClassName: function(className) {

            },

            createElement: function(tag, attr) {
                return {
                    tagname: tag,
                    attributes: attr
                };
                return viewDocument.createElement(tag);
            }
        },

        populateWindow: function(window) {
            docList.push(window.document);

            let viewArea = window.document.getElementById('PanelUI-multiView');
            viewArea.innerHTML += view.outerHTML;
            wireEvents(window);
        },

        wireEvents: wireEvents,
        eventList: domEvents,

        removeInjections: function() {
            for each (var doc in docList) {
                let injection = doc.getElementById(viewID);
                if(injection != null) {
                    injection.parentNode.removeChild(injection);
                }
            }
        }
    }
}

exports.DOMHelper = DOMHelper;