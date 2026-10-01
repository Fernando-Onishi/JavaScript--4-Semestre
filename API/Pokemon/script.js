let input = document.getElementById("input")
let botao = document.getElementById("botao")
let resultado = document.getElementById("resultado")

async function buscarPokemon(nome){
    try{
        let resposta = await fetch("https://pokeapi.co/api/v2/pokemon/" + nome)

        if(!resposta.ok){
            resultado.innerHTML = `<p> Pokémon não encontrado </p>`
            return
        } //Se não encontrar o Pokemon
        //A variável dados recebe o json e vai fazer as buscas do que precisamos/solicitamos
        let dados = await resposta.json()
        resposta.innerHTML = ""
        resposta.innerHTML = ""

        // Pegando o nome do POkemon
        let nomePokemon = document.createElement("h2")
        nomePokemon.innerHTML = dados.name

        // Pegando a imagem do Pokemon
        let imagemPokemon = document.createElement("img")
        imagemPokemon.src = dados.sprites.front_default

        // pegando a tipagem do pokemon
        let tipoPokemon = document.createElement("p")
        let tipo = "Tipo: "
        for(let info of dados.types){
            tipo += info.type.name + ""
        }
        tipoPokemon.innerHTML = tipo 

        resultado.appendChild(nomePokemon)
        resultado.appendChild(imagemPokemon)
        resultado.appendChild(tipoPokemon)

    }catch(erro){
        resultado.innerHTML = "Erro ao buscar o pokémon"
    }
}

botao.addEventListener("click", function(){
    buscarPokemon(input.value)
})