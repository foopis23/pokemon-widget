window.addEventListener('load', () => {
  function getPokemon(pokemon_id) {
    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_id}`)
      .then(response => response.json())
  }

  function updateUI(pokemon, isShiny = false) {
    // canvas is for trying to upscale the pokemon image cleanly
    const canvas = document.getElementById('pokemon-canvas');
    const ctx = canvas.getContext("2d");

    // load pokemon image and draw it on canvas
    const pokemonImage = new Image();
    pokemonImage.onload = () => {
      ctx.drawImage(pokemonImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    pokemonImage.src = isShiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default;

    // load pokemon name and add title element
    const pokemonName = document.createElement('h1');
    pokemonName.innerText = pokemon.name + (isShiny ? ' (shiny)' : '');
    pokemonName.classList.add('pokemon-name');
    document.body.appendChild(pokemonName);
  }

  function doRandomShinyRoll() {
    return Math.random() <= 1 / 365;
  }

  function doRandomPokemonRoll() {
    // as of pokemon x and y, there are 721 pokemon
    const largest_pokemon_number = 721;
    const pokemon_id = Math.floor(Math.random() * largest_pokemon_number) + 1;
    getPokemon(pokemon_id)
      .then(pokemon => updateUI(pokemon, doRandomShinyRoll()));
  }

  // allow the user to choose a specific pokemon using a query parameter
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams.has('pokemon')) {
    const pokemon_id = urlParams.get('pokemon');
    getPokemon(pokemon_id)
      .then(pokemon => updateUI(pokemon));
  } else {
    doRandomPokemonRoll();
  }
})
