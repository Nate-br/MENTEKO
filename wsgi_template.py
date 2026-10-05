# ============================================================================
# PythonAnywhere WSGI Configuration File
#
# In your PythonAnywhere Web tab, click on your WSGI configuration file link
# (e.g. /var/www/<your-username>_pythonanywhere_com_wsgi.py) and paste this:
# ============================================================================

import sys
import os

# Set this to your repository directory on PythonAnywhere
# Replace '<your-username>' with your actual PythonAnywhere username
project_home = '/home/<your-username>/menteko'

if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import the Flask application
from app import app as application
