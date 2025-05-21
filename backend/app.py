from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from routes.music_routes import music_bp, init_app
from services.task_processor import TaskProcessor
from services.ai_radio_generator import AIRadioGenerator
import os

# Load environment variables
load_dotenv()

# Define project directories
PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
BACKEND_ROOT = PROJECT_ROOT
CACHE_DIR = os.path.join(PROJECT_ROOT, "cache")
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "output")
LOGS_DIR = os.path.join(PROJECT_ROOT, "logs")

# Ensure directories exist
os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

def create_app():
    # Initialize Flask app
    app = Flask(__name__)
    CORS(app)
    
    # Configure app with project directories
    app.config.update(
        PROJECT_ROOT=PROJECT_ROOT,
        BACKEND_ROOT=BACKEND_ROOT,
        CACHE_DIR=CACHE_DIR,
        OUTPUT_DIR=OUTPUT_DIR,
        LOGS_DIR=LOGS_DIR
    )
    
    with app.app_context():
        # Initialize task processor with config
        task_processor = TaskProcessor(LOGS_DIR, app.config)
        
        # Initialize AI radio generator within app context
        ai_radio_generator = AIRadioGenerator()
        
        # Set AI radio generator in task processor
        task_processor.set_ai_radio_generator(ai_radio_generator)
        
        # Set Flask app instance in task processor
        task_processor.set_app(app)
        
        # Store instances in app config
        app.config['task_processor'] = task_processor
        app.config['ai_radio_generator'] = ai_radio_generator
        
        # Initialize other services with app context
        init_app(app)
    
    # Register blueprints with app context
    app.register_blueprint(music_bp, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', debug=True, port=6000) 