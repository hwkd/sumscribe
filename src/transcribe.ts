import fs from "fs";
import { downloadAudioFromVideo, summarise, transcribeAudioFile } from "./util";

const YOUTUBE_VIDEO_URL = "https://www.youtube.com/watch?v=gFUPQosicqU";
const OUTPUT_AUDIO_FILE = "audio.mp3";
const TRANSCRIPT_FILE = "transcription.txt";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

(async () => {
  if (!fs.existsSync(OUTPUT_AUDIO_FILE)) {
    await downloadAudioFromVideo(YOUTUBE_VIDEO_URL, OUTPUT_AUDIO_FILE);
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
  console.log(transcribeAudioFile);
})();
