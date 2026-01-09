// ========== CONFIGURACIÓN INICIAL ==========
const map = L.map('map').setView([20.588, -100.389], 12);

// Capa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18
}).addTo(map);

// ========== VARIABLES GLOBALES ==========
let allTianguis = [];
let polygonsLayer = L.layerGroup().addTo(map);

// Colores por federación
const COLORS = {
    'UCTEQ': '#FF6B6B',         // Rojo
    'FENAME': '#4ECDC4',        // Turquesa
    'UNAT': '#FFD166',          // Amarillo
    'FETAM': '#95E1D3',         // Verde agua
    'INDEPENDIENTE': '#A8DADC', // Azul claro
    'SINAFED': '#FFA8B6',       // Rosa
    'default': '#B8B8B8'        // Gris
};

// ========== FUNCIONES PRINCIPALES ==========

// Cargar datos del JSON
async function cargarDatos() {
    try {
        const response = await fetch('data/tianguis.json');
        const data = await response.json();
        allTianguis = data.tianguis;

        console.log(`✅ ${allTianguis.length} tianguis cargados`);
        inicializarAplicacion();
    } catch (error) {
        console.error('❌ Error cargando datos:', error);
        mostrarError();
    }
}

// Inicializar aplicación
function inicializarAplicacion() {
    // Llenar filtros
    llenarFiltros();

    // Mostrar todos los tianguis
    renderizarTianguis(allTianguis);

    // Crear leyenda
    crearLeyenda();

    // Actualizar contador
    actualizarContador(allTianguis.length);
}

// Renderizar tianguis en el mapa
function renderizarTianguis(tianguis) {
    // Limpiar capa anterior
    polygonsLayer.clearLayers();

    tianguis.forEach(t => {
        // Obtener color según federación
        const color = COLORS[t.federacion] || COLORS.default;

        // Crear polígono
        const polygon = L.polygon(t.coordenadas, {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            weight: 2
        });

        // Crear contenido del popup
        const popupContent = crearPopupContent(t, color);

        // Agregar popup y añadir al mapa
        polygon.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'tianguis-popup'
        });

        polygon.addTo(polygonsLayer);
    });
}

// Crear contenido del popup
function crearPopupContent(tianguis, color) {
    const diasHTML = Array.isArray(tianguis.dias)
        ? tianguis.dias.map(d => `<span class="dia-tag">${d}</span>`).join('')
        : `<span class="dia-tag">${tianguis.dias || 'No especificado'}</span>`;

    const imagenesHTML = tianguis.imagenes && tianguis.imagenes.length > 0
        ? `
        <div class="imagenes-section">
            <h4>📸 Imágenes:</h4>
            <div class="carrusel-imagenes">
                ${tianguis.imagenes.map(img => `
                    <img src="${img}" 
                         alt="${tianguis.nombre}" 
                         loading="lazy"
                         onclick="window.open('${img}', '_blank')">
                `).join('')}
            </div>
        </div>
        `
        : '<p>📷 Sin imágenes disponibles</p>';

    return `
        <div class="popup-content">
            <h3>${tianguis.nombre}</h3>
            
            <div class="info-grid">
                <div class="info-item">
                    <strong>📍 Ubicación:</strong>
                    <p>${tianguis.ubicacion || 'No especificada'}</p>
                </div>
                
                <div class="info-item">
                    <strong>🏛️ Federación:</strong>
                    <p style="color:${color}; font-weight:bold;">${tianguis.federacion}</p>
                </div>
                
                <div class="info-item">
                    <strong>📅 Días:</strong>
                    <div class="dias-container">${diasHTML}</div>
                </div>
                
                <div class="info-item">
                    <strong>🕐 Horario:</strong>
                    <p>${tianguis.horario || 'No especificado'}</p>
                </div>
                
                <div class="info-item">
                    <strong>🌅 Tipo:</strong>
                    <p>${tianguis.tipo || 'No especificado'}</p>
                </div>
                
                <div class="info-item">
                    <strong>📍 Delegación:</strong>
                    <p>${tianguis.delegacion}</p>
                </div>
                
                ${tianguis.contacto && tianguis.contacto.nombre ? `
                <div class="info-item">
                    <strong>👤 Contacto:</strong>
                    <p>${tianguis.contacto.nombre}</p>
                    ${tianguis.contacto.telefono ? `<p>📞 ${tianguis.contacto.telefono}</p>` : ''}
                </div>
                ` : ''}
                
                ${tianguis.antiguedad ? `
                <div class="info-item">
                    <strong>📅 Antigüedad:</strong>
                    <p>${tianguis.antiguedad} años</p>
                </div>
                ` : ''}
                
                ${tianguis.agremiados ? `
                <div class="info-item">
                    <strong>👥 Agremiados:</strong>
                    <p>${tianguis.agremiados}</p>
                </div>
                ` : ''}
            </div>
            
            ${imagenesHTML}
        </div>
    `;
}

// Mostrar error si falla la carga
function mostrarError() {
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = `
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); 
                    background:white; padding:30px; border-radius:10px; box-shadow:0 0 20px rgba(0,0,0,0.2);
                    text-align:center; z-index:1000; max-width:400px;">
            <h3 style="color:#e74c3c;">⚠️ Error cargando datos</h3>
            <p>No se pudieron cargar los datos de los tianguis.</p>
            <button onclick="location.reload()" 
                    style="padding:10px 20px; background:#3498db; color:white; 
                           border:none; border-radius:5px; cursor:pointer; margin-top:15px;">
                Reintentar
            </button>
        </div>
    `;
    document.body.appendChild(errorDiv);
}

// Actualizar contador
function actualizarContador(cantidad) {
    document.getElementById('tianguis-count').textContent = cantidad;
}

// Iniciar carga de datos
document.addEventListener('DOMContentLoaded', cargarDatos);