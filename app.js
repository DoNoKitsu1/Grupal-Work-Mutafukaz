async function showPokemonTypes(pokemonId) {
    try {
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
