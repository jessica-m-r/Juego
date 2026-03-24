let LI, LS, cantidadIntentos = 0;
let numeroSecreto;
let intentosRestantes = 0;
let intentosUsados = 0;
let juegoTerminado;
let partidasGanadas = 0;
let partidasTotales = 0;

function guardarScore() {
    localStorage.setItem("adivina_score", JSON.stringify({
        ganadas: partidasGanadas,
        totales: partidasTotales,
    }));
}

function cargarScore() {
    const raw = localStorage.getItem("adivina_score");
    return raw ? JSON.parse(raw) : null;
}

window.addEventListener("DOMContentLoaded", () => {
    const scoreGuardado = cargarScore();
    if (scoreGuardado) {
        partidasGanadas = scoreGuardado.ganadas;
        partidasTotales = scoreGuardado.totales;
    }
});

function setUp(limiteI, limiteS, intentos) {
    LI = Number(limiteI);
    LS = Number(limiteS);
    cantidadIntentos = Number(intentos);
}

function rendirse() {
    if (!juegoTerminado) {
        juegoTerminado = true;
        partidasTotales++;
        document.getElementById("mensaje").innerHTML =
            `Te rendiste. El número secreto era <strong>${numeroSecreto}</strong>.`;
        document.getElementById("intentos-display").textContent = "";
        guardarScore();
    }
}

function nuevoJuego() {
    numeroSecreto     = Math.floor((Math.random() * (LS - LI + 1)) + LI);
    intentosRestantes = cantidadIntentos;
    intentosUsados    = 0;
    juegoTerminado    = false;
    partidasTotales++;

    document.getElementById("rango-display").textContent = `Rango: ${LI} – ${LS}`;
    actualizarIntentosDisplay();
    document.getElementById("mensaje").textContent = "";
    document.getElementById("inputNumero").value = "";
    document.getElementById("historial").innerHTML = "";

    guardarScore();
}

function actualizarIntentosDisplay() {
    document.getElementById("intentos-display").textContent =
        `Intentos usados: ${intentosUsados} | Restantes: ${intentosRestantes}`;
}

function adivinar(numero) {
    numero = Number(numero);
    if (juegoTerminado) {
        document.getElementById("mensaje").textContent = "El juego ya terminó. Presiona Jugar para una nueva partida.";
        return;
    }
    if (isNaN(numero) || numero < LI || numero > LS) {
        document.getElementById("mensaje").textContent =
            `Ingresa un número válido entre ${LI} y ${LS}.`;
        return;
    }

    intentosUsados++;
    intentosRestantes--;
    actualizarIntentosDisplay();

    if (numero === numeroSecreto) {
        agregarAlHistorial(numero, "ganador");
        document.getElementById("mensaje").innerHTML =
            `¡Ganaste! El número era <strong>${numeroSecreto}</strong>.`;
        juegoTerminado = true;
        partidasGanadas++;
        guardarScore();
    } else {
        let pista = numero < numeroSecreto ? "El número es Mayor ↑" : "El número es Menor ↓";
        let tipo  = numero < numeroSecreto ? "mayor" : "menor";
        agregarAlHistorial(numero, tipo);

        if (intentosRestantes === 0) {
            document.getElementById("mensaje").innerHTML =
                `Sin intentos. El número era <strong>${numeroSecreto}</strong>.`;
            juegoTerminado = true;
            guardarScore();
        } else {
            document.getElementById("mensaje").textContent = pista;
        }
    }
}

function agregarAlHistorial(numero, tipo) {
    const historial = document.getElementById("historial");
    const chip = document.createElement("span");
    chip.classList.add("intento-chip", `intento-${tipo}`);
    const icono = tipo === "mayor" ? "↑" : tipo === "menor" ? "↓" : "✓";
    chip.textContent = `${numero} ${icono}`;
    historial.appendChild(chip);
}

function score() {
    return { ganadas: partidasGanadas, totales: partidasTotales };
}

function iniciarJuego() {
    const li      = document.getElementById("limiteI").value;
    const ls      = document.getElementById("limiteS").value;
    const intentos = document.getElementById("intentos").value;

    if (!li || !ls || !intentos || Number(li) >= Number(ls) || Number(intentos) < 1) {
        alert("Por favor ingresa valores válidos. El límite inferior debe ser menor al superior y los intentos al menos 1.");
        return;
    }

    setUp(li, ls, intentos);
    nuevoJuego();

    document.getElementById("zona-juego").style.display = "flex";
    document.getElementById("score-display").style.display = "none";
}

function intentarAdivinar() {
    const valor = document.getElementById("inputNumero").value;
    adivinar(valor);
}

function mostrarScore() {
    const s = score();
    const div = document.getElementById("score-display");
    div.innerHTML =
        `<strong>📊 Puntuación</strong><br>
        Partidas ganadas: <strong>${s.ganadas}</strong><br>
        Partidas jugadas: <strong>${s.totales}</strong>`;
    div.style.display = "block";
}

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" && document.getElementById("zona-juego").style.display !== "none") {
        intentarAdivinar();
    }
});