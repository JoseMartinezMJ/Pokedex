/*Patron modulio de la funcion flecha PokedexModule*/
const PokedexModule = (() => {
    const pokemonList = [];//Variable de tipo lista que almacenara todos los Pokemon
    /* La funcion Pokemon es una (Función de Fábrica) y es una forma de crear objetos con propiedades predefinidas de una manera más concisa.
    En este caso crear objetos Pokemon con las propiedades de name, species, weight, type, abilities, stats, moves, spriteUrl*/

    const Pokemon = (name, species, height, weight, type, abilities, stats, moves, spriteUrl) => {
        return {
            name,
            species,
            height,
            weight,
            type,
            abilities,
            stats,
            moves,
            spriteUrl
        };
    };
    /*Función flecha addPokemon se utiliza para agregar un objeto de Pokémon a la lista de Pokémon en el módulo */
    const addPokemon = (pokemon) => {
        pokemonList.push(pokemon);
    };
    /*drawPokemonCard esta función se encarga de generar el HTML necesario para mostrar una tarjeta (card) que representa a un Pokémon en la página web. 
    También configura un botón de "Details" que abrirá un modal con información adicional del Pokémon. Aquí tienes una explicación más detallada. */
    const drawPokemonCard = (pokemon) => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <img src="${pokemon.spriteUrl}" class="card-img-top" alt="${pokemon.name}">
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.name}</h5>
                        <p class="card-text">${pokemon.species}</p>
                        <p class="card-text">Type: ${pokemon.type}</p>
                        <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#${pokemon.name}Modal">Details</a>
                    </div>
                </div>
            </div>
            <!-- Modal -->
            <div class="modal fade" id="${pokemon.name}Modal" tabindex="-1" role="dialog" aria-labelledby="${pokemon.name}ModalLabel" aria-hidden="true">
                <!-- Modal content will be added here -->
            </div>
        `;

        $("#pokedexContainer").append(card);

        drawModalContent(pokemon);
    };

    const drawModalContent = (pokemon) => {
        // Código para crear y mostrar contenido modal para cada Pokémon.
        const modalContent = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${pokemon.name} Details</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Species: ${pokemon.species}</p>
                        <p>Height: ${pokemon.height}</p>
                        <p>Weight: ${pokemon.weight}</p>
                        <p>Type: ${pokemon.type}</p>
                        <h6>Abilities:</h6>
                        <ul>
                            ${pokemon.abilities.map(ability => `<li>${ability}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        $(`#${pokemon.name}Modal`).html(modalContent);
    };

    const drawPokedex =  async() => {
        // Código para recuperar datos de la API y dibujar la Pokedex
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
            const data = await response.json();

            for (const pokemonData of data.results) {
                const response = await fetch(pokemonData.url);
                const pokemon = await response.json();

                const abilities = pokemon.abilities.map(ability => ability.ability.name);

                const pokemonObj = Pokemon(
                    pokemon.name,
                    pokemon.species.name,
                    pokemon.height,
                    pokemon.weight,
                    pokemon.types[0].type.name,
                    abilities,
                    pokemon.stats,
                    pokemon.moves,
                    pokemon.sprites.front_default
                );

                addPokemon(pokemonObj);
                drawPokemonCard(pokemonObj);
            }
        } catch (error) {
            console.error("Se produjo un error al obtener datos:", error);
        }
    
    };

    return {
        addPokemon,
        drawPokedex
    };
})();

$(document).ready(() => {
    PokedexModule.drawPokedex();
});
