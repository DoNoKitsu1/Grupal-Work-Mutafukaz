const searchInput = document.getElementById("search-input");
const suggestionsList = document.getElementById("suggestions-list");
const pokemonGrid = document.getElementById("pokemon-grid");

let allPokemon = [];

function filterPokemon(searchTerm) {
  suggestionsList.innerHTML = "";

  if (searchTerm === "") {
    suggestionsList.classList.add("hidden");
    return;
  }

  const filtered = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  displaySuggestions(filtered);
}

function displaySuggestions(list) {
  if (list.length === 0) {
    suggestionsList.classList.add("hidden");
    return;
  }

  suggestionsList.classList.remove("hidden");

  list.slice(0, 5).forEach((pokemon) => {
    const li = document.createElement("li");
    li.textContent = pokemon.name;

    li.addEventListener("click", () => {
      searchInput.value = pokemon.name;
      suggestionsList.classList.add("hidden");
    });

    suggestionsList.appendChild(li);
  });
}

searchInput.addEventListener("input", (e) => {
  filterPokemon(e.target.value);
});

const API_URL = "https://pokeapi.co/api/v2/pokemon";

let offset = 0;
const limit = 10;

const typeTranslations = {
  normal: "Normal",
  fire: "Fuego",
  water: "Agua",
  grass: "Planta",
  electric: "Eléctrico",
  ice: "Hielo",
  fighting: "Lucha",
  poison: "Veneno",
  ground: "Tierra",
  flying: "Volador",
  psychic: "Psíquico",
  bug: "Bicho",
  rock: "Roca",
  ghost: "Fantasma",
  dragon: "Dragón",
  dark: "Siniestro",
  steel: "Acero",
  fairy: "Hada",
};

async function fetchPokemonList() {
  try {
    const res = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);

    if (!res.ok) {
      throw new Error("Could not fetch pokemon list");
    }

    const data = await res.json();

    console.log("Pokemon list:", data.results);

    return data.results;
  } catch (err) {
    console.error("Error loading pokemon list:", err);
    return [];
  }
}

async function fetchPokemonDetails(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error("Could not fetch pokemon details");
    }

    const pokemon = await res.json();

    return {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.other["official-artwork"].front_default,
      types: pokemon.types.map((item) => item.type.name),
    };
  } catch (err) {
    console.error("Error loading pokemon details:", err);
    return null;
  }
}

async function loadPokemonPage() {
  const pokemonList = await fetchPokemonList();

  const pokemonDetails = await Promise.all(
    pokemonList.map((pokemon) => fetchPokemonDetails(pokemon.url))
  );

  const validPokemon = pokemonDetails.filter((pokemon) => pokemon !== null);

  console.log("Pokemon details:", validPokemon);

  renderPokemonCards(validPokemon);

  return validPokemon;
}

function renderPokemonCards(pokemonList) {
  pokemonGrid.innerHTML = "";

  pokemonList.forEach((pokemon) => {
    const mainType = pokemon.types[0];

    const card = document.createElement("div");
    card.classList.add("card", `type-${mainType}`);
    card.dataset.pokemonId = pokemon.id;

    card.innerHTML = `
      <span class="card-id">#${pokemon.id.toString().padStart(3, "0")}</span>

      <img
        class="card-img"
        src="${pokemon.image}"
        alt="${pokemon.name}"
      />

      <h2 class="card-name">${pokemon.name.toUpperCase()}</h2>

      <div class="card-types">
        ${pokemon.types
          .map(
            (type) => `
              <span class="type-badge type-${type}">
                ${typeTranslations[type] || type}
              </span>
            `
          )
          .join("")}
      </div>
    `;

    pokemonGrid.appendChild(card);
  });
}

async function showPokemonTypes(pokemonId) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();

    const types = data.types.map((typeInfo) => typeInfo.type.name);
    const typesContainer = document.querySelector("#modal-types");

    if (typesContainer) {
      typesContainer.innerHTML = "";

      types.forEach((type) => {
        const typeSpan = document.createElement("span");
        typeSpan.textContent = typeTranslations[type] || type;
        typeSpan.classList.add("type-badge", `type-${type}`);

        typesContainer.appendChild(typeSpan);
      });
    }
  } catch (error) {
    console.error("Error fetching pokemon types:", error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadPokemonPage();
});

async function showPokemonMeasurements(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
        
        // Hacemos la conversión a kilogramos y metros
        const weightInKg = data.weight / 10;
        const heightInMeters = data.height / 10;
        
        // Buscamos dónde inyectarlo (Ajusta los IDs si es necesario)
        const weightContainer = document.querySelector('#modal-weight');
        const heightContainer = document.querySelector('#modal-height');
        
        if (weightContainer) {
            weightContainer.textContent = `${weightInKg} kg`;
        }
        
        if (heightContainer) {
            heightContainer.textContent = `${heightInMeters} m`;
        }
        
    } catch (error) {
        console.error("Error fetching pokemon measurements:", error);
    }
}

async function showPokemonMoves(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
        
        const allMoves = data.moves;
        
        const randomMoves = allMoves.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        const moveNames = randomMoves.map(moveInfo => moveInfo.move.name);
        
        const movesContainer = document.querySelector('#modal-moves');
        
        if (movesContainer) {
            movesContainer.innerHTML = ''; // Limpiamos ataques de Pokémon anteriores
            
            moveNames.forEach(move => {
                const moveSpan = document.createElement('span');
                
               moveSpan.textContent = move.replace('-', ' '); 
                
                moveSpan.classList.add('move-badge'); 
                
                movesContainer.appendChild(moveSpan);
            });
        }
    } catch (error) {
        console.error("Error fetching pokemon moves:", error);
    }
}