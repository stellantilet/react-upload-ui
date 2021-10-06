/* eslint-disable no-unused-vars */
export enum FileStatus {
  WAITING,
  UPLOADING,
  INCOMPLETED,
  COMPLETED,
}

export type FileType = 'pdf' | 'archive' | 'excel' | 'image' | 'video' | ''

export interface FileUpload {
  queueIndex: number
  fileName: string
  fileSize: number
  fileType: FileType
  status: FileStatus
  progress?: number
  progressInterval?: ReturnType<typeof setInterval>
}

export type IntervalState = ReturnType<typeof setInterval> | null

export const FileExtToType: { [key: string]: FileType } = {
  pdf: 'pdf',
  rar: 'archive',
  zip: 'archive',
  xls: 'excel',
  xlsx: 'excel',
  bmp: 'image',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  mp4: 'video',
  avi: 'video',
}
