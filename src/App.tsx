import React, { useState, useEffect } from 'react'
import './assets/style/App.css'

import Header from './components/Header'
import FilePanel from './components/FilePanel'

import {
  FileExtToType,
  FileStatus,
  FileUpload,
  IntervalState,
} from './store/types.d'
import {
  queue,
  next,
  complete,
  incomplete,
  setProgress,
} from './store/slices/uploadSlice'
import {
  useAppDispatch,
  useUploadState,
  useUploadingItem,
  useInterval,
} from './hooks'

function App() {
  const dispatch = useAppDispatch()
  const uploadData = useUploadState()
  const uploading = useUploadingItem()
  const [interval, setInterval] = useState(0)
  const [percent, setPercent] = useState(0)
  const [counter, setCounter] = useState(0)

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

  useInterval(() => {
    setPercent(percent + 20)
  }, interval)

  useEffect(() => {
    if (uploading && uploadData.status === FileStatus.UPLOADING) {
      if (counter % 4 === 3 && percent > 50) {
        dispatch(incomplete(uploading))
        return
      }
      dispatch(setProgress(percent))
      if (percent > 100) {
        dispatch(complete(uploading))
        setInterval(0)
        setPercent(0)
      }
    }
  }, [percent])

  useEffect(() => {
    if (uploadData.status === FileStatus.UPLOADING) {
      setInterval(1000)
    } else {
      setInterval(0)
      setPercent(0)
      if (
        uploadData.status === FileStatus.COMPLETED ||
        uploadData.status === FileStatus.INCOMPLETED
      ) {
        setCounter(counter + 1)
        dispatch(next())
      }
    }
  }, [uploadData.status])

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
