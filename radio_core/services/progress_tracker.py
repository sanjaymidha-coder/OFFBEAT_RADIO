import os
import json
import uuid
from typing import Dict, List, Optional
from datetime import datetime

class ProgressTracker:
    def __init__(self):
        self.progress_dir = os.path.join(os.path.dirname(__file__), '..', 'data', 'progress')
        os.makedirs(self.progress_dir, exist_ok=True)

    def create_progress(self, artist_name: str, enable_dj_transitions: bool = False, dj_options: Dict = None) -> str:
        """Create a new progress tracking session"""
        progress_id = str(uuid.uuid4())
        progress_data = {
            "id": progress_id,
            "artist_name": artist_name,
            "enable_dj_transitions": enable_dj_transitions,
            "dj_options": dj_options or {
                "style": "energetic",
                "length": "medium",
                "speed": 1.1
            },
            "created_at": datetime.now().isoformat(),
            "status": "created",
            "current_step": "script_generation",
            "steps": {
                "script_generation": {
                    "status": "pending",
                    "data": None
                },
                "script_segmentation": {
                    "status": "pending",
                    "data": None
                },
                "audio_generation": {
                    "status": "pending",
                    "segments": []
                },
                "dj_transitions": {
                    "status": "pending",
                    "transitions": []
                },
                "final_combination": {
                    "status": "pending",
                    "output_files": None
                }
            }
        }
        self._save_progress(progress_id, progress_data)
        return progress_id

    def update_step(self, progress_id: str, step: str, status: str, data: Optional[Dict] = None) -> Dict:
        """Update the status of a specific step"""
        progress_data = self._load_progress(progress_id)
        if step in progress_data["steps"]:
            progress_data["steps"][step]["status"] = status
            if data is not None:
                progress_data["steps"][step]["data"] = data
            progress_data["current_step"] = step
            self._save_progress(progress_id, progress_data)
        return progress_data

    def update_audio_segment(self, progress_id: str, segment_index: int, status: str, file_path: Optional[str] = None) -> Dict:
        """Update the status of a specific audio segment"""
        progress_data = self._load_progress(progress_id)
        segments = progress_data["steps"]["audio_generation"]["segments"]
        
        # Ensure we have enough segments
        while len(segments) <= segment_index:
            segments.append({"status": "pending", "file_path": None})
        
        segments[segment_index]["status"] = status
        if file_path is not None:
            segments[segment_index]["file_path"] = file_path
        
        self._save_progress(progress_id, progress_data)
        return progress_data

    def update_dj_transition(self, progress_id: str, transition_index: int, status: str, file_path: Optional[str] = None) -> Dict:
        """Update the status of a specific DJ transition"""
        progress_data = self._load_progress(progress_id)
        transitions = progress_data["steps"]["dj_transitions"]["transitions"]
        
        # Ensure we have enough transitions
        while len(transitions) <= transition_index:
            transitions.append({"status": "pending", "file_path": None})
        
        transitions[transition_index]["status"] = status
        if file_path is not None:
            transitions[transition_index]["file_path"] = file_path
        
        self._save_progress(progress_id, progress_data)
        return progress_data

    def get_progress(self, progress_id: str) -> Dict:
        """Get the current progress data"""
        return self._load_progress(progress_id)

    def _save_progress(self, progress_id: str, data: Dict):
        """Save progress data to file"""
        file_path = os.path.join(self.progress_dir, f"{progress_id}.json")
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def _load_progress(self, progress_id: str) -> Dict:
        """Load progress data from file"""
        file_path = os.path.join(self.progress_dir, f"{progress_id}.json")
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f) 