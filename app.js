const API_URL = "https://pokeapi.co/api/v2/pokemon";

let offset = 0;
const limit = 10;

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
    console.error("Error landing pokemon list:", err);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await fetchPokemonList();
});