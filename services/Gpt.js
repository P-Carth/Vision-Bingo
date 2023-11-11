// Gpt.js
import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'REPLACE_WITH_OPENAI_API_KEY'; // replace with your API key

class Gpt {
  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    });
  }

  async createChatCompletion(messages) {
    try {
      const response = await this.client.post('', {
        model: 'gpt-4-vision-preview', // GPT model
        messages: messages,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating chat completion:', error);
      throw error;
    }
  }
}

export default new Gpt();
