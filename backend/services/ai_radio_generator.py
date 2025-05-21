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
    def __init__(self, use_openai: bool = True):
        """
        Initialize AIRadioGenerator with option to use OpenAI or local processing.
        
        Args:
            use_openai (bool): Whether to use OpenAI (True) or local processing (False)
        """
        self.music_manager = MusicManager()
        self.transcriber = WhisperTranscriber()
        self.templates = self._load_templates()
        self.ai_processor = AIProcessor(use_openai=use_openai)

    def _load_templates(self) -> Dict:
        """
        Load radio intro templates from JSON file.
        """
        template_path = os.path.join(current_app.config['BACKEND_ROOT'], 'data', 'radio_intro_templates.json')
        with open(template_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def generate_radio_intro_prompt(self, songs_data: List[Dict]) -> str:
        """
        Generate an energetic, poetic, and engaging radio intro prompt for multiple songs.

        Args:
            songs_data (List[Dict]): List containing song information (name and transcript).

        Returns:
            str: Refined AI-generated energetic radio intro prompt.
        """
        # Prepare and truncate song transcripts
        song_transcripts = []
        for song in songs_data:
            truncated_transcript = (
                song['transcript'][:200].rstrip() + "..." if len(song['transcript']) > 200 else song['transcript']
            )
            song_transcripts.append(
                f"Song: {song['song_name']}\nTranscript Excerpt: \"{truncated_transcript}\"\n"
            )

        all_transcripts = "\n".join(song_transcripts)

        # Format example templates for clarity
        example_templates = "\n".join(
            f"Example Script: {template['script']}" for template in self.templates['intro_templates']
        )

# EXAMPLES (replace placeholders with actual artist and song names):
# {example_templates}

        # Craft a clear and vibrant prompt for AI
        prompt = f"""You're an enthusiastic, vibrant radio DJ known for your energetic, poetic intros, inspired by the dynamic styles of BBC Radio 1 and NPR.

TASK:
Craft an energetic, poetic, and captivating radio intro script (max 80 words).

TONE & STYLE:
- Uplifting, lively, and passionate
- Expressive and poetic, using vivid imagery or dynamic storytelling
- Naturally conversational, spontaneous, and engaging

SONG TRANSCRIPTS:
{all_transcripts}



INSTRUCTIONS:
- Enthusiastically greet listeners
- Immediately establish an exciting and vibrant mood aligned with song lyrics
- Seamlessly introduce the upcoming artist and track at the end
- Keep it punchy, lively, and memorable
- Use authentic language, avoiding clichés
- Ensure the script is a complete, finished piece without abrupt endings.

Provide ONLY the final energetic radio script—no explanations or additional formatting."""

        return prompt


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
        # Increased max_tokens for the initial script generation
        return self.ai_processor.process_song({
            "artist": artist_name,
            "name": f"{artist_name} radio intro",
            "transcript": radio_intro_prompt
        }, max_tokens=500)

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

    def combine_audio_files(self, audio_files: List[str], output_path: str, enable_dj_transitions: bool = False, artist_name: str = None) -> bool:
        """
        Combine multiple audio files into a single output file, properly handling transitions.
        """
        try:
            from pydub import AudioSegment
            
            # Initialize the combined audio
            combined = AudioSegment.empty()
            
            print(f"\n=== Starting Audio Combination ===")
            print(f"Output path: {output_path}")
            print(f"Number of audio files to combine: {len(audio_files)}")
            print(f"Files to combine: {audio_files}")
            
            songs = self.music_manager.get_artist_songs(artist_name)
            if not songs:
                print(f"No songs found for artist '{artist_name}'")
                return False

            # Group files by type
            intro_files = [f for f in audio_files if 'intro_' in f.lower()]
            transition_files = [f for f in audio_files if 'transition_' in f.lower()]
            
            print(f"\nFound {len(intro_files)} intro segments and {len(transition_files)} transitions")
            print(f"Intro files: {intro_files}")
            print(f"Transition files: {transition_files}")
            
            # Add intro segments first
            for intro in intro_files:
                try:
                    print(f"\nProcessing intro: {intro}")
                    if not os.path.exists(intro):
                        print(f"Warning: Intro file not found: {intro}")
                        continue
                        
                    audio = AudioSegment.from_file(intro)
                    print(f"Intro duration: {len(audio)/1000:.2f} seconds")
                    combined += audio
                    print(f"Successfully added intro segment: {os.path.basename(intro)}")
                except Exception as e:
                    print(f"Error adding intro {intro}: {str(e)}")
                    continue
            
            # Add songs and transitions alternately
            for i, song in enumerate(songs):
                try:
                    print(f"\nProcessing song {i+1}: {song['name']}")
                    if not os.path.exists(song['path']):
                        print(f"Warning: Song file not found: {song['path']}")
                        continue
                        
                    # Add the song
                    song_audio = AudioSegment.from_file(song['path'])
                    print(f"Song duration: {len(song_audio)/1000:.2f} seconds")
                    combined += song_audio
                    print(f"Successfully added song: {song['name']}")
                    
                    # Add transition if available and not the last song
                    if enable_dj_transitions and i < len(songs) - 1:
                        matching_transitions = [t for t in transition_files if f'transition_{i}' in t]
                        if matching_transitions:
                            transition_path = matching_transitions[0]
                            print(f"\nProcessing transition: {transition_path}")
                            if not os.path.exists(transition_path):
                                print(f"Warning: Transition file not found: {transition_path}")
                                continue
                                
                            transition_audio = AudioSegment.from_file(transition_path)
                            print(f"Transition duration: {len(transition_audio)/1000:.2f} seconds")
                            combined += transition_audio
                            print(f"Successfully added transition after song {i+1}")
                except Exception as e:
                    print(f"Error processing song {song['name']}: {str(e)}")
                    continue
            
            print(f"\nFinal combined duration: {len(combined)/1000:.2f} seconds")
            print(f"Exporting to: {output_path}")
            
            # Create output directory if it doesn't exist
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Export the final combined audio
            combined.export(output_path, format="mp3")
            print(f"Successfully exported combined audio to {output_path}")
            
            # Verify the file was created and has content
            if not os.path.exists(output_path):
                raise Exception(f"Output file was not created: {output_path}")
            if os.path.getsize(output_path) == 0:
                raise Exception(f"Output file is empty: {output_path}")
                
            return True
            
        except Exception as e:
            print(f"\nError combining audio files: {str(e)}")
            return False

    def generate_audio(self, artist_name: str, script: str, dj_options: Dict = None) -> Dict:
        """
        Generate audio from an SSML-enhanced script.
        This is the second step in the radio generation process.
        """
        # Initialize all_audio_paths at the start
        all_audio_paths = []
        generated_files = []  # Track only the files we generate
        
        try:
            # Create cache directory if it doesn't exist
            cache_dir = os.path.join("cache", "audio")
            os.makedirs(cache_dir, exist_ok=True)
            
            # Generate intro audio with SSML
            final_audio_path = os.path.join(cache_dir, f"{artist_name}_radio_intro_combined.mp3")
            audio_gen = AudioGenerator()
            
            print("\n=== Script being sent to ElevenLabs ===")
            print(f"Length: {len(script)} characters")
            print(f"Content: {script}\n")
            
            # Generate audio with SSML support
            audio_gen.generate_radio_intro_audio(
                script,
                output_path=final_audio_path,
                use_ssml=True  # New parameter to indicate SSML support
            )
            
            if not os.path.exists(final_audio_path) or os.path.getsize(final_audio_path) == 0:
                raise ValueError(f"Failed to create intro audio file: {final_audio_path}")
            
            # Get songs for this artist
            songs = self.music_manager.get_artist_songs(artist_name)
            if not songs:
                return {"intro_audio": os.path.basename(final_audio_path)}
            
            # Add the intro audio path
            all_audio_paths.append(final_audio_path)
            generated_files.append(final_audio_path)  # Track this as a generated file

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
                    
                    # Enhance transition with SSML
                    enhanced_transition = self.enhance_script_with_emphasis(transition_text)
                    
                    # Generate audio for transition
                    transition_filename = f"{artist_name}_transition_{i}_{uuid.uuid4().hex[:8]}.mp3"
                    transition_path = os.path.join(cache_dir, transition_filename)
                    print(f"Generating transition: {transition_path}")
                    
                    audio_gen.generate_radio_intro_audio(
                        enhanced_transition,
                        output_path=transition_path,
                        use_ssml=True  # New parameter to indicate SSML support
                    )
                    
                    if os.path.exists(transition_path) and os.path.getsize(transition_path) > 0:
                        all_audio_paths.append(transition_path)
                        generated_files.append(transition_path)  # Track this as a generated file
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
            # Clean up only the generated files, not the original songs
            for path in generated_files:
                if os.path.exists(path):
                    print(f"Cleaning up generated file: {path}")
                    os.remove(path)
            raise ValueError(f"Audio generation failed: {str(e)}")

    def generate_content(self, artist_name: str) -> Dict:
        """
        Legacy method that combines both steps for backward compatibility.
        Consider using generate_script_and_segments and generate_audio separately.
        """
        script_data = self.generate_script_and_segments(artist_name)
        try:
            audio_data = self.generate_audio(artist_name, script_data["ai_radio_intro"])
            script_data.update(audio_data)
        except Exception as e:
            print(f"Error in audio generation: {e}")
        return script_data

    def generate_dj_transition(self, current_song: Dict, next_song: Dict, style: str = "energetic", length: str = "medium") -> str:
        """
        Generate a vibrant, engaging AI DJ transition between two songs.

        Args:
            current_song (Dict): Information about the current song.
            next_song (Dict): Information about the next song.
            style (str): Desired speaking style ("energetic", "smooth", "storytelling", "technical", "poetic").
            length (str): Length of transition ("short", "medium", "long").

        Returns:
            str: AI-generated DJ transition script.
        """
        # Extract excerpts from transcripts (first 2-3 lines)
        current_excerpt = ' '.join(current_song.get('transcript', '').split('\n')[:3])
        next_excerpt = ' '.join(next_song.get('transcript', '').split('\n')[:3])

        # Define length ranges (words)
        length_ranges = {
            "short": (15, 30),
            "medium": (30, 50),  # Target 30-50 words for medium length
            "long": (50, 80)
        }
        min_words, max_words = length_ranges.get(length, length_ranges["medium"]) # Default to medium

        # Construct the AI prompt with vibrant language
        prompt = f"""You are a high-energy, charismatic radio DJ renowned for crafting vibrant, captivating transitions between songs.

        CURRENT SONG:
        Title: {current_song.get('name', 'Unknown Title')}
        Artist: {current_song.get('artist', 'Unknown Artist')}
        Lyric Excerpt: "{current_excerpt}"

        NEXT SONG:
        Title: {next_song.get('name', 'Unknown Title')}
        Artist: {next_song.get('artist', 'Unknown Artist')}
        Lyric Excerpt: "{next_excerpt}"

        INSTRUCTIONS:
        - Highlight the high-energy mood or standout theme from the current song
        - Generate enthusiasm and build anticipation for the next track
        - Use vibrant, engaging, and conversational language
        - Connect thematic elements seamlessly
        - Length: between {min_words} and {max_words} words
        - Style: {style}
        - Ensure the transition script is a complete, finished piece without abrupt endings.

        STYLE GUIDELINES:
        {self._get_style_instructions(style)}

        Return ONLY the energetic transition script without additional notes or explanations."""

        # Generate the transition script with increased max_tokens
        transition_script = self.ai_processor.process_song({
            "artist": "AI DJ",
            "name": "song_transition",
            "transcript": prompt
        }, max_tokens=300).strip().strip('"\'') # Increased max_tokens to 300

        # Fallback if transition is still too brief (adjust threshold if needed)
        if len(transition_script.split()) < min_words * 0.8: # Fallback if significantly shorter than min words
             print(f"Warning: Generated transition is too short ({len(transition_script.split())} words). Using fallback.")
             transition_script = self._generate_fallback_transition(current_song, next_song, current_excerpt, next_excerpt)

        return transition_script

    def _get_style_instructions(self, style: str) -> str:
        """
        Get style-specific instructions for transitions.

        Args:
            style (str): The desired style

        Returns:
            str: Style instructions
        """
        style_instructions = {
            "energetic": "Bring high energy, excitement, and lively language to energize your listeners!",
            "smooth": "Use a soothing, relaxed tone, perfect for mellow or late-night sets.",
            "storytelling": "Connect songs through a brief, engaging story.",
            "technical": "Discuss intriguing musical aspects or production details of the songs.",
            "poetic": "Use poetic, metaphor-rich language to create an emotional connection."
        }
        return style_instructions.get(style, style_instructions["smooth"])


    def _generate_fallback_transition(self, current_song: Dict, next_song: Dict, current_excerpt: str, next_excerpt: str) -> str:
        """
        Generate a fallback transition when the AI-generated one is too brief.
        
        Args:
            current_song (Dict): Current song information
            next_song (Dict): Next song information
            current_excerpt (str): Current song excerpt
            next_excerpt (str): Next song excerpt
            
        Returns:
            str: Fallback transition script
        """
        return (
            f"That was '{current_song.get('name', '')}' by {current_song.get('artist', '')}, "
            f"bringing you {current_excerpt[:100]}... "
            f"Next up is '{next_song.get('name', '')}' by {next_song.get('artist', '')}, "
            f"which {next_excerpt[:100]}..."
        )

    def generate_enhanced_script(self, artist_name: str, songs_data: List[Dict]) -> str:
        """
        Generate a clean, natural radio script using the existing prompt structure.
        The script will be enhanced with SSML in a separate step.
        """
        # Use the existing prompt generation logic
        radio_intro_prompt = self.generate_radio_intro_prompt(songs_data)
        
        # Generate the script using the existing prompt
        return self.ai_processor.process_song({
            "artist": artist_name,
            "name": f"{artist_name} radio intro",
            "transcript": radio_intro_prompt
        })

    def enhance_script_with_emphasis(self, script: str) -> str:
        """
        Enhance a clean script with SSML markers for dynamic speech using OpenAI.
        """
        prompt = f"""You are a voice production expert. Enhance this radio script with SSML markers for dynamic speech.

        Original script:
        {script}

        Return ONLY the SSML-enhanced script with no explanations or notes. Use this format:
        <speak>
            <prosody rate="fast" pitch="+25%">
                <emphasis level="strong">[HIGH ENERGY OPENING]</emphasis>
            </prosody>
            <break time="800ms"/>
            [REST OF SCRIPT WITH APPROPRIATE EMPHASIS AND PACING]
        </speak>

        Guidelines:
        - Add natural pauses between sentences (300ms to 1500ms)
        - Vary the pitch throughout, using higher pitches sometimes for emphasis or excitement (+5% to +40%)
        - Add emphasis on key words and phrases
        - Adjust speaking rates for different parts
        - Keep the original meaning and flow
        - Make the opening attention-grabbing
        - Create smooth transitions
        - DO NOT include any explanations or reasoning
        - DO NOT include any sound effects or music cues
        - DO NOT include any DJ annotations or voice descriptions
        - ONLY include the actual script with SSML tags
        - Ensure the SSML is well-formed and complete, ending with a closing </speak> tag.

        Return ONLY the SSML-enhanced script, nothing else."""

        # Increased max_tokens to ensure the full SSML is generated
        enhanced_script = self.ai_processor.process_song({
            "artist": "voice_enhancement",
            "name": "enhance_script",
            "transcript": prompt
        }, max_tokens=700)

        # Extract only the SSML content and clean it
        import re

        # First, try to find the SSML content
        ssml_match = re.search(r'<speak>.*?</speak>', enhanced_script, re.DOTALL)
        if ssml_match:
            ssml_content = ssml_match.group(0)

            # Remove any explanatory text or annotations
            ssml_content = re.sub(r'\([^)]*\)', '', ssml_content)  # Remove parenthetical notes
            ssml_content = re.sub(r'\*\*[^*]*\*\*', '', ssml_content)  # Remove bold text
            ssml_content = re.sub(r'\[[^\]]*\]', '', ssml_content)  # Remove bracketed text
            ssml_content = re.sub(r'Reasoning:.*?(?=<|$)', '', ssml_content, flags=re.DOTALL)  # Remove reasoning
            ssml_content = re.sub(r'DJ:.*?(?=<|$)', '', ssml_content, flags=re.DOTALL)  # Remove DJ annotations

            # Clean up any extra whitespace
            ssml_content = re.sub(r'\s+', ' ', ssml_content)
            ssml_content = re.sub(r'>\s+<', '><', ssml_content)

            return ssml_content.strip()

        return enhanced_script