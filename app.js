const searchInput = document.getElementById("search-input");
const suggestionsList = document.getElementById("suggestions-list");
const pokemonGrid = document.getElementById("pokemon-grid");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");
const shinyCheckbox = document.getElementById("shiny-checkbox");
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const pageIndicator = document.getElementById("page-indicator");

const API_URL = "https://pokeapi.co/api/v2/pokemon";

let allPokemon = [];
let currentPokemonData = null;
let offset = 0;

const limit = 10;
const maxPokemon = 1025;

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

const statTranslations = {
  hp: "HP",
  attack: "Ataque",
  defense: "Defensa",
  "special-attack": "Ataque Esp.",
  "special-defense": "Defensa Esp.",
  speed: "Velocidad",
};

function filterPokemon(searchTerm) {
  suggestionsList.innerHTML = "";

  if (searchTerm.trim() === "") {
    suggestionsList.classList.add("hidden");
    return;
  }

  const filtered = allPokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  displaySuggestions(filtered);
}

function displaySuggestions(list) {
  suggestionsList.innerHTML = "";

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

searchInput.addEventListener("input", (event) => {
  filterPokemon(event.target.value);
});

async function fetchAllPokemonNames() {
  try {
    const response = await fetch(`${API_URL}?limit=1000&offset=0`);

    if (!response.ok) {
      throw new Error("Could not fetch pokemon names");
    }

    const data = await response.json();
    allPokemon = data.results;
  } catch (error) {
    console.error("Error loading pokemon names:", error);
  }
}

async function fetchPokemonList() {
  try {
    const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      throw new Error("Could not fetch pokemon list");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error loading pokemon list:", error);
    return [];
  }
}

async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Could not fetch pokemon details");
    }

    const pokemon = await response.json();
    return formatPokemonData(pokemon);
  } catch (error) {
    console.error("Error loading pokemon details:", error);
    return null;
  }
}

function formatPokemonData(pokemon) {
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
}

async function loadPokemonPage() {
  const pokemonList = await fetchPokemonList();

  const pokemonDetails = await Promise.all(
    pokemonList.map((pokemon) => fetchPokemonDetails(pokemon.url))
  );

  const validPokemon = pokemonDetails.filter((pokemon) => pokemon !== null);

  renderPokemonCards(validPokemon);
  updatePagination();

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

    card.addEventListener("click", () => openModal(pokemon));
    pokemonGrid.appendChild(card);
  });
}

function setupPagination() {
  btnPrev.addEventListener("click", async () => {
    if (offset === 0) return;

    offset -= limit;
    await loadPokemonPage();
  });

  btnNext.addEventListener("click", async () => {
    if (offset + limit >= maxPokemon) return;

    offset += limit;
    await loadPokemonPage();
  });
}

function updatePagination() {
  const currentPage = Math.floor(offset / limit) + 1;

  pageIndicator.textContent = `Página ${currentPage}`;

  btnPrev.disabled = offset === 0;
  btnNext.disabled = offset + limit >= maxPokemon;
}

function openModal(pokemon) {
  currentPokemonData = pokemon;

  document.getElementById("modal-id").textContent = `#${pokemon.id
    .toString()
    .padStart(3, "0")}`;

  document.getElementById("modal-name").textContent = pokemon.name.toUpperCase();
  document.getElementById("modal-img").src = pokemon.image;
  document.getElementById("modal-img").alt = pokemon.name;
  document.getElementById("modal-img-shiny").src = pokemon.shiny;
  document.getElementById("modal-img-shiny").alt = `${pokemon.name} shiny`;
  document.getElementById("modal-height").textContent = `${pokemon.height} m`;
  document.getElementById("modal-weight").textContent = `${pokemon.weight} kg`;

  renderModalTypes(pokemon.types);
  renderModalStats(pokemon.stats);
  renderModalMoves(pokemon.moves);
  resetShinyImage();

  modalOverlay.classList.remove("hidden");
}

function renderModalTypes(types) {
  const typesContainer = document.getElementById("modal-types");
  typesContainer.innerHTML = "";

  types.forEach((type) => {
    const span = document.createElement("span");
    span.classList.add("type-badge", `type-${type}`);
    span.textContent = typeTranslations[type] || type;
    typesContainer.appendChild(span);
  });
}

function renderModalStats(stats) {
  const statsList = document.getElementById("modal-stats-list");
  statsList.innerHTML = "";

  stats.forEach((statInfo) => {
    const li = document.createElement("li");
    li.classList.add("stat-item");

    const value = statInfo.base_stat;
    const percent = Math.min((value / 255) * 100, 100).toFixed(1);
    const statName = statTranslations[statInfo.stat.name] || statInfo.stat.name;

    li.innerHTML = `
      <span class="stat-name">${statName}</span>
      <span class="stat-value">${value}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${percent}%"></div>
      </div>
    `;

    statsList.appendChild(li);
  });
}

function renderModalMoves(moves) {
  const movesList = document.getElementById("modal-moves-list");
  movesList.innerHTML = "";

  const randomMoves = [...moves].sort(() => Math.random() - 0.5).slice(0, 3);

  randomMoves.forEach((moveInfo) => {
    const li = document.createElement("li");
    li.classList.add("move-item");
    li.textContent = moveInfo.move.name.replaceAll("-", " ");
    movesList.appendChild(li);
  });
}

function resetShinyImage() {
  shinyCheckbox.checked = false;
  document.getElementById("modal-img").classList.remove("hidden");
  document.getElementById("modal-img-shiny").classList.add("hidden");
}

async function loadPokemonByName(name) {
  try {
    const response = await fetch(`${API_URL}/${name.toLowerCase()}`);

    if (!response.ok) {
      throw new Error("Could not fetch pokemon by name");
    }

    const pokemon = await response.json();
    const formattedPokemon = formatPokemonData(pokemon);

    openModal(formattedPokemon);
  } catch (error) {
    console.error("Error loading pokemon by name:", error);
    alert("No se encontró ese Pokémon.");
  }
}

modalClose.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
});

modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
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
  setupPagination();
  await fetchAllPokemonNames();
  await loadPokemonPage();
});