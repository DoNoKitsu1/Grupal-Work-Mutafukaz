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
async function showPokemonTypes(pokemonId) {
    try {
        // Usamos await en lugar de .then() para esperar la respuesta
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const data = await response.json();
        
        const types = data.types.map(typeInfo => typeInfo.type.name);
        
        const typesContainer = document.querySelector('#modal-types');
        
        if (typesContainer) {
            typesContainer.innerHTML = ''; 
            
            types.forEach(type => {
                const typeSpan = document.createElement('span');
                typeSpan.textContent = type;
                
                typeSpan.classList.add('type-badge', `type-${type}`);
                
                typesContainer.appendChild(typeSpan);
            });
        }
    } catch (error) {
        console.error("Error fetching pokemon types:", error);
    }
}
