# 📝 Guía para Editar tianguis.json

Esta guía te ayudará a agregar, modificar y mantener la información de los tianguis en el archivo `data/tianguis.json`.

---

## 📋 Estructura del Archivo

El archivo `tianguis.json` tiene esta estructura:

```json
{
    "metadata": {
        "fecha_actualizacion": "2026-01-09",
        "total_tianguis": 102,
        "fuente": "plantilla_tianguis.xlsx"
    },
    "tianguis": [
        { /* tianguis 1 */ },
        { /* tianguis 2 */ },
        ...
    ]
}
```

---

## 🏪 Estructura de un Tianguis

Cada tianguis tiene los siguientes campos:

```json
{
    "id": 1,
    "nombre": "Matutino El Marqués -Arquitectos-",
    "ubicacion": "Calle Arquitectos entre Avenida Cimatario y Calle Veterinarios",
    "colonia": "El Marqués",
    "delegacion": "Centro Histórico",
    "union_independiente": "Nombre oficial de la unión (opcional)",
    "federacion": "UCTEQ",
    "dias": ["Martes", "Sábado"],
    "horario": "08:00 a 16:00 hrs.",
    "tipo": ["matutino"],
    "agremiados": 115,
    "contacto_nombre": "Juan Pérez",
    "contacto_telefono": "4421234567",
    "antiguedad": "20",
    "notas": "Información adicional relevante",
    "imagenes": [
        "https://i.ibb.co/abc123/imagen1.jpg",
        "https://i.ibb.co/def456/imagen2.jpg"
    ],
    "coordenadas_poligono": [
        [-100.396, 20.585],
        [-100.394, 20.585],
        [-100.394, 20.583],
        [-100.396, 20.583],
        [-100.396, 20.585]
    ]
}
```

---

## 🗺️ Cómo Agregar Coordenadas de Polígono

### Usar geojson.io (Recomendado)

1. **Ir a [geojson.io](https://geojson.io)**

2. **Buscar la ubicación del tianguis**

3. **Dibujar el polígono:**
   - Haz clic en el ícono de polígono (🔷)
   - Haz clic en el mapa para crear cada vértice
   - Cierra el polígono haciendo clic en el primer punto

4. **Copiar las coordenadas del panel derecho**

5. **Pegar en tianguis.json** en el campo `coordenadas_poligono`

---

## 📸 Cómo Subir Imágenes a ImgBB

1. Ve a [imgbb.com](https://imgbb.com)
2. Sube la imagen
3. Copia la "Direct link"
4. Pégala en el array `imagenes`

---

## ➕ Agregar un Nuevo Tianguis

1. Copia un tianguis existente como plantilla
2. Cambia el ID al siguiente número disponible
3. Actualiza `total_tianguis` en metadata
4. No olvides la coma entre tianguis

---

## ✅ Validar el JSON

```bash
python -m json.tool data/tianguis.json
```

Si no hay errores, el JSON es válido.
