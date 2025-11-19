/* ======================================================= */
/* Lógica del Foro: Separación de Vista y Administración */
/* ======================================================= */

// --- 1. VARIABLES Y SELECCIÓN DOM ---
const modalCrear = document.getElementById('modal-nuevo-tema');
const modalAdmin = document.getElementById('modal-administrar');
const formCrear = document.getElementById('forum-form');
const gridPrincipal = document.querySelector('.forum-grid');
const listaAdmin = document.getElementById('user-topics-list'); // Contenedor dentro del modal

// Botones
const btnAbrirCrear = document.getElementById('btn-open-modal');
const btnAbrirAdmin = document.getElementById('btn-manage-topics'); // El botón gris
const btnCerrarCrear = document.getElementById('btn-cancelar');
const btnCerrarAdmin = document.getElementById('btn-close-manage');

// --- 2. ESTADO (DATOS) ---
let misTemas = JSON.parse(localStorage.getItem('nutriTrackTopics')) || [];

// Guardar en navegador
const guardarDatos = () => {
    localStorage.setItem('nutriTrackTopics', JSON.stringify(misTemas));
};

// --- 3. RENDERIZADO 1: PANTALLA PRINCIPAL (LIMPIA) ---
// Esta función crea las tarjetas visuales SIN botones de eliminar
const renderMainGrid = () => {
    // 1. Borramos solo las tarjetas dinámicas previas para no duplicar
    document.querySelectorAll('.topic-dynamic').forEach(el => el.remove());

    // 2. Dibujamos los temas del usuario (SIN BOTÓN DE BORRAR)
    misTemas.forEach(tema => {
        const htmlTarjeta = `
            <div class="card forum-topic topic-dynamic" style="animation: fadeIn 0.5s ease;">
                <span class="badge badge-new">Nuevo</span>
                <h3>${tema.title}</h3>
                <p>${tema.desc}</p>
                <small>Por: ${tema.author} · ${tema.date}</small>
            </div>
        `;
        // Insertar al principio de la grilla
        gridPrincipal.insertAdjacentHTML('afterbegin', htmlTarjeta);
    });
};


const renderAdminList = () => {
    listaAdmin.innerHTML = ''; // Limpiar lista anterior

    if (misTemas.length === 0) {
        listaAdmin.innerHTML = '<p style="text-align:center; color:#999;">No tienes temas creados.</p>';
        return;
    }

    misTemas.forEach(tema => {
        // Crear fila para la lista
        const fila = document.createElement('div');
        fila.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #eee;';
        
        // HTML interno de la fila: Título a la izquierda, Botón Eliminar a la derecha
        fila.innerHTML = `
            <div style="padding-right:10px;">
                <strong style="display:block; color:var(--color-texto-principal);">${tema.title}</strong>
                <span style="font-size:0.85em; color:#888;">${tema.date}</span>
            </div>
            <button class="btn-borrar-item" data-id="${tema.id}" style="
                background-color: #ffebee; 
                color: #c62828; 
                border: none; 
                padding: 6px 12px; 
                border-radius: 4px; 
                cursor: pointer; 
                font-weight:bold; 
                font-size:0.8em;">
                Eliminar
            </button>
        `;
        
        listaAdmin.appendChild(fila);
    });

    // Activar los botones de eliminar recién creados
    document.querySelectorAll('.btn-borrar-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            eliminarTema(id);
        });
    });
};

// --- 5. LÓGICA DE ELIMINACIÓN ---
const eliminarTema = (id) => {
    if(confirm("¿Estás seguro de eliminar este tema permanentemente?")) {
        // Filtramos: Nos quedamos con todos MENOS el que coincide con el ID
        misTemas = misTemas.filter(tema => tema.id !== id);
        
        guardarDatos();     // Guardar cambios en memoria
        renderAdminList();  // Actualizar la lista del modal (el item desaparece)
        renderMainGrid();   // Actualizar la pantalla de fondo (la tarjeta desaparece)
    }
};

// --- 6. EVENTOS DE INTERACCIÓN ---

// Crear Nuevo Tema
btnAbrirCrear.addEventListener('click', () => modalCrear.showModal());
btnCerrarCrear.addEventListener('click', () => {
    modalCrear.close();
    formCrear.reset();
});

formCrear.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();

    if(titulo && descripcion) {
        const nuevoTema = {
            id: Date.now(), // ID único basado en la hora
            title: titulo,
            desc: descripcion,
            author: "Yo",
            date: new Date().toLocaleDateString('es-ES')
        };

        misTemas.push(nuevoTema); // Agregar al arreglo
        guardarDatos();
        renderMainGrid(); // Dibujar en la pantalla principal
        
        formCrear.reset();
        modalCrear.close();
    }
});

// Administrar Temas
btnAbrirAdmin.addEventListener('click', () => {
    renderAdminList(); // Generar la lista fresca al abrir
    modalAdmin.showModal();
});
btnCerrarAdmin.addEventListener('click', () => modalAdmin.close());

// --- 7. INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', renderMainGrid);