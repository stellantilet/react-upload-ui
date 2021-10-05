import React, { useState } from 'react'
import { FileUpload, FileStatus } from '../store/types'
import { useUploadItems } from '../hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import FileItem from './FileItem'

import { cancelAll } from '../store/slices/uploadSlice'
import { useAppDispatch } from '../hooks'

type PropsType = {
  title: string
  caption: string
  status: FileStatus
  placeholder: string
  collapsed?: boolean
}

function FilePanel(props: PropsType) {
  const dispatch = useAppDispatch()
  const [collapsed, setCollpased] = useState(
    props.collapsed != undefined ? props.collapsed : true
  )
  const items: FileUpload[] = useUploadItems(props.status)

  const handleCancellAll = () => {
    dispatch(cancelAll(props.status))
  }

  return (
    <div className="file-panel">
      <div className="file-panel-header">
        <span className="title">{props.title}</span>
        <div className="file-panel-action">
          <span className="caption" onClick={() => handleCancellAll()}>
            {props.caption}
          </span>
          <FontAwesomeIcon
            className="gray"
            icon={['fas', 'chevron-up']}
            size="sm"
            rotation={!collapsed ? 180 : undefined}
            onClick={() => {
              setCollpased(!collapsed)
            }}
          />
        </div>
      </div>
      <div className={`file-panel-body ${collapsed ? 'collapsed' : ''}`}>
        <div className="placeholder">
          {items.length === 0 ? props.placeholder : ''}
        </div>
        {items.map((item: FileUpload, index: number) => (
          <FileItem key={index} file={item} />
        ))}
      </div>
    </div>
  )
}

export default FilePanel
