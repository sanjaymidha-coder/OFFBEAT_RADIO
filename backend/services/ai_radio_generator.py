import os
import json
import hashlib
from typing import Dict, List
from flask import current_app
from .music_manager import MusicManager
from .whisper_transcriber import WhisperTranscriber
from .ai_processor import AIProcessor
from .audio_generator import AudioGenerator
import uuid
from pydub import AudioSegment
import re
import random

class AIRadioGenerator:
    def __init__(self):
        self.music_manager = MusicManager()
        self.transcriber = WhisperTranscriber()
        self.templates = self._load_templates()
        self.ai_processor = AIProcessor()

    def _load_templates(self) -> Dict:
        """
        Load radio intro templates from JSON file.
        """
        template_path = os.path.join(current_app.config['BACKEND_ROOT'], 'data', 'radio_intro_templates.json')
        with open(template_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def generate_radio_intro_prompt(self, songs_data: List[Dict]) -> str:
        """
        Generate a single radio intro prompt for all songs.
        """
        # Prepare song transcripts
        song_transcripts = []
        for song in songs_data:
            # Truncate each transcript to keep it manageable
            truncated_transcript = song['transcript'][:200] + "..." if len(song['transcript']) > 200 else song['transcript']
            song_transcripts.append(f"Song: {song['song_name']}\nTranscript:\n{truncated_transcript}\n")
        
        # Combine all transcripts
        all_transcripts = "\n".join(song_transcripts)
        
        # Prepare example templates
        example_templates = "\n".join([
            f"Script: {template['script']}"
            for template in self.templates['intro_templates']
        ])
        
        prompt = f"""You are a professional radio DJ host with a natural, poetic, and conversational voice — inspired by BBC Radio 1 and NPR.

            Your task is to write a radio intro script (under 50 words) that sounds like a real DJ welcoming the listener and setting the mood for the track.

            🎙️ Tone: Warm, reflective, poetic, and HUMAN — do not sound like an AI.
            🎵 Style: Natural speech with emotional connection. Use metaphors, mood setting, or short storytelling.

            Song Transcripts:
            {all_transcripts}

            Here are some example scripts to inspire your style (replace {{artist}} and {{song_name}} with actual values):
            {example_templates}

            Write a spoken-style intro that:
            * Feels natural and unscripted
            * Has a soft welcome
            * Sets a mood that matches the songs
            * Ends by naturally introducing the artist + track

            Only write the final radio script — no extra explanations or markdown."""
        
        return prompt

    def segment_radio_intro_for_voice(self, radio_intro: str) -> list:
        """
        Segment the radio intro for voice synthesis using the AI endpoint.
        Retry up to 2 times if no segments are returned.
        
        Args:
            radio_intro (str): The radio intro script to segment
            
        Returns:
            list: List of segmented script parts
        """
        import time
        start_time = time.time()
        print(f"Starting script segmentation for text: {radio_intro[:100]}...")

        segmentation_prompt = (
            "You are a voice production assistant preparing a radio DJ intro for high-quality voice synthesis.\n\n"
            "Your task is to:\n\n"
            "1. Split the following DJ script into natural-sounding audio segments (each 1-2 spoken phrases).\n"
            "2. Assign a realistic speech speed for each segment (between 0.7 and 1.2).\n"
            "3. Add a pause duration in milliseconds after each segment (between 300 and 1500ms).\n\n"
            "Format each segment as a JSON object with:\n"
            "- \"audio\": the text to speak\n"
            "- \"speed\": speech rate (0.7-1.2)\n"
            "- \"break_after\": pause in milliseconds\n\n"
            "Return an array of these objects.\n\n"
            "Example format:\n"
            "[\n"
            "  {\n"
            "    \"audio\": \"Good evening, music lovers...\",\n"
            "    \"speed\": 0.95,\n"
            "    \"break_after\": 800\n"
            "  }\n"
            "]\n\n"
            f"Script to segment:\n{radio_intro}"
        )

        for attempt in range(2):
            try:
                print(f"Attempt {attempt + 1} to segment script...")
                response = self.ai_processor.process_song({
                    "artist": "voice_production",
                    "name": "segment_radio_intro",
                    "transcript": segmentation_prompt
                })
                
                # Try to parse the JSON array in the response
                import re, json
                match = re.search(r'\[.*?\]', response, re.DOTALL)
                if match:
                    try:
                        segments = json.loads(match.group(0))
                        if segments and isinstance(segments, list):
                            # Validate each segment
                            valid_segments = []
                            for segment in segments:
                                if isinstance(segment, dict) and 'audio' in segment:
                                    # Ensure required fields with defaults if missing
                                    valid_segment = {
                                        'audio': segment['audio'],
                                        'speed': float(segment.get('speed', 1.0)),
                                        'break_after': int(segment.get('break_after', 500))
                                    }
                                    valid_segments.append(valid_segment)
                            
                            if valid_segments:
                                end_time = time.time()
                                print(f"Successfully segmented script in {end_time - start_time:.2f} seconds")
                                print(f"Generated {len(valid_segments)} segments")
                                return valid_segments
                    except json.JSONDecodeError:
                        print(f"Warning: Invalid JSON in AI response (attempt {attempt+1})")
                        continue
                
                print(f"Warning: No valid segments found in AI response (attempt {attempt+1})")
                
            except Exception as e:
                print(f"Warning: Exception while segmenting script (attempt {attempt+1}): {str(e)}")
                continue

        # If we get here, we failed to segment properly
        # Fall back to basic sentence segmentation
        print("Falling back to basic sentence segmentation...")
        segments = []
        sentences = re.split(r'([.!?][\s\n]+)', radio_intro)
        
        for i in range(0, len(sentences), 2):
            if i < len(sentences):
                text = sentences[i].strip()
                if text:
                    segments.append({
                        "audio": text,
                        "speed": 1.0,
                        "break_after": 500
                    })
        
        end_time = time.time()
        print(f"Completed basic segmentation in {end_time - start_time:.2f} seconds")
        print(f"Generated {len(segments)} segments")
        return segments
    
    def generate_stretchy_opening_phrase(self, artist_name: str) -> str:
        """
        Ask AI to generate a stretchy attention-grabbing 5-word phrase for radio opening.
        """
        prompt = (
            "You are a creative radio DJ voice assistant.\n\n"
            "Write a dramatic, catchy opening phrase (maximum 5 words) that stretches naturally when spoken aloud.\n\n"
            "It should be perfect for starting a radio show and pulling listeners in. Example: 'Gooood Mooorrrnnninnnggggg Everyone!'\n\n"
            "Return ONLY the phrase, no extra explanation or formatting."
        )
        response = self.ai_processor.process_song({
            "artist": artist_name,
            "name": f"{artist_name} stretchy opening phrase",
            "transcript": prompt
        })
        return response.strip().replace('"','')

    def get_songs_data(self, artist_name: str) -> List[Dict]:
        """
        Get song data for an artist, including transcripts.
        
        Args:
            artist_name (str): Name of the artist
            
        Returns:
            List[Dict]: List of song data with transcripts
        """
        songs = self.music_manager.get_artist_songs(artist_name)
        if not songs:
            raise ValueError(f"No songs found for artist '{artist_name}'")

        songs_data = []
        for song in songs:
            json_path = os.path.splitext(song['path'])[0] + ".json"
            if os.path.exists(json_path):
                with open(json_path, "r", encoding="utf-8") as f:
                    song_data = json.load(f)
            else:
                transcript = self.transcriber.transcribe(song['path'])
                song_data = {
                    "artist": artist_name,
                    "song_name": song['name'],
                    "transcript": transcript
                }
                with open(json_path, "w", encoding="utf-8") as f:
                    json.dump(song_data, f, ensure_ascii=False, indent=2)
            songs_data.append(song_data)
        
        return songs_data

    def generate_script(self, artist_name: str, songs_data: List[Dict]) -> str:
        """
        Generate the radio intro script for an artist.
        
        Args:
            artist_name (str): Name of the artist
            songs_data (List[Dict]): List of song data with transcripts
            
        Returns:
            str: Generated radio intro script
        """
        radio_intro_prompt = self.generate_radio_intro_prompt(songs_data)
        ai_radio_intro = self.ai_processor.process_song({
            "artist": artist_name,
            "name": f"{artist_name} radio intro",
            "transcript": radio_intro_prompt
        })
        return ai_radio_intro

    def segment_script(self, script: str) -> List[Dict]:
        """
        Segment a script into natural speaking chunks.
        
        Args:
            script (str): The script to segment
            
        Returns:
            List[Dict]: List of segments with audio text and parameters
        """
        # Split by sentence endings and commas
        segments = []
        sentences = re.split(r'([.!?][\s\n]+|\.\.\.\s*|,\s+)', script)
        current_segment = ""
        
        for i in range(0, len(sentences), 2):
            if i < len(sentences):
                text = sentences[i]
                delimiter = sentences[i + 1] if i + 1 < len(sentences) else ""
                
                if text.strip():
                    segment = {
                        "audio": text.strip() + (delimiter.strip() if delimiter else ""),
                        "speed": random.uniform(0.95, 1.05),  # Slight speed variation for natural feel
                        "break_after": random.randint(400, 1200)  # Variable pauses between segments
                    }
                    segments.append(segment)
        
        return segments

    def generate_script_and_segments(self, artist_name: str) -> Dict:
        """
        Generate radio script for an artist.
        This is the first step in the radio generation process.
        
        Args:
            artist_name (str): Name of the artist
            
        Returns:
            Dict: Contains script and metadata
        """
        # Get song data
        songs_data = self.get_songs_data(artist_name)
        
        # Generate script
        radio_intro = self.generate_script(artist_name, songs_data)

        return {
            "artist": artist_name,
            "total_songs": len(songs_data),
            "radio_intro_prompt": self.generate_radio_intro_prompt(songs_data),
            "ai_radio_intro": radio_intro
        }

    def generate_segments(self, script: str) -> List[Dict]:
        """
        Generate segments from a radio script.
        This is called separately after script generation.
        
        Args:
            script (str): The radio script to segment
            
        Returns:
            List[Dict]: List of segmented script parts
        """
        return self.segment_script(script)

    def generate_segment_audio_files(self, artist_name: str, segments: List[Dict], prefix: str = '') -> List[str]:
        """
        Generate audio files for a list of segments
        
        Args:
            artist_name (str): Name of the artist
            segments (List[Dict]): List of segments to generate audio for
            prefix (str): Optional prefix for the generated files
            
        Returns:
            List[str]: List of generated audio file paths
        """
        audio_files = []
        cache_dir = os.path.join("cache", "audio")
        os.makedirs(cache_dir, exist_ok=True)
        
        audio_gen = AudioGenerator()
        
        for i, segment in enumerate(segments):
            segment_text = segment.get('text', '')
            if not segment_text:
                continue
                
            filename = f"{artist_name}_{prefix}_{i}_{uuid.uuid4().hex[:8]}.mp3"
            output_path = os.path.join(cache_dir, filename)
            
            try:
                audio_gen.generate_radio_intro_audio(
                    segment_text,
                    output_path=output_path
                )
                
                if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                    audio_files.append(output_path)
                    
            except Exception as e:
                print(f"Error generating audio for segment {i}: {str(e)}")
                continue
                
        return audio_files

    def combine_audio_files(self, audio_files: List[str], output_path: str, enable_dj_transitions: bool = False, artist_name: str = None) -> bool:
        """
        Combine multiple audio files into a single output file, properly handling transitions.
        
        Args:
            audio_files (List[str]): List of audio file paths to combine
            output_path (str): Path where the combined audio should be saved
            enable_dj_transitions (bool): Whether DJ transitions are enabled
            artist_name (str, optional): Name of the artist
            
        Returns:
            bool: True if combination was successful, False otherwise
        """
        try:
            from pydub import AudioSegment
            
            # Initialize the combined audio
            combined = AudioSegment.empty()
            
            print(f"Processing audio combination for artist: {artist_name}")
            songs = self.music_manager.get_artist_songs(artist_name)
            if not songs:
                print(f"No songs found for artist '{artist_name}'")
                return False

            # Group files by type and sort them
            intro_files = sorted([f for f in audio_files if 'intro_' in f.lower()],
                               key=lambda x: int(x.split('intro_')[1].split('_')[0]))
            transition_files = [f for f in audio_files if 'transition_' in f.lower()]
            
            print(f"Found {len(intro_files)} intro segments and {len(transition_files)} transitions")
            
            # Add intro segments first in order
            for intro in intro_files:
                try:
                    audio = AudioSegment.from_file(intro)
                    combined += audio
                    print(f"Added intro segment: {os.path.basename(intro)}")
                except Exception as e:
                    print(f"Error adding intro {intro}: {str(e)}")
                    continue
            
            # Add songs and transitions alternately
            for i, song in enumerate(songs):
                try:
                    # Add the song
                    song_audio = AudioSegment.from_file(song['path'])
                    combined += song_audio
                    print(f"Added song: {song['name']}")
                    
                    # Add transition if available and not the last song
                    if enable_dj_transitions and i < len(songs) - 1:
                        matching_transitions = [t for t in transition_files if f'transition_{i}' in t]
                        if matching_transitions:
                            transition_audio = AudioSegment.from_file(matching_transitions[0])
                            combined += transition_audio
                            print(f"Added transition after song {i+1}")
                except Exception as e:
                    print(f"Error adding song {song['name']}: {str(e)}")
                    continue
            
            # Export the final combined audio
            combined.export(output_path, format="mp3")
            print(f"Successfully exported combined audio to {output_path}")
            return True
            
        except Exception as e:
            print(f"Error combining audio files: {str(e)}")
            return False

    def generate_audio(self, artist_name: str, segmented_radio_intro: List[Dict], dj_options: Dict = None) -> Dict:
        """
        Generate and combine audio segments based on the script.
        This is the second step in the radio generation process.
        
        Args:
            artist_name (str): Name of the artist
            segmented_radio_intro (List[Dict]): List of segmented radio intro data
            dj_options (Dict): Options for DJ transitions
            
        Returns:
            Dict: Contains paths to generated audio files
        """
        try:
            # Create cache directory if it doesn't exist
            cache_dir = os.path.join("cache", "audio")
            os.makedirs(cache_dir, exist_ok=True)
            
            # Generate intro audio first
            final_audio_path = os.path.join(cache_dir, f"{artist_name}_radio_intro.mp3")
            audio_gen = AudioGenerator()
            audio_gen.generate_radio_intro_audio(
                segmented_radio_intro,
                output_path=final_audio_path,
                speed=float(dj_options.get('speed', 1.1)) if dj_options else 1.1
            )
            
            if not os.path.exists(final_audio_path) or os.path.getsize(final_audio_path) == 0:
                raise ValueError(f"Failed to create intro audio file: {final_audio_path}")
            
            # Get songs for this artist
            songs = self.music_manager.get_artist_songs(artist_name)
            if not songs:
                return {"intro_audio": os.path.basename(final_audio_path)}
            
            # Track all audio paths for final combination and cleanup
            all_audio_paths = [final_audio_path]

            # Process each song and add transitions
            for i in range(len(songs)):
                current_song = songs[i]
                song_path = os.path.abspath(current_song['path'])
                print(f"Adding song: {song_path}")
                if not os.path.exists(song_path):
                    raise ValueError(f"Song file not found: {song_path}")
                all_audio_paths.append(song_path)
                
                # If there's a next song and transitions are enabled, generate transition
                if i < len(songs) - 1 and dj_options and dj_options.get('enable_dj_transitions', False):
                    next_song = songs[i + 1]
                    
                    # Generate transition script
                    transition_text = self.generate_dj_transition(
                        current_song,
                        next_song,
                        style=dj_options.get('style', 'smooth'),
                        length=dj_options.get('length', 'medium')
                    )
                    
                    # Segment the transition for more natural speech
                    transition_segments = self.segment_script(transition_text)
                    
                    # Generate audio for transition
                    transition_filename = f"{artist_name}_transition_{i}_{uuid.uuid4().hex[:8]}.mp3"
                    transition_path = os.path.join(cache_dir, transition_filename)
                    print(f"Generating transition: {transition_path}")
                    
                    audio_gen.generate_radio_intro_audio(
                        transition_segments,
                        output_path=transition_path,
                        speed=float(dj_options.get('speed', 1.1))
                    )
                    
                    if os.path.exists(transition_path) and os.path.getsize(transition_path) > 0:
                        all_audio_paths.append(transition_path)
                    else:
                        raise ValueError(f"Failed to create transition audio file: {transition_path}")

            # Combine everything into the final show
            full_show_path = os.path.join(cache_dir, f"{artist_name}_full_show.mp3")
            print(f"Creating final show: {full_show_path}")
            self.combine_audio_files(all_audio_paths, full_show_path, dj_options.get('enable_dj_transitions', False), artist_name)

            # Verify the final file was created
            if not os.path.exists(full_show_path) or os.path.getsize(full_show_path) == 0:
                raise ValueError(f"Failed to create final show audio file: {full_show_path}")

            return {
                "intro_audio": os.path.basename(final_audio_path),
                "full_show_audio": os.path.basename(full_show_path)
            }

        except Exception as e:
            print(f"Error generating radio intro audio: {str(e)}")
            # Clean up any partial files
            for path in all_audio_paths:
                if os.path.exists(path):
                    os.remove(path)
            raise ValueError(f"Audio generation failed: {str(e)}")

    def generate_content(self, artist_name: str) -> Dict:
        """
        Legacy method that combines both steps for backward compatibility.
        Consider using generate_script_and_segments and generate_audio separately.
        """
        script_data = self.generate_script_and_segments(artist_name)
        try:
            audio_data = self.generate_audio(artist_name, script_data["segmented_radio_intro"])
            script_data.update(audio_data)
        except Exception as e:
            print(f"Error in audio generation: {e}")
        return script_data

    def generate_dj_transition(self, current_song: Dict, next_song: Dict, style: str = "energetic", length: str = "medium") -> str:
        """
        Generate a DJ transition between two songs using AI.
        
        Args:
            current_song (Dict): Current song data
            next_song (Dict): Next song data
            style (str): Style of the transition
            length (str): Length of the transition
            
        Returns:
            str: Generated transition script
        """
        # Define length parameters (in words)
        length_params = {
            "short": (15, 25),
            "medium": (25, 40),
            "long": (40, 60)
        }
        min_words, max_words = length_params.get(length, length_params["medium"])
        
        # Create base transition prompt
        base_prompt = f"""You are a professional radio DJ creating a smooth transition between songs.
        Current Song: {current_song.get('name', '')} by {current_song.get('artist', '')}
        Next Song: {next_song.get('name', '')} by {next_song.get('artist', '')}
        
        Create a natural, engaging transition that:
        1. References elements or mood from the current song
        2. Creates anticipation for the next song
        3. Maintains the energy and flow
        4. Sounds human and conversational
        
        Keep it between {min_words} and {max_words} words.
        Make it feel like a real radio DJ speaking naturally."""

        # Define style-specific additions
        style_additions = {
            "energetic": "\nUse high-energy language and create excitement!",
            "smooth": "\nKeep it mellow and flowing, perfect for late-night radio.",
            "storytelling": "\nWeave a brief narrative that connects these songs together.",
            "technical": "\nInclude interesting musical or production details about the songs.",
            "poetic": "\nUse metaphors and poetic language to paint a mood."
        }
        
        # Combine prompts
        full_prompt = base_prompt + style_additions.get(style, style_additions["smooth"])
        
        # Generate transition using AI
        transition = self.ai_processor.process_song({
            "artist": "DJ",
            "name": "song_transition",
            "transcript": full_prompt
        })

        return transition.strip()