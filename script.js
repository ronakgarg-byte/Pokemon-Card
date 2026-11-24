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

            // Pokemon image
            let img = document.createElement('img');
            img.src = pokemonData.sprites.other['official-artwork'].front_default;

            // Pokemon name
            let name = document.createElement('h3');
            name.innerText = pokemonData.name;

            // Pokemon types container
            let types = document.createElement('div');

            // Get Pokemon types
            pokemonData.types.forEach(function(t){

                let type = document.createElement('p');
                type.innerText = t.type.name;

                type.classList.add('type');
                type.classList.add(t.type.name);

                types.appendChild(type);
            });

            // Add image to front
            front.appendChild(img);

            // Add name and types to back
            back.appendChild(name);
            back.appendChild(types);

            // Add front and back to inner
            inner.appendChild(front);
            inner.appendChild(back);

            // Add inner to outer card
            flipCard.appendChild(inner);

            // Add card to main container
            Card.appendChild(flipCard);

        })
    })
})