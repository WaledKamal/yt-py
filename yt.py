import yt_dlp
import os
import sys
import platform
import subprocess

def download_video(url, quality, output_path='./downloads'):
    ydl_opts = {
        'format': quality,  # Set quality based on user input 
        'outtmpl': os.path.join(output_path, '%(title)s.%(ext)s'),  # Output path template
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])


def download_playlist(url, quality, output_path='./downloads'):
    ydl_opts = {
        'format': quality,  # Set quality based on user input
        'outtmpl': os.path.join(output_path, '%(playlist)s/%(title)s.%(ext)s'),  # Save in a folder by playlist name
        'noplaylist': False,  # Ensure playlist downloads
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])


def open_folder(path):
    if platform.system() == "Windows":
        os.startfile(path)  # Open folder on Windows
    elif platform.system() == "Linux":
        subprocess.Popen(['xdg-open', path])  # Open folder on Linux
    else:
        print(f"Opening folder not supported on {platform.system()}")


if __name__ == "__main__":
    url = input("Enter the URL of the video or playlist: ")
    
    # Create output directory if it doesn't exist
    output_path = './downloads'
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    
    # Ask for quality selection
    print("Choose quality:")
    print("1. Best quality (default)")
    print("2. 1080p")
    print("3. 720p")
    print("4. 480p")
    print("5. Audio only")
    
    choice = input("Enter the number of your choice: ").strip()

    # Map choice to yt-dlp format string
    if choice == '1':
        quality = 'best'
    elif choice == '2':
        quality = 'bestvideo[height<=1080]+bestaudio/best'
    elif choice == '3':
        quality = 'bestvideo[height<=720]+bestaudio/best'
    elif choice == '4':
        quality = 'bestvideo[height<=480]+bestaudio/best'
    elif choice == '5':
        quality = 'bestaudio'
    else:
        print("Invalid choice. Defaulting to best quality.")
        quality = 'best'
    
    # Check if it's a playlist or a single video
    is_playlist = input("Is this a playlist? (y/n): ").strip().lower() == 'y'
    
    if is_playlist:
        download_playlist(url, quality, output_path)
    else:
        download_video(url, quality, output_path)
    
    print("Download completed!")
    
    # Open the folder after download
    open_folder(output_path)
