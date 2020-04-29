import React, { useState, useEffect } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Icon } from 'semantic-ui-react'
import { validateFiles } from 'components/Upload/util'
import * as style from 'components/Upload/styles'

const WarningIcon = () => <Icon name='warning circle' />

interface FormData {
  append(name: string, value: string | FileWithPath, fileName?: string): void
}

declare let FormData: {
  prototype: FormData
  new (form?: HTMLFormElement): FormData
}

const Upload: React.FunctionComponent = () => {
  const [files, setFiles] = useState<Array<FileWithPath>>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: Array<FileWithPath>) => {
      setFiles([...files, ...acceptedFiles])
    },
    multiple: true
  })

  useEffect(() => {
    const potentialErrorMessage = validateFiles(files)
    setErrorMessage(potentialErrorMessage)
  }, [files])

  const removeItem = (removableIndex: number) => {
    return () => setFiles(files.filter((_, i) => i !== removableIndex))
  }

  return (
    <style.StyledContainer>
      <style.Dropzone {...getRootProps({ refKey: 'innerRef' })}>
        <style.InstructionsContainer>
          <p>Drag a pair of DusTrak and GPS files here</p>
          <style.FileSelector>
            <span>or</span>
            <style.FileInput>
              Select files from your computer
              <input {...getInputProps()} />
            </style.FileInput>
          </style.FileSelector>
        </style.InstructionsContainer>
      </style.Dropzone>
      <style.StyledMessage hidden={errorMessage === ''}>
        <WarningIcon />
        {errorMessage}
      </style.StyledMessage>
      {files.length > 0 && (
        <style.PendingContainer>
          <h3>Pending Files</h3>
          <hr />
          <ul>
            {files.map((file, i) => (
              <style.PendingFile key={file.path}>
                <style.FileNameContainer>
                  <style.FileName>{file.path}</style.FileName>
                </style.FileNameContainer>
                <style.IconButton icon={true} onClick={removeItem(i)}>
                  <Icon name='trash' />
                </style.IconButton>
              </style.PendingFile>
            ))}
          </ul>

          {files.length === 2 && !errorMessage ? (
            <p>Upload Starts Automatically</p>
          ) : null}
        </style.PendingContainer>
      )}
    </style.StyledContainer>
  )
}

export default Upload
