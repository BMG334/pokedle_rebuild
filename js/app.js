/**
 * Application Controller / Entry Point
 */
document.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine(POKEMON_DATABASE);
    const ui = new UIManager(game);

    game.startNewGame();
    ui.updateStats();

    const handleGuessSubmit = (e) => {
        if (e) e.preventDefault();
        if (game.isGameOver) return;

        const pokemonName = ui.input.value;
        const pokemon = game.findByName(pokemonName);

        if (!pokemon) {
            ui.showToast("Pokémon not found in database!");
            return;
        }

        if (game.guessedPokemonList.some(p => p.name.toLowerCase() === pokemon.name.toLowerCase())) {
            ui.showToast("You already guessed this Pokémon!");
            return;
        }

        const matchResult = game.evaluateGuess(pokemon);
        ui.renderGuessRow(matchResult);
        ui.updateStats();
        ui.input.value = '';
        ui.autocompleteList.classList.add('hidden');

        if (matchResult.isWin) {
            setTimeout(() => ui.showVictoryModal(), 600);
        }
    };

    document.getElementById('guess-form').addEventListener('submit', handleGuessSubmit);
    
    ui.input.addEventListener('input', (e) => {
        ui.showAutocomplete(e.target.value);
    });

    document.addEventListener('click', (e) => {
        if (!ui.input.contains(e.target) && !ui.autocompleteList.contains(e.target)) {
            ui.autocompleteList.classList.add('hidden');
        }
    });

    document.getElementById('open-settings-btn').addEventListener('click', () => {
        ui.renderGenerationsList();
        ui.settingsModal.classList.remove('hidden');
    });

    document.getElementById('close-settings-btn').addEventListener('click', () => {
        ui.settingsModal.classList.add('hidden');
    });

    document.getElementById('select-all-btn').addEventListener('click', () => {
        document.querySelectorAll('.gen-checkbox').forEach(cb => cb.checked = true);
    });

    document.getElementById('deselect-all-btn').addEventListener('click', () => {
        document.querySelectorAll('.gen-checkbox').forEach(cb => cb.checked = false);
    });

    document.getElementById('apply-settings-btn').addEventListener('click', () => {
        const selected = Array.from(document.querySelectorAll('.gen-checkbox:checked'))
            .map(cb => parseInt(cb.value, 10));

        if (selected.length === 0) {
            ui.showToast("Select at least one Generation!");
            return;
        }

        game.selectedGens = selected;
        game.startNewGame();
        ui.resetUI();
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
        game.startNewGame();
        ui.resetUI();
    });

    document.getElementById('close-victory-btn').addEventListener('click', () => {
        ui.victoryModal.classList.add('hidden');
    });

    document.getElementById('show-victory-btn').addEventListener('click', () => {
        ui.showVictoryModal();
    });

    document.getElementById('new-game-btn').addEventListener('click', () => {
        game.startNewGame();
        ui.resetUI();
    });
});