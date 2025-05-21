import os
import requests
from gtts import gTTS

class AudioGenerator:
    def __init__(self):
        # ElevenLabs settings
        # self.voice_id = "FmJ4FDkdrYIKzBTruTkV"  # Default voice ID (Rachel)
        self.voice_id = "FmJ4FDkdrYIKzBTruTkV"
        self.api_key = "sk_1fc58aff1ad9391e6fc4fe28dddc6ef9635f99d455fefab2"
        # 017a32c65b@emaily.pro
        # https://www.mohmal.com/ar/inbox#
        
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

    def generate_radio_intro_audio(self, radio_intro_text, output_path="radio_intro_full.mp3", use_ssml=False):
        """
        Generate a single audio file from the radio intro text using ElevenLabs API.
        Now supports SSML-enhanced scripts for more dynamic speech.
        """
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{self.voice_id}"
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        
        # Configure voice settings for dynamic speech
        voice_settings = {
            "stability": 0.3,  # Lower for more dynamic speech
            "similarity_boost": 0.8,  # Higher to maintain voice characteristics
            "style": 0.5,  # Mix of styles
            "use_speaker_boost": True
        }
        
        # If using SSML, the text should already be wrapped in <speak> tags
        if not use_ssml and not radio_intro_text.strip().startswith('<speak>'):
            radio_intro_text = f"<speak>{radio_intro_text}</speak>"
        
        payload = {
            "text": radio_intro_text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": voice_settings
        }
        
        print("\n=== ElevenLabs API Request ===")
        print(f"Text length: {len(radio_intro_text)} characters")
        print(f"Text content: {radio_intro_text}\n") 
        
        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            with open(output_path, "wb") as f:
                f.write(response.content)
            return output_path
        else:
            raise Exception(f"ElevenLabs API error: {response.status_code} {response.text}")

    def generate_radio_intro_audio_local(self, radio_intro_text, output_path="radio_intro_full.mp3", use_ssml=False):
        """
        Generate a single audio file from the radio intro text using gTTS.
        This is the default method for local testing.
        Note: gTTS doesn't support SSML, so SSML tags will be stripped.
        """
        try:
            # Strip SSML tags if present
            if use_ssml:
                import re
                radio_intro_text = re.sub(r'<[^>]+>', '', radio_intro_text)
            
            tts = gTTS(text=radio_intro_text, lang=self.language, slow=False)
            tts.save(output_path)
            return output_path
        except Exception as e:
            raise Exception(f"Text-to-speech error: {str(e)}")