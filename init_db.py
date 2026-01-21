from app import app, db
from models import Vehicle, Customer

def init_database():
    """Inicializar la base de datos con datos de ejemplo"""
    with app.app_context():
        # Crear las tablas
        db.create_all()
        
        # Verificar si ya hay datos
        if Vehicle.query.first() is None:
            # Agregar vehículos de ejemplo
            vehicles = [
                Vehicle(brand='Toyota', model='Corolla', year=2023, price_per_day=50.0, price_per_week=350.0, price_per_month=1500.0, status='disponible', plate='ABC-123', color='Blanco', mileage=15000, vin='1HGBH41JXMN109186'),
                Vehicle(brand='Honda', model='Civic', year=2023, price_per_day=55.0, price_per_week=385.0, price_per_month=1650.0, status='disponible', plate='DEF-456', color='Negro', mileage=12000, vin='2HGBH41JXMN109187'),
                Vehicle(brand='Ford', model='Focus', year=2022, price_per_day=45.0, price_per_week=315.0, price_per_month=1350.0, status='disponible', plate='GHI-789', color='Azul', mileage=28000, vin='3HGBH41JXMN109188'),
                Vehicle(brand='Chevrolet', model='Cruze', year=2023, price_per_day=48.0, price_per_week=336.0, price_per_month=1440.0, status='disponible', plate='JKL-012', color='Rojo', mileage=8000, vin='4HGBH41JXMN109189'),
                Vehicle(brand='Nissan', model='Sentra', year=2022, price_per_day=47.0, price_per_week=329.0, price_per_month=1410.0, status='disponible', plate='MNO-345', color='Gris', mileage=22000, vin='5HGBH41JXMN109190'),
                Vehicle(brand='Mazda', model='3', year=2023, price_per_day=52.0, price_per_week=364.0, price_per_month=1560.0, status='disponible', plate='PQR-678', color='Plateado', mileage=9500, vin='6HGBH41JXMN109191'),
                Vehicle(brand='Hyundai', model='Elantra', year=2023, price_per_day=46.0, price_per_week=322.0, price_per_month=1380.0, status='disponible', plate='STU-901', color='Blanco', mileage=11000, vin='7HGBH41JXMN109192'),
                Vehicle(brand='Volkswagen', model='Jetta', year=2022, price_per_day=50.0, price_per_week=350.0, price_per_month=1500.0, status='mantenimiento', plate='VWX-234', color='Negro', mileage=35000, vin='8HGBH41JXMN109193'),
            ]
            
            for vehicle in vehicles:
                db.session.add(vehicle)
            
            # Agregar clientes de ejemplo
            customers = [
                Customer(name='Juan Pérez', email='juan.perez@example.com', phone='555-0101', license_number='LIC-001'),
                Customer(name='María García', email='maria.garcia@example.com', phone='555-0102', license_number='LIC-002'),
                Customer(name='Carlos López', email='carlos.lopez@example.com', phone='555-0103', license_number='LIC-003'),
            ]
            
            for customer in customers:
                db.session.add(customer)
            
            db.session.commit()
            print("✅ Base de datos inicializada con datos de ejemplo")
        else:
            print("ℹ️  La base de datos ya contiene datos")

if __name__ == '__main__':
    init_database()
