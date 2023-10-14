/// <reference types="vscode" />

import { vscode } from '../main';
import { marked  } from 'marked';
import { useEffect, useState, useRef } from 'react';
const ChatGptComponent = () => {

  const [message, setMessage] = useState();

  const inputTextarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {

    vscode.postMessage({ type: 'appMounted', text: 'Hello from React!' });

    const handlerMesasge = (event: any) => {
      const messageEvent = event.data;

      // Maneja el mensaje según su tipo
      if (messageEvent.type === 'addResponse') {
        // setea el mensaje que llega desde openai
        setMessage(messageEvent.value)
        console.log('Received updateText message:', messageEvent.value);
      } else if (messageEvent.type === 'ok') {
        // setea el mensaje que llega desde openai
        console.log('Received ok message:', messageEvent.value);
        setMessage(messageEvent.value)
      }
    }
    window.addEventListener('message', handlerMesasge);
    return () => {
      window.removeEventListener('message',handlerMesasge);
  };

  }, []);

  function verificarVariable(valor:any) {
    return (valor !== undefined || valor !== null || valor.length !== 0);
  }

  const handlerAsk = () => { 
    if (verificarVariable(inputTextarea.current?.value)) {
      const value = inputTextarea.current?.value;
      vscode.postMessage({ type: 'askChatGPT', value});
    }
  }

  const parseHtml = (html: any) => {
    if (html !== undefined && html !== null) {
      console.log(html)
      const resp = html?.choices
      let rawMarkup: string = "";
      console.log(resp)
      resp.forEach((element: { message: { content: string; }; }) => {
        rawMarkup += `<div class="m-5">${marked.parse(element.message.content)}</div>`
        console.log(rawMarkup)
      });
      return { __html: rawMarkup };
    }
    return { __html: "<h2>chatea</h2>" };
  }


  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto" id="qa-list"></div>
      <div id="in-progress" className="p-4 flex items-center">
        <div>
          <div>Please wait while we handle your request ❤️</div>
          <div className="loader"></div>
          <div>Please note, ChatGPT facing scaling issues which will impact this extension</div>
        </div>
      </div>
      <div dangerouslySetInnerHTML={parseHtml(message) }></div>
      <div className="p-4 flex items-center">
        <div className="flex-1">
          <textarea
            className="border p-2 w-full"
            id="question-input"
            ref={inputTextarea}
            placeholder="Ask a question..."
          ></textarea>
        </div>
        <button id="ask-button" onClick={handlerAsk} className="p-2 ml-5">Ask</button>
        <button id="clear-button" className="p-2 ml-3">Clear</button>
      </div>
    </div>
  );
};

export default ChatGptComponent;

