import wit
import os
# Create a client object
client = wit.SpeechClient()

# Set the environment variable
os.environ["WIT_API_KEY"] = "YOUR_WIT_API_KEY"

# Transcribe an audio file
audio_file = "audio.wav"
with open(audio_file, "rb") as f:
    audio = f.read()
    try:
        # Transcribe the audio file
        transcript = client.recognize(audio)
        print(transcript)
    except wit.errors.WitError:
        print("Wit could not understand audio")
