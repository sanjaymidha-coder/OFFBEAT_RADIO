import os
import requests
from gtts import gTTS

class AudioGenerator:
    def __init__(self):
        # ElevenLabs settings
        # self.voice_id = "FmJ4FDkdrYIKzBTruTkV"  # Default voice ID (Rachel)
        self.voice_id = "UgBBYS2sOqTuMpoF3BR0"
        self.api_key = "sk_99f1f3e27b1b2965dfe447af519e18840d9d90f13b736652"
        
        # gTTS settings
        self.language = 'en'  # Default language is English

    def set_voice(self, voice_id):
        """
        Set a different voice for audio generation (ElevenLabs)
        """
        self.voice_id = voice_id 

    def set_language(self, language):
        """
        Set a different language for audio generation (gTTS)
        """
        self.language = language

    def generate_radio_intro_audio(self, radio_intro_text, output_path="radio_intro_full.mp3", speed=1.0):
        """
        Generate a single audio file from the full radio intro text using ElevenLabs API.
        """
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}"
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "text": radio_intro_text,
            "voice_settings": {
                "speed": float(speed)
            }
        }
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            with open(output_path, "wb") as f:
                f.write(response.content)
            return output_path
        else:
            raise Exception(f"ElevenLabs API error: {response.status_code} {response.text}")

    def generate_radio_intro_audio_local(self, radio_intro_text, output_path="radio_intro_full.mp3", speed=1.0):
        """
        Generate a single audio file from the full radio intro text using gTTS.
        This is the default method for local testing.
        """
        try:
            tts = gTTS(text=radio_intro_text, lang=self.language, slow=False)
            tts.save(output_path)
            return output_path
        except Exception as e:
            raise Exception(f"Text-to-speech error: {str(e)}")