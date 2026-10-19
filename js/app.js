const container = document.querySelector(".container");


async function obtenerPokemons() {
    try {
    
        const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
        const datos = await respuesta.json();

        for (const pokemon of datos.results) {
            
            const resDetalle = await fetch(pokemon.url);
            const detalle = await resDetalle.json();

            crearTarjeta(detalle);
        }
    } catch (error) {
        console.error("Error al obtener los Pokémon:", error);
    }
}

function crearTarjeta(pokemon) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <img 
            src="${pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default}" 
            alt="${pokemon.name}"
        >
        <div class="card-content">
            <h3>${pokemon.name.toUpperCase()}</h3>
            <p><strong>N.º:</strong> ${pokemon.id}</p>
            <button class="btn-ver-mas">Ver más</button>
        </div>
    `;

    const boton = card.querySelector(".btn-ver-mas");
    boton.addEventListener("click", () => {
        window.location.href = `detalle.html?id=${pokemon.id}`;
    });

    container.appendChild(card);
    // Registro del Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./serviceworker.js")
            .then(reg => console.log("Service Worker registrado con éxito:", reg.scope))
            .catch(err => console.error("Error al registrar el Service Worker:", err));
    });
}
}

obtenerPokemons();