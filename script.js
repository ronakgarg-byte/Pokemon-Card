
let Card = document.querySelector('.card');
let filterType = document.querySelector('#filterType');
let loadBtn = document.querySelector('#load');
let searchPokemon = document.querySelector('#searchPokemon');

let pokemonDataArray = [];
let limit = 20;
let offset = 0;

let url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;


// Fetch Types from Type API
async function getTypes() {

    let response = await fetch("https://pokeapi.co/api/v2/type/");
    let data = await response.json();

    data.results.forEach(function(type){

        let option = document.createElement('option');

        option.value = type.name;
        option.innerText = type.name;

        filterType.appendChild(option);

    });

}


// Fetch Pokemon
async function getPokemon(url) {

    const response = await fetch(url);
    const data = await response.json();

    let promises = data.results.map(async function(pokemon){

        let response = await fetch(pokemon.url);
        let pokemonData = await response.json();

        return pokemonData;
    });

    let newPokemon = await Promise.all(promises);

    pokemonDataArray = pokemonDataArray.concat(newPokemon);

    filterPokemon();

}


// Load More button
loadBtn.addEventListener('click', function(){

    offset = offset + limit;

    url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;

    getPokemon(url);

});


// Show Pokemon cards
function showPokemon(pokemonList) {

    Card.innerHTML = "";

    let fragment = document.createDocumentFragment();

    pokemonList.forEach(function(pokemonData){

        // Outer card
        let flipCard = document.createElement('div');
        flipCard.classList.add('flip-card');

        // Inner card
        let inner = document.createElement('div');
        inner.classList.add('flip-card-inner');

        // Front side
        let front = document.createElement('div');
        front.classList.add('flip-card-front');

        // Back side
        let back = document.createElement('div');
        back.classList.add('flip-card-back');


        // Image
        let img = document.createElement('img');
        img.src = pokemonData.sprites.other['official-artwork'].front_default;


        // Name
        let name = document.createElement('h3');
        name.innerText = pokemonData.name;


        // Types
        let types = document.createElement('p');

        types.innerText = "Type: " + pokemonData.types.map(function(t){
            return t.type.name;
        }).join(', ');


        // Abilities
        let speciality = document.createElement('p');

        speciality.innerText = "Abilities: " + pokemonData.abilities
            .map(function(a){
                return a.ability.name;
            })
            .join(', ');


        // Add image, name and types to front
        front.appendChild(img);
        front.appendChild(name);
        front.appendChild(types);


        // Add abilities to back
        back.appendChild(speciality);


        // Add front and back to inner
        inner.appendChild(front);
        inner.appendChild(back);


        // Add inner to outer
        flipCard.appendChild(inner);


        // Add outer to fragment
        fragment.appendChild(flipCard);

    });


    Card.appendChild(fragment);

}


// Filter Pokemon by Type + Name
function filterPokemon() {

    let selectedType = filterType.value;
    let searchValue = searchPokemon.value.toLowerCase().trim();

    let filteredPokemon = pokemonDataArray.filter(function(pokemonData){

        // Check Type
        let matchType = selectedType === "all" || pokemonData.types.some(function(t){
            return t.type.name === selectedType;
        });


        // Check Name
        let matchName = pokemonData.name.toLowerCase().includes(searchValue);


        // Both conditions
        return matchType && matchName;

    });

    showPokemon(filteredPokemon);

}


// Type filter event
filterType.addEventListener('change', function(){

    filterPokemon();

});


// Name search event
searchPokemon.addEventListener('input', function(){

    filterPokemon();

});


// Initial calls
getTypes();
getPokemon(url);
