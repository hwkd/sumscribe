import youtubedl from "youtube-dl-exec";

export async function downloadAudioFromURL(
  url: string,
  outputFile: string,
): Promise<void> {
  try {
    await youtubedl(url, {
      extractAudio: true,
      audioFormat: "mp3",
      output: outputFile,
    });
  } catch (error) {
    console.error("Error downloading audio file:", error);
  }
}
