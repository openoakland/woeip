import React, { useState, useEffect } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import UploadConfirmation from 'components/Upload/UploadConfirmation'
import { validateFiles } from 'components/Upload/util'
import * as uploadElements from 'components/Upload/elements'

const Upload: React.FunctionComponent = () => {
  const [files, setFiles] = useState<Array<FileWithPath>>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [proceed, setProceed] = useState<boolean>(false)
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: Array<FileWithPath>) => {
      setFiles([...files, ...acceptedFiles])
    },
    multiple: true
  })

  useEffect(() => {
    const handleValidation = async () => {
      const potentialErrorMessage: string = await validateFiles(files)
      setErrorMessage(potentialErrorMessage)
      if (files.length === 2 && potentialErrorMessage === '') {
        setProceed(true)
      }
    }
    handleValidation()
  })

  const removeItem = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    const removeIndex: number = Number(event.currentTarget.dataset.arg)
    setFiles(files.filter((_, i) => i !== removeIndex))
  }

  const uploadPage =
    files.length !== 2 || proceed === false ? (
      <uploadElements.StyledContainer>
        <uploadElements.Dropzone {...getRootProps({ refKey: 'ref' })}>
          <uploadElements.InstructionsContainer>
            <p>Drag a pair of DusTrak and GPS files here</p>
            <uploadElements.FileSelector>
              <span>or</span>
              <uploadElements.FileInput>
                Select files from your computer
                <input {...getInputProps()} />
              </uploadElements.FileInput>
            </uploadElements.FileSelector>
          </uploadElements.InstructionsContainer>
        </uploadElements.Dropzone>
        <uploadElements.StyledMessage hidden={errorMessage === ''}>
          <uploadElements.WarningIcon />
          {errorMessage}
        </uploadElements.StyledMessage>
        {files.length > 0 && (
          <uploadElements.PendingContainer>
            <h3>Pending Files</h3>
            <hr />
            <ul>
              {files.map((file, i) => (
                <uploadElements.PendingFile key={file.path}>
                  <uploadElements.FileNameContainer>
                    <uploadElements.FileName>{file.path}</uploadElements.FileName>
                  </uploadElements.FileNameContainer>
                  <uploadElements.IconButton icon={true} data-arg={i} onClick={removeItem}>
                    <uploadElements.TrashIcon />
                  </uploadElements.IconButton>
                </uploadElements.PendingFile>
              ))}
            </ul>
          </uploadElements.PendingContainer>
        )}
      </uploadElements.StyledContainer>
    ) : (
      <UploadConfirmation {...files} />
    )

  return uploadPage
}

export default Upload
