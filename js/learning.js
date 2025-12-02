document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       LOGICA DE FILTRADO Y BÚSQUEDA
       ========================================= */
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.card-learn');
    const container = document.querySelector('.learn-grid');

    // Estado actual
    let currentCategory = 'Todos';
    let currentSearchTerm = '';

    // Crear mensaje de "No hay resultados" dinámicamente
    const noResultsMsg = document.createElement('div');
    noResultsMsg.className = 'no-results-message';
    noResultsMsg.innerHTML = '<p>No se encontraron resultados para tu búsqueda.</p>';
    container.appendChild(noResultsMsg);

    // Función principal de filtrado
    const filterContent = () => {
        let visibleCount = 0;

        cards.forEach(card => {
            // Obtener datos de la tarjeta
            const tagElement = card.querySelector('.learn-tag');
            const titleElement = card.querySelector('h3');
            const descElement = card.querySelector('p');

            const category = tagElement ? tagElement.textContent.trim() : '';
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';
            const description = descElement ? descElement.textContent.toLowerCase() : '';

            // Lógica de coincidencia
            const matchesCategory = (currentCategory === 'Todos') || (category === currentCategory);
            const matchesSearch = title.includes(currentSearchTerm) || description.includes(currentSearchTerm);

            // Mostrar u ocultar
            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                // Pequeña animación de entrada
                card.style.opacity = '1';
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });

        // Mostrar mensaje si no hay nada visible
        noResultsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
    };

    // Evento: Clic en botones de filtro
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Quitar clase active de todos
            filterButtons.forEach(b => b.classList.remove('active'));
            // 2. Agregar clase active al clickeado
            btn.classList.add('active');
            // 3. Actualizar estado y filtrar
            currentCategory = btn.getAttribute('data-category');
            filterContent();
        });
    });

    // Evento: Escribir en el buscador
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase().trim();
        filterContent();
    });


    /* =========================================
       LOGICA DEL MODAL (LEER MÁS)
       ========================================= */
    const modal = document.getElementById('article-modal');
    const openButtons = document.querySelectorAll('.open-modal-btn');
    const closeBtnX = document.getElementById('close-modal-btn');
    const closeBtnAction = document.getElementById('close-modal-action');

    // Elementos internos del modal
    const modalImg = document.getElementById('modal-img-display');
    const modalTag = document.getElementById('modal-tag-display');
    const modalTitle = document.getElementById('modal-title-display');
    const modalContent = document.getElementById('modal-content-display');

    openButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const title = button.getAttribute('data-title');
            const img = button.getAttribute('data-image');
            const tag = button.getAttribute('data-tag');
            const content = button.getAttribute('data-content');

            modalTitle.textContent = title;
            modalImg.src = img;
            modalImg.alt = title;
            modalTag.textContent = tag;
            modalContent.innerHTML = content;

            modal.showModal();
        });
    });

    const closeModal = () => {
        modal.close();
    };

    if(closeBtnX) closeBtnX.addEventListener('click', closeModal);
    if(closeBtnAction) closeBtnAction.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        const dialogDimensions = modal.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            closeModal();
        }
    });
});