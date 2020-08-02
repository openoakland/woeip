import React from 'react'
import {
  Message,
  Icon,
  Button,
  Container,
  Input,
  Dropdown
} from 'semantic-ui-react'
import styled from 'theme'

export const SuccessIcon = () => <Icon name='check circle outline' />

export const StyledContainer = styled(Container)`
  margin-top: 30px;
`

export const ContentContainer = styled.div`
  margin: 0px 130px 0px 130px;
`

export const SuccessBanner = styled(Message)`
  background: #619e54 !important;
  height: 48px;
  width: 100%;
  display: flex;
  border-radius: 4px;
  align-items: center;
  margin-bottom: 32px;
  * {
    color: ${({ theme }) => theme.colors.white};
  }
  i.icon {
    font-size: 20px;
  }
  h3 {
    font-size: 24px;
  }
`

export const SuccessMessage = styled.span`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1rem;
`

export const FormMessage = styled.h3`
  font-size: 1.5rem;
`

export const FormContainer = styled.div`
  width: 500px;
  margin: 0 auto;
`

export const FormContent = styled.div`
  padding: 1.85rem 4.5rem 5rem 2rem;
`

export const DisabledInput = styled(Input)`
  min-width: auto;
  width: 160px;
`

export const DropdownInput = styled(Dropdown)`
  min-width: auto !important;
  width: 160px;
  //eventually need to make borders of this dropdown #232735 per wireframe
  // :focus-within {
  //   border: 1px solid #232735 !important;
  // }
`

export const InputLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size .875rem;
  line-height: 24px;
  margin: 0px 0px 32px 0px !important;
`

export const SubmitForm = styled.form`
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  button {
    border-radius: 2px !important;
    font-family: ${({ theme }) => theme.fonts.secondary} !important;
    font-style: normal !important;
    font-weight: 500 !important;
    width: 160px !important;
    font-size: 1rem !important;
  }
`

export const SaveButton = styled(Button)`
  color: ${({ theme }) => theme.colors.white} !important;
  background-color: rgba(53, 53, 53, 0.9) !important;
`

export const CancelButton = styled(Button)`
  color: rgba(53, 53, 53, 0.9) !important;
  background-color: #f4f5f4 !important;
`
