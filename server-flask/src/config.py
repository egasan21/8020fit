import os

class Config:
    """Configuration settings for the Flask application."""
    
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    TESTING = os.getenv('TESTING', 'False') == 'True'
    SECRET_KEY = os.getenv('SECRET_KEY', 'your_secret_key')
    MODELS_DIR = os.getenv('MODELS_DIR', 'src/models/fitness_models')