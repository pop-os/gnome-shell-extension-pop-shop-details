const AppDisplay = imports.ui.appDisplay;

let old;

function init() {}

function enable() {
    old = AppDisplay.AppIconMenu.prototype._redisplay;
    AppDisplay.AppIconMenu.prototype._redisplay = function() {
        old();

        if (!this._source.app.is_window_backed()) {
            if (Shell.AppSystem.get_default().lookup_app('org.pop.shop.desktop')) {
                this._appendSeparator();
                let item = this._appendMenuItem(_("Show Details"));
                item.connect('activate', Lang.bind(this, function() {
                    let id = this._source.app.get_id();
                    Util.trySpawn(["org.pop.shop", "appstream://" + id]);
                    Main.overview.hide();
                }));
            }
        }
    };
}

function disable() {
    AppDisplay.AppIconMenu.prototype._redisplay = old;
}
