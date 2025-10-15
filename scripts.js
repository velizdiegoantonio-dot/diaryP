console.log("scripts.js cargando correctamente");

const usuarios = {
    "Diegoohav": "Diegoohav1796",
    "Paau": "Paau17"
};

function mostrarAlerta(mensaje, tipo = "info", duracion = 3000) {
    const alerta = document.getElementById("alerta");

    alerta.className = "w3-panel w3-round-large w3-show";
    alerta.classList.remove("w3-pale-red", "w3-pale-green", "w3-pale-yellow", "w3-pale-indigo");

    switch (tipo) {
        case "error": alerta.classList.add("w3-pale-red", "w3-border-red"); break;
        case "exito": alerta.classList.add("w3-pale-green", "w3-border-green"); break;
        case "warning": alerta.classList.add("w3-pale-yellow", "w3-border-orange"); break;
        default: alerta.classList.add("w3-pale-indigo", "w3-border-blue");
    }

    alerta.textContent = mensaje;
    alerta.style.display = "block";
    setTimeout(() => { alerta.style.display = "none"; }, duracion);
}

document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");
    usuario ? mostrarDiario() : mostrarLogin();
});

function mostrarLogin() {
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("diarioSection").style.display = "none";
}

function mostrarDiario() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("diarioSection").style.display = "block";
    mostrarNotas();
}

function iniciarSesion() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        mostrarAlerta("Por favor completa usuario y contraseña.", "warning");
        return;
    }

    if (usuarios[username] && usuarios[username] === password) {
        sessionStorage.setItem("usuario", username);

        if (username.toLowerCase() === "paau") {
            mostrarAlerta("Bienvenida Pau", "exito");
        } else if (username.toLowerCase() === "diegoohav") {
            mostrarAlerta("Bienvenido de nuevo, Diego", "exito");
        } else {
            mostrarAlerta(`Bienvenido/a ${username}!`, "exito");
        }

        mostrarDiario();
    } else {
        mostrarAlerta("Usuario o contraseña incorrectos.", "error");
    }
}

function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    mostrarAlerta("Has cerrado sesión.", "info");
    mostrarLogin();
    document.getElementById("loginForm").reset();
    document.getElementById("notas").innerHTML = "";
}

function guardarNota() {
    const titulo = document.getElementById("titulo").value.trim();
    const fecha = document.getElementById("fecha").value;
    const texto = document.getElementById("texto").value.trim();
    const usuario = sessionStorage.getItem("usuario");

    if (!titulo || !fecha || !texto) {
        mostrarAlerta("Por favor completa todos los campos antes de guardar.", "warning");
        return;
    }

    if (!usuario) {
        mostrarAlerta("Usuario no identificado.", "error");
        return;
    }

    const nota = { titulo, fecha, texto };
    const key = `diarioPau_${usuario}`;

    let diario = JSON.parse(localStorage.getItem(key)) || [];
    diario.push(nota);
    localStorage.setItem(key, JSON.stringify(diario));

    mostrarAlerta("Nota guardada correctamente.", "exito");

    document.getElementById("titulo").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("texto").value = "";

    mostrarNotas();
}

function mostrarNotas() {
    const contenedor = document.getElementById("notas");
    contenedor.innerHTML = "";

    const usuario = sessionStorage.getItem("usuario");
    const key = `diarioPau_${usuario}`;
    const diario = JSON.parse(localStorage.getItem(key)) || [];

    if (diario.length === 0) {
        contenedor.innerHTML = `<p class="w3-center w3-text-grey">No hay notas guardadas.</p>`;
        return;
    }

    diario.slice().reverse().forEach((nota, index) => {
        const card = document.createElement("div");
        card.className = "w3-card w3-round-large w3-padding w3-margin-bottom entrada";
        card.style.backgroundColor = "#f3e5f5";

        const header = document.createElement("div");
        header.innerHTML = `
            <h4 class="w3-text-indigo">${nota.titulo}</h4>
            <p class="w3-small w3-text-grey">${nota.fecha}</p>
        `;
        card.appendChild(header);

        const texto = document.createElement("p");
        texto.textContent = nota.texto;
        texto.style.display = "none";
        card.appendChild(texto);

        const botonToggle = document.createElement("button");
        botonToggle.className = "w3-button w3-round-large w3-small w3-indigo w3-margin-top";
        botonToggle.textContent = "Mostrar texto";
        botonToggle.onclick = () => {
            texto.style.display = texto.style.display === "none" ? "block" : "none";
            botonToggle.textContent = texto.style.display === "none" ? "Mostrar texto" : "Ocultar texto";
        };
        card.appendChild(botonToggle);

        const botones = document.createElement("div");
        botones.className = "w3-margin-top w3-center";
        botones.innerHTML = `
            <button class="w3-button w3-round-large w3-small boton-eliminar w3-margin-right" onclick="eliminarNota(${diario.length - 1 - index})">
                Eliminar
            </button>
            <button class="w3-button w3-round-large w3-small w3-purple" onclick="descargarNota(${diario.length - 1 - index})">
                Descargar esta nota
            </button>
        `;
        card.appendChild(botones);

        contenedor.appendChild(card);
    });
}

function eliminarNota(indice) {
    const usuario = sessionStorage.getItem("usuario");
    const key = `diarioPau_${usuario}`;
    let diario = JSON.parse(localStorage.getItem(key)) || [];

    diario.splice(indice, 1);
    localStorage.setItem(key, JSON.stringify(diario));
    mostrarAlerta("Nota eliminada.", "info");
    mostrarNotas();
}

function toggleNotas() {
    const contenedor = document.getElementById("notas");
    if (contenedor.style.display === "none") {
        contenedor.style.display = "block";
        mostrarNotas();
        setTimeout(() => contenedor.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
        contenedor.style.display = "none";
    }
}