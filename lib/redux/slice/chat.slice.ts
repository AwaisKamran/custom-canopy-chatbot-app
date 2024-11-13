import { createSlice } from '@reduxjs/toolkit';

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
  messages: [],
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
