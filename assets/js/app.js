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
let COLORS = {};

// Generar colores dinámicamente basados en las federaciones en los datos
function generarColoresFederaciones(tianguis) {
    const federaciones = [...new Set(tianguis
        .map(t => t.federacion)
        .filter(f => f && f.trim() !== '')
    )].sort();

    const coloresBase = [
        '#FF6B6B', '#4ECDC4', '#FFD166', '#95E1D3',
        '#A8DADC', '#FFA8B6', '#B8E986', '#F38181',
        '#AA96DA', '#FCBAD3', '#FFFFD2'
    ];

    const colores = {};
    federaciones.forEach((fed, i) => {
        colores[fed] = coloresBase[i % coloresBase.length];
    });
    colores['default'] = '#B8B8B8';

    return colores;
}

// ========== FUNCIONES PRINCIPALES ==========

// Cargar datos del JSON
async function cargarDatos() {
    try {
        console.log('📥 Cargando datos...');
        const response = await fetch('data/tianguis.json');
        const data = await response.json();
        allTianguis = data.tianguis || [];

        // Generar colores dinámicamente basados en las federaciones
        COLORS = generarColoresFederaciones(allTianguis);

        console.log(`✅ ${allTianguis.length} tianguis cargados`);

        // Verificar cuántos tienen coordenadas
        const conCoords = allTianguis.filter(t => t.coordenadas_poligono && t.coordenadas_poligono.length > 0);
        console.log(`📍 ${conCoords.length} tianguis con coordenadas:`, conCoords.map(t => t.nombre));

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

    console.log(`🔍 Renderizando ${tianguis.length} tianguis...`);
    let renderizados = 0;
    const bounds = [];

    tianguis.forEach(t => {
        // Solo renderizar si tiene coordenadas
        if (!t.coordenadas_poligono || t.coordenadas_poligono.length === 0) {
            return; // Saltar tianguis sin coordenadas
        }

        console.log(`✅ Renderizando: ${t.nombre}`, t.coordenadas_poligono);
        renderizados++;

        // Obtener color según federación
        const color = COLORS[t.federacion] || COLORS.default;

        // Crear polígono
        const polygon = L.polygon(t.coordenadas_poligono, {
            color: color,
            fillColor: color,
            fillOpacity: 0.5,
            weight: 2
        });

        // Guardar bounds para centrar el mapa
        bounds.push(...t.coordenadas_poligono);

        // Crear contenido del popup
        const popupContent = crearPopupContent(t, color);

        // Agregar popup y añadir al mapa
        polygon.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'tianguis-popup'
        });

        polygon.addTo(polygonsLayer);
    });

    console.log(`📊 Total renderizados: ${renderizados} de ${tianguis.length}`);

    // Centrar mapa en los tianguis renderizados
    if (bounds.length > 0) {
        const latLngs = bounds.map(coord => [coord[1], coord[0]]); // Convertir [lng, lat] a [lat, lng]
        map.fitBounds(latLngs, { padding: [50, 50] });
        console.log('🗺️ Mapa centrado en tianguis con coordenadas');
    }
}

// Crear contenido del popup
function crearPopupContent(tianguis, color) {
    const diasHTML = Array.isArray(tianguis.dias)
        ? tianguis.dias.map(d => `<span class="dia-tag">${d}</span>`).join('')
        : `<span class="dia-tag">${tianguis.dias || 'No especificado'}</span>`;

    // Manejar tipo como array
    const tipoHTML = Array.isArray(tianguis.tipo)
        ? tianguis.tipo.join(', ')
        : (tianguis.tipo || 'No especificado');

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
                
                ${tianguis.colonia ? `
                <div class="info-item">
                    <strong>�️ Colonia:</strong>
                    <p>${tianguis.colonia}</p>
                </div>
                ` : ''}
                
                <div class="info-item">
                    <strong>📍 Delegación:</strong>
                    <p>${tianguis.delegacion}</p>
                </div>
                
                ${tianguis.federacion ? `
                <div class="info-item">
                    <strong>�🏛️ Federación:</strong>
                    <p style="color:${color}; font-weight:bold;">${tianguis.federacion}</p>
                </div>
                ` : ''}
                
                ${tianguis.union_independiente ? `
                <div class="info-item">
                    <strong>🤝 Unión:</strong>
                    <p>${tianguis.union_independiente}</p>
                </div>
                ` : ''}
                
                <div class="info-item">
                    <strong>� Días:</strong>
                    <div class="dias-container">${diasHTML}</div>
                </div>
                
                <div class="info-item">
                    <strong>🕐 Horario:</strong>
                    <p>${tianguis.horario || 'No especificado'}</p>
                </div>
                
                <div class="info-item">
                    <strong>🌅 Tipo:</strong>
                    <p>${tipoHTML}</p>
                </div>
                
                ${tianguis.contacto_nombre ? `
                <div class="info-item">
                    <strong>👤 Contacto:</strong>
                    <p>${tianguis.contacto_nombre}</p>
                    ${tianguis.contacto_telefono ? `<p>📞 ${tianguis.contacto_telefono}</p>` : ''}
                </div>
                ` : ''}
                
                ${tianguis.antiguedad ? `
                <div class="info-item">
                    <strong>📅 Antigüedad:</strong>
                    <p>${tianguis.antiguedad} años</p>
                </div>
                ` : ''}
                
                ${tianguis.agremiados && tianguis.agremiados > 0 ? `
                <div class="info-item">
                    <strong>👥 Agremiados:</strong>
                    <p>${tianguis.agremiados}</p>
                </div>
                ` : ''}
                
                ${tianguis.notas ? `
                <div class="info-item">
                    <strong>📝 Notas:</strong>
                    <p>${tianguis.notas}</p>
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

// ========== GEOLOCALIZACIÓN ==========
let userLocationMarker = null;

function mostrarUbicacionUsuario() {
    const locateBtn = document.getElementById('locate-btn');

    if (!navigator.geolocation) {
        alert('❌ Tu navegador no soporta geolocalización');
        return;
    }

    // Mostrar estado de carga
    locateBtn.textContent = '⏳ Ubicando...';
    locateBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Remover marcador anterior si existe
            if (userLocationMarker) {
                map.removeLayer(userLocationMarker);
            }

            // Crear marcador personalizado
            const userIcon = L.divIcon({
                className: 'user-location-marker',
                html: '<div class="pulse"></div><div class="marker-icon">📍</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            // Agregar marcador
            userLocationMarker = L.marker([latitude, longitude], { icon: userIcon })
                .addTo(map)
                .bindPopup('<strong>📍 Tu ubicación actual</strong>')
                .openPopup();

            // Centrar mapa en la ubicación
            map.setView([latitude, longitude], 15);

            // Restaurar botón
            locateBtn.textContent = '📍 Mi Ubicación';
            locateBtn.disabled = false;
        },
        (error) => {
            let mensaje = '❌ No se pudo obtener tu ubicación';

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    mensaje = '❌ Permiso de ubicación denegado';
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensaje = '❌ Ubicación no disponible';
                    break;
                case error.TIMEOUT:
                    mensaje = '❌ Tiempo de espera agotado';
                    break;
            }

            alert(mensaje);
            locateBtn.textContent = '📍 Mi Ubicación';
            locateBtn.disabled = false;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Iniciar carga de datos
document.addEventListener('DOMContentLoaded', () => {
    cargarDatos();

    // Event listener para botón de geolocalización
    const locateBtn = document.getElementById('locate-btn');
    if (locateBtn) {
        locateBtn.addEventListener('click', mostrarUbicacionUsuario);
    }
});