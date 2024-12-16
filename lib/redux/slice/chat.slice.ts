import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export enum Roles {
  user = 'user',
  assistant = 'assistant'
}

export interface ChatMessage {
  id: string;
  message: string;
  role?: string;
  file?: {
    name: string
    previewUrl: string
  }
}

const initialState: {
  messages: ChatMessage[];
  chatId: string | null;
  threadId: string
} = {
  messages: [{
    id: nanoid(),
    message: "Hello! Welcome to Custom Canopy. I'm here to help you build a custom design for your 10'x10' canopy tent. Let's get started! \n \n What is the name of your company or organization?",
    role: Roles.assistant
  }],
  chatId: null,
  threadId: ''
};

const chatSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { id, message, role, file } = action.payload;
      const existingMessageIndex = state.messages.findIndex((msg) => msg.id === id);
      if (existingMessageIndex !== -1) {
         state.messages = [
           ...state.messages.slice(0, existingMessageIndex),
           { ...state.messages[existingMessageIndex], message },
           ...state.messages.slice(existingMessageIndex + 1),
         ];
       } else {
         state.messages.push({
           id,
           message,
           role,
           file
         })
       }
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
    setThreadId: (state, action) => {
       state.threadId = action.payload
    },
    removeMessages: (state) => {
       state.messages = []
     }
  },
});

export const { addMessage, setChatId, setThreadId, removeMessages } = chatSlice.actions;
export default chatSlice.reducer;
