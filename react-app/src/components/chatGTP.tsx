/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vscode" />

import { vscode } from '../main';
import { marked } from 'marked';
import { useEffect, useState, useRef } from 'react';

// types

import { ChatMessage, responseEvent } from '../types/types';

const ChatGptComponent = () => {

  //const [message, setMessage] = useState<ResposeCompletion>();

  const [historyChats, setHistoryChats] = useState<ChatMessage[]>([]);

  const inputTextarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {

    const handlerMesasge = (event: any) => {
      const messageEvent: responseEvent = event.data;
      // Maneja el mensaje según su tipo
      if (messageEvent.type === 'addResponse') {
        // setea el mensaje que llega desde openai
        
        setHistoryChats(prevState => {
          // Usar la forma de función para asegurarse de tener la última versión del estado
          return [...prevState, messageEvent.value.choices[0].message];
        });
      }
    }
    window.addEventListener('message', handlerMesasge);
    return () => {
      window.removeEventListener('message', handlerMesasge);
    };

  }, []);

  function verificarVariable(valor: any) {
    return (valor !== undefined || valor !== null || valor.length !== 0);
  }

  const handlerAsk = async () => {
    if (verificarVariable(inputTextarea.current?.value)) {
      const value = inputTextarea.current?.value;

      if (value === undefined || value === null || value.trim().length === 0) {
        return;
      }

      setHistoryChats((prevState:any) => {
        // Usar la forma de función para asegurarse de tener la última versión del estado
        const newHistoryChats = [...prevState, { role: 'user', content: value }];
        if (newHistoryChats.length > 0) {
          vscode.postMessage({ type: 'askChatGPT', value: newHistoryChats });
        }
        return newHistoryChats
      });
    }
  }
  const handlerCleanChat = () => {
    setHistoryChats([])
  }

  const parseHtml = (html: ChatMessage[]) => {
    if (html !== undefined && html !== null) {
      let rawMarkup: string = "";
      html.forEach((element: ChatMessage) => {
        rawMarkup += `<div class="m-5">${marked.parse(element.content)}</div>`
      });
      return { __html: rawMarkup }
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
      <div dangerouslySetInnerHTML={parseHtml(historyChats!)}></div>
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
        <button id="clear-button" onClick={handlerCleanChat} className="p-2 ml-3">Clear</button>
      </div>
    </div>
  );
};

export default ChatGptComponent;

