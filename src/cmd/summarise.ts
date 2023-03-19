import fs from 'fs';
import {
  downloadAudioFromVideo,
  summariseText,
  transcribeAudioFile,
} from '../util';

const OUTPUT_AUDIO_FILE = 'audio.mp3';
const TRANSCRIPT_FILE = 'transcription.txt';
const SUMMARY_FILE = 'summary.txt';
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function summarise(
  videoURL: string,
  {
    apiKey,
    keepAudioFile = false,
    keepTranscriptFile = false,
    keepSummaryFile = false,
    audioFile = OUTPUT_AUDIO_FILE,
    transcriptFile = TRANSCRIPT_FILE,
    summaryFile = SUMMARY_FILE,
  }: {
    apiKey: string;
    keepAudioFile?: boolean;
    keepTranscriptFile?: boolean;
    keepSummaryFile?: boolean;
    audioFile?: string;
    transcriptFile?: string;
    summaryFile?: string;
  },
) {
  try {
    if (!fs.existsSync(audioFile)) {
      await downloadAudioFromVideo(videoURL, audioFile);
    }
    let transcription: string | undefined;
    if (fs.existsSync(transcriptFile)) {
      transcription = fs.readFileSync(transcriptFile, 'utf-8');
    } else {
      transcription = await transcribeAudioFile(audioFile, { apiKey });
      fs.writeFileSync(transcriptFile, transcription);
    }
    const summary = await summariseText(transcription, { apiKey });
    fs.writeFileSync(summaryFile, summary);
    console.log(summary);
  } catch (e) {
    console.error(e);
  } finally {
    const cleanUps: PromiseLike<any>[] = [];
    if (!keepAudioFile) {
      cleanUps.push(fs.promises.rm(audioFile));
    }
    if (!keepTranscriptFile) {
      cleanUps.push(fs.promises.rm(transcriptFile));
    }
    if (!keepSummaryFile) {
      cleanUps.push(fs.promises.rm(summaryFile));
    }
    await Promise.allSettled(cleanUps);
  }
}

export default summarise;
