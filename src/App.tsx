import React, { useEffect } from 'react'
import './assets/style/App.css'

import Header from './components/Header'
import FilePanel from './components/FilePanel'

import { FileExtToType, FileStatus, FileUpload } from './store/types.d'
import {
  queue,
  next,
  complete,
  incomplete,
  setProgress,
} from './store/slices/uploadSlice'
import { useAppDispatch, useUpload, useUploadingItem } from './hooks'

function App() {
  const dispatch = useAppDispatch()
  const uploadData = useUpload()
  const uploading = useUploadingItem()

  const handleSelectedFile = (file: File) => {
    const ext = file.name.substring(file.name.lastIndexOf('.') + 1)
    const type = FileExtToType[ext]
    const fileUpload: FileUpload = {
      queueIndex: 0,
      fileName: file.name,
      fileSize: file.size,
      fileType: type ? type : '',
      status: FileStatus.WAITING,
    }
    dispatch(queue(fileUpload))
  }

  let progressInterval: ReturnType<typeof setInterval> | null = null
  let progress: number = 0

  useEffect(() => {
    if (
      uploadData.previous === FileStatus.WAITING &&
      uploadData.current === FileStatus.UPLOADING
    ) {
      progressInterval = setInterval(() => {
        if (progressInterval) {
          if (progress >= 100) {
            clearInterval(progressInterval)
            progressInterval = null
            progress = 0
            if (uploading) {
              dispatch(complete(uploading))
              dispatch(next())
            }
            return
          } else if (
            uploadData.current != FileStatus.UPLOADING ||
            (uploadData.counter % 4 === 3 && progress > 50)
          ) {
            clearInterval(progressInterval)
            progressInterval = null
            progress = 0
            if (uploading) {
              dispatch(incomplete(uploading))
              dispatch(next())
              return
            }
          }
        }
        progress += 20
        dispatch(setProgress(progress))
      }, 1000)
    } else if (uploadData.current != FileStatus.UPLOADING) {
      if (progressInterval) {
        clearInterval(progressInterval)
        progressInterval = null
        progress = 0
        if (uploading) {
          dispatch(incomplete(uploading))
          dispatch(next())
          return
        }
      }
    }
  }, [uploadData])

  return (
    <div className="App">
      <Header onSelectFile={handleSelectedFile} />
      <FilePanel
        title="Uploading"
        caption="Cancel Upload"
        status={FileStatus.UPLOADING}
        placeholder="No uploading files yet"
      />
      <FilePanel
        title="Next Up"
        caption="Cancel All"
        status={FileStatus.WAITING}
        placeholder="No waiting files yet"
      />
      <FilePanel
        title="Completed"
        caption="Dismiss All"
        status={FileStatus.COMPLETED}
        placeholder="No file uploads completed yet"
      />
      <FilePanel
        title="Incomplete Uploads"
        caption="Dismiss All"
        status={FileStatus.INCOMPLETED}
        placeholder="No incomplete uploads yet"
      />
    </div>
  )
}

export default App
