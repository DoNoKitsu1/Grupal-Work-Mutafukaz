function mostrarTiposPokemon(idPokemon) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
        .then(respuesta => respuesta.json())
        .then(data => {
            const tipos = data.types.map(tipoInfo => tipoInfo.type.name);
            
            const contenedorTipos = document.querySelector('.contenedor-tipos');
            
            if (contenedorTipos) {
                contenedorTipos.innerHTML = ''; 
                
                tipos.forEach(tipo => {
                    const spanTipo = document.createElement('span');
                    spanTipo.textContent = tipo;
                    
                    spanTipo.classList.add('tipo-badge', `type-${tipo}`);
                    
                    contenedorTipos.appendChild(spanTipo);
                });
            }
        })
        .catch(error => {
            console.error("Hubo un error al extraer los tipos:", error);
        });
}