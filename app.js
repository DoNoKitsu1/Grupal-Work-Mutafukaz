const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions-list');
let allPokemon = []; 
function filterPokemon(searchTerm) {
    suggestionsList.innerHTML = '';
    if (searchTerm === '') {
        suggestionsList.classList.add('hidden');
        return;
    }
    const filtered = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displaySuggestions(filtered);
}
function displaySuggestions(list) {
    if (list.length === 0) {
        suggestionsList.classList.add('hidden');
        return;
    }
    suggestionsList.classList.remove('hidden');
    list.slice(0, 5).forEach(pokemon => { 
        const li = document.createElement('li');
        li.textContent = pokemon.name;
        li.addEventListener('click', () => {
            searchInput.value = pokemon.name;
            suggestionsList.classList.add('hidden');
        });
        suggestionsList.appendChild(li);
    });
}
searchInput.addEventListener('input', (e) => {
    filterPokemon(e.target.value);
});
