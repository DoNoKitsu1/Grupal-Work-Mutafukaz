const pokemonGrid = document.getElementById("pokemon-grid");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");

pokemonGrid.addEventListener("click", function(event) {
    modalOverlay.classList.remove("hidden");
});

modalClose.addEventListener("click", function() {
    modalOverlay.classList.add("hidden");
});

fetch("https://pokeapi.co/api/v2/pokemon/1")
  .then(respuesta => respuesta.json())
  .then(data => {
    console.log("¡Datos obtenidos!", data);
  });