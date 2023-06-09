import fs from 'fs';
import {
  downloadAudioFromVideo,
  summariseText,
  transcribeAudioFile,
} from '../util';

export async function summarise(
  videoURL: string,
  {
    apiKey,
    keepAudioFile = false,
    keepTranscriptFile = false,
    keepSummaryFile = false,
    audioFile,
    transcriptFile,
    summaryFile,
  }: {
    apiKey: string;
    keepAudioFile?: boolean;
    keepTranscriptFile?: boolean;
    keepSummaryFile?: boolean;
    audioFile: string;
    transcriptFile: string;
    summaryFile: string;
  },
) {
  try {
    if (!fs.existsSync(audioFile)) {
      await downloadAudioFromVideo(videoURL, audioFile);
    }

    const transcription = await transcribeAudioFile(audioFile, { apiKey });
    fs.writeFileSync(transcriptFile, transcription);

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
