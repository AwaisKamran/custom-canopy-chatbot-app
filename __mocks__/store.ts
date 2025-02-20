import { FileData, TentColorConfig } from '@/lib/types'

export const mockInitialState = {
  chatReducer: {
    id: '',
    title: '',
    path: '',
    messages: [],
    threadId: '',
    loading: false,
    error: null,
    createdAt: new Date(),
    version: 0
  },
  tentMockUpPromptReducer: {
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
    logo: null,
    fontColor: '',
    font: '',
    loading: false,
    error: null,
    generatedMockups: []
  }
}

export const mockTentColorConfig: TentColorConfig = {
  patterned: false,
  awaitingColorPick: false,
  isMonochrome: false,
  currentRegion: '',
  awaitingFileUpload: false
}

export const mockFileData: FileData = {
  file: new File(['test'], 'test.jpg', { type: 'image/jpeg' }),
  name: 'test.jpg',
  previewUrl: 'data:image/jpeg;base64,test',
  fileType: 'image/jpeg'
}
