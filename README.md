# 🗺️ Mapa Interactivo de Tianguis - Querétaro

Mapa web público para visualizar todos los tianguis del municipio de Querétaro.

## 🚀 Características
- Mapa interactivo con polígonos por tianguis
- Colores distintos por federación/uníón
- 4 filtros combinables: Día, Tipo, Delegación, Federación
- Información completa con imágenes
- Totalmente responsive (PC y móvil)
- Sin login, acceso público

## 🎯 Filtros disponibles
1. **📅 Día de la semana** (Lunes a Domingo)
2. **🌅 Tipo** (Matutino, Vespertino, Nocturno, Diurno)
3. **📍 Delegación** 
4. **🏛️ Federación/Unión**

## 🛠️ Tecnologías
- Leaflet.js (mapas)
- HTML/CSS/JavaScript puro
- Netlify (hosting)
- ImgBB (imágenes)
- GitHub (control de versiones)

## 📊 Estructura de datos
Ver `data/tianguis.json` para el formato de datos.

**Total de tianguis:** 102

Cada tianguis incluye:
- **Información básica**: ID, nombre, ubicación, colonia, delegación
- **Organización**: Federación, unión independiente (nombre oficial)
- **Horarios**: Días de operación, horario, tipo (matutino/vespertino/nocturno/diurno)
- **Datos adicionales**: Agremiados, antigüedad, contacto (nombre y teléfono)
- **Ubicación**: Coordenadas de polígono para el mapa (se agregarán progresivamente)
- **Multimedia**: Imágenes (opcional)
- **Notas**: Información adicional relevante (opcional)

### Delegaciones disponibles (7):
- Centro Histórico
- Epigmenio González Flores
- Felipe Carrillo Puerto
- Félix Osores Sotomayor
- Josefa Vergara y Hernández
- Santa Rosa Jáuregui
- Villa Cayetano Rubio

### Federaciones (10):
El sistema genera colores dinámicamente para las federaciones presentes en los datos:
- Alianza de Sectores Populares
- CROC
- FECOPSE
- FEQUC
- FETAQ
- FUCQ
- Independiente
- UCCQ
- UCTEQ
- UTAFAC

## 👥 Contribuir
1. Fork el repositorio
2. Crear rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia
MIT