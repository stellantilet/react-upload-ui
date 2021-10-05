import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconName } from '@fortawesome/fontawesome-svg-core'
import { FileUpload, FileStatus } from '../store/types.d'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'

import { cancel, queue } from '../store/slices/uploadSlice'
import { useAppDispatch } from '../hooks'

type PropsType = {
  file: FileUpload
}

function FileItem(props: PropsType) {
  const dispatch = useAppDispatch()

  const fileType: IconName = ('file' +
    ((props.file.fileType != '' ? '-' : '') + props.file.fileType)) as IconName
  const fileSizeCaption =
    (props.file.fileSize / (1024 * 1024)).toFixed(2) + 'MB'
  let statusCaption = ''
  if (props.file.status === FileStatus.UPLOADING) {
    statusCaption = 'Uploading...'
  } else if (props.file.status === FileStatus.WAITING) {
    statusCaption = 'Waiting...'
  }

  return (
    <div className="file-upload-item">
      <div className="file-main">
        <div className={`file-icon ${props.file.fileType}`}>
          <FontAwesomeIcon icon={['fas', fileType]} size="2x" />
        </div>
        <div className="file-content">
          <span className="title">{props.file.fileName}</span>
          <span className="size">{fileSizeCaption}</span>
        </div>
      </div>
      <div className="file-action">
        {props.file.status === FileStatus.UPLOADING ||
        props.file.status === FileStatus.WAITING ? (
          <div className="status">
            <CircularProgressbar
              className="progress"
              value={props.file.progress ? props.file.progress : 0}
              styles={buildStyles({
                pathColor: '#2E6DDE',
                textColor: '#f88',
                trailColor: '#d6d6d6',
                backgroundColor: '#3e98c7',
              })}
            />
            {statusCaption}
          </div>
        ) : props.file.status === FileStatus.INCOMPLETED ? (
          <div className="status failed">
            <FontAwesomeIcon
              className="btn"
              icon={['fas', 'redo-alt']}
              size="2x"
              onClick={() => {
                dispatch(queue(props.file))
              }}
            />
          </div>
        ) : (
          <div className="status success">
            <FontAwesomeIcon icon={['fas', 'check-circle']} size="2x" />
          </div>
        )}
        <FontAwesomeIcon
          className="btn gray"
          icon={['fas', 'times']}
          onClick={() => {
            dispatch(cancel(props.file))
          }}
        />
      </div>
    </div>
  )
}

export default FileItem
