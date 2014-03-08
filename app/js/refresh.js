var RefreshApp = (function() {

	function RefreshApp() {
	}

	var RefreshAll = function() {
		var actual_section = window.location;
		
		if ( actual_section.hash == "#main/coin-detail/coin-detail-art") {
			return;
		}
		
		var dom_manipulate = new DomManipulation();
		var db = new BBDD();
		var data, resultadoPeticion;

		dom_manipulate.deleteListofCoins("#main-article ul li");

		Lungo.dom("#tag_count")[0].style.visibility = 'hidden';
		Lungo.dom("#loading")[0].style.display = 'block';
		Lungo.Element.loading('#loading', 'index');

		//Crear BBDD
		db.createBBDD();

		//BORRAR Y VOLVER A CREAR LA TABLA COINS
		db.dropTableCoins();
		db.createTableCoins();

		//Borrar todas las monedas
		db.deleteCoins();

		var parseResponse = function(result) {

			if ( resultadoPeticion.status == 0 ) {
				Lungo.dom("#tag_count")[0].style.visibility = 'hidden';
				Lungo.dom("#loading")[0].style.display = 'none';
				Lungo.Notification.error('Check your internet connection!', 'CƎ Accounting', 'remove', 3);
				return;
			}

     		//Insertar todas los monedas del JSON en la BBDD
			$$.each(result.features, function(i, coins) {
				db.createCoin(coins);
			});

			//Rellenar listado a partir de las monedas de la BBDD
			db.allCoins(function(result) {
				var coin_in_wallet, coins = [];

				for (var i = 0; i < result.length; i++) {
					//Rellenar listado de la pestaña PRINCIPAL
					coin_in_wallet = dom_manipulate.InsertCoinInList(result[i]);

					if ( coin_in_wallet == 1 ) {
						coins.push(coin_in_wallet);
					}

					if (i == result.length - 1) {
						Lungo.dom("#loading")[0].style.display = 'none';
						Lungo.dom("#last-update-date").text(result[i].last_update_date + " - " + result[i].last_update_time);
						
						if (coins.length > 0 ) {
							Lungo.dom("#tag_count")[0].style.visibility = 'visible';
							Lungo.dom("#tag_count").text(coins.length);														
						}
					}
				}
			});
		};

		resultadoPeticion = Lungo.Service.json("app/data/coins.json", data, parseResponse, "json");
	}

	RefreshApp.prototype.RefreshAll = RefreshAll;

	return RefreshApp;
})();

