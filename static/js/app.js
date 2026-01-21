// Detectar automáticamente si estamos en producción o desarrollo
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5001/api'
    : `${window.location.origin}/api`;

// Formatear precio con separador de miles
function formatPriceInput(input) {
    // Obtener el valor y eliminar todo lo que no sea número
    let value = input.value.replace(/[^\d]/g, '');
    
    // Si está vacío, no hacer nada
    if (value === '') {
        input.value = '';
        return;
    }
    
    // Convertir a número y formatear con separador de miles
    let num = parseInt(value);
    input.value = num.toLocaleString('es-MX');
}

// Convertir precio formateado a número
function parseFormattedPrice(value) {
    if (!value) return null;
    return parseInt(value.replace(/[^\d]/g, ''));
}

// Formatear número con separador de miles sin decimales
function formatPrice(price) {
    return Math.round(price).toLocaleString('es-MX');
}

// Formatear precio con separador de miles
function formatPriceInput(input) {
    // Obtener el valor y eliminar todo lo que no sea número
    let value = input.value.replace(/[^\d]/g, '');
    
    // Si está vacío, no hacer nada
    if (value === '') {
        input.value = '';
        return;
    }
    
    // Convertir a número y formatear con separador de miles
    let num = parseInt(value);
    input.value = num.toLocaleString('es-MX');
}

// Convertir precio formateado a número
function parseFormattedPrice(value) {
    if (!value) return null;
    return parseInt(value.replace(/[^\d]/g, ''));
}

// Formatear número con separador de miles sin decimales
function formatPrice(price) {
    return Math.round(price).toLocaleString('es-MX');
}

// ============== DASHBOARD ==============

async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/statistics`);
        const stats = await response.json();
        
        // Actualizar tarjetas principales
        document.getElementById('stat-generated').textContent = `$${formatPrice(stats.total_generated)}`;
        document.getElementById('stat-collected').textContent = `$${formatPrice(stats.total_collected)}`;
        document.getElementById('stat-pending').textContent = `$${formatPrice(stats.total_pending)}`;
        
        // Actualizar estadísticas de rentas
        document.getElementById('stat-total-rentals').textContent = stats.total_rentals;
        document.getElementById('stat-active-rentals').textContent = stats.active_rentals;
        document.getElementById('stat-completed-rentals').textContent = stats.completed_rentals;
        
        // Mostrar ingresos por período
        const periodStatsDiv = document.getElementById('period-stats');
        if (stats.period_stats.length === 0) {
            periodStatsDiv.innerHTML = '<p style="text-align: center; color: #6c757d;">Sin datos disponibles</p>';
        } else {
            periodStatsDiv.innerHTML = stats.period_stats.map(period => {
                const periodLabel = period.period === 'dia' ? 'Diario' : period.period === 'semana' ? 'Semanal' : 'Mensual';
                const color = period.period === 'dia' ? '#17a2b8' : period.period === 'semana' ? '#ffc107' : '#6f42c1';
                
                return `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: ${color}20; border-left: 4px solid ${color}; border-radius: 8px;">
                        <div>
                            <div style="font-weight: 600; color: ${color};">${periodLabel}</div>
                            <div style="font-size: 0.9em; color: #6c757d;">${period.count} rentas</div>
                        </div>
                        <div style="font-size: 1.2em; font-weight: bold; color: ${color};">$${formatPrice(period.revenue)}</div>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al cargar estadísticas', 'error');
    }
}

// ============== NAVEGACIÓN ==============

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    
    document.querySelectorAll('nav button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Cargar datos según la sección
    if (sectionId === 'dashboard') loadDashboard();
    if (sectionId === 'vehicles') {
        showVehicleTab('available');
    }
    if (sectionId === 'customers') loadCustomers();
    if (sectionId === 'rentals') loadRentals();
    if (sectionId === 'new-rental') loadNewRentalForm();
    if (sectionId === 'payments') loadPaymentsSection();
}

// Navegación entre pestañas de vehículos
function showVehicleTab(tab) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.vehicle-tab').forEach(t => {
        t.style.display = 'none';
    });
    
    // Resetear estilo de todos los botones de pestaña
    document.getElementById('tab-available').style.background = '#6c757d';
    document.getElementById('tab-inventory').style.background = '#6c757d';
    document.getElementById('tab-add').style.background = '#6c757d';
    
    // Mostrar la pestaña seleccionada y resaltar el botón
    if (tab === 'available') {
        document.getElementById('vehicle-available').style.display = 'block';
        document.getElementById('tab-available').style.background = '#667eea';
        loadVehicles();
    } else if (tab === 'inventory') {
        document.getElementById('vehicle-inventory').style.display = 'block';
        document.getElementById('tab-inventory').style.background = '#667eea';
        loadInventory();
    } else if (tab === 'add') {
        document.getElementById('vehicle-add').style.display = 'block';
        document.getElementById('tab-add').style.background = '#667eea';
    }
}

// ============== VEHÍCULOS ==============

function toggleEndDate() {
    const indefiniteCheckbox = document.getElementById('rental-indefinite');
    const endDateInput = document.getElementById('rental-end');
    const endDateGroup = document.getElementById('end-date-group');
    const customPriceInput = document.getElementById('rental-custom-price');
    
    if (indefiniteCheckbox.checked) {
        endDateInput.value = '';
        endDateInput.required = false;
        endDateInput.disabled = true;
        endDateGroup.style.opacity = '0.5';
        customPriceInput.required = true;
        document.getElementById('rental-total').textContent = 'Fecha indefinida: debe especificar el precio manualmente';
        document.getElementById('rental-total').style.color = '#ff6b6b';
    } else {
        endDateInput.required = true;
        endDateInput.disabled = false;
        endDateGroup.style.opacity = '1';
        customPriceInput.required = false;
        document.getElementById('rental-total').style.color = '#667eea';
        calculateTotal();
    }
}

async function loadVehicles() {
    try {
        const response = await fetch(`${API_URL}/vehicles/available`);
        const vehicles = await response.json();
        displayVehicles(vehicles);
    } catch (error) {
        console.error('Error al cargar vehículos:', error);
        showMessage('Error al cargar los vehículos', 'error');
    }
}

function displayVehicles(vehicles) {
    const grid = document.getElementById('vehicles-grid');
    grid.innerHTML = '';
    
    vehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${vehicle.brand} ${vehicle.model}</h3>
            <p><strong>Año:</strong> ${vehicle.year}</p>
            <p class="price">$${vehicle.price_per_day}/día</p>
            <span class="status ${vehicle.status}">${vehicle.status.toUpperCase()}</span>
        `;
        grid.appendChild(card);
    });
}

async function loadInventory() {
    try {
        const response = await fetch(`${API_URL}/vehicles`);
        const vehicles = await response.json();
        displayInventory(vehicles);
    } catch (error) {
        console.error('Error al cargar inventario:', error);
        showMessage('Error al cargar el inventario', 'error');
    }
}

function displayInventory(vehicles) {
    const tbody = document.getElementById('inventory-tbody');
    tbody.innerHTML = '';
    
    vehicles.forEach(vehicle => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${vehicle.id}</td>
            <td>${vehicle.brand}</td>
            <td>${vehicle.model}</td>
            <td>${vehicle.year}</td>
            <td>${vehicle.plate || 'N/A'}</td>
            <td>${vehicle.color || 'N/A'}</td>
            <td>${vehicle.mileage || 0} km</td>
            <td>$${vehicle.price_per_day}/día</td>
            <td><span class="status ${vehicle.status}">${vehicle.status.toUpperCase()}</span></td>
        `;
        tbody.appendChild(row);
    });
}

async function addVehicle(event) {
    event.preventDefault();
    
    const formData = {
        brand: document.getElementById('vehicle-brand').value,
        model: document.getElementById('vehicle-model').value,
        year: parseInt(document.getElementById('vehicle-year').value),
        price_per_day: parseFloat(document.getElementById('vehicle-price').value),
        status: document.getElementById('vehicle-status').value,
        plate: document.getElementById('vehicle-plate').value || null,
        color: document.getElementById('vehicle-color').value || null,
        mileage: parseInt(document.getElementById('vehicle-mileage').value) || 0,
        vin: document.getElementById('vehicle-vin').value || null
    };
    
    try {
        const response = await fetch(`${API_URL}/vehicles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showMessage('Vehículo agregado exitosamente', 'success');
            document.getElementById('vehicle-form').reset();
            showVehicleTab('available');
        } else {
            showMessage('Error al agregar el vehículo', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al agregar el vehículo', 'error');
    }
}

// ============== CLIENTES ==============

async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        const customers = await response.json();
        displayCustomers(customers);
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        showMessage('Error al cargar los clientes', 'error');
    }
}

function displayCustomers(customers) {
    const grid = document.getElementById('customers-grid');
    grid.innerHTML = '';
    
    customers.forEach(customer => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${customer.name}</h3>
            <p><strong>Email:</strong> ${customer.email}</p>
            <p><strong>Teléfono:</strong> ${customer.phone}</p>
            <p><strong>Licencia:</strong> ${customer.license_number}</p>
        `;
        grid.appendChild(card);
    });
}

async function registerCustomer(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        license_number: document.getElementById('customer-license').value
    };
    
    try {
        const response = await fetch(`${API_URL}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showMessage('Cliente registrado exitosamente', 'success');
            document.getElementById('customer-form').reset();
            loadCustomers();
        } else {
            showMessage('Error al registrar el cliente', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al registrar el cliente', 'error');
    }
}

// ============== RENTAS ==============

async function loadRentals() {
    try {
        const response = await fetch(`${API_URL}/rentals`);
        const rentals = await response.json();
        displayRentals(rentals);
    } catch (error) {
        console.error('Error al cargar rentas:', error);
        showMessage('Error al cargar las rentas', 'error');
    }
}

function displayRentals(rentals) {
    const tbody = document.getElementById('rentals-tbody');
    tbody.innerHTML = '';
    
    rentals.forEach(rental => {
        const row = document.createElement('tr');
        const endDateDisplay = rental.end_date ? rental.end_date : '<span style="color: #ff6b6b; font-weight: bold;">INDEFINIDA</span>';
        const actionButton = rental.status === 'activa'
            ? `<button class="btn" onclick="completeRental(${rental.id})" style="background: #28a745; padding: 5px 15px; font-size: 0.9em;">Terminar</button>`
            : '<span style="color: #6c757d;">-</span>';
        
        row.innerHTML = `
            <td>${rental.id}</td>
            <td>${rental.customer_name}</td>
            <td>${rental.vehicle_info}</td>
            <td><span class="status ${rental.rental_period}">${rental.rental_period.toUpperCase()}</span></td>
            <td>${rental.start_date}</td>
            <td>${endDateDisplay}</td>
            <td>$${formatPrice(rental.total_cost)}</td>
            <td>$${formatPrice(rental.total_paid)}</td>
            <td style="color: ${rental.balance > 0 ? '#dc3545' : '#28a745'}; font-weight: bold;">$${formatPrice(rental.balance)}</td>
            <td><span class="status ${rental.status}">${rental.status.toUpperCase()}</span></td>
            <td>${actionButton}</td>
        `;
        tbody.appendChild(row);
    });
}

async function loadNewRentalForm() {
    try {
        // Cargar clientes
        const customersResponse = await fetch(`${API_URL}/customers`);
        const customers = await customersResponse.json();
        const customerSelect = document.getElementById('rental-customer');
        customerSelect.innerHTML = '<option value="">Seleccionar cliente</option>';
        customers.forEach(customer => {
            customerSelect.innerHTML += `<option value="${customer.id}">${customer.name}</option>`;
        });
        
        // Cargar vehículos disponibles
        const vehiclesResponse = await fetch(`${API_URL}/vehicles/available`);
        const vehicles = await vehiclesResponse.json();
        const vehicleSelect = document.getElementById('rental-vehicle');
        vehicleSelect.innerHTML = '<option value="">Seleccionar vehículo</option>';
        vehicles.forEach(vehicle => {
            const pricePerWeek = vehicle.price_per_week || (vehicle.price_per_day * 7);
            const pricePerMonth = vehicle.price_per_month || (vehicle.price_per_day * 30);
            vehicleSelect.innerHTML += `<option value="${vehicle.id}" 
                data-price-day="${vehicle.price_per_day}" 
                data-price-week="${pricePerWeek}" 
                data-price-month="${pricePerMonth}">
                ${vehicle.brand} ${vehicle.model} - $${vehicle.price_per_day}/día
            </option>`;
        });
    } catch (error) {
        console.error('Error al cargar formulario:', error);
        showMessage('Error al cargar el formulario', 'error');
    }
}

function calculateTotal() {
    const indefiniteCheckbox = document.getElementById('rental-indefinite');
    
    // Si la fecha es indefinida, no calcular
    if (indefiniteCheckbox && indefiniteCheckbox.checked) {
        document.getElementById('rental-total').textContent = 'Fecha indefinida: debe especificar el precio manualmente';
        document.getElementById('rental-total').style.color = '#ff6b6b';
        return;
    }
    
    const startDate = new Date(document.getElementById('rental-start').value);
    const endDate = new Date(document.getElementById('rental-end').value);
    const vehicleSelect = document.getElementById('rental-vehicle');
    const selectedOption = vehicleSelect.options[vehicleSelect.selectedIndex];
    const rentalPeriod = document.getElementById('rental-period').value;
    const customPriceInput = document.getElementById('rental-custom-price');
    
    if (startDate && endDate && vehicleSelect.value && endDate >= startDate) {
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        let total = 0;
        let description = '';
        
        if (rentalPeriod === 'semana') {
            const weeks = days / 7;
            const pricePerWeek = parseFloat(selectedOption.dataset.priceWeek) || 0;
            total = weeks * pricePerWeek;
            description = `${weeks.toFixed(2)} semanas`;
        } else if (rentalPeriod === 'mes') {
            const months = days / 30;
            const pricePerMonth = parseFloat(selectedOption.dataset.priceMonth) || 0;
            total = months * pricePerMonth;
            description = `${months.toFixed(2)} meses`;
        } else {
            const pricePerDay = parseFloat(selectedOption.dataset.priceDay) || 0;
            total = days * pricePerDay;
            description = `${days} días`;
        }
        
        // Actualizar el campo de precio personalizado con el valor calculado si está vacío
        if (!customPriceInput.value) {
            customPriceInput.placeholder = `Precio sugerido: $${formatPrice(total)}`;
        }
        
        document.getElementById('rental-total').textContent = `Cálculo automático: $${formatPrice(total)} (${description})`;
        document.getElementById('rental-total').style.color = '#667eea';
    } else {
        document.getElementById('rental-total').textContent = '';
        customPriceInput.placeholder = 'Precio calculado automáticamente';
    }
}

async function createRental(event) {
    event.preventDefault();
    
    const customPrice = document.getElementById('rental-custom-price').value;
    const customPriceValue = parseFormattedPrice(customPrice);
    const indefiniteCheckbox = document.getElementById('rental-indefinite');
    const endDateValue = document.getElementById('rental-end').value;
    
    // Validar que si es indefinida, se debe proporcionar precio
    if (indefiniteCheckbox.checked && (!customPriceValue || customPriceValue <= 0)) {
        showMessage('Debe especificar un precio para rentas con fecha indefinida', 'error');
        return;
    }
    
    const formData = {
        customer_id: parseInt(document.getElementById('rental-customer').value),
        vehicle_id: parseInt(document.getElementById('rental-vehicle').value),
        rental_period: document.getElementById('rental-period').value,
        start_date: document.getElementById('rental-start').value,
        end_date: indefiniteCheckbox.checked ? null : endDateValue,
        is_indefinite: indefiniteCheckbox.checked
    };
    
    // Agregar precio personalizado si se proporcionó
    if (customPriceValue && customPriceValue > 0) {
        formData.custom_price = customPriceValue;
    }
    
    try {
        const response = await fetch(`${API_URL}/rentals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showMessage('Renta creada exitosamente', 'success');
            document.getElementById('rental-form').reset();
            document.getElementById('rental-total').textContent = '';
        } else {
            const error = await response.json();
            showMessage(error.error || 'Error al crear la renta', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al crear la renta', 'error');
    }
}

// Completar/Terminar una renta
async function completeRental(rentalId) {
    if (!confirm('¿Está seguro de que desea terminar esta renta? El vehículo quedará disponible nuevamente.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/rentals/${rentalId}/complete`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            showMessage('Renta finalizada exitosamente', 'success');
            loadRentals();
            loadVehicles(); // Actualizar lista de vehículos disponibles
        } else {
            const error = await response.json();
            showMessage(error.error || 'Error al finalizar la renta', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al finalizar la renta', 'error');
    }
}

// ============== PAGOS ==============

// Completar/Terminar una renta
async function completeRental(rentalId) {
    if (!confirm('¿Está seguro de que desea terminar esta renta? El vehículo quedará disponible nuevamente.')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/rentals/${rentalId}/complete`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            showMessage('Renta finalizada exitosamente', 'success');
            loadRentals();
            loadVehicles(); // Actualizar lista de vehículos disponibles
        } else {
            const error = await response.json();
            showMessage(error.error || 'Error al finalizar la renta', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al finalizar la renta', 'error');
    }
}

async function loadPaymentsSection() {
    await loadActiveRentals();
    await loadAllPayments();
}

async function loadActiveRentals() {
    try {
        const response = await fetch(`${API_URL}/rentals`);
        const rentals = await response.json();
        
        const rentalSelect = document.getElementById('payment-rental');
        rentalSelect.innerHTML = '<option value="">Seleccionar renta</option>';
        
        // Filtrar rentas con balance pendiente
        rentals.forEach(rental => {
            if (rental.balance > 0) {
                rentalSelect.innerHTML += `<option value="${rental.id}" data-total="${rental.total_cost}" data-paid="${rental.total_paid}" data-balance="${rental.balance}">
                    Renta #${rental.id} - ${rental.customer_name} - ${rental.vehicle_info} (Pendiente: $${rental.balance.toFixed(2)})
                </option>`;
            }
        });
    } catch (error) {
        console.error('Error al cargar rentas:', error);
    }
}

async function loadAllPayments() {
    try {
        const response = await fetch(`${API_URL}/payments`);
        const payments = await response.json();
        displayPayments(payments);
    } catch (error) {
        console.error('Error al cargar pagos:', error);
    }
}

function displayPayments(payments) {
    const tbody = document.getElementById('payments-tbody');
    tbody.innerHTML = '';
    
    if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay pagos registrados</td></tr>';
        return;
    }
    
    payments.forEach(payment => {
        const row = document.createElement('tr');
        const date = new Date(payment.payment_date).toLocaleDateString('es-ES');
        row.innerHTML = `
            <td>${payment.rental_id}</td>
            <td>$${payment.amount.toFixed(2)}</td>
            <td>${payment.payment_method}</td>
            <td>${date}</td>
            <td>${payment.notes || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

function updatePaymentInfo() {
    const select = document.getElementById('payment-rental');
    const selectedOption = select.options[select.selectedIndex];
    
    if (select.value) {
        const total = parseFloat(selectedOption.dataset.total);
        const paid = parseFloat(selectedOption.dataset.paid);
        const balance = parseFloat(selectedOption.dataset.balance);
        
        document.getElementById('payment-total').textContent = `$${total.toFixed(2)}`;
        document.getElementById('payment-paid').textContent = `$${paid.toFixed(2)}`;
        document.getElementById('payment-balance').textContent = `$${balance.toFixed(2)}`;
        document.getElementById('payment-info').style.display = 'block';
        
        // Establecer el máximo del input al balance pendiente
        document.getElementById('payment-amount').max = balance.toFixed(2);
    } else {
        document.getElementById('payment-info').style.display = 'none';
    }
}

async function registerPayment(event) {
    event.preventDefault();
    
    const formData = {
        rental_id: parseInt(document.getElementById('payment-rental').value),
        amount: parseFloat(document.getElementById('payment-amount').value),
        payment_method: document.getElementById('payment-method').value,
        notes: document.getElementById('payment-notes').value
    };
    
    try {
        const response = await fetch(`${API_URL}/payments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            showMessage('Pago registrado exitosamente', 'success');
            document.getElementById('payment-form').reset();
            document.getElementById('payment-info').style.display = 'none';
            loadPaymentsSection();
        } else {
            const error = await response.json();
            showMessage(error.error || 'Error al registrar el pago', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Error al registrar el pago', 'error');
    }
}

// ============== UTILIDADES ==============

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const content = document.querySelector('.content');
    content.insertBefore(messageDiv, content.firstChild);
    
    setTimeout(() => messageDiv.remove(), 5000);
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    loadVehicles();
});
