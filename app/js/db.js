var EarthquakeDB = {};

EarthquakeDB = (function(){
    var db = null;
	var SIZE = 2 * 1024 * 1024;
	var config = {
		name: "earthquakes",
		version: "1.0",
		desc: "Earthquake DB gov USA",
		size: SIZE
	};
	
    // Constructor
    function EarthquakeDB() {
        if(Modernizr.websqldatabase) {
            this.name = (config && config.name) || "default";
            this.version = (config && config.version) || "1.0";
            this.desc = (config && config.desc) || "Description";
            this.size = (config && config.size) || 2 * 1024 * 1024;
        } else {
            showStatus('Web SQL Databases not supported');
        }
    }

    var showStatus = function(status) {
        console.log(status);
    };

    var showError = function(tx, error) {
        console.log('[ERROR] ', error);
    };

    EarthquakeDB.prototype.init = function(callback, error) {
        showStatus('[DB] Initialising DB');

        try {
            if (window.openDatabase) {
                db = openDatabase(this.name, this.version, this.desc, this.size);
                if (db) {
                    db.transaction(function(tx) {
                        var earthquakesTable = "CREATE TABLE IF NOT EXISTS earthquake (" +
                                                "id TEXT PRIMARY KEY," + 
                                                "mag REAL," + 
                                                "place TEXT," +
                                                "time TIME," +
                                                "lat REAL," +
                                                "long REAL," +
                                                "depth REAL)";

                        tx.executeSql(earthquakesTable, [], null, error || showStatus);
                    });
                } else {
                    showStatus('Error occurred trying to open DB.');
                }
            } else {
                showStatus('Web SQL Databases not supported');
            }
        } catch (e) {
            showStatus('Error occurred during DB init, Web SQL Database supported?');
        }
    }

    EarthquakeDB.prototype.addEarthquakesDB = function(earthquakes, initEarthquakeListAndMap) {
        db.transaction(function (tx) {
            for (i in earthquakes){
                var earthquake = earthquakes[i];
                // Insert earthquake
                tx.executeSql('INSERT OR IGNORE INTO earthquake (id, mag, place, time, lat, long, depth) VALUES (?, ?, ?, ?, ?, ?, ?)',
                            [earthquake.id, earthquake.properties.mag, earthquake.properties.place, 
                            earthquake.properties.time, earthquake.geometry.coordinates[0],
                            earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[2]],
                            (function(i){
                                return function(tx, result){
                                    console.log("Earthquake " + earthquakes[i].id + " successfully added to the DB");
                                    if(i == earthquakes.length - 1){
                                        getEarthquakes(initEarthquakeListAndMap);
                                    }
                                } 
                            })(i),
                            showError);
            }
        });
    }
    
    var getEarthquake = function(id, showInfoEarthquake) {
        db.transaction(function (tx) {
            // Get the earthquake info
            var sql = 'SELECT * FROM earthquake WHERE id="'+ id + '"';
            tx.executeSql(sql,
                            [],
                            function(tx, result){
                                showInfoEarthquake(result);
                            },
                            showError);
        });
    };

    var getEarthquakes = function(generateEarthquakeList) {
        db.transaction(function (tx) {
            // Get the last 50 earthquakes
            tx.executeSql('SELECT * FROM earthquake ORDER BY time DESC LIMIT 50',
                            [],
                            function(tx, result){
                                initEarthquakeListAndMap(result);
                            },
                            showError);
        });
    };

    var searchEarthquakes = function(expr, initEarthquakeListAndMap) {
        db.transaction(function (tx) {
            var sql = 'SELECT * FROM earthquake WHERE place LIKE "%'+ expr +'%" ORDER BY time DESC LIMIT 50';
            // Get the last 50 earthquakes
            tx.executeSql(sql,
                            [],
                            function(tx, result){
                                initEarthquakeListAndMap(result);
                            },
                            showError);
        });
    };

	EarthquakeDB.prototype.getEarthquake = getEarthquake;
    EarthquakeDB.prototype.searchEarthquakes = searchEarthquakes;


    return EarthquakeDB;
})();