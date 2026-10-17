/**
 * UI Renderer and Interface Handler
 */
class UIManager {
    constructor(game) {
        this.game = game;

        this.input = document.getElementById('pokemon-input');
        this.autocompleteList = document.getElementById('autocomplete-list');
        this.guessesContainer = document.getElementById('guesses-container');
        this.poolCountEl = document.getElementById('pool-count');
        this.guessCountEl = document.getElementById('guess-count');
        
        this.settingsModal = document.getElementById('settings-modal');
        this.victoryModal = document.getElementById('victory-modal');
        this.generationsList = document.getElementById('generations-list');
        this.postWinActions = document.getElementById('post-win-actions');
    }

    updateStats() {
        this.poolCountEl.textContent = this.game.activePool.length;
        this.guessCountEl.textContent = this.game.guessCount;
    }

    renderGenerationsList() {
        this.generationsList.innerHTML = '';
        for (let i = 1; i <= 9; i++) {
            const isChecked = this.game.selectedGens.includes(i);
            const label = document.createElement('label');
            label.className = 'flex items-center space-x-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60 cursor-pointer hover:bg-slate-700/50 transition';
            label.innerHTML = `
                <input type="checkbox" value="${i}" ${isChecked ? 'checked' : ''} class="gen-checkbox w-4 h-4 text-red-600 rounded focus:ring-0">
                <span class="text-xs font-semibold text-slate-200">Generation ${i}</span>
            `;
            this.generationsList.appendChild(label);
        }
    }

    showAutocomplete(query) {
        this.autocompleteList.innerHTML = '';
        if (!query.trim()) {
            this.autocompleteList.classList.add('hidden');
            return;
        }

        const matches = this.game.fullList.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) &&
            !this.game.guessedPokemonList.some(g => g.name === p.name)
        ).slice(0, 6);

        if (matches.length === 0) {
            this.autocompleteList.classList.add('hidden');
            return;
        }

        matches.forEach(p => {
            const li = document.createElement('li');
            li.className = 'px-4 py-2.5 flex items-center space-x-3 hover:bg-slate-700/80 cursor-pointer transition';
            li.innerHTML = `
                <img src="${p.sprite}" class="w-8 h-8 object-contain" alt="${p.name}">
                <span class="text-sm font-medium text-slate-200">${p.name}</span>
                <span class="text-xs text-slate-500 ml-auto">Gen ${p.gen}</span>
            `;
            li.addEventListener('click', () => {
                this.input.value = p.name;
                this.autocompleteList.classList.add('hidden');
            });
            this.autocompleteList.appendChild(li);
        });

        this.autocompleteList.classList.remove('hidden');
    }

    renderGuessRow(matchData) {
        const row = document.createElement('div');
        row.className = 'grid grid-cols-8 gap-2 text-center text-xs font-semibold animate-flip';

        const getStatusBg = (status) => {
            if (status === 'correct') return 'bg-emerald-600 border-emerald-500 text-white shadow-md';
            if (status === 'partial') return 'bg-amber-600 border-amber-500 text-white shadow-md';
            return 'bg-slate-800/80 backdrop-blur-md border-slate-700 text-slate-300';
        };

        row.innerHTML = `
            <div class="bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-xl p-2 flex flex-col items-center justify-center shadow-md">
                <img src="${matchData.pokemon.sprite}" class="w-8 h-8 object-contain mb-1" alt="${matchData.pokemon.name}">
                <span class="text-[11px] truncate w-full text-white">${matchData.pokemon.name}</span>
            </div>
            <div class="${getStatusBg(matchData.gen.status)} border rounded-xl p-2 flex flex-col items-center justify-center shadow-md">
                <span>${matchData.gen.value}</span>
                <span class="text-xs">${matchData.gen.arrow}</span>
            </div>
            <div class="${getStatusBg(matchData.type1.status)} border rounded-xl p-2 flex items-center justify-center truncate shadow-md">
                ${matchData.type1.value}
            </div>
            <div class="${getStatusBg(matchData.type2.status)} border rounded-xl p-2 flex items-center justify-center truncate shadow-md">
                ${matchData.type2.value}
            </div>
            <div class="${getStatusBg(matchData.color.status)} border rounded-xl p-2 flex items-center justify-center truncate shadow-md">
                ${matchData.color.value}
            </div>
            <div class="${getStatusBg(matchData.evolutionStage.status)} border rounded-xl p-2 flex flex-col items-center justify-center shadow-md">
                <span>${matchData.evolutionStage.value}</span>
                <span class="text-xs">${matchData.evolutionStage.arrow}</span>
            </div>
            <div class="${getStatusBg(matchData.height.status)} border rounded-xl p-2 flex flex-col items-center justify-center shadow-md">
                <span>${matchData.height.value}</span>
                <span class="text-xs">${matchData.height.arrow}</span>
            </div>
            <div class="${getStatusBg(matchData.weight.status)} border rounded-xl p-2 flex flex-col items-center justify-center shadow-md">
                <span>${matchData.weight.value}</span>
                <span class="text-xs">${matchData.weight.arrow}</span>
            </div>
        `;

        this.guessesContainer.prepend(row);
    }

    showVictoryModal() {
        document.getElementById('victory-pokemon-img').src = this.game.targetPokemon.sprite;
        document.getElementById('victory-pokemon-name').textContent = this.game.targetPokemon.name;
        document.getElementById('final-guess-count').textContent = this.game.guessCount;
        this.postWinActions.classList.remove('hidden');
        this.victoryModal.classList.remove('hidden');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'bg-red-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-red-500 transition duration-300 transform translate-y-2';
        toast.textContent = message;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);

        setTimeout(() => toast.classList.remove('translate-y-2'), 10);
        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    resetUI() {
        this.guessesContainer.innerHTML = '';
        this.input.value = '';
        this.postWinActions.classList.add('hidden');
        this.victoryModal.classList.add('hidden');
        this.settingsModal.classList.add('hidden');
        this.updateStats();
    }
}