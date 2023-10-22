import {ResposeCompletion, ChatMessage} from '../types/types'

const handlerFetchApiChatGtp = async (message:ChatMessage[]): Promise<ResposeCompletion> => {
  // dame el codigo en fetch para hacer la peticion al api de gtp
  const body = {
    model: "gpt-3.5-turbo",
    messages: message
  };
  const response =  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + "",
    },
    body: JSON.stringify(body),
  }).then(res => res.json())
  return response;
};

export { handlerFetchApiChatGtp };
