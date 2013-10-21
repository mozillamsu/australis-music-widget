function DOMEvent(elementId, eventName, func) {
    return {
        ElementId: elementId,
        EventName: eventName,
        Callback: func
    };
}

exports.DOMEvent = DOMEvent;