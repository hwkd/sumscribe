import youtubedl from "youtube-dl-exec";

export async function downloadAudioFromVideo(
  videoUrl: string,
  outputFile: string
): Promise<void> {
  try {
    await youtubedl(videoUrl, {
      extractAudio: true,
      audioFormat: "mp3",
      output: outputFile,
    });
  } catch (error) {
    console.error("Error downloading audio file:", error);
  }
}
