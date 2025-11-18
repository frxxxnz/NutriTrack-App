document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Obtener todas las cuentas registradas
    const cuentas = JSON.parse(localStorage.getItem('cuentasRegistradas')) || [];

    // Buscar coincidencia
    const cuenta = cuentas.find(u => u.email === email && u.password === password);

    if (cuenta) {
      localStorage.setItem('usuarioActivo', JSON.stringify(cuenta));
      window.location.href = 'dashboard.html';
    } else {
      alert('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }
  });
});