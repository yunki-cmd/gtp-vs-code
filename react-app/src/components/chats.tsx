/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent } from "react";
import { ListChats } from "./listChars";
import {useHistoryChat, useInputPromt } from "../store/strore"

const ChatComponent = ({ historyChats, handlerAsk, disable, onChangeDisable }: any) => {
    const {promt, updatePromt}= useInputPromt()
    const {removeHistoryChats} = useHistoryChat()

  /*     const handleSendMessage = () => {
            if (inputMessage.trim() === '') return;
            // Agregar el mensaje enviado al historial de chat
            setChatMessages([
                ...chatMessages,
                {
                    type: 'sent',
                    message: inputMessage,
                },
            ]); */
  // Aquí podrías hacer una solicitud a un servidor o realizar el procesamiento necesario
  // para obtener una respuesta del asistente y agregarla al historial de chat como un mensaje "received".
  // Por ahora, simularemos una respuesta inmediata del asistente.
  /* setChatMessages([
        ...chatMessages,
        {
            type: 'received',
            message: 'Gracias por tu pregunta. Estoy aquí para ayudarte.',
        },
    ]); */
  // Limpiar el campo de entrada
  /* setInputMessage('');
}; */

  const hadlerInputTest = (event: any) => {
    event.preventDefault();
    handlerAsk(promt)
    updatePromt('');
    onChangeDisable(true)
  }


  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    updatePromt(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handlerClearInput = (event:any) =>{
    event.preventDefault();
    removeHistoryChats()
  }

  return (
    <div className="max-w-full mx-auto">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center mb-4">
          <div className="ml-3">
            <p className="text-xl font-medium">Your AI Assistant</p>
          </div>
        </div>

        <div className="space-y-4">
          <ListChats chatMessages={historyChats} />
        </div>

        <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl m-2">
          <div className="relative flex h-full flex-1 items-stretch md:flex-col">
            <button onClick={handlerClearInput} className="absolute bg-slate-600 -top-8 right-0"
            >
              <svg className="bg-neutral-50 hover:fill-red-700" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30">
                <path d="M6 8v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8H6zM24 4h-6c0-.6-.4-1-1-1h-4c-.6 0-1 .4-1 1H6C5.4 4 5 4.4 5 5s.4 1 1 1h18c.6 0 1-.4 1-1S24.6 4 24 4z"></path>
              </svg>
            </button>
            <div className="flex w-full items-center">
              <div className="flex flex-col w-full flex-grow relative border outline-none">
                <textarea
                  placeholder="Type your message..."
                  className="m-0 w-full resize-none border-0 bg-transparent  outline-none text-black py-[10px] pr-10 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:py-4 md:pr-12 gizmo:md:py-3.5 gizmo:placeholder-black/50 gizmo:dark:placeholder-white/50 pl-3 md:pl-4"
                  value={promt}
                  onChange={handleTextareaChange}
                  style={{ height: "auto", minHeight: "44px" }}
                />
                <button
                  className="absolute p-1 rounded-md md:bottom-3 gizmo:md:bottom-2.5 md:p-2 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 disabled:text-gray-400 enabled:bg-brand-purple gizmo:enabled:bg-transparent text-white gizmo:text-gray-500 gizmo:dark:text-gray-300 bottom-1.5 transition-colors disabled:opacity-40"
                  style={{ backgroundColor: "rgb(25, 195, 125)" }}
                  disabled={disable}
                  onClick={hadlerInputTest}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;
