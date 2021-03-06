import { useEffect, useRef } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store/store'
import { FileStatus, FileUpload } from './store/types.d'
import { selectUpload } from './store/slices/uploadSlice'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useUploadItems = (status: FileStatus): FileUpload[] => {
  const uploadState = useAppSelector(selectUpload)
  if (status == FileStatus.WAITING) {
    return uploadState.waiting
  } else if (status === FileStatus.UPLOADING) {
    return uploadState.uploading
  } else if (status === FileStatus.COMPLETED) {
    return uploadState.completed
  } else if (status === FileStatus.INCOMPLETED) {
    return uploadState.incompleted
  }
  return []
}

export const useUploadingItem = (): FileUpload | null => {
  const uploadState = useAppSelector(selectUpload)
  return uploadState.uploading[0]
}

export const useUploadState = () => {
  return useAppSelector(selectUpload)
}

export const useInterval = (callback: () => void, interval: number) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (interval === 0) {
      return
    }
    const id = setInterval(() => savedCallback.current(), interval)
    return () => clearInterval(id)
  }, [interval])
}
