import fs from "fs";
import OpenAI from "openai";

import { downloadAudioFromURL } from "../downloader/audio";

export async function transcribe(
  url: string,
  {
    openai,
    keepAudioFile = false,
    keepTranscriptFile = false,
    audioFile,
    transcriptFile,
  }: {
    openai: OpenAI;
    keepAudioFile?: boolean;
    keepTranscriptFile?: boolean;
    audioFile: string;
    transcriptFile: string;
  },
) {
  try {
    if (!fs.existsSync(audioFile)) {
      await downloadAudioFromURL(url, audioFile);
    }

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFile),
      model: "whisper-1",
    });
    fs.writeFileSync(transcriptFile, transcription.text);

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
