const API_URL = "https://pokeapi.co/api/v2/pokemon";

let offset = 0;
const limit = 10;

async function fetchPokemonList() {
  const res = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);
  const data = await res.json();

  console.log("Lista de Pokémon:", data.results);

  return data.results;
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchPokemonList();
});