
let Card = document.querySelector('.card');

fetch("https://pokeapi.co/api/v2/pokemon?limit=12&offset=0")
.then(function(response){
    return response.json();
})
.then(function(data){

    data.results.forEach(function(pokemon){

        fetch(pokemon.url)
        .then(function(response){
            return response.json();
        })
        .then(function(pokemonData){

            let flipCard = document.createElement('div');
            flipCard.classList.add('flip-card');

            let inner = document.createElement('div');
            inner.classList.add('flip-card-inner');

            let front = document.createElement('div');
            front.classList.add('flip-card-front');

            let back = document.createElement('div');
            back.classList.add('flip-card-back');

            let img = document.createElement('img');
            img.src = pokemonData.sprites.front_default;

            let name = document.createElement('h3');
            name.innerText = pokemonData.name;

            front.appendChild(img);
            back.appendChild(name);

            inner.appendChild(front);
            inner.appendChild(back);

            flipCard.appendChild(inner);

            Card.appendChild(flipCard);

        })
    })
})
