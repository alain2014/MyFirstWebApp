var BBDD = (function() {

	var db;
	var callback = [], errorCallback = [], error;

	function BBDD() {
	}

    var showStatus = function(status) {
        console.log(status);
    };

    var showError = function(tx, error) {
        console.log('[ERROR] ', error);
    };

	var createBBDD = function() {
		db = openDatabase('MyDB', '1.0', 'CryptoCoins DB', 100000);
		return db;
	}

	var createTableCoins = function() {
        db.transaction(function(tx) {
            var CoinsTable = 'CREATE TABLE IF NOT EXISTS coins(id INTEGER PRIMARY KEY, name STRING, acronym STRING, value REAL, value_euro REAL, value_dolar REAL, icon STRING, priority INTEGER, url STRING, last_update_date STRING, last_update_time STRING, change STRING)';

            tx.executeSql(CoinsTable, [], null, error || showStatus);
         });
		return db;
	}

	var dropTableCoins = function() {
		db.transaction(function(tx) {
			tx.executeSql('DROP TABLE coins', [], null, error || showStatus);
		});

		return db;
	}

	var createCoin = function(coins) {
		var monedaLocalStorage, priority, fecha_last_update, conversion_to_euros;

		db.transaction(function(tx) {
			var fecha, separador;
			
			monedaLocalStorage = localStorage.getItem(coins.name);

			if (monedaLocalStorage != undefined && monedaLocalStorage > 0) {
				priority = 1;
				}
			else {
				priority = 2;
			} 

			fecha = coins.last_update;
			separador = fecha.search(" ");

			fecha_last_update = fecha.substr(0, separador);
			hora_last_update = fecha.substr(separador + 1, 8);
			
			conversion_to_euros = coins.BTC_EUR * coins.value;
			
			tx.executeSql('insert into coins(id, name, acronym, value, value_euro, value_dolar, icon, priority, '+
							'url, last_update_date, last_update_time, change) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
			[coins.id, coins.name, coins.acronym, coins.value_bitcoin, conversion_to_euros, 
			coins.value_dolar, coins.icon, priority, 
			coins.url, fecha_last_update, hora_last_update, coins.change], null, error || showStatus);
		});

		return db;
	}
	
	var deleteCoins = function() {
		db.transaction(function(tx) {
			tx.executeSql('delete from coins', [], null, error || showStatus);
		});

		return db;
	}

	var allCoins = function(result) {
		db.transaction(function(tx) {
			tx.executeSql('select * from coins ORDER BY priority, id', [], function(tx, rs) {
				if (rs.rows.length > 0) {
					var ArrayCoins = [];
					for (var i = 0; i < rs.rows.length; i++) {
						ArrayCoins.push(rs.rows.item(i));
					}
					result(ArrayCoins);
				}

			}, error || showStatus);
		});

		return db;
	};

	var updateCoin = function(name, priority, result) {
		db.transaction(function(tx) {
			tx.executeSql('update coins set priority = ? where name = ?', [priority, name], 
			function(tx, rs) {result();}, error || showStatus);
		});
	};

	var getCoin = function(id, result) {

		db.transaction(function(tx) {
			tx.executeSql('select * from coins where id = ?', [id], function(tx, rs) {
				if (rs.rows.length > 0) {
					result(rs.rows.item(0));
				} else {
					result(null);
				}
			}, error || showStatus);
		});
	};
	
	var getValorBitCoin = function(result) {
		db.transaction(function(tx) {
			tx.executeSql('select value_euro,value_dolar from coins where id = 1', [], function(tx, rs) {
				if ( rs.rows.length > 0 ) { 
				result(rs.rows.item(0));
				}
			}, error || showStatus);
		});
	};
	
	var getCoinsByDesc = function(desc, result) {
		db.transaction(function(tx) {
			tx.executeSql('select * from coins where name LIKE ? ORDER BY priority, id', ["%" + desc + "%"], function(tx, rs) {
				if (rs.rows.length > 0) {
					var ArrayCoins = [];
					for (var i = 0; i < rs.rows.length; i++) {
						ArrayCoins.push(rs.rows.item(i));
					}
					result(ArrayCoins);
				} else {
					result(0);
				}
			}, error || showStatus);
		});
	};

	BBDD.prototype.createBBDD = createBBDD;
	BBDD.prototype.createTableCoins = createTableCoins;
	BBDD.prototype.createCoin = createCoin;
	BBDD.prototype.deleteCoins = deleteCoins;
	BBDD.prototype.allCoins = allCoins;
	BBDD.prototype.getCoin = getCoin;
	BBDD.prototype.updateCoin = updateCoin;
	BBDD.prototype.getCoinsByDesc = getCoinsByDesc;
	BBDD.prototype.getValorBitCoin = getValorBitCoin;
	BBDD.prototype.dropTableCoins = dropTableCoins;

	return BBDD;
})();

