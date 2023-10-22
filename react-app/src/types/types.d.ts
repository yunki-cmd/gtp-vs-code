
interface ChatMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
}

export interface ResposeCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage; // Ahora `message` es un array de objetos ChatMessage
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}


export interface OpenAIPromts {
  messages: { role: string; content: string }[];
}

export interface responseEvent {
  type: string
  value: ResposeCompletion
}


