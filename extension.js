const AppDisplay = imports.ui.appDisplay;
const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Util = imports.misc.util;

let displayFunc = !!AppDisplay.AppIconMenu.prototype._rebuildMenu ? '_rebuildMenu' : '_redisplay';
let old;

function init() {}

function enable() {
    old = AppDisplay.AppIconMenu.prototype[displayFunc];

    AppDisplay.AppIconMenu.prototype[displayFunc] = function() {
        let ret = old.apply(this, arguments);

        if (!this._source.app.is_window_backed()) {
            if (Shell.AppSystem.get_default().lookup_app('io.elementary.appcenter.desktop')) {
                this._appendSeparator();
                let item = this._appendMenuItem(_("Show Details"));
                item.connect('activate', () => {
                    let id = this._source.app.get_id();
                    Util.trySpawn(["io.elementary.appcenter", "appstream://" + id]);
                    Main.overview.hide();
                });
            }
        }

        return ret;
    };
}

function disable() {
    AppDisplay.AppIconMenu.prototype[displayFunc] = old;
}
