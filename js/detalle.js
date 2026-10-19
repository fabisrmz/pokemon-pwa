const parametros = new URLSearchParams(window.location.search);
const id = parametros.get("id");

async function cargarDetallePokemon() {
    if (!id) {
        window.location.href = "index.html";
        return;
    }

    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!respuesta.ok) throw new Error("Pokémon no encontrado");

        const pokemon = await respuesta.json();

       
        const imagen = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;
        const tipos = pokemon.types.map(t => t.type.name).join(", ");
        const habilidades = pokemon.abilities.map(a => a.ability.name).join(", ");

        
        document.getElementById("imagen-pokemon").src = imagen;
        document.getElementById("imagen-pokemon").alt = pokemon.name;
        document.getElementById("nombre-pokemon").textContent = pokemon.name.toUpperCase();
        document.getElementById("id-pokemon").textContent = `#${pokemon.id}`;
        document.getElementById("altura-pokemon").textContent = pokemon.height;
        document.getElementById("peso-pokemon").textContent = pokemon.weight;
        document.getElementById("tipos-pokemon").textContent = tipos;
        document.getElementById("habilidades-pokemon").textContent = habilidades;

    } catch (error) {
        console.error("Error al cargar el detalle del Pokémon:", error);
        document.getElementById("nombre-pokemon").textContent = "Error al cargar la información";
    }
}


cargarDetallePokemon();