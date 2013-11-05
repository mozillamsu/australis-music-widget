/*******************************************************************************
 * Requires
 ******************************************************************************/
const { Cc, Ci, Cu, Cr, Cm, Components } = require("chrome");
const { CustomizableUI } = Cu.import("resource:///modules/CustomizableUI.jsm");

/*******************************************************************************
 * Passes missing method calls off to properties on CustomizableUI
 ******************************************************************************/
exports.ChromeConstants = {
    __noSuchMethod__: function (id, args) {
        return CustomizableUI[id];
    }
};