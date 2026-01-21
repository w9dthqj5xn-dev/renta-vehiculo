#!/usr/bin/env bash
# Script de construcción para Render

# Instalar dependencias
pip install -r requirements.txt

# Inicializar la base de datos
python init_db.py
