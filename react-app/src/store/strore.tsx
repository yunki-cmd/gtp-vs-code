import { create } from 'zustand'
import { ChatMessage } from '../types/types'


interface UseInputPromtInterfaz {
  promt: string
  updatePromt: (promt: string) => void,
  removePromt: () => void
}

interface useHistoryChatInterfaz {
  historyChats: ChatMessage[]
  addHistoryChats: (history: ChatMessage) => void,
  removeHistoryChats: () => void
}

interface useModelsInterfaz{
  model: 'gpt3.5' | 'gpt4',
  updateModel: (model:string) => void
}

const useHistoryChat = create<useHistoryChatInterfaz>((set) => ({
  historyChats: [],
  addHistoryChats: (newChatMessage: ChatMessage) => set((prevState: useHistoryChatInterfaz) => ({
    historyChats: [...prevState.historyChats, newChatMessage],
  })),
  removeHistoryChats: () => set({ historyChats: [] }),
}))


const useInputPromt = create<UseInputPromtInterfaz>((set) => ({
  promt: "",
  updatePromt: (promt: string) => set({ promt }),
  removePromt: () => set({ promt: "" }),
}))


const useModels = create<useModelsInterfaz>((set) => ({
  model: "gpt3.5",
  updateModel: (model:any) => set({ model }),
}))




export { useInputPromt, useHistoryChat, useModels }