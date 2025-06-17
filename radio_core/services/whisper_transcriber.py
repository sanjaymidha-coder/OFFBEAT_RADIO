import whisper
import torch
import warnings
import logging
import os

class WhisperTranscriber:
    def __init__(self, model_name="base"):
        # Configure logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        # Check if CUDA is available
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.logger.info(f"Using device: {self.device}")
        
        # Load model with appropriate settings
        try:
            self.model = whisper.load_model(model_name, device=self.device)
            if self.device == "cpu":
                self.logger.info("Running on CPU - transcription may be slower")
        except Exception as e:
            self.logger.error(f"Error loading Whisper model: {str(e)}")
            raise

    def transcribe(self, audio_path: str) -> str:
        """
        Transcribe audio file using Whisper.
        Skips and returns empty string if file is missing, empty, or on error.
        """
        if not os.path.exists(audio_path) or os.path.getsize(audio_path) == 0:
            self.logger.warning(f"Skipping empty or missing audio file: {audio_path}")
            return ""
        try:
            # Suppress the FP16 warning for CPU
            with warnings.catch_warnings():
                warnings.filterwarnings("ignore", message="FP16 is not supported on CPU")
                result = self.model.transcribe(audio_path)
            return result["text"]
        except Exception as e:
            self.logger.error(f"Error transcribing audio: {str(e)}. Skipping file: {audio_path}")
            return "" 