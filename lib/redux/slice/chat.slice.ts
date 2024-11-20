import { createSlice } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

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
} = {
  messages: [{
    id: nanoid(),
    message: "Hello! Welcome to Custom Canopy. I'm here to help you build a custom design for your 10'x10' canopy tent. Let me know when you're ready to get started!",
    role: "assistant"
  }],
  chatId: null,
};

const chatSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const { id, message, role, file } = action.payload;
      const newMessage = { id, message, role } as ChatMessage; 
      if (file) {
        newMessage.file = file;
      }
      state.messages.push(newMessage);
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
    },
  },
});

export const { addMessage, setChatId } = chatSlice.actions;
export default chatSlice.reducer;
