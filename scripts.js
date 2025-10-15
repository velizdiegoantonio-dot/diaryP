console.log("scripts.js cargando correctamente");

// Usuarios permitidos
const usuarios = {
    "Diegoohav": "Diegoohav1796",
    "Paau": "Paau17"
};

// Mostrar alertas
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
    setTimeout(() => alerta.style.display = "none", duracion);
}

// Comprobar sesión al cargar
document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");
    if (usuario) mostrarDiario();
    else mostrarLogin();
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
        if (username.toLowerCase() === "paau") mostrarAlerta("Bienvenida Pau", "exito");
        else if (username.toLowerCase() === "diegoohav") mostrarAlerta("Bienvenido de nuevo, Diego", "exito");
        else mostrarAlerta(`Bienvenido/a ${username}!`, "exito");

        mostrarDiario();
    } else mostrarAlerta("Usuario o contraseña incorrectos.", "error");
}

function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    mostrarAlerta("Has cerrado sesión.", "info");
    mostrarLogin();
    const formLogin = document.getElementById("loginForm");
    if (formLogin) formLogin.reset();
    const contenedor = document.getElementById("notas");
    if (contenedor) contenedor.innerHTML = "";
}

// Guardar nota
function guardarNota() {
    const titulo = document.getElementById("titulo").value.trim();
    const fecha = document.getElementById("fecha").value;
    const texto = document.getElementById("texto").value.trim();
    const usuario = sessionStorage.getItem("usuario");

    if (!titulo || !fecha || !texto) {
        mostrarAlerta("Por favor completa todos los campos antes de guardar.", "warning");
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

// Mostrar notas
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
        header.innerHTML = `<h4 class="w3-text-indigo">${nota.titulo}</h4>
                            <p class="w3-small w3-text-grey">${nota.fecha}</p>`;
        card.appendChild(header);

        const texto = document.createElement("p");
        texto.textContent = nota.texto;
        texto.style.display = "none";
        card.appendChild(texto);

        const botonToggle = document.createElement("button");
        botonToggle.className = "w3-button w3-round-large w3-small w3-indigo w3-margin-top";
        botonToggle.textContent = "Mostrar texto";
        botonToggle.onclick = () => {
            if (texto.style.display === "none") {
                texto.style.display = "block";
                botonToggle.textContent = "Ocultar texto";
            } else {
                texto.style.display = "none";
                botonToggle.textContent = "Mostrar texto";
            }
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

// Eliminar nota
function eliminarNota(indice) {
    const usuario = sessionStorage.getItem("usuario");
    const key = `diarioPau_${usuario}`;
    let diario = JSON.parse(localStorage.getItem(key)) || [];

    if (indice < 0 || indice >= diario.length) {
        mostrarAlerta("Índice inválido para eliminar nota.", "error");
        return;
    }

    diario.splice(indice, 1);
    localStorage.setItem(key, JSON.stringify(diario));
    mostrarAlerta("Nota eliminada.", "info");
    mostrarNotas();
}

// Funciones PDF
function dibujarCuaderno(doc) {
    doc.setFillColor(237, 231, 246);
    doc.rect(0, 0, 210, 297, "F");

    doc.setDrawColor(179, 157, 219);
    doc.setLineWidth(0.3);
    const startY = 40;
    const endY = 285;
    const spacing = 8;
    for (let y = startY; y <= endY; y += spacing) doc.line(10, y, 200, y);

    doc.setDrawColor(126, 87, 194);
    doc.setLineWidth(1);
    doc.rect(5, 5, 200, 287);
}

function escribirTexto(doc, texto, x, y, maxWidth) {
    const lineHeight = 8;
    const lines = doc.splitTextToSize(texto, maxWidth);
    lines.forEach(line => {
        if (y + lineHeight > 285) {
            doc.addPage();
            dibujarCuaderno(doc);
            y = 40;
        }
        doc.text(line, x, y);
        y += lineHeight;
    });
    return y;
}

async function descargarPDF() {
    const usuario = sessionStorage.getItem("usuario");
    if (!usuario) { mostrarAlerta("Debes iniciar sesión para descargar el diario.", "warning"); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const key = `diarioPau_${usuario}`;
    const diario = JSON.parse(localStorage.getItem(key)) || [];
    if (diario.length === 0) { mostrarAlerta("No hay notas para descargar.", "warning"); return; }

    dibujarCuaderno(doc);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`Diario de ${usuario}`, 105, 25, null, null, "center");
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");

    let y = 40;
    diario.forEach(nota => {
        doc.setFont("Helvetica", "bold");
        y = escribirTexto(doc, `${nota.titulo} - ${nota.fecha}`, 10, y, 180);
        doc.setFont("Helvetica", "normal");
        y = escribirTexto(doc, nota.texto, 10, y, 180);
        y += 4;
    });

    doc.save(`diario-${usuario}.pdf`);
}

// Descargar nota individual
async function descargarNota(indice) {
    const usuario = sessionStorage.getItem("usuario");
    if (!usuario) { mostrarAlerta("Debes iniciar sesión para descargar.", "warning"); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const key = `diarioPau_${usuario}`;
    const diario = JSON.parse(localStorage.getItem(key)) || [];

    if (indice < 0 || indice >= diario.length) { mostrarAlerta("Nota no encontrada.", "error"); return; }

    const nota = diario[indice];
    dibujarCuaderno(doc);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Pau's Diary", 105, 25, null, null, "center");

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(12);
    let y = 40;
    doc.setFont("Helvetica", "bold");
    y = escribirTexto(doc, `${nota.titulo} - ${nota.fecha}`, 10, y, 180);
    doc.setFont("Helvetica", "normal");
    y = escribirTexto(doc, nota.texto, 10, y, 180);

    doc.save(`nota-${nota.titulo.replace(/\s+/g, "_")}.pdf`);
    mostrarAlerta(`Nota "${nota.titulo}" descargada.`, "exito");
}

function toggleNotas() {
    const contenedor = document.getElementById("notas");
    if (contenedor.style.display === "none") {
        contenedor.style.display = "block";
        mostrarNotas();
        setTimeout(() => contenedor.scrollIntoView({ behavior: "smooth" }), 100);
    } else contenedor.style.display = "none";
}