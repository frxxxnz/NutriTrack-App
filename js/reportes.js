const coloresPorCategoria = {
  fruta: "#d45d31ff",          // rojo quemado
  verdura: "#66BB6A",          // verde medio
  proteina: "#A5D6A7",         // verde claro
  carbohidrato: "#ba4ecbff",   // violeta
  dulce: "#FFB74D",            // naranja claro
  lacteo: "#90CAF9",           // azul claro
  grasa: "#FF8A65"             // naranja oscuro
};

document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuario) return;

  document.querySelectorAll('.time-filter .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-filter .btn').forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      generarGraficoPorPeriodo(btn.textContent.trim().toLowerCase(), usuario.email);
    });
  });

  generarGraficoPorPeriodo('mensual', usuario.email); // carga inicial
});

function normalizarCategoria(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function generarGraficoPorPeriodo(periodo, email) {
  const comidasPorUsuario = JSON.parse(localStorage.getItem('comidasRegistradas')) || {};
  const todas = comidasPorUsuario[email] || [];
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

  const filtradas = todas.filter(item => {
    const fecha = new Date(item.fecha);
    return fecha >= desde && fecha <= hoy;
  });

  const conteo = {};
  filtradas.forEach(item => {
    const cat = normalizarCategoria(item.categoria);
    if (!conteo[cat]) conteo[cat] = 0;
    conteo[cat]++;
  });

  const total = Object.values(conteo).reduce((a, b) => a + b, 0);
  const porcentajes = Object.entries(conteo).map(([categoria, cantidad]) => ({
    categoria,
    porcentaje: total ? Math.round((cantidad / total) * 100) : 0
  }));

  renderizarGraficoCircular(porcentajes);
}

function renderizarGraficoCircular(porcentajes) {
  const svg = document.querySelector('.grafico-circular');
  if (!svg) return;

  svg.innerHTML = '';
  const cx = 200, cy = 120, r = 80, strokeWidth = 20;
  let offset = -90;

  porcentajes.forEach(({ categoria, porcentaje }) => {
    const dash = (porcentaje / 100) * (2 * Math.PI * r);
    const gap = (2 * Math.PI * r) - dash;
    const color = coloresPorCategoria[normalizarCategoria(categoria)] || "#ccc";

    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", r);
    circle.setAttribute("fill", "transparent");
    circle.setAttribute("stroke", color);
    circle.setAttribute("stroke-width", strokeWidth);
    circle.setAttribute("stroke-dasharray", `${dash} ${gap}`);
    circle.setAttribute("stroke-dashoffset", "0");
    circle.setAttribute("transform", `rotate(${offset} ${cx} ${cy})`);
    svg.appendChild(circle);

    // Etiqueta de porcentaje sobre el segmento
    const angleRad = (offset + (porcentaje / 100) * 180) * (Math.PI / 180);
    const textX = cx + (r + strokeWidth / 2 + 10) * Math.cos(angleRad);
    const textY = cy + (r + strokeWidth / 2 + 10) * Math.sin(angleRad);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", textX);
    label.setAttribute("y", textY);
    label.setAttribute("fill", "#333");
    label.setAttribute("font-size", "11");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "middle");
    label.textContent = `${porcentaje}%`;
    svg.appendChild(label);

    offset += (porcentaje / 100) * 360;
  });

  // Leyenda dinámica en múltiples filas
  const leyenda = document.createElementNS("http://www.w3.org/2000/svg", "g");
  leyenda.setAttribute("style", "font-size: 10px; fill: #333333;");

  let x = 10;
  let y = 240;
  const itemsPorFila = 4;

  porcentajes.forEach(({ categoria }, i) => {
    const color = coloresPorCategoria[normalizarCategoria(categoria)] || "#ccc";

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", 10);
    rect.setAttribute("height", 10);
    rect.setAttribute("fill", color);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", x + 13);
    text.setAttribute("y", y + 9);
    text.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);

    leyenda.appendChild(rect);
    leyenda.appendChild(text);

    x += 100;
    if ((i + 1) % itemsPorFila === 0) {
      x = 10;
      y += 20;
    }
  });

  svg.appendChild(leyenda);
}

let graficoPracticasReportes = null;

function generarGraficoPracticasEnReportes(periodo = 'mensual') {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuario) return;

  const todas = JSON.parse(localStorage.getItem(`practicas_${usuario.email}`)) || [];
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
    const [a, m, d] = p.fecha.split('-').map(Number);
    const fecha = new Date(a, m - 1, d);
    return fecha >= desde && fecha <= hoy;
  });

  const agrupadas = agruparPorPeriodo(filtradas, periodo);
  const labels = Object.keys(agrupadas);
  const datos = labels.map(label => agrupadas[label]);

  const canvas = document.getElementById('grafico-practicas-reportes');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Destruir gráfico anterior si existe
  if (graficoPracticasReportes) {
    graficoPracticasReportes.destroy();
  }

  // Crear nuevo gráfico
  graficoPracticasReportes = new Chart(ctx, {
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
    const lunes = new Date(hoy);
    const dia = lunes.getDay();
    const offset = dia === 0 ? -6 : 1 - dia;
    lunes.setDate(lunes.getDate() + offset);

    for (let i = 0; i < 7; i++) {
      const fecha = new Date(lunes);
      fecha.setDate(lunes.getDate() + i);
      const claveISO = fecha.toISOString().split('T')[0];
      const etiqueta = fecha.toLocaleDateString('es-PE', { weekday: 'long' });
      claves.push({ clave: claveISO, etiqueta: etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1) });
      grupos[claveISO] = 0;
    }

    practicas.forEach(p => {
      if (!p.cumplida) return;
      const [a, m, d] = p.fecha.split('-').map(Number);
      const fecha = new Date(a, m - 1, d);
      const clave = fecha.toISOString().split('T')[0];
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
      const [a, m, d] = p.fecha.split('-').map(Number);
      const fecha = new Date(a, m - 1, d);
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
      const [a, m, d] = p.fecha.split('-').map(Number);
      const fecha = new Date(a, m - 1, d);
      const mesIndex = fecha.getMonth();
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

function renderizarTablaMetas() {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuario) return;

  const metasPorUsuario = JSON.parse(localStorage.getItem('metasNutricionales')) || {};
  const metas = metasPorUsuario[usuario.email] || [];

  const cuerpoTabla = document.getElementById('tabla-metas-dinamica');
  if (!cuerpoTabla) return;

  cuerpoTabla.innerHTML = ''; // Limpiar contenido previo

  metas.forEach(meta => {
    const fila = document.createElement('tr');

    const celdaNombre = document.createElement('td');
    celdaNombre.textContent = meta.nombre;

    const celdaObjetivo = document.createElement('td');
    celdaObjetivo.textContent = `${meta.valorObjetivo} ${meta.unidad}`;

    const celdaActual = document.createElement('td');
    celdaActual.textContent = `${meta.progreso} ${meta.unidad}`;

    const celdaEstado = document.createElement('td');
    const estadoSpan = document.createElement('span');
    estadoSpan.classList.add('status-badge');

    const progreso = meta.progreso / meta.valorObjetivo;
    if (progreso === 0) {
      estadoSpan.classList.add('status-danger');
      estadoSpan.textContent = 'En inicio';
    } else if (progreso < 1) {
      estadoSpan.classList.add('status-warning');
      estadoSpan.textContent = 'En curso';
    } else {
      estadoSpan.classList.add('status-success');
      estadoSpan.textContent = 'Completado';
    }

    celdaEstado.appendChild(estadoSpan);

    fila.appendChild(celdaNombre);
    fila.appendChild(celdaObjetivo);
    fila.appendChild(celdaActual);
    fila.appendChild(celdaEstado);

    cuerpoTabla.appendChild(fila);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  generarGraficoPracticasEnReportes('mensual');
  renderizarTablaMetas();

  document.querySelectorAll('.time-filter .btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-filter .btn').forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      const periodo = btn.textContent.trim().toLowerCase();
      generarGraficoPracticasEnReportes(periodo);
    });
  });
  document.querySelectorAll('.time-filter-practicas .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.time-filter-practicas .btn').forEach(b => b.classList.remove('btn-primary'));
    btn.classList.add('btn-primary');
    const periodo = btn.textContent.trim().toLowerCase();
    generarGraficoPracticasEnReportes(periodo);
    });
  });
  const btnDescargar = document.getElementById('btn-descargar-pdf');
if (btnDescargar) {
  btnDescargar.addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const container = document.querySelector('.page-container');
    if (!container) return;

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = doc.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= doc.internal.pageSize.getHeight();

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= doc.internal.pageSize.getHeight();
    }

    doc.save('reporte-nutricional.pdf');
  });
}
});