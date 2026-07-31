// GPS SaaS Platform - Dashboard JavaScript

// Datos simulados (en producción vendrían de una API)
const mockData = {
    vehicles: [
        { id: 1, name: 'Unidad A-01', plate: 'ABC-123', status: 'moving', speed: 65, lat: 19.4326, lng: -99.1332, lastUpdate: '2024-01-15 10:30:00' },
        { id: 2, name: 'Unidad A-02', plate: 'DEF-456', status: 'stopped', speed: 0, lat: 19.4280, lng: -99.1276, lastUpdate: '2024-01-15 10:28:00' },
        { id: 3, name: 'Unidad B-01', plate: 'GHI-789', status: 'moving', speed: 72, lat: 19.4400, lng: -99.1500, lastUpdate: '2024-01-15 10:29:00' },
        { id: 4, name: 'Unidad B-02', plate: 'JKL-012', status: 'idle', speed: 0, lat: 19.4250, lng: -99.1400, lastUpdate: '2024-01-15 10:25:00' },
        { id: 5, name: 'Unidad C-01', plate: 'MNO-345', status: 'moving', speed: 58, lat: 19.4350, lng: -99.1200, lastUpdate: '2024-01-15 10:31:00' },
        { id: 6, name: 'Unidad C-02', plate: 'PQR-678', status: 'moving', speed: 80, lat: 19.4450, lng: -99.1600, lastUpdate: '2024-01-15 10:27:00' }
    ],
    
    geofences: [
        { id: 1, name: 'Zona Industrial Norte', description: 'Área de distribución principal', speedLimit: 60, type: 'circle', lat: 19.4400, lng: -99.1500, radius: 500 },
        { id: 2, name: 'Centro de Distribución Sur', description: 'Almacén principal y zona de carga', speedLimit: 40, type: 'circle', lat: 19.4200, lng: -99.1300, radius: 300 },
        { id: 3, name: 'Ruta Comercial Este', description: 'Corredor comercial de alta tráfico', speedLimit: 50, type: 'polygon', lat: 19.4350, lng: -99.1100, radius: 400 }
    ],
    
    alerts: [
        { id: 1, type: 'speed', vehicle: 'Unidad C-02', message: 'Exceso de velocidad detectado (85 km/h en zona de 60)', time: '10:27 AM', critical: true },
        { id: 2, type: 'geofence', vehicle: 'Unidad A-01', message: 'Entrada a cerco geográfico: Zona Industrial Norte', time: '10:25 AM', critical: false },
        { id: 3, type: 'stop', vehicle: 'Unidad A-02', message: 'Detención no programada (más de 30 min)', time: '10:20 AM', critical: false },
        { id: 4, type: 'speed', vehicle: 'Unidad B-01', message: 'Exceso de velocidad detectado (78 km/h en zona de 60)', time: '10:15 AM', critical: true },
        { id: 5, type: 'maintenance', vehicle: 'Unidad D-01', message: 'Mantenimiento preventivo vencido', time: '09:00 AM', critical: false }
    ],
    
    hoursData: {
        labels: ['Unidad A-01', 'Unidad A-02', 'Unidad B-01', 'Unidad B-02', 'Unidad C-01', 'Unidad C-02'],
        values: [8.5, 7.2, 9.0, 6.5, 8.0, 7.8]
    },
    
    distanceData: {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        values: [245, 312, 287, 298, 356, 189, 124]
    }
};

// Variables globales
let map = null;
let historyMap = null;
let markers = [];
let geofenceLayers = [];
let hoursChart = null;
let distanceChart = null;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticación
    checkAuth();
    
    // Configurar navegación
    setupNavigation();
    
    // Configurar menú móvil
    setupMobileMenu();
    
    // Configurar logout
    setupLogout();
    
    // Inicializar dashboard
    initDashboard();
    
    // Configurar modal de cercos
    setupGeofenceModal();
    
    // Configurar filtros de reportes
    setupReportFilters();
    
    // Configurar reconstrucción de viajes
    setupHistoryReconstruction();
});

// Verificar autenticación
function checkAuth() {
    const isLoggedIn = localStorage.getItem('gps_logged_in');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
    
    const username = localStorage.getItem('gps_user') || 'Admin';
    document.getElementById('username-display').textContent = username;
}

// Configuración de navegación
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            
            // Actualizar botones activos
            navButtons.forEach(b => {
                b.classList.remove('active');
                b.removeAttribute('aria-current');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');
            
            // Actualizar título
            const titles = {
                dashboard: 'Dashboard',
                map: 'Mapa en Tiempo Real',
                vehicles: 'Gestión de Vehículos',
                geofences: 'Cercos Geográficos',
                reports: 'Reportes y Análisis',
                history: 'Reconstrucción de Viajes'
            };
            document.getElementById('page-title').textContent = titles[view];
            
            // Mostrar vista correspondiente
            document.querySelectorAll('.view-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(`view-${view}`).classList.add('active');
            
            // Acciones específicas por vista
            if (view === 'map') {
                setTimeout(() => initMap(), 100);
            } else if (view === 'dashboard') {
                initCharts();
            } else if (view === 'vehicles') {
                renderVehicles();
            } else if (view === 'geofences') {
                renderGeofences();
            } else if (view === 'reports') {
                populateVehicleSelects();
            } else if (view === 'history') {
                populateHistorySelects();
            }
            
            // Cerrar menú en móvil
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('open');
                document.getElementById('menu-toggle').setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Menú móvil
function setupMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        const isOpen = sidebar.classList.contains('open');
        menuToggle.setAttribute('aria-expanded', isOpen.toString());
    });
}

// Logout
function setupLogout() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('gps_logged_in');
        localStorage.removeItem('gps_user');
        window.location.href = 'index.html';
    });
}

// Inicializar Dashboard
function initDashboard() {
    renderKPIs();
    renderAlerts();
    initCharts();
}

// Renderizar KPIs
function renderKPIs() {
    const totalVehicles = mockData.vehicles.length;
    const movingVehicles = mockData.vehicles.filter(v => v.status === 'moving').length;
    const activeAlerts = mockData.alerts.length;
    const speedViolations = mockData.alerts.filter(a => a.type === 'speed').length;
    
    document.getElementById('total-vehicles').textContent = totalVehicles;
    document.getElementById('moving-vehicles').textContent = movingVehicles;
    document.getElementById('active-alerts').textContent = activeAlerts;
    document.getElementById('speed-violations').textContent = speedViolations;
}

// Renderizar Alertas
function renderAlerts() {
    const alertsList = document.getElementById('alerts-list');
    alertsList.innerHTML = '';
    
    mockData.alerts.slice(0, 5).forEach(alert => {
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item ${alert.critical ? 'critical' : ''}`;
        alertItem.setAttribute('role', 'article');
        
        const iconColor = alert.critical ? '#ef4444' : '#f59e0b';
        const iconName = alert.type === 'speed' ? '⚠️' : alert.type === 'geofence' ? '📍' : alert.type === 'stop' ? '🛑' : '🔧';
        
        alertItem.innerHTML = `
            <div class="alert-icon" style="background-color: ${iconColor}20; color: ${iconColor};" aria-hidden="true">
                ${iconName}
            </div>
            <div class="alert-content">
                <h4>${alert.vehicle}</h4>
                <p>${alert.message}</p>
            </div>
            <span class="alert-time">${alert.time}</span>
        `;
        
        alertsList.appendChild(alertItem);
    });
}

// Inicializar Gráficos
function initCharts() {
    const hoursCtx = document.getElementById('hoursChart');
    const distanceCtx = document.getElementById('distanceChart');
    
    if (!hoursCtx || !distanceCtx) return;
    
    // Destruir gráficos existentes
    if (hoursChart) hoursChart.destroy();
    if (distanceChart) distanceChart.destroy();
    
    // Gráfico de Horas
    hoursChart = new Chart(hoursCtx, {
        type: 'bar',
        data: {
            labels: mockData.hoursData.labels,
            datasets: [{
                label: 'Horas Trabajadas',
                data: mockData.hoursData.values,
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 1,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Horas'
                    }
                }
            }
        }
    });
    
    // Gráfico de Distancia
    distanceChart = new Chart(distanceCtx, {
        type: 'line',
        data: {
            labels: mockData.distanceData.labels,
            datasets: [{
                label: 'Distancia (km)',
                data: mockData.distanceData.values,
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Kilómetros'
                    }
                }
            }
        }
    });
}

// Inicializar Mapa
function initMap() {
    if (map) return;
    
    map = L.map('map').setView([19.4326, -99.1332], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Agregar marcadores de vehículos
    updateVehicleMarkers();
    
    // Agregar cercos geográficos
    renderGeofencesOnMap();
}

// Actualizar marcadores de vehículos
function updateVehicleMarkers() {
    // Limpiar marcadores existentes
    markers.forEach(marker => marker.remove());
    markers = [];
    
    mockData.vehicles.forEach(vehicle => {
        const color = vehicle.status === 'moving' ? '#10b981' : vehicle.status === 'stopped' ? '#ef4444' : '#f59e0b';
        
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                background-color: ${color};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        const marker = L.marker([vehicle.lat, vehicle.lng], { icon })
            .addTo(map)
            .bindPopup(`
                <strong>${vehicle.name}</strong><br>
                Placa: ${vehicle.plate}<br>
                Estado: ${vehicle.status}<br>
                Velocidad: ${vehicle.speed} km/h<br>
                Última actualización: ${vehicle.lastUpdate}
            `);
        
        markers.push(marker);
    });
    
    // Renderizar lista de vehículos
    renderVehicleList();
}

// Renderizar lista de vehículos
function renderVehicleList() {
    const vehicleList = document.getElementById('vehicle-list');
    if (!vehicleList) return;
    
    vehicleList.innerHTML = '';
    
    mockData.vehicles.forEach(vehicle => {
        const item = document.createElement('div');
        item.className = 'vehicle-item';
        item.setAttribute('role', 'listitem');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `${vehicle.name}, ${vehicle.status}, ${vehicle.speed} kilómetros por hora`);
        
        item.innerHTML = `
            <div class="vehicle-status ${vehicle.status}"></div>
            <div class="vehicle-info">
                <h4>${vehicle.name}</h4>
                <p>${vehicle.plate} • ${vehicle.speed} km/h</p>
            </div>
        `;
        
        item.addEventListener('click', () => {
            map.setView([vehicle.lat, vehicle.lng], 15);
            const marker = markers[vehicle.id - 1];
            if (marker) marker.openPopup();
        });
        
        vehicleList.appendChild(item);
    });
}

// Renderizar vehículos en vista de gestión
function renderVehicles() {
    const grid = document.getElementById('vehicles-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    mockData.vehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        
        const statusText = vehicle.status === 'moving' ? 'En Movimiento' : vehicle.status === 'stopped' ? 'Detenido' : 'Inactivo';
        const statusColor = vehicle.status === 'moving' ? '#10b981' : vehicle.status === 'stopped' ? '#ef4444' : '#f59e0b';
        
        card.innerHTML = `
            <div class="vehicle-card-header">
                <h3 class="vehicle-name">${vehicle.name}</h3>
                <span style="color: ${statusColor}; font-weight: 600;">${statusText}</span>
            </div>
            <div class="vehicle-details">
                <div class="detail-row">
                    <span class="detail-label">Placa:</span>
                    <span class="detail-value">${vehicle.plate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Velocidad:</span>
                    <span class="detail-value">${vehicle.speed} km/h</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ubicación:</span>
                    <span class="detail-value">${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Última Act.:</span>
                    <span class="detail-value">${vehicle.lastUpdate}</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Renderizar cercos geográficos
function renderGeofences() {
    const grid = document.getElementById('geofences-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    mockData.geofences.forEach(geofence => {
        const card = document.createElement('div');
        card.className = 'geofence-card';
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Cerco ${geofence.name}, límite de velocidad ${geofence.speedLimit} kilómetros por hora`);
        
        card.innerHTML = `
            <div class="geofence-card-header">
                <h3 class="geofence-name">${geofence.name}</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="cursor: pointer;" aria-label="Editar cerco">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </div>
            <div class="geofence-details">
                <div class="detail-row">
                    <span class="detail-label">Descripción:</span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">${geofence.description}</p>
                <div class="detail-row">
                    <span class="detail-label">Tipo:</span>
                    <span class="detail-value">${geofence.type === 'circle' ? 'Circular' : 'Polígono'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Límite Velocidad:</span>
                    <span class="detail-value" style="color: var(--warning); font-weight: 700;">${geofence.speedLimit} km/h</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Radio:</span>
                    <span class="detail-value">${geofence.radius} m</span>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Renderizar cercos en el mapa
function renderGeofencesOnMap() {
    if (!map) return;
    
    // Limpiar capas existentes
    geofenceLayers.forEach(layer => layer.remove());
    geofenceLayers = [];
    
    mockData.geofences.forEach(geofence => {
        const circle = L.circle([geofence.lat, geofence.lng], {
            radius: geofence.radius,
            color: '#3b82f6',
            fillColor: '#3b82f6',
            fillOpacity: 0.2,
            weight: 2
        }).addTo(map);
        
        circle.bindPopup(`
            <strong>${geofence.name}</strong><br>
            ${geofence.description}<br>
            Límite de velocidad: ${geofence.speedLimit} km/h
        `);
        
        geofenceLayers.push(circle);
    });
}

// Configurar Modal de Cercos
function setupGeofenceModal() {
    const modal = document.getElementById('geofence-modal');
    const openBtn = document.getElementById('add-geofence-btn');
    const closeBtn = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('cancel-geofence');
    const overlay = document.querySelector('.modal-overlay');
    
    if (!openBtn) return;
    
    openBtn.addEventListener('click', () => {
        modal.hidden = false;
        document.getElementById('geofence-name').focus();
    });
    
    const closeModal = () => {
        modal.hidden = true;
        document.getElementById('geofence-form').reset();
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) {
            closeModal();
        }
    });
    
    // Manejar envío del formulario
    document.getElementById('geofence-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newGeofence = {
            id: mockData.geofences.length + 1,
            name: document.getElementById('geofence-name').value,
            description: document.getElementById('geofence-description').value,
            speedLimit: parseInt(document.getElementById('geofence-speed').value),
            type: document.getElementById('geofence-type').value,
            lat: parseFloat(document.getElementById('geofence-lat').value),
            lng: parseFloat(document.getElementById('geofence-lng').value),
            radius: parseInt(document.getElementById('geofence-radius').value)
        };
        
        mockData.geofences.push(newGeofence);
        closeModal();
        renderGeofences();
        renderGeofencesOnMap();
        
        // Mostrar mensaje de éxito
        showNotification('Cerco guardado exitosamente', 'success');
    });
    
    // Botón seleccionar en mapa
    document.getElementById('select-on-map').addEventListener('click', () => {
        if (map) {
            map.once('click', (e) => {
                document.getElementById('geofence-lat').value = e.latlng.lat.toFixed(6);
                document.getElementById('geofence-lng').value = e.latlng.lng.toFixed(6);
            });
            showNotification('Haz click en el mapa para seleccionar la ubicación', 'info');
        }
    });
}

// Configurar Filtros de Reportes
function setupReportFilters() {
    const generateBtn = document.getElementById('generate-report-btn');
    if (!generateBtn) return;
    
    generateBtn.addEventListener('click', () => {
        const reportType = document.getElementById('report-type').value;
        const vehicle = document.getElementById('report-vehicle').value;
        const startDate = document.getElementById('report-start').value;
        const endDate = document.getElementById('report-end').value;
        
        const resultDiv = document.getElementById('report-result');
        
        // Generar reporte simulado
        let reportHTML = `
            <div style="padding: 1rem;">
                <h3 style="margin-bottom: 1rem;">Reporte de ${getReportTypeName(reportType)}</h3>
                <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                    <div style="background: var(--surface-hover); padding: 1rem; border-radius: 8px; flex: 1; min-width: 150px;">
                        <p style="font-size: 0.875rem; color: var(--text-secondary);">Vehículo</p>
                        <p style="font-size: 1.25rem; font-weight: 700;">${vehicle === 'all' ? 'Todos' : vehicle}</p>
                    </div>
                    <div style="background: var(--surface-hover); padding: 1rem; border-radius: 8px; flex: 1; min-width: 150px;">
                        <p style="font-size: 0.875rem; color: var(--text-secondary);">Período</p>
                        <p style="font-size: 1.25rem; font-weight: 700;">${startDate || 'Inicio'} - ${endDate || 'Fin'}</p>
                    </div>
                </div>
        `;
        
        if (reportType === 'hours') {
            reportHTML += `
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border);">
                            <th style="text-align: left; padding: 0.75rem;">Vehículo</th>
                            <th style="text-align: left; padding: 0.75rem;">Horas Totales</th>
                            <th style="text-align: left; padding: 0.75rem;">Promedio Diario</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            mockData.vehicles.forEach((v, i) => {
                const hours = mockData.hoursData.values[i];
                reportHTML += `
                    <tr style="border-bottom: 1px solid var(--border);">
                        <td style="padding: 0.75rem;">${v.name}</td>
                        <td style="padding: 0.75rem;">${hours} h</td>
                        <td style="padding: 0.75rem;">${(hours / 7).toFixed(1)} h/día</td>
                    </tr>
                `;
            });
            reportHTML += `</tbody></table>`;
        } else if (reportType === 'speed') {
            reportHTML += `
                <div style="background: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                    <h4 style="color: var(--danger); margin-bottom: 0.5rem;">⚠️ Excesos de Velocidad Detectados</h4>
                    <p style="font-size: 0.875rem;">Se encontraron ${mockData.alerts.filter(a => a.type === 'speed').length} incidentes en el período seleccionado.</p>
                </div>
                <ul style="list-style: none;">
            `;
            mockData.alerts.filter(a => a.type === 'speed').forEach(alert => {
                reportHTML += `
                    <li style="padding: 0.75rem; border-bottom: 1px solid var(--border);">
                        <strong>${alert.vehicle}</strong> - ${alert.message} <span style="color: var(--text-muted); float: right;">${alert.time}</span>
                    </li>
                `;
            });
            reportHTML += `</ul>`;
        } else if (reportType === 'distance') {
            reportHTML += `
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            `;
            mockData.vehicles.forEach((v, i) => {
                const distance = Math.round(mockData.distanceData.values.reduce((a, b) => a + b, 0) * (0.8 + Math.random() * 0.4));
                reportHTML += `
                    <div style="background: var(--surface-hover); padding: 1rem; border-radius: 8px;">
                        <p style="font-size: 0.875rem; color: var(--text-secondary);">${v.name}</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--primary);">${distance} km</p>
                    </div>
                `;
            });
            reportHTML += `</div>`;
        }
        
        reportHTML += `
            <div style="margin-top: 1.5rem; display: flex; gap: 0.75rem;">
                <button class="btn-primary" onclick="window.print()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                        <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Imprimir Reporte
                </button>
                <button class="btn-secondary" onclick="exportToCSV()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Exportar CSV
                </button>
            </div>
            </div>
        `;
        
        resultDiv.innerHTML = reportHTML;
    });
}

// Obtener nombre del tipo de reporte
function getReportTypeName(type) {
    const names = {
        hours: 'Horas Trabajadas',
        speed: 'Excesos de Velocidad',
        distance: 'Distancia Recorrida',
        stops: 'Paradas y Detenciones'
    };
    return names[type] || type;
}

// Poblar selects de vehículos
function populateVehicleSelects() {
    const selects = ['report-vehicle', 'history-vehicle'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;
        
        // Mantener primera opción si existe
        const firstOption = select.querySelector('option[value="all"]');
        select.innerHTML = '';
        if (firstOption) select.appendChild(firstOption);
        
        mockData.vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.name;
            option.textContent = `${vehicle.name} (${vehicle.plate})`;
            select.appendChild(option);
        });
    });
}

// Configurar Reconstrucción de Viajes
function setupHistoryReconstruction() {
    const reconstructBtn = document.getElementById('reconstruct-trip-btn');
    if (!reconstructBtn) return;
    
    reconstructBtn.addEventListener('click', () => {
        const vehicle = document.getElementById('history-vehicle').value;
        const date = document.getElementById('history-date').value;
        
        if (!vehicle || !date) {
            showNotification('Seleccione vehículo y fecha', 'warning');
            return;
        }
        
        // Inicializar mapa de historial
        if (!historyMap) {
            historyMap = L.map('history-map').setView([19.4326, -99.1332], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(historyMap);
        }
        
        // Simular ruta histórica
        simulateHistoricalRoute(vehicle, date);
    });
}

// Simular ruta histórica
function simulateHistoricalRoute(vehicle, date) {
    const timeline = document.getElementById('history-timeline');
    timeline.innerHTML = '';
    
    // Generar puntos simulados
    const baseLat = 19.4326;
    const baseLng = -99.1332;
    const points = [];
    
    for (let i = 0; i < 20; i++) {
        points.push({
            lat: baseLat + (Math.random() - 0.5) * 0.05,
            lng: baseLng + (Math.random() - 0.5) * 0.05,
            time: `${8 + Math.floor(i * 0.5)}:${(i % 2) * 30}`.padStart(5, '0'),
            speed: Math.floor(Math.random() * 80),
            event: i === 0 ? 'Inicio de viaje' : i === 19 ? 'Fin de viaje' : Math.random() > 0.8 ? 'Parada temporal' : 'En ruta'
        });
    }
    
    // Dibujar polyline
    const latLngs = points.map(p => [p.lat, p.lng]);
    L.polyline(latLngs, { color: '#2563eb', weight: 4, opacity: 0.8 }).addTo(historyMap);
    
    // Agregar marcadores de inicio y fin
    L.marker(latLngs[0], {
        icon: L.divIcon({
            html: '<div style="background: #10b981; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white;"></div>',
            iconSize: [16, 16]
        })
    }).addTo(historyMap).bindPopup('Inicio del viaje');
    
    L.marker(latLngs[latLngs.length - 1], {
        icon: L.divIcon({
            html: '<div style="background: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white;"></div>',
            iconSize: [16, 16]
        })
    }).addTo(historyMap).bindPopup('Fin del viaje');
    
    // Ajustar vista
    historyMap.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
    
    // Renderizar timeline
    points.forEach((point, index) => {
        const event = document.createElement('div');
        event.className = 'timeline-event';
        event.innerHTML = `
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <h4>${point.event} - ${point.time}</h4>
                <p>Velocidad: ${point.speed} km/h • Ubicación: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
            </div>
        `;
        timeline.appendChild(event);
    });
    
    showNotification(`Viaje de ${vehicle} reconstruido para ${date}`, 'success');
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Implementación simple de notificación
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // En producción, aquí iría un sistema de toast/notificaciones
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Exportar a CSV
function exportToCSV() {
    const headers = ['Vehículo', 'Fecha', 'Hora Inicio', 'Hora Fin', 'Horas Totales', 'Distancia (km)', 'Velocidad Máx'];
    const rows = mockData.vehicles.map((v, i) => [
        v.name,
        new Date().toISOString().split('T')[0],
        '08:00',
        '18:00',
        mockData.hoursData.values[i],
        Math.round(mockData.distanceData.values.reduce((a, b) => a + b, 0) * 0.3),
        Math.max(...mockData.vehicles.map(v => v.speed))
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_gps_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    showNotification('Reporte exportado exitosamente', 'success');
}

// Estilos de animación para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
