var modRewrite = require('connect-modrewrite');

/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | Please report any issues you encounter:
 |  https://github.com/shakyShane/browser-sync/issues
 |
 | For up-to-date information about the options:
 |  https://github.com/shakyShane/browser-sync/wiki/Working-with-a-Config-File
 |
 */
module.exports = {

    watchTask: true,

    /*
     |--------------------------------------------------------------------------
     | Files to watch
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-files
     */
    files: [
        'public/intelligence/index.html',
        'public/intelligence/styles.css',
        'public/intelligence/scripts.js',
        'public/intelligence/assets/**/*.png',
        'public/intelligence/assets/**/*.ttf',
        'public/intelligence/assets/**/*.woff',
        'public/intelligence/assets/**/*.woff2',
        'public/intelligence/assets/**/*.eot'
    ],

    /*
     |--------------------------------------------------------------------------
     | Directories or files to exclude
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-exclude
     */
    exclude: false,

    /*
     |--------------------------------------------------------------------------
     | Server
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-server
     */
    server: {

        baseDir: 'public',
        middleware: [

            /* Redirect hash urls to index.html */
            modRewrite([
                '^[^\\.]*$ /intelligence/index.html [L]'
            ])
        ]
    },

    /*
     |--------------------------------------------------------------------------
     | Proxy
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-proxy
     */
    proxy: false,

    /*
     |--------------------------------------------------------------------------
     | Start path
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-startPath
     */
    startPath: 'intelligence/login',

    /*
     |--------------------------------------------------------------------------
     | Ghost Mode
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-ghostmode
     */
    ghostMode: {
        clicks: true,
        links: true,
        forms: true,
        scroll: true
    },

    /*
     |--------------------------------------------------------------------------
     | Open (true|false)
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-open
     */
    open: true,

    /*
     |--------------------------------------------------------------------------
     | xip (true|false)
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-xip
     */
    xip: false,

    /*
     |--------------------------------------------------------------------------
     | Timestamps (true|false)
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-timestamps
     */
    timestamps: true,

    /*
     |--------------------------------------------------------------------------
     | File Timeout (milliseconds)
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-filetimeout
     */
    fileTimeout: 1000,

    /*
     |--------------------------------------------------------------------------
     | Inject Changes
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-injectchanges
     */
    injectChanges: true,

    /*
     |--------------------------------------------------------------------------
     | Scroll Proportionally (true|false)
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-scrollproportionally
     */
    scrollProportionally: true,

    /*
     |--------------------------------------------------------------------------
     | Scroll Throttle (milliseconds)
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-scrollthrottle
     */
    scrollThrottle: 0,

    /*
     |--------------------------------------------------------------------------
     | Notify (true|false)
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-notify
     */
    notify: true,

    /*
     |--------------------------------------------------------------------------
     | Host
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-host
     */
    host: null,
    ports: {
        min: 8000,
        max: 8100
    },

    /*
     |--------------------------------------------------------------------------
     | Tunnel
     |--------------------------------------------------------------------------
     | Tunnel the BrowserSync server through a random Public URL
     | -> http://randomstring23232.localtunnel.me
     */
    tunnel: false,

    /*
     |--------------------------------------------------------------------------
     | Excluded File Types
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-excludedfiletypes
     */
    excludedFileTypes: [],

    /*
     |--------------------------------------------------------------------------
     | Reload each browser when BrowserSync is restarted.
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-excludedfiletypes
     */
    reloadOnRestart: true,

    /*
     |--------------------------------------------------------------------------
     | Reload Delay
     |--------------------------------------------------------------------------
     | https://github.com/shakyShane/browser-sync/wiki/options#wiki-reloadDelay
     */
    reloadDelay: 0

};
