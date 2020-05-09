import React, { useState, useEffect } from 'react'
import {
  Message,
  Icon,
  Button,
  Container,
  Form,
  Input,
  Dropdown
} from 'semantic-ui-react'
import styled from 'theme'

const StyledContainer = styled(Container)`
  margin-top: 30px;
`

const ContentContainer = styled.div`
  margin: 0px 130px 0px 130px;
`

const SuccessBanner = styled(Message)`
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

const SuccessIcon = () => <Icon name='check circle outline' />

const SuccessMessage = styled.span`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 16px;
`

const FormContainer = styled.div`
  width: 500px;
  margin: 0 auto;
`

const FormContent = styled(Form)`
  padding: 22px 72px 80px 32px;
`
const DisabledInput = styled(Input)`
  min-width: auto;
  width: 160px;
`

const CalendarIcon = () => <Icon name='calendar outline' />

const DropdownInput = styled(Dropdown)`
  min-width: auto !important;
  width: 160px;
`

const InputLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size 14px;
  line-height: 24px;
  margin: 0px 0px 32px 0px !important;
`
const SubmitForm = styled.form`
  display: flex;
  justify-content: space-between;
  margin-top: 48px;
  button {
    border-radius: 2px !important;
    font-family: ${({ theme }) => theme.fonts.secondary} !important;
    font-style: normal !important;
    font-weight: 500 !important;
    width: 160px !important;
    font-size: 16px !important;
  }
`

const SaveButton = styled(Button)`
  color: ${({ theme }) => theme.colors.white} !important;
  background-color: rgba(53, 53, 53, 0.9) !important;
`

const CancelButton = styled(Button)`
  color: rgba(53, 53, 53, 0.9) !important;
  background-color: #f4f5f4 !important;
`

const options = [
  { key: 'm', text: 'Male', value: 'male' },
  { key: 'f', text: 'Female', value: 'female' },
  { key: 'o', text: 'Other', value: 'other' }
]

const UploadConfirmation: React.FunctionComponent = () => {
  return (
    <StyledContainer>
      <ContentContainer>
        <SuccessBanner>
          <SuccessIcon />
          <SuccessMessage>Success! Your files were uploaded.</SuccessMessage>
        </SuccessBanner>
        <h3>Step 2. Confirm your session details</h3>
        <FormContainer>
          <FormContent>
            <div>
              <DisabledInput
                icon='calendar outline'
                iconPosition='right'
                disabled={true}
              />
            </div>
            <InputLabel>Collection date</InputLabel>
            <DisabledInput placeholder='First Name' disabled={true} />
            <InputLabel>Start time</InputLabel>
            <DropdownInput
              search={true}
              selection={true}
              options={options}
              placeholder='Gender'
            />
            <InputLabel>Device</InputLabel>
            <SubmitForm>
              <SaveButton>Save</SaveButton>
              <CancelButton>Cancel</CancelButton>
            </SubmitForm>
          </FormContent>
        </FormContainer>
      </ContentContainer>
    </StyledContainer>
  )
}

export default UploadConfirmation
