/* ============================================
   FRONTEND COMPLETO - CRUD JUEGOS
   ============================================ */

// ========== CONFIGURACIÓN ==========
const API_URL = 'https://estudio-vazio-web.onrender.com/api/juegos';

// Variables globales
let juegos = [];
let modoEdicion = false;
let editandoId = null;

// ========== MENSAJES ==========
function mostrarMensaje(texto, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = texto;
    mensajeDiv.className = `mensaje mensaje-${tipo}`;
    mensajeDiv.style.display = 'block';

    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 3000);
}

function mostrarLoading() {
    const tbody = document.getElementById('cuerpoTabla');
    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" class="cargando">Cargando juegos...</td></tr>';
}

// ========== GET ==========
async function obtenerJuegos() {

    const tbody = document.getElementById('cuerpoTabla');
    if (!tbody) return; // 👈 clave

    mostrarLoading();

    try {
        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        juegos = await respuesta.json();
        renderizarTabla();

        mostrarMensaje(`${juegos.length} juegos cargados`, 'exito');

    } catch (error) {
        console.error('Error GET:', error);
        mostrarMensaje('Error de conexión con el servidor', 'error');
    }
}

// ========== POST ==========
async function crearJuego(juego) {
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(juego)
        });

        if (!respuesta.ok) {
            const error = await respuesta.json();
            throw new Error(error.error);
        }

        const nuevoJuego = await respuesta.json();
        juegos.unshift(nuevoJuego);
        renderizarTabla();

        mostrarMensaje(`"${juego.juego}" creado`, 'exito');

    } catch (error) {
        mostrarMensaje(error.message, 'error');
        throw error;
    }
}

// ========== PUT ==========
async function actualizarJuego(id, juego) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(juego)
        });

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}`);
        }

        const actualizado = await respuesta.json();

        const index = juegos.findIndex(j => j._id === id);
        if (index !== -1) {
            juegos[index] = actualizado;
        }

        renderizarTabla();
        mostrarMensaje(`"${juego.juego}" actualizado`, 'exito');

    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

// ========== DELETE ==========
async function eliminarJuego(id, nombre) {
    if (!confirm(`Eliminar "${nombre}"?`)) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}`);
        }

        juegos = juegos.filter(j => j._id !== id);
        renderizarTabla();

        mostrarMensaje(`"${nombre}" eliminado`, 'exito');

    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

// ========== RENDER ==========
function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto || '';
    return div.innerHTML;
}

function renderizarTabla() {
    const tbody = document.getElementById('cuerpoTabla');

    if (juegos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Sin juegos</td></tr>';
        return;
    }

    tbody.innerHTML = juegos.map(j => `
        <tr>
            <td>${escapeHtml(j.juego)}</td>
            <td>${escapeHtml(j.sistema)}</td>
            <td>${escapeHtml(j.emulador)}</td>
            <td>${escapeHtml(j.dispositivo)}</td>
            <td><p class="rendimiento ${j.rendimiento.toLowerCase()}">${escapeHtml(j.rendimiento)}</p></td>
            <td>
                <button onclick="editarJuego('${j._id}')">Editar</button>
                <button onclick="eliminarJuego('${j._id}', '${escapeHtml(j.juego)}')">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// ========== FORM ==========
function editarJuego(id) {
    const j = juegos.find(x => x._id === id);
    if (!j) return;

    modoEdicion = true;
    editandoId = id;

    document.getElementById('juego').value = j.juego;
    document.getElementById('sistema').value = j.sistema;
    document.getElementById('emulador').value = j.emulador;
    document.getElementById('dispositivo').value = j.dispositivo;
    document.getElementById('rendimiento').value = j.rendimiento;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function cancelarEdicion() {
    modoEdicion = false;
    editandoId = null;
    document.getElementById('form').reset();
}

// ========== SUBMIT ==========
async function manejarSubmit(e) {
    e.preventDefault();

    const juego = {
        juego: document.getElementById('juego').value,
        sistema: document.getElementById('sistema').value,
        emulador: document.getElementById('emulador').value,
        dispositivo: document.getElementById('dispositivo').value,
        rendimiento: document.getElementById('rendimiento').value
    };

    if (modoEdicion) {
        await actualizarJuego(editandoId, juego);
        cancelarEdicion();
    } else {
        await crearJuego(juego);
        document.getElementById('form').reset();
    }
}

// ========== EVENTOS ==========
const form = document.getElementById('form');

if (form) {
    form.addEventListener('submit', manejarSubmit);
}

// Global
window.editarJuego = editarJuego;
window.eliminarJuego = eliminarJuego;

// INIT
if (document.getElementById('cuerpoTabla')) {
    obtenerJuegos();
}



// ============== LIKES ===============
const API_LIKES = 'https://estudio-vazio-web.onrender.com/api/likes';

// Cargar likes al iniciar
async function cargarLikes() {
    const res = await fetch(API_LIKES);
    const data = await res.json();

    data.forEach(item => {
        const btn = document.querySelector(`[data-consola="${item.consola}"]`);
        if (btn) {
            btn.nextElementSibling.textContent = item.likes;
        }
    });
}

// Evento click
document.addEventListener('DOMContentLoaded', () => {

    console.log("LIKES LISTOS");

    const botones = document.querySelectorAll('.like-btn');

    console.log("Botones encontrados:", botones.length);

    botones.forEach(btn => {
        btn.addEventListener('click', async () => {

            console.log("CLICK DETECTADO");

            if (btn.disabled) return;
            btn.disabled = true;

            try {
                const consola = btn.dataset.consola;

                const res = await fetch(`https://estudio-vazio-web.onrender.com/api/likes/${consola}`, {
                    method: 'POST'
                });

                const data = await res.json();

                console.log("Respuesta:", data);

                btn.nextElementSibling.textContent = data.likes;

            } catch (error) {
                console.error("Error en like:", error);
            }

            setTimeout(() => {
                btn.disabled = false;
            }, 1000);
        });
    });

    cargarLikes();
});


// ================= FORMULARIO ===================
const formContacto = document.getElementById("formulario");

if (formContacto) {
    formContacto.addEventListener("submit", async (e) => {
        e.preventDefault();

        const juegos = [];
        document.querySelectorAll("#list li").forEach(li => {
            juegos.push(li.textContent);
        });

        const data = {
            nombre: document.getElementById("nombre").value,
            telefono: document.getElementById("telefono").value,
            correo: document.getElementById("correo").value,
            nivel: document.getElementById("nivel").value,
            comentario: document.getElementById("comentario").value,
            experiencia: document.querySelector('input[name="experiencia"]:checked')?.value,
            promo: document.getElementById("promo").checked,
            juegosSugeridos: juegos
        };

        try {
            const res = await fetch("https://estudio-vazio-web.onrender.com/api/contacto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const resultado = await res.json();

            document.getElementById("mensaje").textContent = "Enviado correctamente";

            formContacto.reset();
            document.getElementById("list").innerHTML = "";

        } catch (error) {
            console.error(error);
            document.getElementById("mensaje").textContent = "Error al enviar";
        }
    });
}
