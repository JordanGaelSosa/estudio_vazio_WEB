/*function cambiarModo() {
    document.body.classList.toggle("oscuro");

    let modo = document.getElementById("modo");

    if (document.body.classList.contains("oscuro")) {
        modo.textContent = "Modo Claro";
        localStorage.setItem("modo", "oscuro"); // guardar
    } else {
        modo.textContent = "Modo Oscuro";
        localStorage.setItem("modo", "claro"); // guardar
    }
}
window.addEventListener("load", () => {
    let modoGuardado = localStorage.getItem("modo");
    let modo = document.getElementById("modo");

    if (modoGuardado === "oscuro") {
        document.body.classList.add("oscuro");
        if (modo) modo.textContent = "Modo Claro";
    } else {
        if (modo) modo.textContent = "Modo Oscuro";
    }
});
*/
let btn = document.getElementById("arriba");
btn.style.display = "none";
window.onscroll = function(){
    btn.style.display = window.scrollY > 200 ? "block" : "none";
}
btn.onclick = function(){
    window.scrollTo({top:0, behavior:"smooth"})
}

let links = document.querySelectorAll("a[href*='instagram']");
links.forEach(function(link) {
    link.addEventListener("click", function(e) {
        if (!confirm("¿Quieres salir del sitio?")) {
            e.preventDefault();
        }
    });
});

function cambiar(img) {
    document.getElementById("principal").src = img.dataset.grande;
    principal.src = img.dataset.grande;
    let nombre = document.getElementById("nombreConsola");

    nombre.textContent = img.dataset.nombre;
    principal.scrollIntoView({behavior: "smooth", block: "center"});
}

let indiceActual = 0;
const tarjetas = document.querySelectorAll('.contenedor .tarjeta');
function mostrarTarjeta(indice) {
    tarjetas.forEach(t => t.classList.remove('activa'));
    if (tarjetas[indice]) {
        tarjetas[indice].classList.add('activa');
    }
}

// Obtener botones
const btnSiguiente = document.getElementById('siguiente');
const btnAnterior = document.getElementById('anterior');
// Validar antes de agregar eventos
if (btnSiguiente) {
    btnSiguiente.addEventListener('click', () => {
        console.log("siguiente");
        indiceActual = (indiceActual + 1) % tarjetas.length;
        mostrarTarjeta(indiceActual);

        // Validar también esta función por si no existe
        if (typeof actualizarVisibles === "function") {
            actualizarVisibles();
        }
    });
}
if (btnAnterior) {
    btnAnterior.addEventListener('click', () => {
        console.log("anterior");
        indiceActual = (indiceActual - 1 + tarjetas.length) % tarjetas.length;
        mostrarTarjeta(indiceActual);
    });
}
// Solo ejecutar el carrusel si hay tarjetas
if (tarjetas.length > 0) {
    setInterval(() => {
        indiceActual = (indiceActual + 1) % tarjetas.length;
        mostrarTarjeta(indiceActual);
    }, 5000);

    mostrarTarjeta(indiceActual);
}

// FORMULARIO
const formulario = document.getElementById("formulario");
if (formulario) {
    formulario.addEventListener("submit", function(e) {
        e.preventDefault();

        let nombre = document.getElementById("nombre")?.value;
        let correo = document.getElementById("correo")?.value;
        let mensaje = document.getElementById("mensaje");

        if (!nombre || !correo) {
            mensaje.textContent = "Todos los campos son obligatorios";
        } else if (!correo.includes("@")) {
            mensaje.textContent = "Correo inválido";
        } else {
            mensaje.textContent = "Formulario enviado correctamente";
        }
    });
}
// LISTA DE TAREAS
function agregar() {
    let tareaInput = document.getElementById("tarea");
    let lista = document.getElementById("list");

    if (!tareaInput || !lista) return;

    let tarea = tareaInput.value;

    let li = document.createElement("li");
    li.textContent = tarea;

    lista.appendChild(li);
}
// CHECKBOXES
const checks = document.querySelectorAll("input[type='checkbox']");
if (checks.length > 0) {
    checks.forEach(c => {
        c.addEventListener("change", () => {
            let total = document.querySelectorAll("input[type='checkbox']:checked").length;
            console.log("Seleccionados: ", total);
        });
    });
}
/*
document.querySelectorAll('.like-btn').forEach(boton => {
    boton.addEventListener('click', function() {
        let contadorSpan = this.nextElementSibling;

        let nuevoContador = parseInt(contadorSpan.textContent) + 1;
        contadorSpan.textContent = nuevoContador;

        let consola = this.dataset.consola;

        localStorage.setItem('like_' + consola, nuevoContador);
    });
});
window.onload = function() {
    document.querySelectorAll('.like-btn').forEach(boton => {
        let consola = boton.dataset.consola;
        let likesGuardados = localStorage.getItem('like_' + consola);

        if (likesGuardados) {
            boton.nextElementSibling.textContent = likesGuardados;
        }
    });
}; */