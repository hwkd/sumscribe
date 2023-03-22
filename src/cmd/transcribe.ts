import fs from 'fs';
import { downloadAudioFromVideo, transcribeAudioFile } from '../util';

const OUTPUT_AUDIO_FILE = 'audio.mp3';
const TRANSCRIPT_FILE = 'transcription.txt';
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function transcribe(
  videoURL: string,
  {
    apiKey,
    keepAudioFile = false,
    keepTranscriptFile = false,
    audioFile,
    transcriptFile,
  }: {
    apiKey: string;
    keepAudioFile?: boolean;
    keepTranscriptFile?: boolean;
    audioFile: string;
    transcriptFile: string;
  },
) {
  try {
    if (!fs.existsSync(audioFile)) {
      await downloadAudioFromVideo(videoURL, audioFile);
    }

    const transcription = await transcribeAudioFile(audioFile, { apiKey });
    fs.writeFileSync(transcriptFile, transcription);

    console.log(transcription);
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
    await Promise.allSettled(cleanUps);
  }
}

export default transcribe;
