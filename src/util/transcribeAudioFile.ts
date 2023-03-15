import fs from "fs";
import axios from "axios";
import FormData from "form-data";

export async function transcribeAudioFile(
  audioFile: string,
  apiKey: string
): Promise<string | undefined> {
  try {
    console.log("Transcribing audio file:", audioFile);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(audioFile));
    formData.append("model", "whisper-1");

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      formData,
      {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.text;
  } catch (error) {
    console.error("Error transcribing audio file:", error);
  }
}
