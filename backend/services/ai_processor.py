import os
import json
import openai
import requests
from typing import Dict, Optional
from flask import current_app
from .whisper_transcriber import WhisperTranscriber

class AIProcessor:
    def __init__(self, use_openai: bool = True):
        """
        Initialize AIProcessor with option to use OpenAI or local processing.
        
        Args:
            use_openai (bool): Whether to use OpenAI (True) or local processing (False)
        """
        self.use_openai = use_openai
        self.model = "gpt-4.1-mini"  # Default OpenAI model
        
        if use_openai:
            # Initialize OpenAI with API key
            # Put key there
            pass
        else:
            # Initialize local API endpoint
            self.api_url = "http://localhost:11434/api/generate"
            self.local_model = "gemma3:12b"  # Default local model
        
        # Load local templates if they exist
        self.templates = self._load_templates()

    def _load_templates(self) -> Dict:
        """
        Load templates from JSON file if it exists.
        """
        template_path = os.path.join(current_app.config['BACKEND_ROOT'], 'data', 'radio_intro_templates.json')
        if os.path.exists(template_path):
            with open(template_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {}

    def _generate_with_openai(self, prompt: str, max_tokens: int = 300) -> str:
        """
        Generate text using OpenAI's API.
        
        Args:
            prompt (str): The prompt to send to OpenAI
            max_tokens (int): Maximum number of tokens in the response
            
        Returns:
            str: Generated text
        """
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an experienced radio DJ who creates engaging, natural-sounding transitions and intros."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=0.8,
                top_p=0.9,
                frequency_penalty=0.3,
                presence_penalty=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating with OpenAI: {str(e)}")
            return self._generate_locally(prompt)

    def _generate_locally(self, prompt: str) -> str:
        """
        Generate text using local processing.
        
        Args:
            prompt (str): The prompt to process
            
        Returns:
            str: Generated text
        """
        try:
            # Try using local API first
            response = requests.post(
                self.api_url,
                json={
                    "model": self.local_model,
                    "prompt": prompt,
                    "stream": False
                }
            )

            if response.status_code == 200:
                result = response.json()
                return result['response'].strip()
        except Exception as e:
            print(f"Error with local API: {str(e)}")

        # Fallback to templates if local API fails
        if "radio intro" in prompt.lower():
            if self.templates and 'intro_templates' in self.templates:
                template = self.templates['intro_templates'][0]
                return template['script']
        
        # Ultimate fallback response
        return "Welcome to the show! Let's enjoy some great music together."

    def process_song(self, song_data: Dict, max_tokens: Optional[int] = None) -> str:
        """
        Process song data to generate radio content.
        
        Args:
            song_data (Dict): Dictionary containing song information
            max_tokens (Optional[int]): Maximum tokens for OpenAI response
            
        Returns:
            str: Generated content
        """
        # Extract relevant information
        artist = song_data.get('artist', '')
        name = song_data.get('name', '')
        transcript = song_data.get('transcript', '')
        
        # Create appropriate prompt based on content type
        if 'transition' in name.lower():
            prompt = f"""Create a smooth transition between songs.
            Artist: {artist}
            Song: {name}
            Context: {transcript}
            
            Make it natural and engaging, connecting the emotional themes between songs."""
        elif 'intro' in name.lower():
            prompt = f"""Create an engaging radio intro.
            Artist: {artist}
            Context: {transcript}
            
            Make it warm and welcoming, setting the mood for the show."""
        else:
            prompt = transcript
        
        # Generate content using selected method
        if self.use_openai:
            return self._generate_with_openai(prompt, max_tokens or 150)
        else:
            return self._generate_locally(prompt)

    def set_processing_method(self, use_openai: bool):
        """
        Change the processing method between OpenAI and local.
        
        Args:
            use_openai (bool): Whether to use OpenAI (True) or local processing (False)
        """
        self.use_openai = use_openai

    def set_model(self, model_name: str):
        """
        Set a different model for processing.
        
        Args:
            model_name (str): Name of the model to use
        """
        if self.use_openai:
            self.model = model_name
        else:
            self.local_model = model_name

    def generate_script(self, song_info):
        """
        Generate a radio script based on song information
        """
        try:
            prompt = f"""
            Create a natural-sounding radio script for the following song information:
            {song_info}
            
            Make it conversational and engaging.
            """

            response = requests.post(
                self.api_url,
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False
                }
            )

            if response.status_code != 200:
                raise Exception(f"API request failed with status {response.status_code}")

            result = response.json()
            return result['response'].strip()

        except Exception as e:
            raise Exception(f"Error generating script: {str(e)}") 