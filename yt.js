const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Define quality options
const qualityOptions = {
    '1080p': 'bestvideo[height<=1080]+bestaudio/best',
    '720p': 'bestvideo[height<=720]+bestaudio/best',
    '360p': 'bestvideo[height<=360]+bestaudio/best',
    'best': 'best'
};

// Ensure download directory exists
const downloadDir = path.join(__dirname, 'download');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
}

// Function to determine if a URL is a playlist
function isPlaylist(url, callback) {
    const command = `yt-dlp --dump-json ${url}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            callback(false);
            return;
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            callback(false);
            return;
        }

        try {
            const info = JSON.parse(stdout);
            if (info.entries && info.entries.length > 1) {
                callback(true); // It's a playlist
            } else {
                callback(false); // It's not a playlist
            }
        } catch (e) {
            console.error('Error parsing JSON:', e);
            callback(false);
        }
    });
}

// Function to download video or playlist
function downloadContent(url, quality) {
    const qualityOption = qualityOptions[quality] || qualityOptions['best']; // Default to 'best'
    isPlaylist(url, (isPlaylist) => {
        const command = isPlaylist
            ? `yt-dlp -f ${qualityOption} --yes-playlist -o '${path.join(downloadDir, '%(title)s.%(ext)s')}' ${url}`
            : `yt-dlp -f ${qualityOption} -o '${path.join(downloadDir, '%(title)s.%(ext)s')}' ${url}`;

        console.log(`Executing command: ${command}`);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
                return;
            }
            console.log(`Output: ${stdout}`);
        });
    });
}

// Prompt user for URL and quality
rl.question('Enter the URL of the video or playlist: ', (url) => {
    console.log('Available quality options: 1080p, 720p, 360p, best');
    rl.question('Enter the quality (e.g., 1080p): ', (quality) => {
        if (!Object.keys(qualityOptions).includes(quality) && quality !== 'best') {
            console.error('Invalid quality option. Defaulting to best.');
            quality = 'best';
        }
        downloadContent(url, quality);
        rl.close();
    });
});
