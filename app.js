const searchInput = document.getElementById("search-input");
const suggestionsList = document.getElementById("suggestions-list");
const pokemonGrid = document.getElementById("pokemon-grid");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const shinyCheckbox = document.getElementById("shiny-checkbox");

let allPokemon = [];
let currentPokemonData = null;

const API_URL = "https://pokeapi.co/api/v2/pokemon";
let offset = 0;
const limit = 10;

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
      loadPokemonByName(pokemon.name);
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

async function fetchAllPokemonNames() {
  try {
    const res = await fetch(`${API_URL}?limit=1000&offset=0`);
    if (!res.ok) {
      throw new Error("Could not fetch pokemon names");
    }
    const data = await res.json();
    allPokemon = data.results;
  } catch (err) {
    console.error("Error loading pokemon names:", err);
  }
}
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
      shiny: pokemon.sprites.front_shiny,
      types: pokemon.types.map((item) => item.type.name),
      weight: pokemon.weight / 10,
      height: pokemon.height / 10,
      stats: pokemon.stats,
      moves: pokemon.moves,
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
  return pokemonDetails.filter((pokemon) => pokemon !== null);

  const validPokemon = pokemonDetails.filter((pokemon) => pokemon !== null);
  renderPokemonCards(validPokemon);
  updatePagination();
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
      <img class="card-img" src="${pokemon.image}" alt="${pokemon.name}" />
      <h2 class="card-name">${pokemon.name}</h2>
      <div class="card-types">
        ${pokemon.types.map((type) => `<span class="type-badge type-${type}">${type}</span>`).join("")}
      </div>
    `;
    card.addEventListener("click", () => openModal(pokemon));
    pokemonGrid.appendChild(card);
  });
}

function updatePagination() {
  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  const pageIndicator = document.getElementById("page-indicator");
  btnPrev.disabled = offset === 0;
  pageIndicator.textContent = `Page ${offset / limit + 1}`;
  btnNext.addEventListener("click", () => {
    offset += limit;
    loadPokemonPage();
  });
  btnPrev.addEventListener("click", () => {
    if (offset > 0) {
      offset -= limit;
      loadPokemonPage();
    }
  });
}

function openModal(pokemon) {
  currentPokemonData = pokemon;
  document.getElementById("modal-id").textContent = `#${pokemon.id.toString().padStart(3, "0")}`;
  document.getElementById("modal-name").textContent = pokemon.name;
  document.getElementById("modal-img").src = pokemon.image;
  document.getElementById("modal-img-shiny").src = pokemon.shiny;
  document.getElementById("modal-height").textContent = `${pokemon.height} m`;
  document.getElementById("modal-weight").textContent = `${pokemon.weight} kg`;

  const typesContainer = document.getElementById("modal-types");
  typesContainer.innerHTML = "";
  pokemon.types.forEach((type) => {
    const span = document.createElement("span");
    span.classList.add("type-badge", `type-${type}`);
    span.textContent = type;
    typesContainer.appendChild(span);
  });

  const statsList = document.getElementById("modal-stats-list");
  statsList.innerHTML = "";
  pokemon.stats.forEach((statInfo) => {
    const li = document.createElement("li");
    li.classList.add("stat-item");
    const value = statInfo.base_stat;
    const percent = Math.min((value / 255) * 100, 100).toFixed(1);
    li.innerHTML = `
      <span class="stat-name">${statInfo.stat.name}</span>
      <span class="stat-value">${value}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${percent}%"></div>
      </div>
    `;
    statsList.appendChild(li);
  });

  const movesList = document.getElementById("modal-moves-list");
  movesList.innerHTML = "";
  const randomMoves = pokemon.moves.sort(() => Math.random() - 0.5).slice(0, 3);
  randomMoves.forEach((moveInfo) => {
    const li = document.createElement("li");
    li.classList.add("move-item");
    li.textContent = moveInfo.move.name;
    movesList.appendChild(li);
  });

  shinyCheckbox.checked = false;
  document.getElementById("modal-img").classList.remove("hidden");
  document.getElementById("modal-img-shiny").classList.add("hidden");

  modalOverlay.classList.remove("hidden");
}

async function loadPokemonByName(name) {
  try {
    const res = await fetch(`${API_URL}/${name}`);
    if (!res.ok) {
      throw new Error("Could not fetch pokemon by name");
async function showPokemonTypes(pokemonId) {
  try {
    const response = await fetch(`${API_URL}/${pokemonId}`);
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
    const pokemon = await res.json();
    const data = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.sprites.other["official-artwork"].front_default,
      shiny: pokemon.sprites.front_shiny,
      types: pokemon.types.map((item) => item.type.name),
      weight: pokemon.weight / 10,
      height: pokemon.height / 10,
      stats: pokemon.stats,
      moves: pokemon.moves,
    };
    openModal(data);
  } catch (err) {
    console.error("Error loading pokemon by name:", err);
  }
}

modalClose.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add("hidden");
  }
});

shinyCheckbox.addEventListener("change", () => {
  const normalImg = document.getElementById("modal-img");
  const shinyImg = document.getElementById("modal-img-shiny");
  if (shinyCheckbox.checked) {
    normalImg.classList.add("hidden");
    shinyImg.classList.remove("hidden");
  } else {
    normalImg.classList.remove("hidden");
    shinyImg.classList.add("hidden");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  await fetchAllPokemonNames();
  await loadPokemonPage();
});
document.addEventListener("DOMContentLoaded", async () => {
  await fetchAllPokemonNames();
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
