// --- Función para prácticas recientes ---
function cargarPracticasRecientesDashboard() {
  const lista = document.getElementById('dashboard-practices-list');
  if (!lista) return;

  lista.innerHTML = '';

  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActivo'))?.email || 'usuario_demo';
  const todas = JSON.parse(localStorage.getItem(`practicas_${usuarioActual}`)) || [];

  const hoy = new Date().toISOString().split('T')[0];
  const delDia = todas.filter(p => p.fecha === hoy);

  if (delDia.length === 0) {
    lista.innerHTML = `<li style="color: #757575;">No hay prácticas registradas para hoy.</li>`;
    return;
  }

  delDia.forEach(p => {
    const item = document.createElement('li');
    item.textContent = `${p.cumplida ? '✔️' : '🕒'} ${p.texto}`;
    lista.appendChild(item);
  });
}

// --- Inicialización del dashboard ---
document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuario) return;

  // Cargar metas nutricionales
  const metas = JSON.parse(localStorage.getItem('metasNutricionales')) || {};
  const metasUsuario = metas[usuario.email] || [];
  const contenedor = document.getElementById('dashboard-goals-progress');
  if (contenedor) {
    const metasMostrar = metasUsuario.slice(0, 4); // Mostrar máximo 4

    metasMostrar.forEach(meta => {
      const progreso = Math.min(100, ((meta.progreso / meta.valorObjetivo) * 100).toFixed(0));
      const unidad = meta.unidad || '';

      const item = document.createElement('div');
      item.style.marginBottom = '16px';

      item.innerHTML = `
        <div class="progress__row" style="display:flex; justify-content:space-between; font-size:0.9em; margin-bottom:4px;">
          <span>${meta.nombre}</span>
          <span>${progreso}% ${unidad}</span>
        </div>
        <div class="progress">
          <div class="progress__bar" style="width: ${progreso}%"></div>
        </div>
      `;

      contenedor.appendChild(item);
    });
  }

  // Cargar prácticas recientes
  cargarPracticasRecientesDashboard();
});