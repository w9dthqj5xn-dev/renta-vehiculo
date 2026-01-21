from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from models import db, Vehicle, Customer, Rental, Payment
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rental_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

db.init_app(app)

# Crear las tablas si no existen
with app.app_context():
    db.create_all()

# ============== RUTA PRINCIPAL ==============

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')

# ============== RUTAS DE VEHÍCULOS ==============

@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    """Obtener todos los vehículos"""
    vehicles = Vehicle.query.all()
    return jsonify([v.to_dict() for v in vehicles])

@app.route('/api/vehicles/available', methods=['GET'])
def get_available_vehicles():
    """Obtener vehículos disponibles"""
    vehicles = Vehicle.query.filter_by(status='disponible').all()
    return jsonify([v.to_dict() for v in vehicles])

@app.route('/api/vehicles/<int:id>', methods=['GET'])
def get_vehicle(id):
    """Obtener un vehículo por ID"""
    vehicle = Vehicle.query.get_or_404(id)
    return jsonify(vehicle.to_dict())

@app.route('/api/vehicles', methods=['POST'])
def create_vehicle():
    """Crear un nuevo vehículo"""
    data = request.get_json()
    
    # Calcular precios automáticamente si no se proporcionan
    price_per_day = data['price_per_day']
    price_per_week = data.get('price_per_week', price_per_day * 7)  # Sin descuento
    price_per_month = data.get('price_per_month', price_per_day * 30)  # Sin descuento
    
    vehicle = Vehicle(
        brand=data['brand'],
        model=data['model'],
        year=data['year'],
        price_per_day=price_per_day,
        price_per_week=price_per_week,
        price_per_month=price_per_month,
        status=data.get('status', 'disponible'),
        plate=data.get('plate'),
        color=data.get('color'),
        mileage=data.get('mileage', 0),
        vin=data.get('vin')
    )
    db.session.add(vehicle)
    db.session.commit()
    return jsonify(vehicle.to_dict()), 201

@app.route('/api/vehicles/<int:id>', methods=['PUT'])
def update_vehicle(id):
    """Actualizar un vehículo"""
    vehicle = Vehicle.query.get_or_404(id)
    data = request.get_json()
    
    vehicle.brand = data.get('brand', vehicle.brand)
    vehicle.model = data.get('model', vehicle.model)
    vehicle.year = data.get('year', vehicle.year)
    vehicle.price_per_day = data.get('price_per_day', vehicle.price_per_day)
    vehicle.price_per_week = data.get('price_per_week', vehicle.price_per_week)
    vehicle.price_per_month = data.get('price_per_month', vehicle.price_per_month)
    vehicle.status = data.get('status', vehicle.status)
    vehicle.plate = data.get('plate', vehicle.plate)
    vehicle.color = data.get('color', vehicle.color)
    vehicle.mileage = data.get('mileage', vehicle.mileage)
    vehicle.vin = data.get('vin', vehicle.vin)
    
    db.session.commit()
    return jsonify(vehicle.to_dict())

@app.route('/api/vehicles/<int:id>', methods=['DELETE'])
def delete_vehicle(id):
    """Eliminar un vehículo"""
    vehicle = Vehicle.query.get_or_404(id)
    db.session.delete(vehicle)
    db.session.commit()
    return jsonify({'message': 'Vehículo eliminado exitosamente'})

# ============== RUTAS DE CLIENTES ==============

@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Obtener todos los clientes"""
    customers = Customer.query.all()
    return jsonify([c.to_dict() for c in customers])

@app.route('/api/customers/<int:id>', methods=['GET'])
def get_customer(id):
    """Obtener un cliente por ID"""
    customer = Customer.query.get_or_404(id)
    return jsonify(customer.to_dict())

@app.route('/api/customers', methods=['POST'])
def create_customer():
    """Crear un nuevo cliente"""
    data = request.get_json()
    customer = Customer(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        license_number=data['license_number']
    )
    db.session.add(customer)
    db.session.commit()
    return jsonify(customer.to_dict()), 201

@app.route('/api/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    """Actualizar un cliente"""
    customer = Customer.query.get_or_404(id)
    data = request.get_json()
    
    customer.name = data.get('name', customer.name)
    customer.email = data.get('email', customer.email)
    customer.phone = data.get('phone', customer.phone)
    customer.license_number = data.get('license_number', customer.license_number)
    
    db.session.commit()
    return jsonify(customer.to_dict())

@app.route('/api/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    """Eliminar un cliente"""
    customer = Customer.query.get_or_404(id)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': 'Cliente eliminado exitosamente'})

# ============== RUTAS DE RENTAS ==============

@app.route('/api/rentals', methods=['GET'])
def get_rentals():
    """Obtener todas las rentas"""
    rentals = Rental.query.all()
    return jsonify([r.to_dict() for r in rentals])

@app.route('/api/rentals/<int:id>', methods=['GET'])
def get_rental(id):
    """Obtener una renta por ID"""
    rental = Rental.query.get_or_404(id)
    return jsonify(rental.to_dict())

@app.route('/api/rentals', methods=['POST'])
def create_rental():
    """Crear una nueva renta"""
    data = request.get_json()
    
    # Verificar que el vehículo esté disponible
    vehicle = Vehicle.query.get_or_404(data['vehicle_id'])
    if vehicle.status != 'disponible':
        return jsonify({'error': 'El vehículo no está disponible'}), 400
    
    # Obtener fechas
    start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
    is_indefinite = data.get('is_indefinite', False)
    
    # Manejar fecha indefinida
    if is_indefinite:
        end_date = None
        # Para rentas indefinidas, el precio debe ser proporcionado manualmente
        if 'custom_price' not in data or data['custom_price'] <= 0:
            return jsonify({'error': 'Debe especificar un precio para rentas indefinidas'}), 400
        total_cost = float(data['custom_price'])
    else:
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')
        days = (end_date - start_date).days + 1
        rental_period = data.get('rental_period', 'dia')
        
        # Verificar si se proporcionó un precio personalizado
        if 'custom_price' in data and data['custom_price'] > 0:
            total_cost = float(data['custom_price'])
        else:
            # Cálculo de costo según el periodo
            if rental_period == 'semana':
                weeks = days / 7
                total_cost = weeks * (vehicle.price_per_week or vehicle.price_per_day * 7)
            elif rental_period == 'mes':
                months = days / 30
                total_cost = months * (vehicle.price_per_month or vehicle.price_per_day * 30)
            else:  # dia
                total_cost = days * vehicle.price_per_day
    
    # Crear la renta
    rental = Rental(
        customer_id=data['customer_id'],
        vehicle_id=data['vehicle_id'],
        start_date=start_date,
        end_date=end_date,
        rental_period=data.get('rental_period', 'dia') if not is_indefinite else 'indefinida',
        total_cost=total_cost,
        status='activa'
    )
    
    # Actualizar el estado del vehículo
    vehicle.status = 'rentado'
    
    db.session.add(rental)
    db.session.commit()
    
    return jsonify(rental.to_dict()), 201

@app.route('/api/rentals/<int:id>/complete', methods=['PUT'])
def complete_rental(id):
    """Completar una renta"""
    rental = Rental.query.get_or_404(id)
    
    if rental.status != 'activa':
        return jsonify({'error': 'La renta ya fue completada o cancelada'}), 400
    
    rental.status = 'completada'
    
    # Actualizar el estado del vehículo
    vehicle = Vehicle.query.get(rental.vehicle_id)
    vehicle.status = 'disponible'
    
    db.session.commit()
    return jsonify(rental.to_dict())

@app.route('/api/rentals/<int:id>', methods=['DELETE'])
def cancel_rental(id):
    """Cancelar una renta"""
    rental = Rental.query.get_or_404(id)
    
    if rental.status == 'activa':
        # Liberar el vehículo
        vehicle = Vehicle.query.get(rental.vehicle_id)
        vehicle.status = 'disponible'
    
    rental.status = 'cancelada'
    db.session.commit()
    
    return jsonify({'message': 'Renta cancelada exitosamente'})

# ============== ESTADÍSTICAS ==============

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Obtener estadísticas financieras del sistema"""
    from sqlalchemy import func
    
    # Total de rentas
    total_rentals = Rental.query.count()
    active_rentals = Rental.query.filter_by(status='activa').count()
    completed_rentals = Rental.query.filter_by(status='completada').count()
    
    # Dinero total generado (suma de total_cost de todas las rentas)
    total_generated = db.session.query(func.sum(Rental.total_cost)).scalar() or 0
    
    # Dinero total cobrado (suma de todos los pagos)
    total_collected = db.session.query(func.sum(Payment.amount)).scalar() or 0
    
    # Balance pendiente
    total_pending = total_generated - total_collected
    
    # Rentas por período
    rentals_by_period = db.session.query(
        Rental.rental_period,
        func.count(Rental.id).label('count'),
        func.sum(Rental.total_cost).label('revenue')
    ).group_by(Rental.rental_period).all()
    
    period_stats = [
        {
            'period': period,
            'count': count,
            'revenue': float(revenue or 0)
        }
        for period, count, revenue in rentals_by_period
    ]
    
    return jsonify({
        'total_rentals': total_rentals,
        'active_rentals': active_rentals,
        'completed_rentals': completed_rentals,
        'total_generated': float(total_generated),
        'total_collected': float(total_collected),
        'total_pending': float(total_pending),
        'period_stats': period_stats
    })

# ============== RUTAS DE PAGOS ==============

@app.route('/api/payments', methods=['GET'])
def get_payments():
    """Obtener todos los pagos"""
    payments = Payment.query.all()
    return jsonify([p.to_dict() for p in payments])

@app.route('/api/payments/rental/<int:rental_id>', methods=['GET'])
def get_rental_payments(rental_id):
    """Obtener pagos de una renta específica"""
    payments = Payment.query.filter_by(rental_id=rental_id).all()
    return jsonify([p.to_dict() for p in payments])

@app.route('/api/payments', methods=['POST'])
def create_payment():
    """Registrar un nuevo pago"""
    data = request.get_json()
    
    # Verificar que la renta existe
    rental = Rental.query.get_or_404(data['rental_id'])
    
    # Calcular el balance actual
    total_paid = sum(payment.amount for payment in rental.payments)
    balance = rental.total_cost - total_paid
    
    # Verificar que el pago no exceda el balance
    amount = float(data['amount'])
    if amount > balance:
        return jsonify({'error': f'El monto excede el balance pendiente de ${balance:.2f}'}), 400
    
    # Crear el pago
    payment = Payment(
        rental_id=data['rental_id'],
        amount=amount,
        payment_method=data['payment_method'],
        notes=data.get('notes', '')
    )
    
    db.session.add(payment)
    db.session.commit()
    
    return jsonify(payment.to_dict()), 201

@app.route('/api/payments/<int:id>', methods=['DELETE'])
def delete_payment(id):
    """Eliminar un pago"""
    payment = Payment.query.get_or_404(id)
    db.session.delete(payment)
    db.session.commit()
    return jsonify({'message': 'Pago eliminado exitosamente'})

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port)
