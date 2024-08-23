import fs from "fs";
import OpenAI from "openai";

import { downloadAudioFromURL } from "../downloader/audio";

export async function summarise(
  url: string,
  {
    openai,
    keepAudioFile = false,
    keepTranscriptFile = false,
    keepSummaryFile = false,
    audioFile,
    transcriptFile,
    summaryFile,
  }: {
    openai: OpenAI;
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
      await downloadAudioFromURL(url, audioFile);
    }

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFile),
      model: "whisper-1",
    });
    fs.writeFileSync(transcriptFile, transcription.text);

    const summary = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Summarise in point form. Do not miss important details. Start by providing a title for the summary.`,
        },
        { role: "user", content: transcription.text },
      ],
    });
    fs.writeFileSync(summaryFile, summary.choices[0].message.content);

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
