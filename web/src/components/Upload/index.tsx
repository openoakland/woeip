import React, { useState, useEffect } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Message, Icon, Button, Container } from 'semantic-ui-react'
import axios from 'axios'

import styled from 'theme'
import { validateFiles } from 'components/Upload/util'
import { ValidateMeta, DustrakMeta } from 'components/Upload/types'

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
  const [dustrakMeta, setDustrakMeta] = useState<DustrakMeta>({
    startDatetime: '',
    endDatetime: ''
  })
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: Array<FileWithPath>) => {
      setFiles([...files, ...acceptedFiles])
    },
    multiple: true
  })

  useEffect(() => {
    const handleValidation = async () => {
      const validateMeta: ValidateMeta = await validateFiles(files)
      setErrorMessage(validateMeta.message)
      if (validateMeta.message === '') {
        setDustrakMeta(validateMeta.dustrakMeta)
      }
    }
    handleValidation()
  }, [files])

  const upload = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()

    for (const file of files) {
      formData.append('upload_files', file)
    }

    formData.append('starts_at', dustrakMeta.startDatetime)
    formData.append('ends_at', dustrakMeta.endDatetime)
    formData.append('pollutant', '1')
    console.log(dustrakMeta.startDatetime)
    console.log(dustrakMeta.endDatetime)
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
