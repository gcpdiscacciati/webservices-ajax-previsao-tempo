var form = document.getElementById("formPrevisao");

var inputTexto = document.getElementById("cidade");

inputTexto.addEventListener('keyup', function(e){
	if(e.key === 'Enter'){
		handleSubmit();
	}
});

// Retorna os dados para o HTML
function viewResult(resposta){
	var divPrincipal = document.getElementById("principal");
	divPrincipal.style.display = "block";
	divPrincipal.innerHTML = resposta;
}

// Cria o mapa, posicionando-o nas coordenadas recebidas na requisição
function createMap(divMapa, latitude, longitude){
	
	
	map = new google.maps.Map(divMapa, {
		center: { 
			lat: latitude,
			lng: longitude, 
		},
		zoom: 12,
	  });

	new google.maps.Marker({
		position: {
			lat: latitude,
			lng: longitude,
		},
		map,
	});

	
}

//Gera a requisição baseada no nome da cidade informada pelo usuário e trata os dados da resposta.
function handleSubmit(){
	var cidade = document.getElementById("cidade").value;
	var url = 'http://api.openweathermap.org/data/2.5/weather?q='+cidade+'&units=metric&lang=pt_br&appid=658fd70109ca8add32d1c140ceb3729d'

	var req = new XMLHttpRequest();

	req.onreadystatechange = function (){
		
		if(req.readyState == XMLHttpRequest.DONE) {
			if (req.status == 0 || (req.status >= 200 && req.status < 400)) {
			    resp = req.responseText;
				resp_obj = JSON.parse(resp);
				console.log(resp_obj);
				var nome = resp_obj.name;
				var temperatura_atual = resp_obj.main.temp;
				var temperatura_min = resp_obj.main.temp_min;
				var temperatura_max = resp_obj.main.temp_max;
				var condicao_icon = resp_obj.weather[0].icon
				var nascer = new Date(resp_obj.sys.sunrise * 1000);
				var por = new Date(resp_obj.sys.sunset * 1000);
				var latitude = resp_obj.coord.lat;
				var longitude = resp_obj.coord.lon;
				var previsao = '<div>'+
									'<div id="nome">'+nome+'</div>'+
									'<div id="temperatura">'+
										'<div id="imagem"><img src="http://openweathermap.org/img/wn/'+condicao_icon+'@2x.png"></div>'+
										'<div id="temp_atual">'+temperatura_atual+'°C</div>'+
									'</div>'+
									'<div id="info">'+
										'<div id="max_min">'+
											'<p>Máxima: '+temperatura_max+'°C</p>' +
											'<p>Mínima: '+ temperatura_min+'°C</p>' +
										'</div>'+
										'<div id="hora_sol">'+
											'<p id="hora_nascer">Nascer do Sol: '+nascer.toLocaleTimeString()+
											'<p id="hora_por">Pôr do Sol: '+por.toLocaleTimeString()+
										'</div>'+
									'</div>';

				viewResult(previsao);
				var divMapa = document.getElementById("mapa");
				divMapa.style.display = "block";
				createMap(divMapa, latitude, longitude);

				
			} else {
			  alert("Cidade não encontrada");
			}
		}
	}

	req.open("GET", url, true);
	req.send();
	
};
