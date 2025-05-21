import os
from typing import List, Dict
from pathlib import Path
from flask import current_app

class MusicManager:
    def __init__(self):
        """
        Initialize the MusicManager with the base path for music uploads
        """
        self.base_path = Path(current_app.config['BACKEND_ROOT']) / "music_uploads"
        self._ensure_base_directory()

    def _ensure_base_directory(self):
        """Ensure the base directory exists"""
        self.base_path.mkdir(parents=True, exist_ok=True)

    def get_all_artists(self) -> List[str]:
        """
        Get a list of all artist directories
        
        Returns:
            List[str]: List of artist names
        """
        return [d.name for d in self.base_path.iterdir() if d.is_dir()]

    def get_artist_songs(self, artist_name: str) -> List[Dict[str, str]]:
        """
        Get all songs for a specific artist
        
        Args:
            artist_name (str): Name of the artist
            
        Returns:
            List[Dict[str, str]]: List of song information dictionaries
        """
        artist_path = self.base_path / artist_name
        if not artist_path.exists():
            raise ValueError(f"Artist directory '{artist_name}' does not exist")

        print(f"\n=== Scanning for songs in {artist_path} ===")
        print("Found files:")
        for file in artist_path.iterdir():
            print(f"- {file.name} ({file.suffix})")

        songs = []
        for song_file in artist_path.glob("*"):
            if song_file.is_file() and song_file.suffix.lower() in ['.mp3', '.wav', '.m4a']:
                songs.append({
                    'name': song_file.stem,
                    'path': str(song_file),
                    'format': song_file.suffix[1:],
                    'size': song_file.stat().st_size
                })
        
        print(f"\nFound {len(songs)} audio files:")
        for song in songs:
            print(f"- {song['name']} ({song['format']})")
        
        return songs

    def create_artist_directory(self, artist_name: str) -> bool:
        """
        Create a new artist directory
        
        Args:
            artist_name (str): Name of the artist
            
        Returns:
            bool: True if directory was created, False if it already exists
        """
        artist_path = self.base_path / artist_name
        if artist_path.exists():
            return False
        
        artist_path.mkdir(parents=True)
        return True

    def get_artist_info(self, artist_name: str) -> Dict:
        """
        Get information about an artist and their songs
        
        Args:
            artist_name (str): Name of the artist
            
        Returns:
            Dict: Artist information including song count and total size
        """
        songs = self.get_artist_songs(artist_name)
        total_size = sum(song['size'] for song in songs)
        
        return {
            'name': artist_name,
            'song_count': len(songs),
            'total_size': total_size,
            'songs': songs
        } 