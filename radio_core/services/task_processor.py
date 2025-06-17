import threading
import queue
import logging
import os
import time
import random
from datetime import datetime
from typing import Dict, Optional, List
from services.ai_radio_generator import AIRadioGenerator
from flask import current_app

class TaskProcessor:
    def __init__(self, log_dir: str, config: Dict):
        self.task_queue = queue.Queue()
        self.current_task: Optional[Dict] = None
        self.is_processing = False
        self.processing_thread = None
        self.tasks = {}  # Store task information
        self.config = config
        self.ai_radio_generator = None  # Will be set later
        self.app = None  # Will store Flask app instance
        
        # Set up logging
        self.log_dir = log_dir
        os.makedirs(log_dir, exist_ok=True)
        
        # Configure logging
        self.logger = logging.getLogger('TaskProcessor')
        self.logger.setLevel(logging.INFO)
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(console_formatter)
        self.logger.addHandler(console_handler)
    
    def set_ai_radio_generator(self, generator):
        """Set the AI radio generator instance"""
        self.ai_radio_generator = generator
    
    def set_app(self, app):
        """Set the Flask app instance"""
        self.app = app
    
    def _get_log_filename(self, task_id: str) -> str:
        """Get the log filename for a task"""
        return f'task_{task_id}.log'
    
    def _get_log_filepath(self, task_id: str) -> str:
        """Get the full path to the log file"""
        return os.path.join(self.log_dir, self._get_log_filename(task_id))
    
    def _setup_task_logger(self, task_id: str):
        """Setup task-specific logging"""
        log_file = self._get_log_filepath(task_id)
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.INFO)
        file_formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        file_handler.setFormatter(file_formatter)
        self.logger.addHandler(file_handler)
        
        # Log initial task information
        self.logger.info(f"=== Starting new task: {task_id} ===")
        self.logger.info(f"Log file: {log_file}")
        
        return file_handler
    
    def create_task(self, task_type: str, params: Dict) -> Dict:
        """Create a new task and return task information"""
        if not self.app:
            raise RuntimeError("TaskProcessor not properly initialized with Flask app")
            
        task_id = f"{task_type}_{int(time.time())}"
        log_file = self._get_log_filename(task_id)
        
        task = {
            'id': task_id,
            'type': task_type,
            'params': params,
            'status': 'pending',
            'created_at': datetime.now().isoformat(),
            'started_at': None,
            'completed_at': None,
            'current_step': None,
            'progress': 0,
            'result': None,
            'error': None,
            'log_file': log_file,
            'output_file': None
        }
        
        self.tasks[task_id] = task
        self.task_queue.put(task)
        
        # Start processing if not already running
        if not self.is_processing:
            self._start_processing()
        
        # Return only the necessary information for the API response
        return {
            'task_id': task_id,
            'log_file': log_file,
            'status': 'pending'
        }
    
    def get_task_status(self, task_id: str) -> Optional[Dict]:
        """Get the current status of a task with file information"""
        task = self.tasks.get(task_id)
        if task:
            return {
                'id': task['id'],
                'status': task['status'],
                'progress': task['progress'],
                'current_step': task['current_step'],
                'error': task['error'],
                'log_file': task['log_file'],
                'output_file': task['output_file'],
                'created_at': task['created_at'],
                'started_at': task['started_at'],
                'completed_at': task['completed_at']
            }
        return None
    
    def update_task_progress(self, task_id: str, step: str, progress: int, message: str):
        """Update task progress"""
        if task_id in self.tasks:
            self.tasks[task_id]['current_step'] = step
            self.tasks[task_id]['progress'] = progress
            self.logger.info(f"Task {task_id} - {step}: {message}")
    
    def _start_processing(self):
        """Start the background processing thread"""
        if not self.is_processing and self.app:  # Only start if we have the app instance
            self.is_processing = True
            self.processing_thread = threading.Thread(target=self._process_tasks)
            self.processing_thread.daemon = True
            self.processing_thread.start()
    
    def _process_tasks(self):
        """Main task processing loop"""
        while self.is_processing:
            try:
                # Get next task
                task = self.task_queue.get(timeout=1)
                self.current_task = task
                task_id = task['id']
                
                # Setup task-specific logging
                file_handler = self._setup_task_logger(task_id)
                
                try:
                    # Update task status
                    task['status'] = 'processing'
                    task['started_at'] = datetime.now().isoformat()
                    
                    self.logger.info(f"Starting task {task_id}")
                    
                    # Process the task within app context
                    with self.app.app_context():
                        # Process the task based on its type
                        if task['type'] == 'generate_radio':
                            self._process_radio_generation(task)
                    
                    # Mark task as completed
                    task['status'] = 'completed'
                    task['completed_at'] = datetime.now().isoformat()
                    self.logger.info(f"Task {task_id} completed successfully")
                
                except Exception as e:
                    # Handle task error
                    task['status'] = 'failed'
                    task['error'] = str(e)
                    self.logger.error(f"Task {task_id} failed: {str(e)}")
                
                finally:
                    # Remove task-specific log handler
                    self.logger.removeHandler(file_handler)
                    file_handler.close()
                    
                    self.current_task = None
                    self.task_queue.task_done()
            
            except queue.Empty:
                continue
            except Exception as e:
                self.logger.error(f"Error in task processor: {str(e)}")
                continue
    
    def _process_radio_generation(self, task: Dict):
        """Process radio generation task"""
        task_id = task['id']
        params = task['params']
        artist_name = params['artist_name']
        enable_dj_transitions = params.get('enable_dj_transitions', False)
        dj_options = params.get('dj_options', {})
        
        try:
            # Log task parameters
            self.logger.info(f"Processing radio generation for artist: {artist_name}")
            self.logger.info(f"DJ transitions enabled: {enable_dj_transitions}")
            
            # Step 1: Get songs data with transcripts
            self.update_task_progress(task_id, 'fetching_songs', 10, 'Fetching songs data with transcripts...')
            songs_data = self.ai_radio_generator.get_songs_data(artist_name)
            if not songs_data:
                raise Exception(f"No songs found for artist: {artist_name}")
            self.logger.info(f"Found {len(songs_data)} songs for {artist_name}")
            
            # Step 2: Generate clean script
            self.update_task_progress(task_id, 'script_generation', 20, 'Generating radio script...')
            script_data = self.ai_radio_generator.generate_enhanced_script(artist_name, songs_data)
            self.logger.info("Script generation completed successfully")
            
            # Store script data in task result
            task['result'] = {
                'script': script_data
            }
            
            # Step 3: Enhance script with SSML
            self.update_task_progress(task_id, 'script_enhancement', 40, 'Enhancing script with SSML...')
            enhanced_script = self.ai_radio_generator.enhance_script_with_emphasis(script_data)
            task['result']['enhanced_script'] = enhanced_script
            self.logger.info("Script enhancement completed successfully")
            
            # Step 4: Generate audio from enhanced script
            self.update_task_progress(task_id, 'audio_generation', 60, 'Generating audio...')
            audio_result = self.ai_radio_generator.generate_audio(
                artist_name,
                enhanced_script,
                dj_options={
                    'enable_dj_transitions': enable_dj_transitions,
                    'style': dj_options.get('style', 'smooth'),
                    'length': dj_options.get('length', 'medium')
                }
            )
            
            if not audio_result:
                raise Exception("Failed to generate audio")
            
            # Store audio paths in task result
            task['result'].update(audio_result)
            
            # Update final status
            task['status'] = 'completed'
            self.update_task_progress(
                task_id,
                'completed',
                100,
                f'Radio generation completed. Output file: {audio_result.get("full_show_audio", "N/A")}'
            )
            self.logger.info(f"Task {task_id} completed successfully")
            
        except Exception as e:
            self.logger.error(f"Error in radio generation task {task_id}: {str(e)}")
            raise e 