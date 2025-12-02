/* ======================================================= */
/* Lógica del Foro: Interacción, Comentarios y Datos Base */
/* ======================================================= */

// --- 1. DATOS INICIALES (SEED DATA) ---
const temasIniciales = [
    {
        id: 101,
        title: "Beneficios de una dieta mediterránea para el control del peso",
        desc: "Descubre cómo esta dieta puede ayudarte a mantener un peso saludable.",
        author: "Laura Sánchez",
        date: "01/10/2023",
        isNew: false, // <--- CAMBIO AQUÍ: Ahora es false para que no salga la etiqueta
        comments: [
            { author: "Equipo NutriTrack", isTeam: true, text: "¡Hola Laura! Excelente tema. Desde NutriTrack confirmamos que el alto contenido de grasas saludables (como el aceite de oliva) mejora la saciedad y reduce la ansiedad por comer." }
        ]
    },
    {
        id: 102,
        title: "¿Cómo calcular tus macros para ganar masa muscular?",
        desc: "Aprende a ajustar tus macronutrientes según tus objetivos de entrenamiento.",
        author: "Carlos Méndez",
        date: "02/10/2023",
        isNew: false,
        comments: [
            { author: "Equipo NutriTrack", isTeam: true, text: "Muy importante, Carlos. Recomendamos priorizar entre 1.6g y 2.0g de proteína por kilo de peso corporal para maximizar la síntesis muscular." }
        ]
    },
    // ... (El resto de los temas se mantienen igual con isNew: false) ...
    {
        id: 103,
        title: "Recetas rápidas y saludables para cenas entre semana",
        desc: "Opciones fáciles y nutritivas para terminar el día con energía.",
        author: "Ana Torres",
        date: "03/10/2023",
        isNew: false,
        comments: [
            { author: "Equipo NutriTrack", isTeam: true, text: "¡Gran iniciativa Ana! Una cena ligera con proteínas magras y vegetales ayuda a mejorar la calidad del sueño, vital para la salud." }
        ]
    },
    {
        id: 104,
        title: "Mitos y verdades sobre los suplementos de proteínas",
        desc: "Información basada en evidencia para tomar decisiones informadas.",
        author: "Fernando Ruiz",
        date: "04/10/2023",
        isNew: false,
        comments: [
            { author: "Equipo NutriTrack", isTeam: true, text: "Correcto Fernando. Recuerden que los suplementos son una ayuda, pero la comida real siempre debe ser la base de la nutrición." }
        ]
    },
    {
        id: 105,
        title: "Estrategias efectivas para mantener la motivación",
        desc: "Consejos prácticos para no abandonar tus metas de salud.",
        author: "Isabel Gómez",
        date: "05/10/2023",
        isNew: false,
        comments: [
            { author: "Equipo NutriTrack", isTeam: true, text: "La clave es la consistencia, no la perfección. Establecer micro-metas semanales ayuda mucho a no perder el rumbo." }
        ]
    },
    {
        id: 106,
        title: "Guía completa para principiantes en ayuno intermitente",
        desc: "Conoce los beneficios y cómo empezar de manera segura.",
        author: "Javier Peña",
        date: "06/10/2023",
        isNew: false,
        comments: [
            { author: "Equipo NutriTrack", isTeam: true, text: "Ojo: El ayuno no es para todos. Siempre recomendamos consultar con un especialista antes de iniciar protocolos largos." }
        ]
    },
    {
        id: 107,
        title: "¿Qué comer antes y después de entrenar?",
        desc: "Recomendaciones nutricionales para mejorar tus resultados.",
        author: "Patricia León",
        date: "07/10/2023",
        isNew: false,
        comments: [
            { author: "Equipo NutriTrack", isTeam: true, text: "Tip rápido: Carbohidratos complejos 2 horas antes y carbohidratos simples con proteína 30 min después del entreno funcionan de maravilla." }
        ]
    },
    {
        id: 108,
        title: "El impacto del sueño en el metabolismo",
        desc: "La importancia de dormir bien para alcanzar tus objetivos.",
        author: "Sergio Vargas",
        date: "08/10/2023",
        isNew: false,
        comments: [
            { author: "Equipo NutriTrack", isTeam: true, text: "Crucial, Sergio. Dormir menos de 6 horas aumenta los niveles de cortisol, lo que dificulta muchísimo la pérdida de grasa." }
        ]
    }
];

// --- 2. VARIABLES DOM ---
const modalCrear = document.getElementById('modal-nuevo-tema');
const modalAdmin = document.getElementById('modal-administrar');
const modalDetalle = document.getElementById('modal-detalle');
const formCrear = document.getElementById('forum-form');
const formComentario = document.getElementById('form-comentario');
const gridPrincipal = document.getElementById('grid-container');
const listaAdmin = document.getElementById('user-topics-list');
const detalleContenido = document.getElementById('detalle-contenido');
const listaComentarios = document.getElementById('lista-comentarios');

// Variable para saber qué tema se está viendo actualmente
let temaActualId = null;

// --- 3. GESTIÓN DE DATOS ---
// Intentamos obtener datos del localStorage
let todosLosTemas = JSON.parse(localStorage.getItem('nutriTrackAllTopics'));

// IMPORTANTE: Si ya guardaste datos antes en tu navegador, puede que sigan con "isNew: true".
// Este bloque asegura que si cargas la página y es la primera vez (o borras caché), cargue los nuevos valores.
if (!todosLosTemas || todosLosTemas.length === 0) {
    todosLosTemas = temasIniciales;
    localStorage.setItem('nutriTrackAllTopics', JSON.stringify(todosLosTemas));
} else {
    // OPCIONAL: Forzar actualización de los temas iniciales si quieres ver el cambio inmediato sin borrar caché
    // Esto sobrescribe los viejos con los nuevos corregidos, manteniendo los que el usuario haya creado extra.
    // Si prefieres borrar el caché manual, puedes quitar este 'else'.
    
    // todosLosTemas = temasIniciales; // Descomenta esto solo si quieres reiniciar todo a cero
}

const guardarDatos = () => {
    localStorage.setItem('nutriTrackAllTopics', JSON.stringify(todosLosTemas));
};

// --- 4. RENDERIZADO PRINCIPAL ---
const renderMainGrid = () => {
    gridPrincipal.innerHTML = ''; // Limpiar grid

    todosLosTemas.forEach(tema => {
        const div = document.createElement('div');
        div.className = 'card forum-topic';
        div.onclick = () => abrirDetalleTema(tema.id);

        // Aquí está la lógica: solo muestra el span si tema.isNew es true
        div.innerHTML = `
            ${tema.isNew ? '<span class="badge badge-new">Nuevo</span>' : ''}
            <h3>${tema.title}</h3>
            <p>${tema.desc}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:10px;">
                <small>Por: ${tema.author} · ${tema.date}</small>
                <small style="color:var(--color-principal); font-weight:bold;">💬 ${tema.comments ? tema.comments.length : 0}</small>
            </div>
        `;
        gridPrincipal.appendChild(div); 
    });
};

// --- 5. LÓGICA DE DETALLE Y COMENTARIOS ---

const abrirDetalleTema = (id) => {
    const tema = todosLosTemas.find(t => t.id === id);
    if (!tema) return;

    temaActualId = id;

    detalleContenido.innerHTML = `
        <h2 style="color:var(--color-principal); margin-bottom:10px;">${tema.title}</h2>
        <div style="margin-bottom:15px; font-size:0.9em; color:#666;">
            Publicado por <strong>${tema.author}</strong> el ${tema.date}
        </div>
        <p style="font-size:1.1em; line-height:1.6;">${tema.desc}</p>
    `;

    renderizarComentarios(tema.comments);
    modalDetalle.showModal();
};

const renderizarComentarios = (comentarios) => {
    listaComentarios.innerHTML = '';
    
    if (!comentarios || comentarios.length === 0) {
        listaComentarios.innerHTML = '<p style="color:#999; font-style:italic;">Aún no hay comentarios. ¡Sé el primero!</p>';
        return;
    }

    comentarios.forEach(com => {
        const div = document.createElement('div');
        div.className = 'comment-box';
        
        const icono = com.isTeam ? '✅' : '👤';
        const claseAutor = com.isTeam ? 'comment-author team' : 'comment-author';
        const nombreAutor = com.isTeam ? 'Equipo NutriTrack' : com.author;

        div.innerHTML = `
            <div class="${claseAutor}">
                <span>${icono} ${nombreAutor}</span>
            </div>
            <div class="comment-text">${com.text}</div>
        `;
        listaComentarios.appendChild(div);
    });
};

formComentario.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = document.getElementById('nuevo-comentario-texto').value.trim();
    
    if (texto && temaActualId) {
        const index = todosLosTemas.findIndex(t => t.id === temaActualId);
        
        if (index !== -1) {
            const nuevoComentario = {
                author: "Yo",
                isTeam: false,
                text: texto,
                date: new Date().toLocaleDateString()
            };

            if (!todosLosTemas[index].comments) {
                todosLosTemas[index].comments = [];
            }

            todosLosTemas[index].comments.push(nuevoComentario);
            
            guardarDatos();
            renderizarComentarios(todosLosTemas[index].comments);
            renderMainGrid();
            
            document.getElementById('nuevo-comentario-texto').value = '';
        }
    }
});

// --- 6. LÓGICA DE CREACIÓN Y ADMINISTRACIÓN ---

document.getElementById('btn-open-modal').addEventListener('click', () => modalCrear.showModal());
document.getElementById('btn-cancelar').addEventListener('click', () => {
    modalCrear.close();
    formCrear.reset();
});

// AQUÍ SE CREA EL TEMA NUEVO
formCrear.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();

    if(titulo && descripcion) {
        const nuevoTema = {
            id: Date.now(),
            title: titulo,
            desc: descripcion,
            author: "Yo",
            date: new Date().toLocaleDateString('es-ES'),
            isNew: true, // <--- AQUÍ SE MANTIENE TRUE PARA QUE LOS TUYOS SÍ TENGAN LA ETIQUETA
            comments: []
        };

        todosLosTemas.unshift(nuevoTema);
        guardarDatos();
        renderMainGrid();
        
        formCrear.reset();
        modalCrear.close();
    }
});

const renderAdminList = () => {
    listaAdmin.innerHTML = '';
    const misTemas = todosLosTemas.filter(t => t.author === "Yo");

    if (misTemas.length === 0) {
        listaAdmin.innerHTML = '<p style="text-align:center; color:#999;">No has creado ningún tema aún.</p>';
        return;
    }

    misTemas.forEach(tema => {
        const fila = document.createElement('div');
        fila.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid #eee;';
        
        fila.innerHTML = `
            <div style="padding-right:10px;">
                <strong style="display:block; color:var(--color-texto-principal);">${tema.title}</strong>
                <span style="font-size:0.85em; color:#888;">${tema.date}</span>
            </div>
            <button class="btn-borrar-item" data-id="${tema.id}" style="background-color: #ffebee; color: #c62828; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">
                Eliminar
            </button>
        `;
        listaAdmin.appendChild(fila);
    });

    document.querySelectorAll('.btn-borrar-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = Number(e.target.dataset.id);
            if(confirm("¿Borrar este tema?")) {
                todosLosTemas = todosLosTemas.filter(t => t.id !== id);
                guardarDatos();
                renderAdminList();
                renderMainGrid();
            }
        });
    });
};

document.getElementById('btn-manage-topics').addEventListener('click', () => {
    renderAdminList();
    modalAdmin.showModal();
});
document.getElementById('btn-close-manage').addEventListener('click', () => modalAdmin.close());
document.getElementById('btn-close-detalle').addEventListener('click', () => modalDetalle.close());

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', renderMainGrid);