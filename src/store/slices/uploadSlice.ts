import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { FileUpload, FileStatus } from '../types.d'
import type { RootState } from '../store'

const initialState: {
  current: FileStatus
  previous: FileStatus
  counter: number
  waiting: FileUpload[]
  uploading: FileUpload[]
  incompleted: FileUpload[]
  completed: FileUpload[]
} = {
  current: FileStatus.WAITING,
  previous: FileStatus.WAITING,
  counter: 0,
  waiting: [] as FileUpload[],
  uploading: [] as FileUpload[],
  incompleted: [] as FileUpload[],
  completed: [] as FileUpload[],
}

const resetIndex = (fileUploads: FileUpload[]) => {
  fileUploads.forEach((item: FileUpload, index: number) => {
    item.queueIndex = index
  })
}

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    cancelAll: (state, action: PayloadAction<FileStatus>) => {
      if (action.payload === FileStatus.WAITING) {
        let waiting = [...state.waiting]
        waiting.forEach((item: FileUpload) => {
          item.status = FileStatus.INCOMPLETED
        })
        state.incompleted.push(...waiting)
        state.waiting = [] as FileUpload[]
      } else if (action.payload === FileStatus.COMPLETED) {
        state.completed = [] as FileUpload[]
      } else if (action.payload === FileStatus.UPLOADING) {
        let uploading = [...state.uploading]
        uploading.forEach((item: FileUpload) => {
          item.status = FileStatus.INCOMPLETED
        })
        state.incompleted.push(...uploading)
        state.uploading = [] as FileUpload[]
      } else if (action.payload === FileStatus.INCOMPLETED) {
        state.incompleted = [] as FileUpload[]
      }
    },
    cancel: (state, action: PayloadAction<FileUpload>) => {
      state.previous = state.current
      state.current = FileStatus.INCOMPLETED

      let payload = { ...action.payload }
      payload.progress = 0
      if (payload.status === FileStatus.WAITING) {
        state.waiting.splice(payload.queueIndex, 1)
        resetIndex(state.waiting)
      } else if (payload.status === FileStatus.COMPLETED) {
        state.completed.splice(payload.queueIndex, 1)
        resetIndex(state.completed)
      } else if (payload.status === FileStatus.UPLOADING) {
        state.uploading.splice(payload.queueIndex, 1)
        resetIndex(state.uploading)
        payload.queueIndex = state.incompleted.length
        payload.status = FileStatus.INCOMPLETED
        state.incompleted.push(payload)
      } else if (payload.status === FileStatus.INCOMPLETED) {
        state.incompleted.splice(payload.queueIndex, 1)
        resetIndex(state.incompleted)
      }
    },
    queue: (state, action: PayloadAction<FileUpload>) => {
      let payload = { ...action.payload }
      if (payload.status === FileStatus.INCOMPLETED) {
        state.incompleted.splice(payload.queueIndex, 1)
        resetIndex(state.incompleted)
      }
      if (state.uploading.length === 0 && state.waiting.length === 0) {
        payload.status = FileStatus.UPLOADING
        payload.queueIndex = state.uploading.length
        payload.progress = 0
        state.uploading.push(payload)
        state.previous = FileStatus.WAITING
        state.current = FileStatus.UPLOADING
        state.counter++
      } else {
        payload.status = FileStatus.WAITING
        payload.queueIndex = state.waiting.length
        state.waiting.push(payload)
      }
    },
    next: (state) => {
      if (state.waiting.length > 0) {
        let payload = { ...state.waiting[0] }
        state.waiting.splice(payload.queueIndex, 1)
        resetIndex(state.waiting)
        payload.status = FileStatus.UPLOADING
        payload.queueIndex = state.uploading.length
        payload.progress = 0
        state.uploading.push(payload)
        state.previous = FileStatus.WAITING
        state.current = FileStatus.UPLOADING
        state.counter++
      }
    },
    setProgress: (state, action: PayloadAction<number>) => {
      if (
        state.uploading[0] &&
        state.uploading[0].progress != undefined &&
        state.uploading[0].progress >= 0
      ) {
        state.uploading[0].progress = action.payload
        state.previous = state.current
      }
    },
    complete: (state, action: PayloadAction<FileUpload>) => {
      let payload = { ...action.payload }
      state.uploading.splice(payload.queueIndex, 1)
      resetIndex(state.uploading)
      payload.queueIndex = state.completed.length
      payload.status = FileStatus.COMPLETED
      state.completed.push(payload)
      state.previous = state.current
      state.current = FileStatus.COMPLETED
    },
    incomplete: (state, action: PayloadAction<FileUpload>) => {
      let payload = { ...action.payload }
      state.uploading.splice(payload.queueIndex, 1)
      resetIndex(state.uploading)
      payload.progress = 0
      payload.queueIndex = state.incompleted.length
      payload.status = FileStatus.INCOMPLETED
      state.incompleted.push(payload)
      state.previous = state.current
      state.current = FileStatus.INCOMPLETED
    },
  },
})

export const {
  cancel,
  cancelAll,
  queue,
  next,
  setProgress,
  complete,
  incomplete,
} = uploadSlice.actions

export const selectUpload = (state: RootState) => state.upload

export default uploadSlice.reducer
