var DomManipulation = (function() {

	var db;
	var callback, errorCallback = [];

	function DomManipulation() {
	}

	var InsertCoinInList = function(coins) {
		var colorear_verde, color;
		var monedaLocalStorage = localStorage.getItem(coins.name);
		var coin = 0;

		if (monedaLocalStorage != undefined && monedaLocalStorage > 0) {
			colorear_verde = 'accept';
			coin = 1;			
		}
		else
			colorear_verde = 'cancel';	

		if (coins.change.search("-") >= 0)
			color = "_red";
		else
			color = "_green";

		Lungo.dom("#main-article ul").append("<li class = 'selectable arrow " + colorear_verde + " thumb'>"+
		"<img src='img/icons/" + coins.icon + ".ico'>"+
		"<a href = '#' data-view-section='coin-detail' "+
		"id = 'my_element' data_id = '" + coins.id + "'><span>( " + coins.acronym + " )</span> " + 
		coins.name + "<span class = 'icon exchange' id = 'actual_value_usd'> " + coins.value_dolar + " USD <span id = 'actual_change" + color + "'>" + coins.change + "</span></a></li>");
		
		return coin;
	}

	function deleteListofCoins(control) {
		Lungo.dom(control).each(function(indice, elemento) {
			if (indice != 0 || control != "#main-article ul li") {
				Lungo.dom(elemento).remove();				
			}
		});
	}

	function loadScreenOfWallet(bitcoins_en_total,
   								cantidad_euros,
								cantidad_dolares,
								str_arrayMisMonedas,
								arrayMisMonedas,
								arrayMisMonedasACRONYM,
								arrayMisMonedasBITCOINS,
								arrayMisMonedasDOLARES) {
		Lungo.dom("#bitcoins_wallet").text(bitcoins_en_total + " BTC");
		Lungo.dom("#euros_wallet").text(cantidad_euros + " EUR");
		Lungo.dom("#dollars_wallet").text(cantidad_dolares + " USD");
		Lungo.dom("#my_different_coins").text("Different AltCoins (" + str_arrayMisMonedas.length + ")");

		for (var i = 0; i < str_arrayMisMonedas.length; i++) {
			Lungo.dom("#dinamic_table").append("<td id='my_labels2' class='point2' "+
			"style='padding-right:10px'>" + str_arrayMisMonedas[i] + 
			"</td><td id = 'alinea_dec' style='padding-right:10px'>" + arrayMisMonedas[i] + " " + 
			arrayMisMonedasACRONYM[i] + 
			"</td><td id = 'alinea_dec' style='padding-right:10px'>" + arrayMisMonedasBITCOINS[i] + " BTC</td>"+
			"<td id = 'alinea_dec' style='padding-right:10px'>" + arrayMisMonedasDOLARES[i] + " USD</td>");
			}
		}

	function ShowShareOptionsScreen() {
		Lungo.Notification.html('<article id="share-options">'+
        '<div class="wrapper">'+
            '<ul id = "share-list">'+
                '<li><a id = "share_bt" href="http://twitter.com/share?url=http://www.crypto-exchange.es/&text=Check out this App!!" target="_blank" class="button anchor margin bottom" data-label="Twitter"><span id = "share_ico" class="icon twitter"></span><abbr id = "share_abbr">Twitter</abbr></a></li>'+
                '<li><a id = "share_bt" href="https://www.facebook.com/sharer.php?app_id=113869198637480&amp;sdk=joey&amp;u=http%3A%2F%2F54.201.188.41%2F&amp;display=popup" target="_blank" class="button anchor margin bottom" data-label="Facebook"><span id = "share_ico" class="icon facebook"></span><abbr id = "share_abbr">Facebook</abbr></a></li>'+
                '<li><a id = "share_bt" href="https://plus.google.com/share?url=http://www.crypto-exchange.es/" target="_blank" class="button anchor margin bottom" data-label="Google Plus"><span id = "share_ico" class="icon google-plus"></span><abbr id = "share_abbr">Google Plus</abbr></a></li>'+
                '<li><a id = "share_bt" href="#" class="button anchor margin bottom" data-action="close"><abbr id = "share_abbr">Close</abbr></a></li>'+
            '</ul>'+
        '</div>'+
    '</article>');
	}

	DomManipulation.prototype.ShowShareOptionsScreen = ShowShareOptionsScreen;
	DomManipulation.prototype.InsertCoinInList = InsertCoinInList;
	DomManipulation.prototype.deleteListofCoins = deleteListofCoins;
	DomManipulation.prototype.loadScreenOfWallet = loadScreenOfWallet;
	
	return DomManipulation;
})();

