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
    message: "Hello! Welcome to Custom Canopy. I'm here to help you build a custom design for your 10'x10' canopy tent. Let's get started! \n \n What is the name of your company or organization?",
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
