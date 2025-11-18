document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('account-form');
  const btnEliminar = document.getElementById('btn-eliminar-cuenta');

  // Obtener sesión activa
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  const cuentas = JSON.parse(localStorage.getItem('cuentasRegistradas')) || [];

  if (!usuario) {
    // Si no hay sesión activa, redirigir al login
    window.location.href = 'login.html';
    return;
  }

  // Rellenar formulario con datos del usuario activo
  document.getElementById('nombre').value = usuario.nombre || '';
  document.getElementById('email').value = usuario.email || '';
  document.getElementById('password').value = usuario.password || '';
  document.getElementById('confirmacion').value = usuario.password || '';
  document.getElementById('actividad').value = usuario.actividad || '';
  document.getElementById('dieta').value = usuario.dieta || '';
  document.getElementById('unidad').value = usuario.unidad || '';
  document.getElementById('peso').value = usuario.peso || '';
  document.getElementById('estatura').value = usuario.estatura || '';

  // Guardar cambios
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmacion = document.getElementById('confirmacion').value;
    const actividad = document.getElementById('actividad').value;
    const dieta = document.getElementById('dieta').value;
    const unidad = document.getElementById('unidad').value;
    const peso = document.getElementById('peso').value;
    const estatura = document.getElementById('estatura').value;

    if (password !== confirmacion) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    const usuarioActualizado = {
      nombre,
      email,
      password,
      actividad,
      dieta,
      unidad,
      peso,
      estatura
    };

    // Actualizar cuenta en el array de cuentas
    const index = cuentas.findIndex(c => c.email === usuario.email);
    if (index !== -1) {
      cuentas[index] = usuarioActualizado;
      localStorage.setItem('cuentasRegistradas', JSON.stringify(cuentas));
    }

    // Actualizar sesión activa
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActualizado));

    alert('Cambios guardados correctamente.');
    window.location.href = 'dashboard.html';
  });

  // Eliminar cuenta
  btnEliminar.addEventListener('click', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioActivo'));
  const cuentas = JSON.parse(localStorage.getItem('cuentasRegistradas')) || [];

  if (!usuario) {
    alert('No hay sesión activa.');
    return;
  }

  // Filtrar y eliminar la cuenta del array
  const nuevasCuentas = cuentas.filter(c => c.email !== usuario.email);
  localStorage.setItem('cuentasRegistradas', JSON.stringify(nuevasCuentas));

  // Eliminar sesión activa
  localStorage.removeItem('usuarioActivo');

  // Redirigir al inicio
  alert('Tu cuenta ha sido eliminada.');
  window.location.href = '../index.html';
  });
});