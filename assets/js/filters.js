// ========== FUNCIONES DE FILTRADO ==========

// Llenar filtros con datos únicos
function llenarFiltros() {
    if (allTianguis.length === 0) return;

    // Obtener valores únicos
    const delegaciones = [...new Set(allTianguis.map(t => t.delegacion))].sort();

    // Solo federaciones no vacías
    const federaciones = [...new Set(allTianguis
        .map(t => t.federacion)
        .filter(f => f && f.trim() !== '')
    )].sort();

    // Obtener tipos únicos (extraer de arrays)
    const tiposSet = new Set();
    allTianguis.forEach(t => {
        if (Array.isArray(t.tipo)) {
            t.tipo.forEach(tipo => tiposSet.add(tipo));
        } else if (t.tipo) {
            tiposSet.add(t.tipo);
        }
    });
    const tipos = [...tiposSet].sort();

    // Llenar delegaciones
    const delegacionSelect = document.getElementById('filter-delegacion');
    delegaciones.forEach(d => {
        delegacionSelect.innerHTML += `<option value="${d}">${d}</option>`;
    });

    // Llenar federaciones
    const federacionSelect = document.getElementById('filter-federacion');
    federaciones.forEach(f => {
        federacionSelect.innerHTML += `<option value="${f}">${f}</option>`;
    });

    // Llenar tipos
    const tipoSelect = document.getElementById('filter-tipo');
    tipos.forEach(tipo => {
        const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        tipoSelect.innerHTML += `<option value="${tipo}">${tipoCapitalizado}</option>`;
    });
}

// Filtrar tianguis según criterios
function filtrarTianguis() {
    const dia = document.getElementById('filter-dia').value;
    const tipo = document.getElementById('filter-tipo').value;
    const delegacion = document.getElementById('filter-delegacion').value;
    const federacion = document.getElementById('filter-federacion').value;

    const filtrados = allTianguis.filter(t => {
        // Verificar día (puede ser array o string)
        const cumpleDia = !dia || (t.dias && (
            (Array.isArray(t.dias) && t.dias.some(d => d.includes(dia))) ||
            (typeof t.dias === 'string' && t.dias.includes(dia))
        ));

        // Verificar tipo (ahora es array)
        const cumpleTipo = !tipo || (t.tipo && (
            (Array.isArray(t.tipo) && t.tipo.includes(tipo)) ||
            (typeof t.tipo === 'string' && t.tipo.includes(tipo))
        ));

        // Verificar delegación
        const cumpleDelegacion = !delegacion || t.delegacion === delegacion;

        // Verificar federación
        const cumpleFederacion = !federacion || t.federacion === federacion;

        return cumpleDia && cumpleTipo && cumpleDelegacion && cumpleFederacion;
    });

    // Renderizar tianguis filtrados
    renderizarTianguis(filtrados);

    // Actualizar contador
    actualizarContador(filtrados.length);
}

// Crear leyenda de colores
function crearLeyenda() {
    const legendDiv = document.getElementById('legend-items');
    legendDiv.innerHTML = '';

    // Obtener federaciones únicas de los datos (solo no vacías)
    const federacionesEnDatos = [...new Set(allTianguis
        .map(t => t.federacion)
        .filter(f => f && f.trim() !== '')
    )].sort();

    federacionesEnDatos.forEach(federacion => {
        const color = COLORS[federacion] || COLORS.default;
        const item = document.createElement('div');
        item.className = 'legend-item';
        item.innerHTML = `
            <div class="legend-color" style="background-color: ${color};"></div>
            <span>${federacion}</span>
        `;
        legendDiv.appendChild(item);
    });
}

// Reiniciar filtros
function reiniciarFiltros() {
    document.getElementById('filter-dia').value = '';
    document.getElementById('filter-tipo').value = '';
    document.getElementById('filter-delegacion').value = '';
    document.getElementById('filter-federacion').value = '';

    renderizarTianguis(allTianguis);
    actualizarContador(allTianguis.length);
}

// ========== EVENT LISTENERS ==========

document.addEventListener('DOMContentLoaded', () => {
    // Asignar eventos a los filtros
    document.getElementById('filter-dia').addEventListener('change', filtrarTianguis);
    document.getElementById('filter-tipo').addEventListener('change', filtrarTianguis);
    document.getElementById('filter-delegacion').addEventListener('change', filtrarTianguis);
    document.getElementById('filter-federacion').addEventListener('change', filtrarTianguis);

    // Botón de reinicio
    document.getElementById('reset-filters').addEventListener('click', reiniciarFiltros);

    // Tecla ESC para reiniciar filtros
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            reiniciarFiltros();
        }
    });
});