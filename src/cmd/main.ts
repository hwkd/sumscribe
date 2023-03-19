import inquirer from 'inquirer';
import summarise from './summarise';

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
    },
  ])
  .then((answers) => {
    switch (answers.cmd) {
      case 'Summarise':
        summarise(answers.videoURL, {
          apiKey: process.env.OPENAI_API_KEY!,
          keepSummaryFile: true,
          keepAudioFile: true,
          keepTranscriptFile: true,
        });
        break;
      case 'Transcribe':
        console.log('Transcribe');
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
