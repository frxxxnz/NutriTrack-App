// --- Índice global de búsqueda ---
const SEARCH_INDEX = [
  { texto: "Registrar comida", keywords: ["comida", "alimento", "registro", "frutas", "verduras", "diario", "nutrición", "proteínas", "dulces"], url: "registro_alimentos.html" },
  { texto: "Metas nutricionales", keywords: ["metas", "objetivos", "progreso"], url: "nutritional-goals.html" },
  { texto: "Prácticas saludables", keywords: ["agua", "frutas", "ejercicio", "meditación", "hábitos"], url: "practicas_saludables.html" },
  { texto: "Reportes y análisis", keywords: ["reportes", "estadísticas", "gráfico", "análisis"], url: "regitro-y-analisis.html" },
  { texto: "Aprender vida saludable", keywords: ["recetas", "articulos", "aprender", "consejos"], url: "aprender-vida-saludable.html" },
  { texto: "Foro comunidad", keywords: ["foro", "comunidad", "debate", "temas"], url: "foro-comunidad.html" },
  { texto: "Perfil de usuario", keywords: ["perfil", "cuenta", "ajustes", "eliminar"], url: "account-settings.html" }
];

// --- Renderizar sugerencias ---
function mostrarSugerencias(resultados, input) {
  let lista = document.getElementById("search-suggestions");
  if (!lista) {
    lista = document.createElement("ul");
    lista.id = "search-suggestions";
    lista.className = "search-suggestions";
    input.parentNode.appendChild(lista);
  }
  lista.innerHTML = "";

  if (resultados.length === 0) {
    lista.innerHTML = `<li class="no-result">Sin resultados</li>`;
    return;
  }

  resultados.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r.texto;
    li.dataset.url = r.url;   // 👉 ahora sí existe dataset.url
    li.addEventListener("click", () => {
      window.location.href = r.url;
    });
    lista.appendChild(li);
  });
}

// --- Lógica de búsqueda ---
function ejecutarBusqueda(query, input) {
  if (!query) {
    mostrarSugerencias([], input);
    return;
  }
  const resultados = SEARCH_INDEX.filter(item =>
    item.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
  );
  mostrarSugerencias(resultados, input);
}

// --- Inicializar búsqueda global (se llama desde header-loader.js) ---
function inicializarBusquedaGlobal() {
  const input = document.querySelector(".search-input-header");
  if (!input) return;

  input.addEventListener("keyup", e => {
    ejecutarBusqueda(e.target.value.trim(), input);
    if (e.key === "Enter") {
      const lista = document.getElementById("search-suggestions");
      if (lista && lista.firstChild && lista.firstChild.dataset?.url) {
        window.location.href = lista.firstChild.dataset.url;
      }
    }
  });

  // Cerrar sugerencias al hacer clic fuera
  document.addEventListener("click", e => {
    if (!input.contains(e.target)) {
      const lista = document.getElementById("search-suggestions");
      if (lista) lista.remove();
    }
  });
}