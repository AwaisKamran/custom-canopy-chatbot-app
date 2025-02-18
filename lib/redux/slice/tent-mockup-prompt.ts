import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { generateTentMockupsApi } from '../apis/tent-mockup-prompt'
import JSZip from 'jszip'
import { TentMockUpPrompt } from '@/lib/types'

interface TentMockUpPromptState extends TentMockUpPrompt {
  loading: boolean
  error: string | null | undefined
  generatedMockups: { fileName: string; data: string }[]
}

const initialState: TentMockUpPromptState = {
  companyName: '',
  isPatterned: false,
  tentColors: {
    slope: '',
    canopy: '',
    walls_primary: '',
    walls_secondary: '',
    walls_tertiary: ''
  },
  text: '',
  userName: '',
  email: '',
  phoneNumber: '',
  logo: null,
  fontColor: '',
  font: '',
  loading: false,
  error: null,
  generatedMockups: []
}

export const generateTentMockups = createAsyncThunk<
  Blob,
  TentMockUpPrompt,
  { rejectValue: string }
>('tentMockup/createTentMockup', async (payload, { rejectWithValue }) => {
  try {
    return await generateTentMockupsApi(payload)
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

export const processTentMockups = createAsyncThunk<
  { fileName: string; data: string }[],
  Blob,
  { rejectValue: string }
>('mockups/processMockups', async (blob: Blob, { rejectWithValue }) => {
  try {
    const zip = await JSZip.loadAsync(blob)
    const generatedMockups: { fileName: string; data: string }[] = []
    const filePromises: Promise<void>[] = []

    zip.forEach((relativePath, file) => {
      const promise = file.async('base64').then(fileData => {
        const imageSrc = `data:image/jpeg;base64,${fileData}`
        generatedMockups.push({ fileName: relativePath, data: imageSrc })
      })
      filePromises.push(promise)
    })

    await Promise.all(filePromises)
    return generatedMockups
  } catch (error) {
    return rejectWithValue((error as Error).message || 'Something went wrong')
  }
})


const tentMockupSlice = createSlice({
  name: 'mockUpPrompt',
  initialState,
  reducers: {
    setMockUpPrompt: (state, action) => {
      return { ...state, ...action.payload }
    },
    resetFormData: () => initialState
  },
  extraReducers(builder) {
    builder
      .addCase(generateTentMockups.pending, state => {
        return { ...state, loading: true, error: null }
      })
      .addCase(generateTentMockups.fulfilled, state => {
        return { ...state, loading: false, error: null }
      })
      .addCase(generateTentMockups.rejected, (state, action) => {
        return { ...state, loading: false, error: action.payload }
      })
      .addCase(processTentMockups.pending, state => {
        return { ...state, loading: true, error: null }
      })
      .addCase(processTentMockups.fulfilled, (state, action) => {
        return {
          ...state,
          loading: false,
          error: null,
          generatedMockups: action.payload
        }
      })
      .addCase(processTentMockups.rejected, (state, action) => {
        return { ...state, loading: false, error: action.payload }
      })
  }
})

export const { setMockUpPrompt, resetFormData } = tentMockupSlice.actions
export default tentMockupSlice.reducer
