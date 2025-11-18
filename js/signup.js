document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmacion = document.getElementById('confirmacion').value;
    const actividad = document.getElementById('actividad').value;
    const dieta = document.getElementById('dieta').value;

    if (password !== confirmacion) {
      alert('Las contraseñas no coinciden. Por favor, verifica.');
      return;
    }

    const usuario = {
      nombre,
      email,
      password,
      actividad,
      dieta
    };

    // Obtener cuentas existentes
    const cuentas = JSON.parse(localStorage.getItem('cuentasRegistradas')) || [];

    // Verificar si ya existe una cuenta con ese correo
    const yaExiste = cuentas.some(c => c.email === email);
    if (yaExiste) {
      alert('Ya existe una cuenta registrada con este correo.');
      return;
    }

    // Guardar nueva cuenta
    cuentas.push(usuario);
    localStorage.setItem('cuentasRegistradas', JSON.stringify(cuentas));

    // Iniciar sesión automáticamente
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));

    // Redirigir a página de éxito
    window.location.href = 'registration-success.html';
  });
});