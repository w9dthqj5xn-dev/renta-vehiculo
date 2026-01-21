from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Vehicle(db.Model):
    """Modelo de Vehículo"""
    __tablename__ = 'vehicles'
    
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    price_per_day = db.Column(db.Float, nullable=False)
    price_per_week = db.Column(db.Float)  # Precio por semana (7 días)
    price_per_month = db.Column(db.Float)  # Precio por mes (30 días)
    status = db.Column(db.String(20), default='disponible')  # disponible, rentado, mantenimiento
    plate = db.Column(db.String(20), unique=True)  # Placa del vehículo
    color = db.Column(db.String(30))  # Color del vehículo
    mileage = db.Column(db.Integer, default=0)  # Kilometraje
    vin = db.Column(db.String(50), unique=True)  # VIN (Vehicle Identification Number)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación con rentas
    rentals = db.relationship('Rental', backref='vehicle', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'brand': self.brand,
            'model': self.model,
            'year': self.year,
            'price_per_day': self.price_per_day,
            'price_per_week': self.price_per_week,
            'price_per_month': self.price_per_month,
            'status': self.status,
            'plate': self.plate,
            'color': self.color,
            'mileage': self.mileage,
            'vin': self.vin,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Vehicle {self.brand} {self.model} ({self.year})>'


class Customer(db.Model):
    """Modelo de Cliente"""
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    license_number = db.Column(db.String(50), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación con rentas
    rentals = db.relationship('Rental', backref='customer', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'license_number': self.license_number,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Customer {self.name}>'


class Rental(db.Model):
    """Modelo de Renta"""
    __tablename__ = 'rentals'
    
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('vehicles.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)  # Puede ser NULL para rentas indefinidas
    rental_period = db.Column(db.String(20), default='dia')  # dia, semana, mes
    total_cost = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='activa')  # activa, completada, cancelada
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relación con pagos
    payments = db.relationship('Payment', backref='rental', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        total_paid = sum(payment.amount for payment in self.payments)
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'customer_name': self.customer.name if self.customer else None,
            'vehicle_id': self.vehicle_id,
            'vehicle_info': f"{self.vehicle.brand} {self.vehicle.model}" if self.vehicle else None,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'rental_period': self.rental_period,
            'total_cost': self.total_cost,
            'total_paid': total_paid,
            'balance': self.total_cost - total_paid,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Rental {self.id} - {self.status}>'


class Payment(db.Model):
    """Modelo de Pago"""
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    rental_id = db.Column(db.Integer, db.ForeignKey('rentals.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)  # efectivo, tarjeta, transferencia
    payment_date = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'rental_id': self.rental_id,
            'amount': self.amount,
            'payment_method': self.payment_method,
            'payment_date': self.payment_date.isoformat() if self.payment_date else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Payment {self.id} - ${self.amount}>'
