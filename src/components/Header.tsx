import React, { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type PropsType = {
  onSelectFile: Function
}

function Header(props: PropsType) {
  const fileObj = useRef<HTMLInputElement>(null)

  const handleFileChange = (files: FileList | null) => {
    if (files == null) {
      return
    }
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      if (file != null) {
        props.onSelectFile(file)
      }
    }
  }

  return (
    <header className="App-header">
      Manage Files
      <FontAwesomeIcon
        className="btn icon-file-add blue"
        icon={['fas', 'plus']}
        onClick={() => {
          if (fileObj.current) {
            fileObj.current.click()
          }
        }}
      />
      <input
        type="file"
        ref={fileObj}
        style={{ display: 'none' }}
        onChange={(e) => handleFileChange(e.target.files)}
        multiple
      />
    </header>
  )
}

export default Header
