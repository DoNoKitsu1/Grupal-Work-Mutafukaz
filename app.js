const pokemonGrid = document.getElementById("pokemon-grid");
const modalOverlay = document.getElementById("modal-overlay");
const modalClose = document.getElementById("modal-close");

pokemonGrid.addEventListener("click", function(event) {
    modalOverlay.classList.remove("hidden");
});

modalClose.addEventListener("click", function() {
    modalOverlay.classList.add("hidden");
});
