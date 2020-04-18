import React, { useState } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Message, Icon, Button, Container } from 'semantic-ui-react'

import styled from 'theme'

const Dropzone = styled.div`
  width: 100%;
  height: 200px;
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
  color: white !important;
  background: ${({ theme }) => theme.colors.primary} !important;
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

const NothingMessage = styled.p`
  margin-top: 20px;
  text-align: center;
`

const SubmitForm = styled.form`
  display: flex;
  justify-content: center;
`

const SuccessIcon = () => <Icon name='check circle outline' />

const Upload: React.FunctionComponent = () => {
  const [files, setFiles] = useState<Array<FileWithPath>>([])
  const [success, setSuccess] = useState<boolean>(false)
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: Array<FileWithPath>) => {
      setFiles([...files, ...acceptedFiles])
    },
    multiple: true
  })

  const upload = () => {
    setFiles([])
    setSuccess(true)
  }

  const removeItem = (removableIndex: number) => {
    return () => setFiles(files.filter((_, i) => i !== removableIndex))
  }

  return (
    <Container>
      <StyledMessage hidden={!success}>
        <SuccessIcon />
        Success! Your files were uploaded.
      </StyledMessage>
      <h2>Step 1. Upload your session files</h2>
      <Dropzone {...getRootProps({ refKey: 'innerRef' })}>
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
      {
        <PendingContainer>
          <h3>Pending Files</h3>
          <hr />
          {files.length > 0 ? (
            <ul>
              {files.map((file, i) => (
                <PendingFile key={file.path}>
                  <FileNameContainer>
                    <SuccessIcon />
                    <FileName>{file.path}</FileName>
                  </FileNameContainer>
                  <IconButton icon={true} onClick={removeItem(i)}>
                    <Icon name='trash' />
                  </IconButton>
                </PendingFile>
              ))}
            </ul>
          ) : (
            <NothingMessage>Nothing selected yet!</NothingMessage>
          )}

          {files.length === 2 && (
            <SubmitForm onSubmit={upload}>
              <Button positive={true} type='submit'>
                Upload
              </Button>
            </SubmitForm>
          )}
        </PendingContainer>
      }
    </Container>
  )
}

export default Upload
