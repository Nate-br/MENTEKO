import sys
import os

# Add current app directory to sys.path
APP_DIR = os.path.dirname(os.path.abspath(__file__))
if APP_DIR not in sys.path:
    sys.path.insert(0, APP_DIR)

from app import app

def application(environ, start_response):
    script_name = environ.get('SCRIPT_NAME', '')
    path_info = environ.get('PATH_INFO', '')
    
    # If mounted under /api, reconstruct full PATH_INFO so Flask /api/... routes match
    if script_name and not path_info.startswith(script_name):
        environ['PATH_INFO'] = script_name + path_info
        environ['SCRIPT_NAME'] = ''
        
    return app(environ, start_response)
