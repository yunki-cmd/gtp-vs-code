import {ChatMessage} from '../types/types'
import { marked } from "marked";

function ListChats({chatMessages}: {chatMessages: ChatMessage[]}){

    const parseHtml = (html: string) => {
    if (html !== undefined && html !== null) {
        const rawMarkup = `<div class="m-5 max-w-full overflow-hidden">${marked.parse(html)}</div>`;
      return { __html: rawMarkup };
    }
    return { __html: "<h2>Sin Contenido</h2>" };
  };

    return (
        <>
        <div className="space-y-4 overflow-auto">
          {chatMessages.map((message, index: number) => (
            <div key={index} className={`flex items-${message.role === 'user' ? 'end' : 'start'}`}>
              {message.role === 'assistant' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  width="100"
                  height="100"
                  fill="#009688"
                  className="w-8 h-8 rounded-full"
                >
                </svg>
              ) : null}
              <div className={`ml-3  ${message.role === 'user' ? 'bg-gray-100' : 'bg-gray-50'}  rounded-lg`}>
                <div className={`text-sm  ${message.role === 'user' ? 'text-gray-800' : 'text-black'}`} dangerouslySetInnerHTML={parseHtml(message.content!)}
                style={{ fontFamily: 'font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        </>
    )
}

export {ListChats}