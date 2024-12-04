import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface ChatMessage {
  id: string;
  message: string;
  role?: string;
  files?: string
}

const initialState: {
  messages: ChatMessage[]
  threadId: string
} = {
  messages: [{
    id: nanoid(),
    message: "Hello! Welcome to Custom Canopy. I'm here to help you build a custom design for your 10'x10' canopy tent. Let's get started! \n \n What is the name of your company or organization?",
    role: "assistant"
  }],
  threadId: '',
};

const chatSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { id, message, role, files } = action.payload;
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
           files
         })
       }
    },
    setThreadId: (state, action) => {
       state.threadId = action.payload
    },
    removeMessages: (state, action) => {
      if (action.payload) {
        state.messages = []
      } else {
        state.messages = [{
          id: nanoid(),
          message: "Hello! Welcome to Custom Canopy. I'm here to help you build a custom design for your 10'x10' canopy tent. Let's get started! \n \n What is the name of your company or organization?",
          role: "assistant"
        }]
      }
    },
  },
});

export const { addMessage, setThreadId, removeMessages } = chatSlice.actions;
export default chatSlice.reducer;
