const PRACTICAS_DISPONIBLES = [
  { id: 'agua', texto: '💧 Beber 2 litros de agua' },
  { id: 'frutas', texto: '🍎 Comer frutas y verduras' },
  { id: 'ejercicio', texto: '🏃 Hacer ejercicio diario' },
  { id: 'dormir', texto: '😴 Dormir 7-8 horas' },
  { id: 'estres', texto: '🧘 Practicar técnicas de relajación' },
  { id: 'aire', texto: '☀️ Pasar tiempo al aire libre' },
  { id: 'lectura', texto: '📖 Leer al menos 15 minutos' },
  { id: 'pantallas', texto: '📵 Evitar pantallas antes de dormir' },
  { id: 'limon', texto: '🍋 Tomar agua con limón en ayunas' },
  { id: 'postura', texto: '🪑 Corregir la postura al sentarse' },
  { id: 'gratitud', texto: '🙏 Practicar gratitud cada mañana' },
  { id: 'respirar', texto: '🌬️ Hacer respiraciones profundas' },
  { id: 'caminar', texto: '🚶 Caminar al menos 30 minutos' },
  { id: 'solar', texto: '🧴 Usar protector solar' },
  { id: 'desayuno', texto: '🥣 Tomar un desayuno nutritivo' }
];

const usuarioActual = JSON.parse(localStorage.getItem('usuarioActivo'))?.email || 'usuario_demo';
let indexReemplazo = null;

document.addEventListener('DOMContentLoaded', () => {
  const fechaInput = document.getElementById('fecha-practica');
  fechaInput.value = new Date().toISOString().split('T')[0];

  renderPracticasGuardadas(fechaInput.value);
  renderOpcionesPracticas();
  generarGraficoTendencias('mensual');

  fechaInput.addEventListener('change', () => {
    renderPracticasGuardadas(fechaInput.value);
  });

  document.getElementById('confirm-practices-btn').addEventListener('click', () => {
    if (indexReemplazo !== null) {
      reemplazarPracticaConfirmada(fechaInput.value);
    } else {
      guardarPracticasSeleccionadas(fechaInput.value);
    }
  });

  document.querySelectorAll('.time-filters .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-filters .btn').forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      const periodo = btn.textContent.trim().toLowerCase();
      generarGraficoTendencias(periodo);
    });
  });
});

function renderPracticasGuardadas(fechaSeleccionada) {
  const contenedor = document.getElementById('practicas-list');
  contenedor.innerHTML = '';

  const todas = JSON.parse(localStorage.getItem(`practicas_${usuarioActual}`)) || [];
  const delDia = todas.filter(p => p.fecha === fechaSeleccionada);

  if (delDia.length === 0) {
    contenedor.innerHTML = `<p class="p_subtle" style="text-align:center;">No hay prácticas registradas para este día.</p>
      <div class="list-item add-action" style="justify-content: center;">
        <a href="#modal-anadir-practica" class="btn btn-primary">Añadir práctica</a>
      </div>`;
    return;
  }

  delDia.forEach((practica, index) => {
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
      <label>
        <input type="checkbox" ${practica.cumplida ? 'checked' : ''} onchange="marcarCumplida(${index}, '${fechaSeleccionada}')">
        ${practica.texto}
      </label>
      <div class="list-item-actions">
        <button class="btn btn-primary" onclick="abrirModalReemplazo(${index}, '${fechaSeleccionada}')">Reemplazar</button>
        <button class="btn btn-delete" onclick="eliminarPractica(${index}, '${fechaSeleccionada}')">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(item);
  });

  const addBtn = document.createElement('div');
  addBtn.className = 'list-item add-action';
  addBtn.style.justifyContent = 'center';
  addBtn.innerHTML = `<a href="#modal-anadir-practica" class="btn btn-primary">Añadir práctica</a>`;
  contenedor.appendChild(addBtn);
}

function renderOpcionesPracticas() {
  const grid = document.getElementById('practices-selection-grid');
  grid.innerHTML = '';

  PRACTICAS_DISPONIBLES.forEach(practica => {
    const card = document.createElement('div');
    card.className = 'card card-selection';
    card.innerHTML = `
      <h4>${practica.texto}</h4>
      <p>Incorporar esta práctica a tu rutina diaria.</p>
      <input type="checkbox" id="${practica.id}" />
      <label for="${practica.id}">Seleccionar</label>
    `;
    grid.appendChild(card);
  });
}

function guardarPracticasSeleccionadas(fecha) {
  const seleccionadas = PRACTICAS_DISPONIBLES.filter(p => {
    const checkbox = document.getElementById(p.id);
    return checkbox && checkbox.checked;
  }).map(p => ({
    texto: p.texto,
    fecha,
    cumplida: false
  }));

  if (seleccionadas.length === 0) return;

  const todas = JSON.parse(localStorage.getItem(`practicas_${usuarioActual}`)) || [];
  const nuevas = [...todas, ...seleccionadas];

  localStorage.setItem(`practicas_${usuarioActual}`, JSON.stringify(nuevas));
  indexReemplazo = null;
  window.location.hash = '';
  renderPracticasGuardadas(fecha);
  generarGraficoTendencias('mensual');
}

function marcarCumplida(indexDia, fecha) {
  const todas = JSON.parse(localStorage.getItem(`practicas_${usuarioActual}`)) || [];
  const delDia = todas.filter(p => p.fecha === fecha);
  const practica = delDia[indexDia];

  const indexGlobal = todas.findIndex(p =>
    p.fecha === practica.fecha && p.texto === practica.texto
  );

  if (indexGlobal !== -1) {
    todas[indexGlobal].cumplida = !todas[indexGlobal].cumplida;
    localStorage.setItem(`practicas_${usuarioActual}`, JSON.stringify(todas));
    generarGraficoTendencias('mensual');
  }
}

function eliminarPractica(indexDia, fecha) {
  const todas = JSON.parse(localStorage.getItem(`practicas_${usuarioActual}`)) || [];
  const delDia = todas.filter(p => p.fecha === fecha);
  const practica = delDia[indexDia];

  const indexGlobal = todas.findIndex(p =>
    p.fecha === practica.fecha && p.texto === practica.texto
  );

  if (indexGlobal !== -1) {
    todas.splice(indexGlobal, 1);
    localStorage.setItem(`practicas_${usuarioActual}`, JSON.stringify(todas));
    renderPracticasGuardadas(fecha);
    generarGraficoTendencias('mensual');
  }
}

function abrirModalReemplazo(indexDia, fecha) {
  indexReemplazo = { indexDia, fecha };
  window.location.hash = '#modal-anadir-practica';

  PRACTICAS_DISPONIBLES.forEach(p => {
    const checkbox = document.getElementById(p.id);
    if (checkbox) checkbox.checked = false;
  });
}

function reemplazarPracticaConfirmada(fecha) {
  const seleccionadas = PRACTICAS_DISPONIBLES.filter(p => {
    const checkbox = document.getElementById(p.id);
    return checkbox && checkbox.checked;
  }).map(p => p.texto);

  if (seleccionadas.length === 0 || indexReemplazo === null) return;

  const todas = JSON.parse(localStorage.getItem(`practicas_${usuarioActual}`)) || [];
  const delDia = todas.filter(p => p.fecha === fecha);
  const original = delDia[indexReemplazo.indexDia];

  const indexGlobal = todas.findIndex(p =>
    p.fecha === original.fecha && p.texto === original.texto
  );

  if (indexGlobal !== -1) {
    todas[indexGlobal].texto = seleccionadas[0];
    todas[indexGlobal].cumplida = false;
    localStorage.setItem(`practicas_${usuarioActual}`, JSON.stringify(todas));
    indexReemplazo = null;
    window.location.hash = '';
    renderPracticasGuardadas(fecha);
    generarGraficoTendencias('mensual');
  }
}

// 📈 Gráfico de tendencias
let graficoTendencias = null;

function generarGraficoTendencias(periodo) {
  const todas = JSON.parse(localStorage.getItem(`practicas_${usuarioActual}`)) || [];
  const hoy = new Date();
  let desde;

  if (periodo === 'semanal') {
    desde = new Date(hoy);
    desde.setDate(hoy.getDate() - 7);
  } else if (periodo === 'mensual') {
    desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  } else if (periodo === 'anual') {
    desde = new Date(hoy.getFullYear(), 0, 1);
  }

  const filtradas = todas.filter(p => {
    const fecha = new Date(p.fecha);
    return fecha >= desde && fecha <= hoy;
  });

  const agrupadas = agruparPorPeriodo(filtradas, periodo);
  const labels = Object.keys(agrupadas);
  const datos = labels.map(label => agrupadas[label]);

  const ctx = document.getElementById('grafico-tendencias-practicas').getContext('2d');
  if (graficoTendencias) graficoTendencias.destroy();

  graficoTendencias = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Prácticas completadas',
        data: datos,
        borderColor: '#4CAF50',
        backgroundColor: '#A5D6A7',
        fill: false,
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: '#4CAF50'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Tendencia de Prácticas Saludables - ${periodo.charAt(0).toUpperCase() + periodo.slice(1)}`
        },
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Prácticas cumplidas'
          }
        }
      }
    }
  });
}

function agruparPorPeriodo(practicas, periodo) {
  const hoy = new Date();
  const grupos = {};
  let claves = [];

  if (periodo === 'semanal') {
    // Obtener lunes de esta semana
    const lunes = new Date(hoy);
    const dia = lunes.getDay();
    const offset = dia === 0 ? -6 : 1 - dia;
    lunes.setDate(lunes.getDate() + offset);

    // Generar claves ISO y etiquetas para lunes a domingo
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      const claveISO = fecha.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const etiqueta = fecha.toLocaleDateString('es-PE', { weekday: 'long' });
      claves.push({ clave: claveISO, etiqueta: etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1) });
      grupos[claveISO] = 0;
    }

    // Contar prácticas cumplidas por fecha exacta
    practicas.forEach(p => {
      if (!p.cumplida) return;
      const [año, mes, dia] = p.fecha.split('-').map(Number);
      const fechaLocal = new Date(año, mes - 1, dia);
      const clave = fechaLocal.toISOString().split('T')[0];
      if (grupos.hasOwnProperty(clave)) {
        grupos[clave]++;
      }
    });

    return claves.reduce((obj, k) => {
      obj[k.etiqueta] = grupos[k.clave];
      return obj;
    }, {});
  }

  if (periodo === 'mensual') {
    const etiquetas = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
    etiquetas.forEach(k => grupos[k] = 0);

    practicas.forEach(p => {
      if (!p.cumplida) return;
      const [año, mes, dia] = p.fecha.split('-').map(Number);
      const fecha = new Date(año, mes - 1, dia);
      const diaMes = fecha.getDate();
      let semana;
      if (diaMes <= 7) semana = 'Semana 1';
      else if (diaMes <= 14) semana = 'Semana 2';
      else if (diaMes <= 21) semana = 'Semana 3';
      else semana = 'Semana 4';
      grupos[semana]++;
    });

    return etiquetas.reduce((obj, k) => {
      obj[k] = grupos[k];
      return obj;
    }, {});
  }

  if (periodo === 'anual') {
    const etiquetas = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    etiquetas.forEach(k => grupos[k] = 0);

    practicas.forEach(p => {
      if (!p.cumplida) return;
      const [año, mes, dia] = p.fecha.split('-').map(Number);
      const fecha = new Date(año, mes - 1, dia);
      const mesIndex = fecha.getMonth(); // 0–11
      const clave = etiquetas[mesIndex];
      grupos[clave]++;
    });

    return etiquetas.reduce((obj, k) => {
      obj[k] = grupos[k];
      return obj;
    }, {});
  }

  return {};
}