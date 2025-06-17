from flask import Blueprint, request, jsonify, send_from_directory, current_app
from services.music_manager import MusicManager
from services.progress_tracker import ProgressTracker
import os

# Create blueprint
music_bp = Blueprint('music', __name__)

# Initialize services as None - will be set up in init_app
music_manager = None
progress_tracker = None

def init_app(app):
    """Initialize services with app context"""
    global music_manager, progress_tracker
    with app.app_context():
        music_manager = MusicManager()
        progress_tracker = ProgressTracker()

# Health check endpoint
@music_bp.route('/health', methods=['GET'])
def health_check():
    """Check API health status"""
    return jsonify({"status": "healthy"}), 200

# Artist endpoints
@music_bp.route('/artists', methods=['GET'])
def get_artists():
    """Get all artists"""
    try:
        artists = music_manager.get_all_artists()
        return jsonify({"artists": artists}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@music_bp.route('/artists/<artist_name>/songs', methods=['GET'])
def get_artist_songs(artist_name):
    """Get all songs for a specific artist"""
    try:
        songs = music_manager.get_artist_songs(artist_name)
        return jsonify({"songs": songs}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@music_bp.route('/artists-with-songs', methods=['GET'])
def get_artists_with_songs():
    """Get up to 5 artists and their songs for UI"""
    try:
        artists = music_manager.get_all_artists()[:5]
        result = []
        for artist in artists:
            songs = music_manager.get_artist_songs(artist)
            result.append({
                "artist": artist,
                "songs": [song['name'] for song in songs]
            })
        return jsonify({"artists": result}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# File serving endpoints
@music_bp.route('/audio/<path:filename>', methods=['GET'])
def serve_audio_file(filename):
    """Serve audio files from the cache directory"""
    return send_from_directory(current_app.config['CACHE_DIR'], filename, as_attachment=False)

@music_bp.route('/output/<path:filename>', methods=['GET'])
def serve_output_file(filename):
    """Serve generated output files"""
    return send_from_directory(current_app.config['OUTPUT_DIR'], filename, as_attachment=True)

# Task management endpoints
@music_bp.route('/start-generation', methods=['POST'])
def start_generation():
    """Start a new radio generation process"""
    try:
        data = request.json
        artist_name = data.get('artist_name')
        enable_dj_transitions = data.get('enable_dj_transitions', False)
        is_testing = data.get('is_testing', True)  # Default to testing mode
        
        if not artist_name:
            return jsonify({"error": "Artist name is required"}), 400
        
        task_processor = current_app.config['task_processor']
        
        # Check if there's already a task in progress
        if task_processor.current_task:
            return jsonify({
                "error": "Another task is currently in progress",
                "current_task": task_processor.current_task['id']
            }), 409
        
        # Create new task with testing mode parameter
        task_info = task_processor.create_task('generate_radio', {
            'artist_name': artist_name,
            'enable_dj_transitions': enable_dj_transitions,
            'is_testing': is_testing
        })
        
        return jsonify({
            "message": f"Radio generation started in {'testing' if is_testing else 'production'} mode",
            **task_info
        }), 202
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@music_bp.route('/task-status/<task_id>', methods=['GET'])
def get_task_status(task_id):
    """Get the status of a task"""
    try:
        task_processor = current_app.config['task_processor']
        task_status = task_processor.get_task_status(task_id)
        
        if not task_status:
            return jsonify({"error": "Task not found"}), 404
            
        return jsonify(task_status), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@music_bp.route('/task-log/<task_id>', methods=['GET'])
def get_task_log(task_id):
    """Get the log file for a task"""
    try:
        log_file = os.path.join(current_app.config['LOGS_DIR'], f'task_{task_id}.log')
        
        if not os.path.exists(log_file):
            return jsonify({"error": "Log file not found"}), 404
            
        with open(log_file, 'r') as f:
            log_content = f.read()
            
        return jsonify({"log": log_content}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@music_bp.route('/task-output/<task_id>', methods=['GET'])
def get_task_output(task_id):
    """Get the output file for a completed task"""
    try:
        task_processor = current_app.config['task_processor']
        task_status = task_processor.get_task_status(task_id)
        
        if not task_status:
            return jsonify({"error": "Task not found"}), 404
            
        if task_status['status'] != 'completed':
            return jsonify({
                "error": "Task not completed",
                "status": task_status['status'],
                "progress": task_status['progress']
            }), 400
            
        if not task_status['output_file']:
            return jsonify({"error": "No output file available"}), 404
            
        return send_from_directory(
            current_app.config['OUTPUT_DIR'],
            task_status['output_file'],
            as_attachment=True
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500