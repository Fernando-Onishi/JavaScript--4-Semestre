let input = document.getElementById("input")
let botao = document.getElementById("botao")
let resultado = document.getElementById("resultado")

// Array para converter o número do dia da semana (0 a 6) em texto
const diasDaSemana = [
    "Domingo", 
    "Segunda-feira", 
    "Terça-feira", 
    "Quarta-feira", 
    "Quinta-feira", 
    "Sexta-feira", 
    "Sábado"
]

function traduzirClima(codigo) { 
if (codigo == 0) return { texto: "Céu limpo", icone: "☀️"
}

if (codigo == 1 || codigo == 2 || codigo == 3) return { texto:
"Nublado", icone: "⛅" }

if (codigo == 45 || codigo == 48) return { texto: "Neblina",
icone: "🌫️" }
 
if (codigo >= 51 && codigo <= 65) return { texto:
"Chuva", icone: "🌧️" }
 
if (codigo >= 71 && codigo <= 75) return { texto:
"Neve", icone: "❄️" }
 
if (codigo >= 80 && codigo <= 82) return { texto:
"Pancadas de chuva", icone: "🌦️" }

if (codigo == 95) return { texto: "Tempestade", icone:
"⛈️" }
 
return { texto: "Indefinido", icone: "❔" }
}

function mostrarClima(dadosClima, nomeCidade){
    let atual = dadosClima.current
    let clima = traduzirClima(atual.weather_code)

    // Nome da cidade pesquisada
    let cidadeTitulo = document.createElement("h1")
    cidadeTitulo.className = "cidade-titulo"
    cidadeTitulo.innerHTML = nomeCidade

    let titulo = document.createElement("h2")
    titulo.innerHTML = clima.icone + " " + clima.texto

    let temperatura = document.createElement("p")
    temperatura.innerHTML = "Temperatura: " + atual.
    temperature_2m + "°C    "

    let sensacao = document.createElement("p")
    sensacao.innerHTML = "Sensação: " + atual.
    apparent_temperature + "°C"

    let umidade = document.createElement("p")
    umidade.innerHTML = "Umidade: " + atual.relative_humidity_2m + "%"

    resultado.appendChild(cidadeTitulo)
    resultado.appendChild(titulo)
    resultado.appendChild(temperatura)
    resultado.appendChild(sensacao)
    resultado.appendChild(umidade)
}

function mostrarPrevisao(dadosClima){
    let dia = dadosClima.daily

    // Título "Próximos dias"
    let tituloPrevisao = document.createElement("h3")
    tituloPrevisao.className = "titulo-previsao"
    tituloPrevisao.innerHTML = "Próximos dias"
    resultado.appendChild(tituloPrevisao)

    let previsao = document.createElement("ul")
    "[seg, ter, quar, qui, sex, sab, dom]"

    for(let [indice, data] of dia.time.entries()){
        let clima = traduzirClima(dia.weather_code[indice])
        let minima = dia.temperature_2m_min[indice]
        let maxima =  dia.temperature_2m_max[indice]

        // Descobre o dia da semana a partir da data (formato YYYY-MM-DD)
        let dataObj = new Date(data + "T00:00:00")
        let nomeDiaSemana = diasDaSemana[dataObj.getDay()]

        // Formata a data para DD/MM
        let dataFormatada = dataObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })

        let item = document.createElement("li")
        item.innerHTML = "<span>" + nomeDiaSemana + " <small>(" + dataFormatada + ")</small></span> <span>" + clima.icone + " " + minima + "°C / " + maxima + "°C</span>"

        previsao.appendChild(item)
    }
    resultado.appendChild(previsao)
}

async function buscarClima(cidadeNome) {
    try{
    let geolocalizacao = await fetch(
        "https://geocoding-api.open-meteo.com/v1/search?name=" + cidadeNome + "&count=1&language=pt"
    )

    let dados = await geolocalizacao.json()
    console.log(dados)

    if(!dados.results || dados.results.length == 0){
        resultado.innerHTML = "Cidade não encontrada"
        return
    }

    let cidade = dados.results[0]
    let latitude = cidade.latitude
    let longitude = cidade.longitude
    
    // Nome oficial retornado pela API
    let nomeFormatado = cidade.name + (cidade.admin1 ? ", " + cidade.admin1 : "")

    let resposta = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude +  "&current=temperature_2m,relative_humidity_2m,weather_code,apparent_temperature" +"&daily=temperature_2m_max,temperature_2m_min,weather_code" + "&timezone=auto"
    )

    let dadosClima = await resposta.json()
    console.log(dadosClima)
    resultado.innerHTML = ""
    mostrarClima(dadosClima, nomeFormatado)
    mostrarPrevisao(dadosClima)
}catch (erro){
    resultado.innerHTML = "Não foi possivel conectar a API"
}
}

botao.addEventListener("click", function(){
    buscarClima(input.value)
})