/**
 * Core game state manager and logic handler.
 */
class GameEngine {
    constructor(database) {
        this.database = database;
        this.selectedGens = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        this.fullList = [];
        this.activePool = [];
        this.targetPokemon = null;
        this.guessedPokemonList = [];
        this.guessCount = 0;
        this.isGameOver = false;

        this.flattenDatabase();
    }

    flattenDatabase() {
        this.fullList = [];
        Object.values(this.database).forEach(genList => {
            this.fullList.push(...genList);
        });
    }

    updateActivePool() {
        this.activePool = this.fullList.filter(p => this.selectedGens.includes(p.gen));
    }

    selectRandomTarget() {
        if (this.activePool.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * this.activePool.length);
        this.targetPokemon = this.activePool[randomIndex];
        return this.targetPokemon;
    }

    startNewGame() {
        this.updateActivePool();
        if (this.activePool.length === 0) return false;
        
        this.selectRandomTarget();
        this.guessedPokemonList = [];
        this.guessCount = 0;
        this.isGameOver = false;
        return true;
    }

    evaluateGuess(pokemon) {
        this.guessCount++;
        this.guessedPokemonList.unshift(pokemon);

        const target = this.targetPokemon;
        const isWin = pokemon.name.toLowerCase() === target.name.toLowerCase();

        if (isWin) {
            this.isGameOver = true;
        }

        const formatStageLabel = (stage) => {
            if (stage === 1) return "Stage 1";
            if (stage === 2) return "Stage 2";
            return "Stage 3";
        };

        const matchResults = {
            pokemon: pokemon,
            isWin: isWin,
            gen: {
                value: `Gen ${pokemon.gen}`,
                status: pokemon.gen === target.gen ? 'correct' : 'incorrect',
                arrow: pokemon.gen < target.gen ? '↑' : pokemon.gen > target.gen ? '↓' : ''
            },
            type1: {
                value: pokemon.type1,
                status: pokemon.type1 === target.type1 ? 'correct' : 
                       (pokemon.type1 === target.type2 ? 'partial' : 'incorrect')
            },
            type2: {
                value: pokemon.type2,
                status: pokemon.type2 === target.type2 ? 'correct' : 
                       (pokemon.type2 === target.type1 ? 'partial' : 'incorrect')
            },
            color: {
                value: pokemon.color,
                status: pokemon.color === target.color ? 'correct' : 'incorrect'
            },
            evolutionStage: {
                value: formatStageLabel(pokemon.evolutionStage),
                status: pokemon.evolutionStage === target.evolutionStage ? 'correct' : 'incorrect',
                arrow: pokemon.evolutionStage < target.evolutionStage ? '↑' : pokemon.evolutionStage > target.evolutionStage ? '↓' : ''
            },
            height: {
                value: `${pokemon.height}m`,
                status: pokemon.height === target.height ? 'correct' : 'incorrect',
                arrow: pokemon.height < target.height ? '↑' : pokemon.height > target.height ? '↓' : ''
            },
            weight: {
                value: `${pokemon.weight}kg`,
                status: pokemon.weight === target.weight ? 'correct' : 'incorrect',
                arrow: pokemon.weight < target.weight ? '↑' : pokemon.weight > target.weight ? '↓' : ''
            }
        };

        return matchResults;
    }

    findByName(name) {
        return this.fullList.find(p => p.name.toLowerCase() === name.toLowerCase().trim());
    }
}