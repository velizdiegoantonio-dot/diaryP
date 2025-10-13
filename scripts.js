console.log("scripts.js cargando correctamente");

// Usuarios permitidos
const usuarios = {
    "Diegoohav": "Diegoohav1796",
    "Paau": "Paau17"
};

// Función para mostrar alertas personalizadas
function mostrarAlerta(mensaje, tipo = "info", duracion = 3000) {
    const alerta = document.getElementById("alerta");

    alerta.className = "w3-panel w3-round-large w3-show";
    alerta.classList.remove("w3-pale-red", "w3-pale-green", "w3-pale-yellow", "w3-pale-indigo");

    switch (tipo) {
        case "error":
            alerta.classList.add("w3-pale-red", "w3-border-red");
            break;
        case "exito":
            alerta.classList.add("w3-pale-green", "w3-border-green");
            break;
        case "warning":
            alerta.classList.add("w3-pale-yellow", "w3-border-orange");
            break;
        default:
            alerta.classList.add("w3-pale-indigo", "w3-border-blue");
    }

    alerta.textContent = mensaje;
    alerta.style.display = "block";

    setTimeout(() => {
        alerta.style.display = "none";
    }, duracion);
}

// Al cargar la página, comprobamos sesión
document.addEventListener("DOMContentLoaded", () => {
    const usuario = sessionStorage.getItem("usuario");
    if (usuario) {
        mostrarDiario();
    } else {
        mostrarLogin();
    }
});

function mostrarLogin() {
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("diarioSection").style.display = "none";
}

function mostrarDiario() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("diarioSection").style.display = "block";
    mostrarEntradas();
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
        mostrarAlerta(`Bienvenido ${username}!`, "exito");
        mostrarDiario();
    } else {
        mostrarAlerta("Usuario o contraseña incorrectos.", "error");
    }
}

function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    mostrarAlerta("Has cerrado sesión.", "info");
    mostrarLogin();
    // Limpiar formulario de login
    const formLogin = document.getElementById("loginForm");
    if (formLogin) formLogin.reset();
    // Limpiar las notas mostradas
    const contenedor = document.getElementById("notas");
    if (contenedor) contenedor.innerHTML = "";
}

function guardarEntrada() {
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

    const entrada = { titulo, fecha, texto };
    const key = `diarioPau_${usuario}`;

    let diario = JSON.parse(localStorage.getItem(key)) || [];
    diario.push(entrada);
    localStorage.setItem(key, JSON.stringify(diario));

    mostrarAlerta("Entrada guardada correctamente.", "exito");

    document.getElementById("titulo").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("texto").value = "";

    mostrarEntradas();
}

function mostrarEntradas() {
    const contenedor = document.getElementById("notas");
    contenedor.innerHTML = "";

    const usuario = sessionStorage.getItem("usuario");
    const key = `diarioPau_${usuario}`;
    const diario = JSON.parse(localStorage.getItem(key)) || [];

    if (diario.length === 0) {
        contenedor.innerHTML = `<p class="w3-center w3-text-grey">No hay entradas guardadas.</p>`;
        return;
    }

    // Mostrar de más reciente a más antigua
    diario.slice().reverse().forEach((entrada, index) => {
        const card = `
        <div class="w3-card w3-round-large w3-padding w3-margin-bottom entrada">
            <h4 class="w3-text-indigo">${entrada.titulo}</h4>
            <p class="w3-small w3-text-grey">${entrada.fecha}</p>
            <p>${entrada.texto}</p>
            <button class="w3-button w3-round-large w3-small boton-eliminar" onclick="eliminarEntrada(${diario.length - 1 - index})">Eliminar</button>
        </div>
        `;
        contenedor.innerHTML += card;
    });
}

function eliminarEntrada(indice) {
    const usuario = sessionStorage.getItem("usuario");
    const key = `diarioPau_${usuario}`;
    let diario = JSON.parse(localStorage.getItem(key)) || [];

    if (indice < 0 || indice >= diario.length) {
        mostrarAlerta("Índice inválido para eliminar entrada.", "error");
        return;
    }

    diario.splice(indice, 1);
    localStorage.setItem(key, JSON.stringify(diario));
    mostrarAlerta("Entrada eliminada.", "info");
    mostrarEntradas();
}

async function descargarPDF() {
    const usuario = sessionStorage.getItem("usuario");
    if (!usuario) {
        mostrarAlerta("Debes iniciar sesión para descargar el diario.", "warning");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const key = `diarioPau_${usuario}`;
    const diario = JSON.parse(localStorage.getItem(key)) || [];

    if (diario.length === 0) {
        mostrarAlerta("No hay entradas para descargar.", "warning");
        return;
    }

    // Cabecera
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text(`Diario de ${usuario}`, 105, 20, null, null, "center");
    doc.setFontSize(12);

    let y = 30;
    diario.forEach((entrada, i) => {
        doc.setFont("Helvetica", "bold");
        doc.text(`${entrada.titulo} - ${entrada.fecha}`, 10, y);
        y += 8;
        doc.setFont("Helvetica", "normal");
        const textoLines = doc.splitTextToSize(entrada.texto, 180);
        if (y + textoLines.length * 8 > 280) {
            doc.addPage();
            y = 20;
        }
        doc.text(textoLines, 10, y);
        y += textoLines.length * 8 + 10;
    });

    doc.save(`diario-${usuario}.pdf`);
}

function toggleNotas() {
    const contenedor = document.getElementById("notas");
    if (contenedor.style.display === "none") {
        contenedor.style.display = "block";
        mostrarEntradas();
        setTimeout(() => {
            contenedor.scrollIntoView({ behavior: "smooth" });
        }, 100);
    } else {
        contenedor.style.display = "none";
    }
}