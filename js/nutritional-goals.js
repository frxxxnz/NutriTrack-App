document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuario) {
    window.location.href = 'login.html';
    return;
  }

  const metas = JSON.parse(localStorage.getItem('metasNutricionales')) || {};
  metas[usuario.email] = metas[usuario.email] || [];
  let metasUsuario = metas[usuario.email];
  let metaEditandoIndex = null;
  let metaEliminandoIndex = null;

  const goalsTable = document.querySelector('#goals-table tbody');
  const searchInput = document.getElementById('goal-search');
  const filterButtons = document.querySelectorAll('[data-filter]');
  const btnOpenNew = document.getElementById('btn-open-new');
  const modalEdit = document.getElementById('modal-edit');
  const modalTitle = document.getElementById('modal-title');
  const formEdit = document.getElementById('form-edit');

  const modalConfirmDelete = document.getElementById('modal-confirm-delete');
  const textoConfirmacion = document.getElementById('texto-confirmacion');
  const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');
  const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');

  function renderMetas(filtro = 'all', texto = '') {
    goalsTable.innerHTML = '';
    const filtradas = metasUsuario.filter(meta => {
      const coincideTexto = meta.nombre.toLowerCase().includes(texto.toLowerCase()) ||
                            meta.frecuencia.toLowerCase().includes(texto.toLowerCase());
      const coincideEstado = filtro === 'all' || meta.estado === filtro;
      return coincideTexto && coincideEstado;
    });

    filtradas.forEach((meta, index) => {
      const progreso = Math.min(100, ((meta.progreso / meta.valorObjetivo) * 100).toFixed(0));
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${meta.nombre}</td>
        <td>${meta.frecuencia}</td>
        <td>
          <div class="progress"><div class="progress__bar" style="width:${progreso}%"></div></div>
          <small>${progreso}%</small>
        </td>
        <td class="actions">
          <button class="btn btn-edit btn-sm" onclick="editarMeta(${index})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarMeta(${index})">Eliminar</button>
        </td>
      `;
      goalsTable.appendChild(fila);
    });
  }

  window.editarMeta = index => {
    metaEditandoIndex = index;
    const meta = metasUsuario[index];
    modalTitle.textContent = 'Editar Objetivo de Nutrición';

    formEdit.nombre.value = meta.nombre;
    formEdit.tipo.value = meta.tipo || '';
    formEdit.valorObjetivo.value = meta.valorObjetivo || 1;
    formEdit.unidad.value = meta.unidad || '';
    formEdit.frecuencia.value = meta.frecuencia;
    formEdit.inicio.value = meta.inicio || '';
    formEdit.fin.value = meta.fin || '';
    formEdit.progreso.value = meta.progreso || 0;

    modalEdit.showModal();
  };

  window.eliminarMeta = index => {
    metaEliminandoIndex = index;
    const meta = metasUsuario[index];
    textoConfirmacion.innerHTML = `¿Estás seguro que deseas eliminar el objetivo <strong>${meta.nombre}</strong>? Esta acción no se puede deshacer.`;
    modalConfirmDelete.showModal();
  };

  btnCancelarEliminar.addEventListener('click', () => {
    modalConfirmDelete.close();
    metaEliminandoIndex = null;
  });

  btnConfirmarEliminar.addEventListener('click', () => {
    if (metaEliminandoIndex !== null) {
      metasUsuario.splice(metaEliminandoIndex, 1);
      metas[usuario.email] = metasUsuario;
      localStorage.setItem('metasNutricionales', JSON.stringify(metas));
      metaEliminandoIndex = null;
      modalConfirmDelete.close();
      const filtroActivo = document.querySelector('[data-filter].active')?.getAttribute('data-filter') || 'all';
      renderMetas(filtroActivo, searchInput.value);
    }
  });

  btnOpenNew.addEventListener('click', () => {
    metaEditandoIndex = null;
    modalTitle.textContent = 'Agregar Nuevo Objetivo';
    formEdit.reset();
    modalEdit.showModal();
  });

  formEdit.querySelector('.btn').addEventListener('click', () => {
    modalEdit.close();
    metaEditandoIndex = null;
  });

  formEdit.addEventListener('submit', e => {
    e.preventDefault();

    const nuevaMeta = {
      nombre: formEdit.nombre.value.trim(),
      tipo: formEdit.tipo.value,
      valorObjetivo: parseFloat(formEdit.valorObjetivo.value),
      unidad: formEdit.unidad.value,
      frecuencia: formEdit.frecuencia.value,
      inicio: formEdit.inicio.value,
      fin: formEdit.fin.value,
      progreso: parseFloat(formEdit.progreso.value),
      estado: 'active'
    };

    if (metaEditandoIndex === null) {
      metasUsuario.push(nuevaMeta);
    } else {
      metasUsuario[metaEditandoIndex] = nuevaMeta;
    }

    metas[usuario.email] = metasUsuario;
    localStorage.setItem('metasNutricionales', JSON.stringify(metas));
    modalEdit.close();

    const filtroActivo = document.querySelector('[data-filter].active')?.getAttribute('data-filter') || 'all';
    renderMetas(filtroActivo, searchInput.value);
  });

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filtro = btn.getAttribute('data-filter');
      renderMetas(filtro, searchInput.value);
    });
  });

  searchInput.addEventListener('input', () => {
    const filtroActivo = document.querySelector('[data-filter].active')?.getAttribute('data-filter') || 'all';
    renderMetas(filtroActivo, searchInput.value);
  });

  filterButtons[0].classList.add('active');
  renderMetas();
});