# Sumscribe

Whisper is a command tool that summarises or transcribes YouTube videos. You can provide a YouTube video URL and receive a summary and/or transcription of the video's content.

## Features

- Automatically transcribe the entire YouTube video
- Generate a summary of the video content
- Save transcriptions and summaries as text files
- Supports multiple languages for transcriptions
- If you put "audio.mp3" file in the project directory, it will use that audio instead of a URL.

## Limitations

- Does not work properly for multi-language videos

## Prerequisites

- Node.js (>= 14.0.0)
- npm (>= 6.0.0)

## Installation

To install and run Whisper on your local machine, follow these steps:

1. Clone the repository:

```
git clone https://github.com/hwkd/sumscribe.git
```

2. Change directory to the project folder:

```
cd sumscribe
```

3. Install the required dependencies:

```
npm install
```

4. Create an `.env` file in the root of the project directory with the following content:

```
OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

5. Run the application:

```
npm start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
