import React, { useState, useEffect } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import {
  Message,
  Icon,
  Button,
  Container,
  Input,
  Dropdown
} from 'semantic-ui-react'
import {
  identFiles,
  getDustrakStart,
  getDustrakEnd,
  validateFiles
} from 'components/Upload/util'
import axios from 'axios'
import styled from 'theme'
import moment from 'moment-timezone'

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
  font-size: 1rem;
`

const FormMessage = styled.h3`
  font-size: 1.5rem;
`

const FormContainer = styled.div`
  width: 500px;
  margin: 0 auto;
`

const FormContent = styled.div`
  padding: 1.85rem 4.5rem 5rem 2rem;
`
const DisabledInput = styled(Input)`
  min-width: auto;
  width: 160px;
`

const CalendarIcon = () => <Icon name='calendar outline' />

const DropdownInput = styled(Dropdown)`
  min-width: auto !important;
  width: 160px;
  //eventually need to make borders of this dropdown #232735 per wireframe
  // :focus-within {
  //   border: 1px solid #232735 !important;
  // }
`

const InputLabel = styled.p`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size .875rem;
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
    font-size: 1rem !important;
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
  { key: 'a', text: 'Device A', value: 'Device A' },
  { key: 'b', text: 'Device B', value: 'Device B' },
  { key: 'c', text: 'Device C', value: 'Device c' },
  { key: 'd', text: 'Device D', value: 'Device D' }
]

const UploadConfirmation: React.FunctionComponent<Array<
  FileWithPath
>> = files => {
  const [dustrakText, setDustrakText] = useState<Array<string>>([])
  const [dustrakStart, setDustrakStart] = useState<moment.Moment>(moment(''))

  useEffect(() => {
    const getDustrak = async () => {
      // files passed to component as object but processed like array
      const dustrakFile: File = identFiles([files[0], files[1]])[1]!
      const dustrakString: string = await dustrakFile.text()
      const dustrakTextUpdate: Array<string> = dustrakString.split('\n', 10)
      const dustrakStartUpdate: moment.Moment = getDustrakStart(
        dustrakTextUpdate
      )
      setDustrakStart(dustrakStartUpdate)
      console.log(dustrakTextUpdate)
      console.log(dustrakStartUpdate)
      setDustrakText(dustrakTextUpdate)
    }
    getDustrak()
  }, [files])
  const upload = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()

    for (const file of files) {
      formData.append('upload_files', file)
    }

    // const dustrakStart: moment.Moment = getDustrakStart(dustrakText)
    formData.append('starts_at', dustrakStart.format())
    formData.append(
      'ends_at',
      getDustrakEnd(dustrakText, dustrakStart).format()
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
        // setFiles([])
      })
      .catch(error => {
        console.error(error)
        alert(`files failed to upload: ${error.message}`)
      })
  }

  return (
    <StyledContainer>
      <ContentContainer>
        <SuccessBanner>
          <SuccessIcon />
          <SuccessMessage>Success! Your files were uploaded.</SuccessMessage>
        </SuccessBanner>
        <FormMessage>Step 2. Confirm your session details</FormMessage>
        <FormContainer>
          <FormContent>
            <div>
              <DisabledInput
                value={dustrakStart.format('MMMM Do YYYY')}
                icon='calendar outline'
                disabled={true}
              />
            </div>
            <InputLabel>Collection date</InputLabel>
            <DisabledInput
              value={dustrakStart.format('h:mm:ss a')}
              disabled={true}
            />
            <InputLabel>Start time</InputLabel>
            <DropdownInput
              search={true}
              selection={true}
              options={options}
              defaultValue={options[0].value}
            />
            <InputLabel>Device</InputLabel>
            <SubmitForm onSubmit={upload}>
              <SaveButton type='submit'>Save</SaveButton>
              <CancelButton>Cancel</CancelButton>
            </SubmitForm>
          </FormContent>
        </FormContainer>
      </ContentContainer>
    </StyledContainer>
  )
}

export default UploadConfirmation
