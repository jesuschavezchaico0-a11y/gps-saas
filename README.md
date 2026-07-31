# GPS SaaS Platform - Sistema de Monitoreo y Seguimiento GPS

Plataforma profesional de monitoreo GPS con dashboard completo, seguimiento en tiempo real, gestión de cercos geográficos, reportes detallados y reconstrucción de viajes.

## 🚀 Características Principales

### Dashboard Completo
- **KPIs en Tiempo Real**: Total de vehículos, vehículos en movimiento, alertas activas, excesos de velocidad
- **Gráficos Interactivos**: Horas trabajadas por vehículo y distancia recorrida
- **Alertas Recientes**: Notificaciones de eventos críticos y no críticos

### Mapa en Tiempo Real
- Visualización de todos los vehículos en un mapa interactivo (Leaflet + OpenStreetMap)
- Marcadores de estado (en movimiento, detenido, inactivo)
- Lista de vehículos con búsqueda
- Cercos geográficos visualizados en el mapa

### Gestión de Vehículos
- Listado completo de vehículos con información detallada
- Estado actual, velocidad, ubicación y última actualización
- Tarjetas informativas con diseño accesible

### Cercos Geográficos (Geofences)
- Creación, edición y configuración de cercos
- Tipos: Circular y Polígono
- Configuración de límite de velocidad por cerco
- Información completa: nombre, descripción, radio, coordenadas
- Selección de ubicación directamente en el mapa

### Reportes y Análisis
- **Tipos de Reporte**:
  - Horas Trabajadas
  - Excesos de Velocidad
  - Distancia Recorrida
  - Paradas y Detenciones
- Filtros por vehículo, fecha inicio y fecha fin
- Exportación a CSV
- Impresión de reportes
- Tablas resumen con métricas clave

### Reconstrucción de Viajes
- Visualización histórica de rutas
- Timeline detallado con eventos del viaje
- Mapa de reconstrucción con polyline de ruta
- Información de velocidad y ubicación por punto
- Marcadores de inicio y fin de viaje

## 🔐 Autenticación

El sistema incluye pantalla de login con validación básica:
- **Usuario demo**: `admin`
- **Contraseña demo**: `admin123`

> ⚠️ **Nota**: En producción, esto debe conectarse a un backend seguro con autenticación real.

## ♿ Accesibilidad

La plataforma cumple con estándares WCAG 2.1:
- Navegación completa por teclado
- Atributos ARIA en todos los componentes interactivos
- Contraste de colores adecuado (ratio 4.5:1 mínimo)
- Soporte para lectores de pantalla
- Estados de foco visibles
- Soporte para modo oscuro automático
- Respeto a preferencias de movimiento reducido

## 📱 Diseño Responsivo

- Sidebar colapsable en móviles
- Menú hamburguesa para pantallas pequeñas
- Grids adaptables a diferentes tamaños
- Paneles de vehículos optimizados para táctil

## 🛠️ Tecnologías Utilizadas

- **HTML5** semántico y accesible
- **CSS3** con variables CSS y soporte para modo oscuro
- **JavaScript** vanilla (sin frameworks)
- **Leaflet.js** para mapas interactivos
- **Chart.js** para gráficos
- **OpenStreetMap** como proveedor de mapas

## 📁 Estructura del Proyecto

```
/workspace
├── mobile/
│   └── app.html              # App móvil (botones accesibles)
├── platform/
│   ├── index.html            # Login
│   ├── dashboard.html        # Dashboard principal
│   ├── css/
│   │   └── dashboard.css     # Estilos completos
│   ├── js/
│   │   └── dashboard.js      # Lógica de la aplicación
│   └── assets/               # Recursos adicionales
└── README.md                 # Este archivo
```

## 🌐 Publicación Gratuita con GitHub Pages

### Paso 1: Subir a GitHub

```bash
cd /workspace
git add .
git commit -m "Initial commit: GPS SaaS Platform"
git push origin main
```

### Paso 2: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Pages**
3. En **Source**, selecciona:
   - Branch: `main`
   - Folder: `/ (root)`
4. Click en **Save**

### Paso 3: Acceder a la Plataforma

Tu plataforma estará disponible en:
```
https://[tu-usuario].github.io/[nombre-repositorio]/platform/
```

**URLs principales:**
- Login: `.../platform/index.html`
- Dashboard: `.../platform/dashboard.html`
- App Móvil: `.../mobile/app.html`

## 📊 Google Analytics (Opcional)

Para agregar seguimiento:

1. Crea una propiedad en Google Analytics 4
2. Obtén tu ID de medición (ej: `G-XXXXXXXXXX`)
3. Descomenta y reemplaza en ambos archivos HTML:
   - `platform/index.html`
   - `platform/dashboard.html`

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔧 Personalización

### Colores

Edita las variables CSS en `platform/css/dashboard.css`:

```css
:root {
    --primary: #2563eb;        /* Color principal */
    --success: #10b981;        /* Éxito/En movimiento */
    --danger: #ef4444;         /* Error/Detenido */
    --warning: #f59e0b;        /* Advertencia/Inactivo */
}
```

### Datos Simulados

Los datos actuales son simulados en `platform/js/dashboard.js`. Para producción:

1. Reemplaza `mockData` con llamadas a tu API
2. Implementa WebSocket para actualizaciones en tiempo real
3. Conecta la autenticación a tu backend

## 🎯 Funcionalidades Clave Implementadas

| Funcionalidad | Estado | Descripción |
|--------------|--------|-------------|
| Login | ✅ | Autenticación básica con localStorage |
| Dashboard KPIs | ✅ | 4 tarjetas con métricas en tiempo real |
| Gráficos | ✅ | Chart.js con horas y distancia |
| Mapa en Vivo | ✅ | Leaflet con marcadores de vehículos |
| Lista de Vehículos | ✅ | Panel lateral con búsqueda |
| Gestión de Cercos | ✅ | CRUD completo con modal |
| Límite de Velocidad en Cercos | ✅ | Configuración por cerco |
| Click en Cerco | ✅ | Muestra info: nombre, descripción, límite |
| Reportes | ✅ | 4 tipos con filtros y exportación |
| Horas Trabajadas | ✅ | Reporte detallado por vehículo |
| Excesos de Velocidad | ✅ | Listado de incidentes |
| Distancia Recorrida | ✅ | Métricas por vehículo |
| Reconstrucción de Viajes | ✅ | Mapa histórico + timeline |
| Modo Oscuro | ✅ | Automático según preferencia del sistema |
| Accesibilidad | ✅ | WCAG 2.1 AA compliant |
| Responsive | ✅ | Mobile-first design |

## 🚦 Próximos Pasos (Producción)

1. **Backend API**: Implementar REST API o GraphQL
2. **Base de Datos**: PostgreSQL/MySQL con PostGIS para datos geoespaciales
3. **Autenticación Real**: JWT, OAuth2, o servicio como Auth0
4. **WebSocket**: Para actualizaciones en tiempo real de posición
5. **Dispositivos GPS**: Integrar con hardware GPS (Teltonika, Concox, etc.)
6. **Notificaciones Push**: Service Workers para alertas en navegador
7. **API de Mapas Premium**: Considerar Mapbox o Google Maps para features avanzadas

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo licencia MIT.

## 🤝 Soporte

Para preguntas o problemas:
1. Revisa la documentación en este README
2. Verifica la consola del navegador para errores
3. Asegúrate de tener conexión a internet (para CDN de Leaflet y Chart.js)

---

**Desarrollado con ❤️ para monitoreo GPS profesional**