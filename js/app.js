const container = document.querySelector(".container");

// ==========================================
// 1. OBTENER Y MOSTRAR POKÉMON DESDE LA API
// ==========================================
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
}

// Ejecutar la petición a la API al cargar la página
obtenerPokemons();


// ==========================================
// 2. LÓGICA DE INSTALACIÓN PWA Y BANNERS
// ==========================================
let deferredPrompt;

const installBanner = document.getElementById("install-banner");
const navInstallContainer = document.getElementById("nav-install-container");

const btnInstall = document.getElementById("btn-install");
const btnNavInstall = document.getElementById("btn-nav-install");
const btnDismiss = document.getElementById("btn-dismiss");

// Función reutilizable para lanzar el instalador nativo
async function instalarPWA() {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Respuesta de instalación: ${outcome}`);

    deferredPrompt = null;
    ocultarOpcionesInstalacion();
}

// Oculta tanto el banner como el botón del nav
function ocultarOpcionesInstalacion() {
    if (installBanner) installBanner.classList.add("hidden");
    if (navInstallContainer) navInstallContainer.classList.add("hidden");
}

// 1. Detectar si la PWA se puede instalar
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    if (installBanner) {
        installBanner.classList.remove("hidden");
    }
});

// 2. Clics en los botones de instalación (Banner y Nav)
if (btnInstall) {
    btnInstall.addEventListener("click", instalarPWA);
}

if (btnNavInstall) {
    btnNavInstall.addEventListener("click", instalarPWA);
}

// 3. Al presionar la X: se oculta el banner y se muestra el botón en el menú
if (btnDismiss) {
    btnDismiss.addEventListener("click", () => {
        if (installBanner) installBanner.classList.add("hidden");
        if (navInstallContainer) navInstallContainer.classList.remove("hidden");
    });
}

// 4. Cuando la app ya esté instalada, se quita cualquier opción de instalación
window.addEventListener("appinstalled", () => {
    console.log("PWA instalada correctamente.");
    deferredPrompt = null;
    ocultarOpcionesInstalacion();
});


// ==========================================
// 3. REGISTRO DEL SERVICE WORKER
// ==========================================
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./serviceworker.js")
            .then(reg => console.log("Service Worker registrado con éxito:", reg.scope))
            .catch(err => console.error("Error al registrar el Service Worker:", err));
    });
}