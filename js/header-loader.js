document.addEventListener('DOMContentLoaded', () => {
  fetch('../components/header.html')
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML('afterbegin', html);

      // Activar botón de cerrar sesión después de insertar el header
      const btnCerrar = document.getElementById('cerrar-sesion');
      if (btnCerrar) {
        btnCerrar.addEventListener('click', (e) => {
          e.preventDefault();
          localStorage.removeItem('usuarioActivo');
          window.location.href = '../index.html';
        });
      }
    });
});