import React, { useState, useEffect } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Message, Icon, Button, Container } from 'semantic-ui-react'
import axios from 'axios'
import styled from 'theme'
import {
  identFiles,
  getDustrakStart,
  getDustrakEnd,
  validateFiles
} from 'components/Upload/util'

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

const NothingMessage = styled.p`
  margin-top: 20px;
  text-align: center;
`

const SubmitForm = styled.form`
  display: flex;
  justify-content: center;
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
    }
    handleValidation()
  }, [files])

  const upload = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()

    for (const file of files) {
      formData.append('upload_files', file)
    }

    const csvFile: File = identFiles(files)[1]!
    const csvText: string = await csvFile.text()
    const csvTextSplit: Array<string> = csvText.split('\n', 10)
    const dustrakStart: moment.Moment = getDustrakStart(csvTextSplit)
    formData.append('starts_at', dustrakStart.format())
    formData.append(
      'ends_at',
      getDustrakEnd(csvTextSplit, dustrakStart).format()
    )
    formData.append('pollutant', '1')
    axios
      .post('http://api.lvh.me/collection', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(d => {
        console.log('response data is:', d)
        alert(d.statusText)
      })
      .catch(error => {
        console.error('error is:', error)
        setErrorMessage(error.message)
      })
    setFiles([])
  }

  const removeItem = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    const removeIndex: number = Number(event.currentTarget.dataset.arg)
    setFiles(files.filter((_, i) => i !== removeIndex))
  }

  return (
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

          {files.length === 2 && !errorMessage ? (
            <SubmitForm onSubmit={upload}>
              <Button positive={true} type='submit'>
                Upload
              </Button>
            </SubmitForm>
          ) : null}
        </PendingContainer>
      )}
    </StyledContainer>
  )
}

export default Upload
