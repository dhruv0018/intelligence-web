var pkg = require('../package.json');

var INDEXEDDB_OPEN_TIMEOUT = 1000;

/* Default options for migrations. */
var OPTIONS = { keyPath: 'id' };

/* Fetch angular from the browser scope */
var angular = window.angular;

var IntelligenceWebClient = angular.module(pkg.name);

var IndexedDB;

angular.injector(['ng']).invoke([
    '$q',
    function($q) {

        IndexedDB = $q.defer();
    }
]);

/* Migration scripts. */
var migrations = [

    require('../migrations/1'),
    require('../migrations/2')
];

/* Set a timeout for opening the database. */
var openTimeout = setTimeout(IndexedDB.reject('IndexedDB timeout'), INDEXEDDB_OPEN_TIMEOUT);

openDB(pkg.name);

function openDB(name, version) {

    /* Reference to the database. */
    var db;

    /* If indexedDB can not be found, assume it is not supported. */
    if (!window.indexedDB) IndexedDB.reject('IndexedDB not supported');

    /* If indexedDB is available. */
    else {

        /* If given a version, open the database with the given version. */
        /* Otherwise; if no version is given, open the current version of the database. */
        var request = version ? window.indexedDB.open(name, version) : window.indexedDB.open(name);

        /* Handle a successful connection to the database. */
        request.onsuccess = function(event) {

            /* Clear timeout. */
            clearTimeout(openTimeout);

            /* Get the database. */
            db = event.target.result;

            /* If the database needs to be upgraded. */
            if (db.version < migrations.length) {

                /* Close the database. */
                db.close();

                /* Open database one version higher. */
                openDB(name, db.version + 1);
            }

            /* If the database opened successfully and does not need to be upgraded. */
            else IndexedDB.resolve(db);

            /* Handle database version changes. */
            db.onversionchange = function(event) {

                console.info('Database changed to version ' + version);

                /* Close the database. */
                db.close();

                /* Reload the window. */
                window.location.reload();
            };
        };

        /* Handle an error connecting to the database. */
        request.onerror = function(event) {

            /* Get the database. */
            var error = event.target.error;

            /* If version given is less than the database version. */
            if (error.name === 'VersionError') {

                /* Close the database. */
                db.close();

                /* Open the current database version. */
                openDB(name);
            }

            /* Throw an error. */
            else IndexedDB.reject(new Error(JSON.stringify(event)));
        };

        /* Handle blocked connections to the database. */
        request.onblocked = function(event) {

            /* Get the database. */
            db = event.target.result;

            /* Close the database. */
            db.close();

            /* Reload the window. */
            window.location.reload();
        };

        request.onupgradeneeded = function(event) {

            version = version || 1;

            /* Get the database. */
            db = event.target.result;

            console.info('Database needs to be upgraded');

            /* Find the appropriate migration to run. */
            var migrationToRun = version - 1;

            /* Lookup the migration. */
            var migration = migrations[migrationToRun];

            /* If the migration is found. */
            if (migration) {

                console.info('Running migration for database version ' + version);

                /* Try running the migration. */
                try {

                    /* Run the migration. */
                    migration(db, OPTIONS);
                }

                /* Catch any errors running the migration. */
                catch (error) {

                    throw new Error('Error in database version ' + version + ' migration', error);
                }
            }

            /* If the migration is not found. */
            else throw new Error('No migration found for database version ' + version);
        };
    }
}

IntelligenceWebClient.value('IndexedDB', IndexedDB.promise);

