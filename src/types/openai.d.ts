declare module 'openai' {
  export default class OpenAI {
    completions: any;
    constructor(options: { apiKey: string });
    audio: {
      speech: {
        create: (params: { model: string; voice: strnoming; input: string }) => Promise<any>;
      };
    };
  }
} 
// src/types/openai.d.ts