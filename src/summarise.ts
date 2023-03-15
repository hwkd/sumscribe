import fs from "fs";
import { downloadAudioFromVideo, summarise, transcribeAudioFile } from "./util";

const OUTPUT_AUDIO_FILE = "audio.mp3";
const TRANSCRIPT_FILE = "transcription.txt";
const SUMMARY_FILE = "summary.txt";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

(async () => {
  const videoURL = process.argv[2];

  if (!fs.existsSync(OUTPUT_AUDIO_FILE)) {
    await downloadAudioFromVideo(videoURL, OUTPUT_AUDIO_FILE);
  }

  let transcription: string | undefined;
  if (fs.existsSync(TRANSCRIPT_FILE)) {
    transcription = fs.readFileSync(TRANSCRIPT_FILE, "utf-8");
  } else {
    transcription = await transcribeAudioFile(
      OUTPUT_AUDIO_FILE,
      OPENAI_API_KEY
    );
    fs.writeFileSync(TRANSCRIPT_FILE, transcription);
  }
  const summary = await summarise(transcription, {
    apiKey: OPENAI_API_KEY,
  });
  fs.writeFileSync(SUMMARY_FILE, summary);
  console.log(summary);
})();
