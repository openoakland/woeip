import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Message } from 'semantic-ui-react'
import { Icon } from 'semantic-ui-react'

import styled from 'theme'

const UploadContainer = styled.div`
  margin: 40px;
`

const Dropzone = styled.div`
  border: 1px solid gray;
  width: 100%;
  height: 200px;
`

const InstructionsContainer = styled.div`
  margin-top: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const StyledMessage = styled(Message)`
  color: white !important;
  background: ${({ theme }) => theme.colors.primary} !important;
`

const Upload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: useCallback(acceptedFiles => {
      console.log(acceptedFiles)
    }, []),
    multiple: true
  })
  return (
    <UploadContainer>
      <StyledMessage>
        <Icon name='check circle outline' />
        Success! Your files were uploaded.
      </StyledMessage>
      <h2>Step 1. Upload your session files</h2>
      <Dropzone {...getRootProps({ refKey: 'innerRef' })}>
        <InstructionsContainer>
          <p>Drag a pair of DusTrak and GPS files here</p>
          <p>or</p>
          <p>Select files from your computer</p>
        </InstructionsContainer>
        <input {...getInputProps()} />
      </Dropzone>
    </UploadContainer>
  )
}

export default Upload
