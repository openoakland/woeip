import { Message, Button, Container } from 'semantic-ui-react'

import styled from 'theme'

export const StyledContainer = styled(Container)`
  margin-top: 30px;
`

export const Dropzone = styled.div`
  width: 100%;
  height: 250px;
  background: ${({ theme }) => theme.colors.lightGray};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const InstructionsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`
export const IconButton = styled(Button)`
  background: transparent !important;
`

export const StyledMessage = styled(Message)`
  background: ${({ theme }) => theme.colors.warning} !important;
`

export const PendingContainer = styled.div`
  width: 300px;
  margin: 40px auto;
  h3 {
    text-align: center;
  }
`

export const PendingFile = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const FileInput = styled.a`
  color: ${({ theme }) => theme.colors.darkGray};
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
`

export const FileNameContainer = styled.div`
  display: flex;
  align-items: center;
`

export const FileName = styled.span`
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 180px;
`

export const FileSelector = styled.div`
  display: flex;
  color: ${({ theme }) => theme.colors.darkGray};
  flex-direction: column;
  align-items: center;
`

export const NothingMessage = styled.p`
  margin-top: 20px;
  text-align: center;
`

export const SubmitForm = styled.form`
  display: flex;
  justify-content: center;
`
