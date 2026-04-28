function cambiarModo() {
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