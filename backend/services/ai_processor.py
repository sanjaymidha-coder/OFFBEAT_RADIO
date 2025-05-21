import os
import requests
from typing import Dict
from dotenv import load_dotenv
from .whisper_transcriber import WhisperTranscriber

load_dotenv()

class AIProcessor:
    def __init__(self):
        self.api_url = "https://llm.theartasia.com/ai/v1/chat/completions"
        self.model = "gemma3:12b"

    def process_song(self, song_data: dict) -> str:
        """
        Process a song or prompt and generate a radio script using the AI endpoint.
        
        Args:
            song_data (dict): Dictionary containing song or prompt information
                {
                    'name': str,
                    'artist': str,
                    'transcript': str (or prompt)
                }
        
        Returns:
            str: Generated radio script or AI response
        """

        transcript = song_data.get('transcript', '')
        prompt = transcript if song_data.get('name', '').endswith('radio intro') or song_data.get('name', '').startswith('segment_radio_intro') else f"""
        Create a radio script for the following song:
        Artist: {song_data.get('artist', '')}
        Song: {song_data.get('name', '')}
        Transcript: {transcript[:500]}
        ...
        """

        for attempt in range(2):  # Try up to 2 times
            try:
                response = requests.post(
                    self.api_url,
                    json={
                        "model": self.model,
                        "messages": [
                            {
                                "role": "system",
                                "content": "You are a professional radio DJ with a warm and engaging personality."
                            },
                            {
                                "role": "user",
                                "content": prompt
                            }
                        ]
                    }
                )

                if response.status_code != 200:
                    if attempt == 0:
                        # Log or print retry attempt
                        print(f"AI request failed with status {response.status_code}, retrying once...")
                        continue
                    else:
                        raise Exception(f"API request failed with status {response.status_code}")

                result = response.json()
                return result['choices'][0]['message']['content'].strip()

            except Exception as e:
                if attempt == 0:
                    print(f"Error processing song: {str(e)}, retrying once...")
                    continue
                else:
                    raise Exception(f"Error processing song: {str(e)}")

    def set_model(self, model_name: str):
        """
        Set a different model for processing
        
        Args:
            model_name (str): Name of the model to use
        """
        self.model = model_name

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

            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a professional radio DJ."},
                    {"role": "user", "content": prompt}
                ]
            )

            return response.choices[0].message.content

        except Exception as e:
            raise Exception(f"Error generating script: {str(e)}") 