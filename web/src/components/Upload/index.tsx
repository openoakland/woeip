import React, { useState, useEffect } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Message, Icon, Button, Container } from 'semantic-ui-react'
import UploadConfirmation from 'components/Upload/UploadConfirmation'
import styled from 'theme'
import { validateFiles } from 'components/Upload/util'

const StyledContainer = styled(Container)`
  margin-top: 30px;
`

const Dropzone = styled.div`
  width: 100%;
  height: 250px;
  background: ${({ theme }) => theme.colors.lightGray};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const InstructionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
const IconButton = styled(Button)`
  background: transparent !important;
`

const StyledMessage = styled(Message)`
  background: ${({ theme }) => theme.colors.warning} !important;
`

const PendingContainer = styled.div`
  width: 300px;
  margin: 40px auto;
  h3 {
    text-align: center;
  }
`

const PendingFile = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const FileInput = styled.a`
  color: ${({ theme }) => theme.colors.darkGray};
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
`

const FileNameContainer = styled.div`
  display: flex;
  align-items: center;
`

const FileName = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 180px;
`

const FileSelector = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.darkGray};
  flex-direction: column;
  align-items: center;
`

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
    const removeIndex = Number(event.currentTarget.dataset.arg)
    setFiles(files.filter((_, i) => i !== removeIndex))
  }

  const uploadPage =
    files.length !== 2 || proceed === false ? (
      <StyledContainer>
        <Dropzone {...getRootProps({ refKey: 'ref' })}>
          <InstructionsContainer>
            <p>Drag a pair of DusTrak and GPS files here</p>
            <FileSelector>
              <span>or</span>
              <FileInput>
                Select files from your computer
                <input {...getInputProps()} />
              </FileInput>
            </FileSelector>
          </InstructionsContainer>
        </Dropzone>
        <StyledMessage hidden={errorMessage === ''}>
          <WarningIcon />
          {errorMessage}
        </StyledMessage>
        {files.length > 0 && (
          <PendingContainer>
            <h3>Pending Files</h3>
            <hr />
            <ul>
              {files.map((file, i) => (
                <PendingFile key={file.path}>
                  <FileNameContainer>
                    <FileName>{file.path}</FileName>
                  </FileNameContainer>
                  <IconButton icon={true} data-arg={i} onClick={removeItem}>
                    <Icon name='trash' />
                  </IconButton>
                </PendingFile>
              ))}
            </ul>
          </PendingContainer>
        )}
      </StyledContainer>
    ) : (
      <UploadConfirmation {...files} />
    )

  return uploadPage
}

export default Upload
