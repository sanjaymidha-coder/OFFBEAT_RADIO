from pydub import AudioSegment

def combine_audio_segments(segment_paths, output_path):
    combined = AudioSegment.empty()

    print(segment_paths)
    for path in segment_paths:
        seg = AudioSegment.from_file(path)
        combined += seg
    combined.export(output_path, format="mp3")
    return output_path
