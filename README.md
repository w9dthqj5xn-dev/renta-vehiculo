# Sistema de Renta de Vehículos

Sistema completo para la gestión de renta de vehículos desarrollado con Python Flask y SQLite.

## 🚀 Características

- **Gestión de Vehículos**: Administra tu flota con información detallada (marca, modelo, año, placa, color, kilometraje, VIN)
- **Precios Flexibles**: Configura precios por día, semana y mes
- **Inventario Completo**: Vista detallada de todos los vehículos con su estado actual
- **Gestión de Clientes**: Registro completo de clientes con datos de contacto y licencia
- **Sistema de Rentas**: Crea rentas con opciones de periodo (día, semana, mes) y cálculo automático
- **Sistema de Pagos**: Registra pagos parciales o totales con múltiples métodos de pago
- **Control de Balance**: Seguimiento automático de saldos pendientes por renta
- **API REST**: Backend completo con endpoints para todas las operaciones CRUD
- **Interfaz Web**: Frontend moderno y responsivo con diseño intuitivo
- **Base de Datos**: SQLite con SQLAlchemy ORM para gestión eficiente de datos

## 📋 Requisitos Previos

- Python 3.8 o superior
- pip (gestor de paquetes de Python)

## 🔧 Instalación

1. **Clonar o descargar el proyecto** (si es necesario)

2. **Crear y activar un entorno virtual**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # En macOS/Linux
   # o
   venv\Scripts\activate  # En Windows
   ```

3. **Instalar las dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Inicializar la base de datos con datos de ejemplo**:
   ```bash
   python init_db.py
   ```

## 🚀 Ejecución

1. **Iniciar el servidor Flask**:
   ```bash
   python app.py
   ```

2. **Acceder a la aplicación**:
   - Frontend: Abrir [http://127.0.0.1:5000](http://127.0.0.1:5000) en tu navegador
   - API: Disponible en [http://127.0.0.1:5000/api](http://127.0.0.1:5000/api)

## 📁 Estructura del Proyecto

```
Renta-Vehiculo/
├── app.py                 # Aplicación principal Flask con rutas API
├── models.py              # Modelos de base de datos (Vehicle, Customer, Rental)
├── init_db.py             # Script de inicialización de base de datos
├── requirements.txt       # Dependencias del proyecto
├── templates/
│   └── index.html        # Página principal del frontend
├── static/
│   ├── css/
│   │   └── style.css     # Estilos de la aplicación
│   └── js/
│       └── app.js        # Lógica del frontend
└── rental_system.db      # Base de datos SQLite (se crea automáticamente)
```

## 🔌 API Endpoints

### Vehículos
- `GET /api/vehicles` - Obtener todos los vehículos
- `GET /api/vehicles/available` - Obtener vehículos disponibles
- `GET /api/vehicles/<id>` - Obtener un vehículo específico
- `POST /api/vehicles` - Crear un nuevo vehículo
- `PUT /api/vehicles/<id>` - Actualizar un vehículo
- `DELETE /api/vehicles/<id>` - Eliminar un vehículo

### Clientes
- `GET /api/customers` - Obtener todos los clientes
- `GET /api/customers/<id>` - Obtener un cliente específico
- `POST /api/customers` - Crear un nuevo cliente
- `PUT /api/customers/<id>` - Actualizar un cliente
- `DELETE /api/customers/<id>` - Eliminar un cliente

### Rentas
- `GET /api/rentals` - Obtener todas las rentas
- `GET /api/rentals/<id>` - Obtener una renta específica
- `POST /api/rentals` - Crear una nueva renta
- `PUT /api/rentals/<id>/complete` - Completar una renta
- `DELETE /api/rentals/<id>` - Cancelar una renta

### Pagos
- `GET /api/payments` - Obtener todos los pagos
- `GET /api/payments/rental/<rental_id>` - Obtener pagos de una renta específica
- `POST /api/payments` - Registrar un nuevo pago
- `DELETE /api/payments/<id>` - Eliminar un pago

## 💡 Uso de la Aplicación

1. **Ver Vehículos Disponibles**: Consulta vehículos listos para rentar
2. **Inventario Completo**: Revisa todos los vehículos con su información detallada
3. **Agregar Vehículo**: Registra nuevos vehículos con datos completos (placa, color, kilometraje, VIN)
4. **Registrar Cliente**: Agrega nuevos clientes al sistema
5. **Crear Renta**: 
   - Selecciona cliente y vehículo
   - Elige el periodo de renta:
     - **Por Día**: Precio estándar por día
     - **Por Semana**: Precio por 7 días
     - **Por Mes**: Precio por 30 días
   - El sistema calcula automáticamente el costo total
6. **Registrar Pago**: Registra pagos parciales o totales con diferentes métodos
7. **Historial**: Revisa todas las rentas con información de pagos y saldos

## 🛠️ Tecnologías Utilizadas

- **Backend**: Flask 3.0.0
- **Base de Datos**: SQLite con SQLAlchemy 3.1.1
- **CORS**: Flask-CORS 4.0.0
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)

## 📝 Notas

- La base de datos se crea automáticamente al ejecutar `init_db.py`
- Los datos de ejemplo incluyen 8 vehículos y 3 clientes
- El sistema calcula automáticamente el costo total de las rentas
- Los vehículos cambian de estado automáticamente al ser rentados

## 🐛 Solución de Problemas

- **Error al conectar con la API**: Verifica que el servidor Flask esté ejecutándose en el puerto 5000
- **No se muestran datos**: Ejecuta `init_db.py` para inicializar la base de datos
- **Error de dependencias**: Reinstala los paquetes con `pip install -r requirements.txt`

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

Desarrollado como sistema de gestión de renta de vehículos.
