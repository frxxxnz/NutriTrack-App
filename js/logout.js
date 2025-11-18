document.addEventListener('DOMContentLoaded', () => {
  const btnCerrar = document.getElementById('cerrar-sesion');

  if (btnCerrar) {
    btnCerrar.addEventListener('click', (e) => {
      e.preventDefault(); // Evita redirección inmediata

      // Eliminar sesión activa
      localStorage.removeItem('usuarioActivo');

      // Redirigir al inicio
      window.location.href = '../index.html';
    });
  }
});