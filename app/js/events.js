$$(document).ready(function() {

	//Valores por defecto del apartado Settings
	var default_auto_refresh = 'false', default_time_refresh = 1, mysetInterval; 

	var db = new BBDD();
	var dom_manipulate = new DomManipulation();

	//Autorefresco
	ActualizarAutomatico();

	function ShowMainList(whereDescription) {
		var coin_in_wallet, coins = [];		
		
		db.getCoinsByDesc(whereDescription, function(result) {
			dom_manipulate.deleteListofCoins("#main-article ul li");
			Lungo.dom("#tag_count")[0].style.visibility = 'hidden';
				
			if (result.length > 0) {
				//Rellenar listado con los registros que cumplen la condición
				for (var i = 0; i < result.length; i++) {
					coin_in_wallet = dom_manipulate.InsertCoinInList(result[i]);
					
					if ( coin_in_wallet == 1 ) {
						coins.push(coin_in_wallet);
						}
						
					if (i == result.length - 1 && coins.length > 0 ) {
						Lungo.dom("#tag_count")[0].style.visibility = 'visible';
						Lungo.dom("#tag_count").text(coins.length);														
						}
					}

				Lungo.dom("#last-update-date").text(result[i - 1].last_update_date + " - " + result[i - 1].last_update_time);
				}
			});
		};

	Lungo.dom("#my_text").on('input', function(event) {
		event.preventDefault();
		ShowMainList(Lungo.dom("#my_text")[0].value);
	});

	Lungo.dom('#form-settings').on('unload', function(event) {
		ActualizarAutomatico();	
		});
		
	Lungo.dom('#form-settings').on('load', function(event) {
		var auto_refresh = localStorage.getItem('auto_refresh');
		var time_refresh = localStorage.getItem('time_refresh');

		if (auto_refresh == null) {
			auto_refresh = default_auto_refresh;
			localStorage.setItem('auto_refresh', auto_refresh);
		}

		if (time_refresh == null) {
			time_refresh = default_time_refresh;
			localStorage.setItem('time_refresh', time_refresh);
		}

		if ( auto_refresh == 'true') {
			Lungo.dom("#set_auto_refresh")[0].checked = true;
		}
		else {
			Lungo.dom("#set_auto_refresh")[0].checked = false;
		}	

		Lungo.dom("#time_refresh").val(time_refresh);
	});

	Lungo.dom('#set_auto_refresh').on('tap', function(event) {
		if ( this.checked ) {
			localStorage.setItem('auto_refresh', 'false');	
		}
		else {
			localStorage.setItem('auto_refresh', 'true');
		}		
	});

	Lungo.dom('#time_refresh').on('change', function(event) {
		localStorage.setItem('time_refresh', Lungo.dom(this).val());
	});

	Lungo.dom('#restore_defaults').on('tap', function(event) {
		localStorage.setItem('auto_refresh', default_auto_refresh);
		localStorage.setItem('time_refresh', default_time_refresh);

		if (default_auto_refresh == 'false') {
			Lungo.dom("#set_auto_refresh")[0].checked = false;
		} else {
			Lungo.dom("#set_auto_refresh")[0].checked = true;
		}
		
		Lungo.Notification.success('Done', 'CƎ Accounting', 'ok', 2);
		ActualizarAutomatico();
	});

	$$(document).on("tap", "li a", function(e) {
		var $this = this;

		if ($this.getAttribute("id") == 'my_element') {
			ShowDetailSection($this.getAttribute("data_id"));
		}
	});
	
	 function setFocusToTextBox(){
	     var textbox = document.getElementById("my_coins");
	     textbox.focus();
	 }

	Lungo.dom("#coin-detail").on("unload", function(e) {
		var moneda_a_actualizar = Lungo.dom("#my_title").text();
		var monedaLocalStorage = localStorage.getItem(moneda_a_actualizar);

		if (monedaLocalStorage != undefined && monedaLocalStorage > 0)
			priority = 1;
		else
			priority = 2;

		db.updateCoin(moneda_a_actualizar, priority, function(result) {
			ShowMainList(Lungo.dom("#my_text")[0].value);
		});	
	});

	function ShowDetailSection(Moneda, bitcoin_euro, bitcoin_dolar) {

		var mi_cantidad, mi_moneda;

		db.getCoin(Moneda, function(result) {

			Lungo.dom("#my_more_info2").attr("href", result.url);

			Lungo.dom("#coin-det").attr("src", 'img/icons/' + result.icon + '.ico');
		
			mi_moneda = result.name.toString();

			Lungo.dom("#my_date").text(result.last_update_date);
			Lungo.dom("#my_time").text(result.last_update_time);

			Lungo.dom("#my_title").text(mi_moneda);
			Lungo.dom("#my_value2").text("1 " + result.acronym + " = " + result.value + " BTC");

			mi_cantidad = localStorage.getItem(mi_moneda);

			if (mi_cantidad == undefined) {
				mi_cantidad = 0;
				localStorage.setItem(mi_moneda, mi_cantidad);
			}

			if (mi_cantidad == null) {
				Lungo.dom("#my_coins")[0].value = 0;
				} 
			else {
				// console.log(mi_cantidad);
				mi_cantidad = Number(mi_cantidad);
				Lungo.dom("#my_coins")[0].value = mi_cantidad;
				
				// console.log(Lungo.dom("#my_coins")[0].value);				
				}

			var total_bitcoins = result.value * mi_cantidad;

			Lungo.dom("#my_bitcoins").text(total_bitcoins.toFixed(2) + " BTC");

			db.getCoin(1, function(result2) {
				var total_euros = total_bitcoins * result2.value_euro;
				var total_dolares = total_bitcoins * result2.value_dolar;

				Lungo.dom("#my_euros").text(total_euros.toFixed(2) + " EUR");
				Lungo.dom("#my_dollars").text(total_dolares.toFixed(2) + " USD");
				setFocusToTextBox();
			});
		});
	};

	Lungo.dom('#share_sn').on('tap', function(event) {
		dom_manipulate.ShowShareOptionsScreen();
	});

	Lungo.dom('#my_coins').on('focus',function(event){
	});

	Lungo.dom('#my_coins').on('blur',function(event){
		ShowDivCoinValue();
	});
	
	function HideDivCoinValue() {
		Lungo.dom("#coin-det2").css("margin-top","-80px");
	}

	function ShowDivCoinValue() {
		Lungo.dom("#coin-det2").css("margin-top","8px");
	}
	
	function isNumberKey(evt) {
    	var charCode = (evt.which) ? evt.which : event.keyCode
     	if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        	return false;
			}
     	return true;
	};

	String.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator) {
	   var n = this,
	   decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
	   decSeparator = decSeparator == undefined ? "." : decSeparator,
	   thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
	   sign = n < 0 ? "-" : "",
	   i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
	   j = (j = i.length) > 3 ? j % 3 : 0;
	   return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
	};
	
	Number.prototype.formatMoney = function(decPlaces, thouSeparator, decSeparator) {
	   var n = this,
	   decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces,
	   decSeparator = decSeparator == undefined ? "." : decSeparator,
	   thouSeparator = thouSeparator == undefined ? "," : thouSeparator,
	   sign = n < 0 ? "-" : "",
	   i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
	   j = (j = i.length) > 3 ? j % 3 : 0;
	   return sign + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(n - i).toFixed(decPlaces).slice(2) : "");
	};

	function ActualizarAutomatico() {
		var time_refresh = localStorage.getItem('time_refresh');

		if (mysetInterval != null) {
			clearInterval(mysetInterval);
			}

		if ( localStorage.getItem('auto_refresh') == "true" ) {
			if (time_refresh == null) {
				time_refresh = 1;
			}

			time_refresh = time_refresh * 60000;

			mysetInterval = window.setInterval('var rf = new RefreshApp();rf.RefreshAll();',time_refresh);	
			}
		};

	Lungo.dom('#my_coins').on('input', function(event) {
		event.preventDefault();

		var cantidad = Lungo.dom("#my_coins")[0].value;
		
		var valor_actualizar, bitcoin_euros, bitcoin_dolares, cantidad_dolares, cantidad_euros, valor_bitcoin, 
			whereDescription;

		if ( cantidad == null || cantidad == "") {
			cantidad = 0;
			}

		localStorage.setItem(Lungo.dom("#my_title").text(), cantidad);

		whereDescription = Lungo.dom("#my_title").text();

		db.getCoinsByDesc(whereDescription, function(result) {
			valor_bitcoin = result[0].value;
			valor_actualizar = cantidad * valor_bitcoin;

			Lungo.dom("#my_bitcoins").text(valor_actualizar.toFixed(2) + " BTC");

			//CALCULAR EN EUROS, DOLARES
			db.getValorBitCoin(function(result) {
				bitcoin_euros = result.value_euro;
				bitcoin_dolares = result.value_dolar;
	
				cantidad_euros = valor_actualizar * bitcoin_euros;
				cantidad_dolares = valor_actualizar * bitcoin_dolares;
	
				Lungo.dom("#my_euros").text(cantidad_euros.toFixed(2) + " EUR");
				Lungo.dom("#my_dollars").text(cantidad_dolares.toFixed(2) + " USD");			
			});	
		});		
	});

	Lungo.dom("#my-wallet-art").on("load", function(e) {
		
		var arrayMisMonedas = [], arrayMisMonedasBITCOINS = [], arrayMisMonedasDOLARES = [], arrayMisMonedasACRONYM = [], 
		str_arrayMisMonedas = [];
		var monedaLocalStorage, valor_en_dolares, bitcoin_euros, bitcoin_dolares, cantidad_dolares, cantidad_euros;
		var bitcoins_en_total = 0;

		db.getValorBitCoin(function(result) {
			bitcoin_euros = result.value_euro;
			bitcoin_dolares = result.value_dolar;
		});

		db.allCoins(function(result) {
			if (result.length == 0) return;

			for (var i = 0; i < result.length; i++) {
				monedaLocalStorage = localStorage.getItem(result[i].name);
				arrayMisMonedasACRONYM.push(result[i].acronym);
					
				if (monedaLocalStorage != undefined && monedaLocalStorage > 0) {
					bitcoins = monedaLocalStorage * result[i].value;
					bitcoins_en_total = bitcoins_en_total + bitcoins;

					valor_en_dolares = result[i].value_dolar * monedaLocalStorage;
					//valor_en_dolares = valor_en_dolares.formatMoney();

					arrayMisMonedasBITCOINS.push(bitcoins);
					arrayMisMonedasDOLARES.push(valor_en_dolares);

					arrayMisMonedas.push(monedaLocalStorage);

					str_arrayMisMonedas.push(result[i].name);
					}
				}
			
			cantidad_euros = bitcoins_en_total * bitcoin_euros;
			cantidad_dolares = bitcoins_en_total * bitcoin_dolares;
			
			dom_manipulate.deleteListofCoins("#my-wallet-art ul li");
			dom_manipulate.deleteListofCoins("#dinamic_table td");

			if (bitcoins_en_total > 1000) {
				bitcoins_en_total = bitcoins_en_total.formatMoney();
			} else {
				bitcoins_en_total = bitcoins_en_total.toFixed(2);				
			}

			if (cantidad_euros > 1000) {
				cantidad_euros = cantidad_euros.formatMoney();
			} else {
				cantidad_euros = cantidad_euros.toFixed(2);				
			}

			if (cantidad_dolares > 1000) {
				cantidad_dolares = cantidad_dolares.formatMoney();
			} else {
				cantidad_dolares = cantidad_dolares.toFixed(2);			
			}

			for (var i = 0; i < str_arrayMisMonedas.length; i++) {
				if (arrayMisMonedas[i]  > 1000) {
					arrayMisMonedas[i]  = arrayMisMonedas[i].formatMoney();
				} else {
					arrayMisMonedas[i]  = Number(arrayMisMonedas[i]);				
					arrayMisMonedas[i]  = arrayMisMonedas[i].toFixed(2);				
				}
			}

			for (var i = 0; i < str_arrayMisMonedas.length; i++) {
				if (arrayMisMonedasBITCOINS[i]  > 1000) {
					arrayMisMonedasBITCOINS[i]  = arrayMisMonedasBITCOINS[i].formatMoney();
				} else {
					arrayMisMonedasBITCOINS[i]  = arrayMisMonedasBITCOINS[i] .toFixed(2);				
				}
			}

			for (var i = 0; i < str_arrayMisMonedas.length; i++) {
				if (arrayMisMonedasDOLARES[i]  > 1000) {
					arrayMisMonedasDOLARES[i]  = arrayMisMonedasDOLARES[i].formatMoney();
				} else {
					arrayMisMonedasDOLARES[i]  = arrayMisMonedasDOLARES[i].toFixed(2);				
				}
			}

			dom_manipulate.loadScreenOfWallet(bitcoins_en_total,
   											  cantidad_euros,
											  cantidad_dolares,
											  str_arrayMisMonedas,
											  arrayMisMonedas,
											  arrayMisMonedasACRONYM,
											  arrayMisMonedasBITCOINS,
											  arrayMisMonedasDOLARES);
		});
	});


	// window.open wasn't opening a link in the system browser on iOS, so we have to use this function (requires phonegap.js)
	function redirectToSystemBrowser(url) {
	    // Wait for Cordova to load
	    document.addEventListener('deviceready', onDeviceReady, false);
	    // Cordova is ready
	    function onDeviceReady() {
	        // open URL in default web browser
	        var ref = window.open(encodeURI(url), '_system', 'location=yes');
	    }
	}

	function loadURL(url){
	    navigator.app.loadUrl(url, { openExternal:true });
	    return false;
	}

	var refresh_coins = new Lungo.Element.Pull('#main-article', {
		onPull : "Pull down to refresh",
		onRelease : "Release to get new data",
		callback : function() {
			refresh_coins.hide();
			var rf = new RefreshApp();
			rf.RefreshAll();
			ActualizarAutomatico();		
		}
	});
});


