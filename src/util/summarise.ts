import axios from 'axios';

export async function summarise(text: string, { apiKey }: { apiKey: string }) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant who outlines, in point format, important details of text provided to you`,
          },
          { role: 'user', content: `${text}` },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      },
    );
    console.log(response.data);
    return response.data.choices[0].message.content;
  } catch (e) {
    console.error('Error summarising:', e);
  }
}
