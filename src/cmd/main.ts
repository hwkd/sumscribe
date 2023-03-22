import fs from 'fs';
import inquirer from 'inquirer';
import summarise from './summarise';
import transcribe from './transcribe';

const OUTPUT_AUDIO_FILE = 'audio.mp3';
const TRANSCRIPT_FILE = 'transcription.txt';
const SUMMARY_FILE = 'summary.txt';

let keepAudioFile = false;

inquirer
  .prompt([
    {
      type: 'list',
      name: 'cmd',
      message: 'What do you want to do?',
      choices: ['Summarise', 'Transcribe'],
    },
    {
      type: 'input',
      name: 'videoURL',
      message: "What's the video URL?",
      when: () => {
        const audioFileExists = fs.existsSync(OUTPUT_AUDIO_FILE);
        if (audioFileExists) {
          keepAudioFile = true;
        }
        return !audioFileExists;
      },
    },
  ])
  .then((answers) => {
    switch (answers.cmd) {
      case 'Summarise':
        summarise(answers.videoURL, {
          apiKey: process.env.OPENAI_API_KEY!,
          keepAudioFile,
          keepTranscriptFile: true,
          keepSummaryFile: true,
          audioFile: OUTPUT_AUDIO_FILE,
          transcriptFile: TRANSCRIPT_FILE,
          summaryFile: SUMMARY_FILE,
        });
        break;
      case 'Transcribe':
        transcribe(answers.videoURL, {
          apiKey: process.env.OPENAI_API_KEY!,
          keepAudioFile,
          keepTranscriptFile: true,
          audioFile: OUTPUT_AUDIO_FILE,
          transcriptFile: TRANSCRIPT_FILE,
        });
        break;
      default:
        console.log('Unknown command');
    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
