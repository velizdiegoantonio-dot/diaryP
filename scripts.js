console.log("scripts.js cargando correctamente")
document,addEvenListener("DOMContentLoaded",mostrarEntradas);

function guardarEntrada(){
    console.log("Entrada guardada")
    const titulo =
document.getElementById("titulo").value.trim();
    const fecha=document.getElementById("fecha").value;
    const texto=
document.getElementById("texto").value.trim();

if (!titulo||!fecha||!texto){
    alert("Por favor completa todos los campos antes de guardar, bonita.");
    return;
}

const entrada = { titulo, fecha, texto};
let diario = JSON.parse(localStorage.getltem("diarioPau"))||[];
diario.push(entrada);
localStorage.setItem("diarioPau",JSON,stringify(diario));

document.getElementById("titulo").value = "";
document.getElementById("fecha").value = "";
document.getElementById("texto").value = "";

mostrarEntradas();
}

function mostrarEntradas(){
    const contenedor = document.getElementById("entradas");
    contenedor.innerHTML ="";

    const diario =
JSON.parse(localStorage.getItem("diarioPAu"))||[];
diario.reverse().forEach((entrada,index)=>{
    const card=
    <div class="w3-card w3-round-large w3-padding w3-margin-bottom entrada">
        <h4 class="w3-text-indigo">${entrada.titulo}</h4>
        <p class="w3-small w3-text-grey">${entrada.fecha}</p>
        <p>${entrada.texto}</p>
        <button class="w3-button w3-round-large w3-small boton-eliminar" onclick="eliminarEntrada(${diario.length-1-index})">Eliminar</button>
    </div>
    ;
    contenedor.innerHTML += card;
});
}

function eliminarEntrada(indice){
    let diario = JSON.parse(localStorage.getItem("diarioPau"))||[];
    diario.splice(indice,1);
    localStorage.setItem("diarioPau",JSON.stringify(diario));
    mostrarEntradas();
}