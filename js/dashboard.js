document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuario) return;

  const metas = JSON.parse(localStorage.getItem('metasNutricionales')) || {};
  const metasUsuario = metas[usuario.email] || [];
  const contenedor = document.getElementById('dashboard-goals-progress');
  if (!contenedor) return;

  const metasMostrar = metasUsuario.slice(0, 4); // Mostrar máximo 4

  metasMostrar.forEach(meta => {
    const progreso = Math.min(100, ((meta.progreso / meta.valorObjetivo) * 100).toFixed(0));
    const unidad = meta.unidad || '';

    const item = document.createElement('div');
    item.style.marginBottom = '16px'; // Espaciado entre metas

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
});