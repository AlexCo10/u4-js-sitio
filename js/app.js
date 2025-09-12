// Constantes
const APP_NOMBRE = 'u4-js-sitio';
const APP_VERSION = '1.0.0';
const ANIO = new Date().getFullYear();

// Variables con let requeridas
let contadorVisitas = Number(localStorage.getItem('u4_totalVisitas') || 0);
let usuarioActivo = { nombre: 'Invitado'};
let esMovil = /Mobi|Android/i.test(navigator.userAgent);

// Clase Util con formatearMoneda
class Util {
  static formatearMoneda(n) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n);
  }
}

// Funciones sumar y multiplicar
function sumar(a, b) { return a + b; }
function multiplicar(a, b) { return a * b; }

// Función evaluarNumero(n) con if/else
function evaluarNumero(n) {
  if (n > 0) return 'positivo';
  else if (n < 0) return 'negativo';
  else return 'cero';
}

// Función obtenerDia(numero) con switch
function obtenerDia(numero) {
  switch (numero) {
    case 0: return 'Domingo';
    case 1: return 'Lunes';
    case 2: return 'Martes';
    case 3: return 'Miércoles';
    case 4: return 'Jueves';
    case 5: return 'Viernes';
    case 6: return 'Sábado';
    default: return 'Inválido';
  }
}

// Mostrar mensaje de bienvenida en #salida con template string
function mostrarBienvenida() {
  const salida = document.getElementById('salida');
  if (!salida) return;
  salida.textContent = `Bienvenido, ${usuarioActivo.nombre}. Móvil: ${esMovil}`;
}

// Botón con contador de visitas y actualización en #totalVisitas (y persistencia)
function actualizarTotalVisitas() {
  const span = document.getElementById('totalVisitas');
  if (span) span.textContent = contadorVisitas;
  localStorage.setItem('u4_totalVisitas', contadorVisitas);
}

function initVisitas() {
  actualizarTotalVisitas();
  const btn = document.getElementById('btnVisita');
  if (btn) {
    btn.addEventListener('click', () => {
      contadorVisitas++;
      actualizarTotalVisitas();
    });
  }
}

// mostrarHora() con reloj en header
function mostrarHora() {
  const reloj = document.getElementById('reloj');
  if (!reloj) return;
  function tick() {
    const now = new Date();
    reloj.textContent = now.toLocaleTimeString();
  }
  tick();
  setInterval(tick, 1000);
}

// Navegación activa usando data-page y clase activo
function navActiva() {
  const links = document.querySelectorAll('nav a[data-page]');
  const path = location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const page = a.dataset.page;
    if (path.includes(page)) a.classList.add('activo');
    else a.classList.remove('activo');
  });
}

// DOM básico: cambio de color con botones (rojo, verde, azul)
function initColorBtns() {
  document.querySelectorAll('.colorBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.dataset.color;
      document.body.classList.remove('color-red', 'color-green', 'color-blue');
      document.body.classList.add(`color-${color}`);
    });
  });
}

// DOM avanzado: lista de notas con validación de input
const notasKey = 'u4_notas';
function cargarNotas() {
  const raw = localStorage.getItem(notasKey);
  return raw ? JSON.parse(raw) : [];
}
function guardarNotas(notas) {
  localStorage.setItem(notasKey, JSON.stringify(notas));
}
function renderNotas() {
  const ul = document.getElementById('notasList');
  if (!ul) return;
  ul.innerHTML = '';
  const notas = cargarNotas();
  notas.forEach((n, idx) => {
    const li = document.createElement('li');
    li.textContent = n;
    const btn = document.createElement('button');
    btn.textContent = 'Eliminar';
    btn.addEventListener('click', () => {
      notas.splice(idx, 1);
      guardarNotas(notas);
      renderNotas();
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });
}
function initNotas() {
  const add = document.getElementById('addNota');
  const input = document.getElementById('notaInput');
  if (add && input) {
    add.addEventListener('click', () => {
      const val = input.value.trim();
      if (val.length < 3) {
        alert('La nota debe tener al menos 3 caracteres');
        return;
      }
      const notas = cargarNotas();
      notas.push(val);
      guardarNotas(notas);
      input.value = '';
      renderNotas();
    });
  }
  renderNotas();
}

// Validación de formulario en contacto.html con mensajes de error y mensaje de éxito
function initContacto() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const nombre = document.getElementById('nombre');
  const email = document.getElementById('email');
  const mensaje = document.getElementById('mensaje');
  const errNombre = document.getElementById('errNombre');
  const errEmail = document.getElementById('errEmail');
  const errMensaje = document.getElementById('errMensaje');
  const success = document.getElementById('successMsg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    errNombre.textContent = '';
    errEmail.textContent = '';
    errMensaje.textContent = '';

    if (!nombre.value || nombre.value.trim().length < 3) { errNombre.textContent = 'Nombre inválido'; ok = false; }
    if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) { errEmail.textContent = 'Email inválido'; ok = false; }
    if (!mensaje.value || mensaje.value.trim().length < 5) { errMensaje.textContent = 'Mensaje muy corto'; ok = false; }

    if (!ok) return;
    success.style.display = 'block';
    setTimeout(() => { success.style.display = 'none'; form.reset(); }, 2000);
  });
}

// Buscador en servicios.html con coincidencias en tiempo real
function initBuscador() {
  const input = document.getElementById('searchServicios');
  const lista = document.getElementById('listaServicios');
  if (!input || !lista) return;
  input.addEventListener('input', () => {
    const term = input.value.toLowerCase();
    [...lista.children].forEach(li => {
      const show = li.textContent.toLowerCase().includes(term);
      li.style.display = show ? '' : 'none';
    });
  });
}

// Renderizar perfil en acerca.html usando template string
function renderPerfil() {
  const cont = document.getElementById('perfil');
  if (!cont) return;
  const template = `
    <h2>${usuarioActivo.nombre}</h2>
    <p>Dispositivo: ${esMovil ? 'Móvil' : 'Escritorio'}</p>
    <p>Ejemplo de moneda: ${Util.formatearMoneda(123456)}</p>
  `;
  cont.innerHTML = template;
}

// Demo operaciones para mostrar en pantalla
function demoOperaciones() {
  const resSum = document.getElementById('resSum');
  const resMul = document.getElementById('resMul');
  if (resSum) resSum.textContent = sumar(0, 0);
  if (resMul) resMul.textContent = multiplicar(0, 0);
}

// Inicialización
function init() {
  mostrarBienvenida();
  initVisitas();
  mostrarHora();
  navActiva();
  initColorBtns();
  initNotas();
  initContacto();
  initBuscador();
  renderPerfil();
  demoOperaciones();
}

// Ejecutar cuando DOM listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else init();

// Export para pruebas si se requiere
window.__APP = { sumar, multiplicar, evaluarNumero, obtenerDia, Util };

// Acciones de botones
document.addEventListener("DOMContentLoaded", () => {
  const btnSumar = document.getElementById("btnSumar");
  const btnMultiplicar = document.getElementById("btnMultiplicar");

  btnSumar.addEventListener("click", () => {
    const n1 = parseFloat(document.getElementById("num1").value) || 0;
    const n2 = parseFloat(document.getElementById("num2").value) || 0;
    document.getElementById("resSum").textContent = sumar(n1, n2);
  });

  btnMultiplicar.addEventListener("click", () => {
    const n1 = parseFloat(document.getElementById("num1").value) || 0;
    const n2 = parseFloat(document.getElementById("num2").value) || 0;
    document.getElementById("resMul").textContent = multiplicar(n1, n2);
  });
});
