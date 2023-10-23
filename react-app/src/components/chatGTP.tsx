/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { vscode } from '../main';
import { useEffect, useState } from 'react';
import ChatComponent from './chats';
import { handlerFetchApiChatGtp } from '../utils/request.js'
import {useHistoryChat, useModels} from "../store/strore.js"

// types

import { ChatMessage, responseEvent } from '../types/types';

const ChatGptComponent = () => {

  //const [message, setMessage] = useState<ResposeCompletion>();

  const {addHistoryChats, historyChats} = useHistoryChat()

  const {model} = useModels()

  //const [historyChats, setHistoryChats] = useState<ChatMessage[]>([]);

  const [disable, setDisable] = useState(false);

  //const inputTextarea = useRef<HTMLTextAreaElement>(null);

  /* const [azure, setAzure] = useState<boolean>(false) */

  useEffect(() => {
    window.addEventListener('message', handlerMesasge);

    return () => {
      window.removeEventListener('message', handlerMesasge);
    };

  }, []);


  const handlerMesasge = (event: any) => {
    const messageEvent: responseEvent = event.data;
    // Maneja el mensaje según su tipo
    if (messageEvent.type === 'addResponse') {
      // setea el mensaje que llega desde openai

      addHistoryChats(messageEvent.value.choices[0].message)
      setDisable(false)

      /* setHistoryChats(prevState => {
        // Usar la forma de función para asegurarse de tener la última versión del estado
        return [...prevState, messageEvent.value.choices[0].message];
      }); */
    }
  }

  function verificarVariable(valor: any) {
    return (valor !== undefined || valor !== null || valor.length !== 0);
  }

  /*   const handlerAsk = async () => {
      if (verificarVariable(inputTextarea.current?.value)) {
        const value = inputTextarea.current?.value;
  
        if (value === undefined || value === null || value.trim().length === 0) {
          return;
        }
  
        setHistoryChats((prevState:any) => {
          // Usar la forma de función para asegurarse de tener la última versión del estado
          const newHistoryChats = [...prevState, { role: 'user', content: value }];
          if (newHistoryChats.length > 0) {
  
          if(azure){
              //vscode.postMessage({ type: 'askChatGPT', value: newHistoryChats, azure:true, stream: false });
            } else {
              vscode.postMessage({ type: 'askChatGPT', value: newHistoryChats, azure:false });
            } 
  
          }
          return newHistoryChats
        });
      }
    } */


  const handlerAsk = async (text:string) => {
    if (verificarVariable(text)) {
      const value = text;

      const promtRequest:ChatMessage = {role: 'user', content: value};

      // const hs:ChatMessage[] = [...historyChats, promtRequest];

      addHistoryChats(promtRequest)
    }else return
  }


  useEffect(() => {
    handlerResponse()

  },[historyChats])

  function handlerDisable (promt:boolean) {
    setDisable(promt)
  }

  async function handlerResponse ()  {
    
    if(historyChats.length > 0){
      const ultimoIndice = historyChats.length - 1;
      const ultimRole = historyChats[ultimoIndice].role;
      if(ultimRole === 'assistant') return

      let response:ChatMessage
      if(model === "gpt3.5"){
        response = await handlerFetchApiChatGtp(historyChats).then(resp => resp.choices[0].message);
        setDisable(!disable)
      } else {
        vscode.postMessage({ type: 'askChatGPT', value: historyChats, azure:true, stream:false });
        return
      }
      

      const promtResponse:ChatMessage = {role: 'assistant', content: response.content};
      addHistoryChats(promtResponse)
      /* setHistoryChats(prevState => {
        // Usar la forma de función para asegurarse de tener la última versión del estado
        return [...prevState,promtResponse];
      }); */

    }

  }


  /* const handlerCleanChat = () => {
    setHistoryChats([])
  }




  const handlerCheck = () => {
    setAzure(!azure)
  } */


  return (
    <ChatComponent historyChats={historyChats} handlerAsk={handlerAsk} disable={disable} onChangeDisable={handlerDisable}/>
  );
};

export default ChatGptComponent;

