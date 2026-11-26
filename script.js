
let Card = document.querySelector('.card');
let filterType = document.querySelector('#filterType');
let loadBtn = document.querySelector('#load');

let pokemonDataArray = [];
let limit = 20;
let offset = 0;

let url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;


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


    // Get all types
    let allTypes = [];

    pokemonDataArray.forEach(function(pokemonData){

        pokemonData.types.forEach(function(t){
            allTypes.push(t.type.name);
        });

    });


    // Remove duplicate types
    let uniqueTypes = [...new Set(allTypes)];


    // Add types to dropdown
    uniqueTypes.forEach(function(type){

        if(!Array.from(filterType.options).some(function(option){
            return option.value === type;
        })) {

            let option = document.createElement('option');
            option.value = type;
            option.innerText = type;

            filterType.appendChild(option);
        }

    });


    // Display Pokemon
    showPokemon(pokemonDataArray);

}


// Load more button
loadBtn.addEventListener('click', function(){

    offset = offset + limit;

    url = "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset;

    getPokemon(url);

});


// Show Pokemon cards
function showPokemon(pokemonList) {

    Card.innerHTML = "";

    // Create DocumentFragment
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

        // Speciality / abilities
        let speciality = document.createElement('p');

        speciality.innerText = pokemonData.abilities
            .map(function(a){
                return a.ability.name;
            })
            .join(', ');


        // Add image and name to front
        front.appendChild(img);
        front.appendChild(name);


        // Add speciality to back
        back.appendChild(speciality);


        // Add front and back to inner
        inner.appendChild(front);
        inner.appendChild(back);


        // Add inner to outer
        flipCard.appendChild(inner);


        // Add outer to fragment
        fragment.appendChild(flipCard);

    });


    // Append all cards together
    Card.appendChild(fragment);

}


// Filter by type
filterType.addEventListener('change', function(){

    let selectedType = filterType.value;

    if(selectedType === "all") {

        showPokemon(pokemonDataArray);

    }
    else {

        let filteredPokemon = pokemonDataArray.filter(function(pokemonData){

            return pokemonData.types.some(function(t){
                return t.type.name === selectedType;
            });

        });

        showPokemon(filteredPokemon);

    }

});


// Initial API call
getPokemon(url);
