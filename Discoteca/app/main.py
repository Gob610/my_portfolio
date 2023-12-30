"""
Archivo principal
"""

import sys
from pathlib import Path

path_root = Path(__file__).parents[1]
sys.path.append(str(path_root))

# Importar la ventana principal
from app.views.main_view import create_main_window

def funcion_principal():
    """
    La funcion principal
    """
    create_main_window()

if __name__ == "__main__":
    funcion_principal()
