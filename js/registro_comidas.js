document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

  const form = document.getElementById('registro-form');
  const tabla = document.getElementById('tabla-comidas');
  const resumen = document.getElementById('resumen-diario');
  const fechaInput = document.getElementById('fecha');
  const buscador = document.getElementById('buscador-comidas');

  const modalEditar = document.getElementById('modal-editar-comida');
  const modalEliminar = document.getElementById('modal-eliminar-comida');
  const textoEliminar = document.getElementById('texto-eliminar');
  const formEditar = document.getElementById('form-editar-comida');
  const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');

  let comidaEditandoIndex = null;
  let comidaEliminandoIndex = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre-alimento').value.trim();
    const categoria = document.getElementById('categoria').value;
    const cantidad = document.getElementById('cantidad').value;
    const unidad = document.getElementById('unidad').value;
    const fecha = fechaInput.value;

    if (!nombre || !categoria || !cantidad || !unidad || !fecha) {
      alert('Completa todos los campos.');
      return;
    }

    const nuevaComida = { nombre, categoria, cantidad, unidad, fecha };
    const comidasPorUsuario = JSON.parse(localStorage.getItem('comidasRegistradas')) || {};
    const comidas = comidasPorUsuario[usuario.email] || [];

    comidas.push(nuevaComida);
    comidasPorUsuario[usuario.email] = comidas;
    localStorage.setItem('comidasRegistradas', JSON.stringify(comidasPorUsuario));

    form.reset();
    cargarComidas();
  });

  function cargarComidas(filtro = '') {
    const fechaSeleccionada = fechaInput.value;
    const comidasPorUsuario = JSON.parse(localStorage.getItem('comidasRegistradas')) || {};
    const todas = comidasPorUsuario[usuario.email] || [];

    const comidasDelDia = todas.filter(c => c.fecha === fechaSeleccionada);
    const comidasFiltradas = filtro.trim()
      ? comidasDelDia.filter(c =>
          c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
          c.categoria.toLowerCase().includes(filtro.toLowerCase())
        )
      : comidasDelDia;

    tabla.innerHTML = '';
    const resumenCategorias = {};

    comidasFiltradas.forEach((comida, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${comida.nombre}</td>
        <td>${comida.categoria}</td>
        <td>${comida.cantidad}</td>
        <td>${comida.unidad}</td>
        <td class="actions">
          <button class="btn btn-edit" onclick="abrirModalEditar(${index})">Editar</button>
          <button class="btn btn-delete" onclick="abrirModalEliminar(${index})">Eliminar</button>
        </td>
      `;
      tabla.appendChild(fila);
      resumenCategorias[comida.categoria] = (resumenCategorias[comida.categoria] || 0) + 1;
    });

    resumen.innerHTML = '';
    const total = comidasFiltradas.length;
    for (const categoria in resumenCategorias) {
      const porcentaje = ((resumenCategorias[categoria] / total) * 100).toFixed(1);
      const item = document.createElement('div');
      item.className = 'resumen-item';
      item.innerHTML = `<span>${categoria}</span><span>${porcentaje}%</span>`;
      resumen.appendChild(item);
    }
  }

  fechaInput.addEventListener('change', () => cargarComidas(buscador.value));
  buscador.addEventListener('input', () => cargarComidas(buscador.value));

  window.abrirModalEditar = (index) => {
    const fecha = fechaInput.value;
    const comidas = JSON.parse(localStorage.getItem('comidasRegistradas'))[usuario.email] || [];
    const comidasDelDia = comidas.filter(c => c.fecha === fecha);
    const comida = comidasDelDia[index];

    comidaEditandoIndex = index;

    document.getElementById('edit-nombre').value = comida.nombre;
    document.getElementById('edit-categoria').value = comida.categoria;
    document.getElementById('edit-cantidad').value = comida.cantidad;
    document.getElementById('edit-unidad').value = comida.unidad;

    modalEditar.style.display = 'flex';
  };

  window.cerrarModalEditar = () => {
    modalEditar.style.display = 'none';
    comidaEditandoIndex = null;
  };

  formEditar.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('edit-nombre').value.trim();
    const categoria = document.getElementById('edit-categoria').value;
    const cantidad = document.getElementById('edit-cantidad').value;
    const unidad = document.getElementById('edit-unidad').value;
    const fecha = fechaInput.value;

    const comidasPorUsuario = JSON.parse(localStorage.getItem('comidasRegistradas')) || {};
    const todas = comidasPorUsuario[usuario.email] || [];

    const comidasDelDia = todas.filter(c => c.fecha === fecha);
    const comidaOriginal = comidasDelDia[comidaEditandoIndex];

    const indexGlobal = todas.findIndex(c =>
      c.nombre === comidaOriginal.nombre &&
      c.categoria === comidaOriginal.categoria &&
      c.cantidad === comidaOriginal.cantidad &&
      c.unidad === comidaOriginal.unidad &&
      c.fecha === comidaOriginal.fecha
    );

    todas[indexGlobal] = { nombre, categoria, cantidad, unidad, fecha };
    comidasPorUsuario[usuario.email] = todas;
    localStorage.setItem('comidasRegistradas', JSON.stringify(comidasPorUsuario));

    cerrarModalEditar();
    cargarComidas(buscador.value);
  });

  window.abrirModalEliminar = (index) => {
    comidaEliminandoIndex = index;
    const fecha = fechaInput.value;
    const comidas = JSON.parse(localStorage.getItem('comidasRegistradas'))[usuario.email] || [];
    const comidasDelDia = comidas.filter(c => c.fecha === fecha);
    const comida = comidasDelDia[index];
    textoEliminar.innerHTML = `¿Estás seguro de que quieres eliminar la comida <strong>${comida.nombre}</strong>? Esta acción no se puede deshacer.`;
    modalEliminar.style.display = 'flex';
  };

  window.cerrarModalEliminar = () => {
    modalEliminar.style.display = 'none';
    comidaEliminandoIndex = null;
  };

  btnConfirmarEliminar.addEventListener('click', () => {
    const fecha = fechaInput.value;
    const comidasPorUsuario = JSON.parse(localStorage.getItem('comidasRegistradas')) || {};
    const todas = comidasPorUsuario[usuario.email] || [];

    const comidasDelDia = todas.filter(c => c.fecha === fecha);
    const comida = comidasDelDia[comidaEliminandoIndex];

    const indexGlobal = todas.findIndex(c =>
      c.nombre === comida.nombre &&
      c.categoria === comida.categoria &&
      c.cantidad === comida.cantidad &&
      c.unidad === comida.unidad &&
      c.fecha === comida.fecha
    );

    if (indexGlobal !== -1) {
      todas.splice(indexGlobal, 1);
      comidasPorUsuario[usuario.email] = todas;
      localStorage.setItem('comidasRegistradas', JSON.stringify(comidasPorUsuario));
    }

    cerrarModalEliminar();
    cargarComidas(buscador.value);
  });

  // Inicialización
  cargarComidas();
});