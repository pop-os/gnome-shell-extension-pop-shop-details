const AppDisplay = imports.ui.appDisplay;
const Lang = imports.lang;
const Main = imports.ui.main;
const Shell = imports.gi.Shell;
const Util = imports.misc.util;

let old;

function init() {}

function enable() {
    old = AppDisplay.AppIconMenu.prototype._redisplay;

    AppDisplay.AppIconMenu.prototype._redisplay = function() {
        let ret = old.apply(this, arguments);

        if (!this._source.app.is_window_backed()) {
            if (Shell.AppSystem.get_default().lookup_app('io.elementary.appcenter.desktop')) {
                this._appendSeparator();
                let item = this._appendMenuItem("Show Details");
                item.connect('activate', Lang.bind(this, function() {
                    let id = this._source.app.get_id();
                    Util.trySpawn(["io.elementary.appcenter", "appstream://" + id]);
                    Main.overview.hide();
                }));
            }
        }

        return ret;
    };
}

function disable() {
    AppDisplay.AppIconMenu.prototype._redisplay = old;
}
