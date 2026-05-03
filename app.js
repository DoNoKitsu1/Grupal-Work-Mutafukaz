const searchInput = document.getElementById("search-input");
const suggestionsList = document.getElementById("suggestions-list");

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

  return validPokemon;
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