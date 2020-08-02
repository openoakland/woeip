import React, { useState, useEffect } from 'react'
import { FileWithPath } from 'react-dropzone'
import { useHistory } from 'react-router-dom'
import * as confirmationElements from 'components/Upload/UploadConfirmation/elements'
import {
  identFiles,
  getDustrakStart,
  getDustrakEnd
} from 'components/Upload/util'
import axios from 'axios'
import moment from 'moment-timezone'

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
  const history = useHistory()

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
      setDustrakText(dustrakTextUpdate)
    }
    getDustrak()
  }, [files])
  const upload = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()

    formData.append('upload_files', files[0])
    formData.append('upload_files', files[1])
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
        history.push('/maps')
      })
      .catch(error => {
        console.error(error)
        alert(`files failed to upload: ${error.message}`)
      })
  }

  const cancelUpload = () => {
    history.push('/about')
  }

  return (
    <confirmationElements.StyledContainer>
      <confirmationElements.ContentContainer>
        <confirmationElements.SuccessBanner>
          <confirmationElements.SuccessIcon />
          <confirmationElements.SuccessMessage>
            Success! Your files were uploaded.
          </confirmationElements.SuccessMessage>
        </confirmationElements.SuccessBanner>
        <confirmationElements.FormMessage>
          Step 2. Confirm your session details
        </confirmationElements.FormMessage>
        <confirmationElements.FormContainer>
          <confirmationElements.FormContent>
            <div>
              <confirmationElements.DisabledInput
                value={dustrakStart.format('MM/DD/YYYY')}
                icon='calendar outline'
                disabled={true}
              />
            </div>
            <confirmationElements.InputLabel>
              Collection date
            </confirmationElements.InputLabel>
            <confirmationElements.DisabledInput
              value={dustrakStart.format('h:mm A')}
              disabled={true}
            />
            <confirmationElements.InputLabel>
              Start time
            </confirmationElements.InputLabel>
            <confirmationElements.DropdownInput
              search={true}
              selection={true}
              options={options}
              defaultValue={options[0].value}
            />
            <confirmationElements.InputLabel>
              Device
            </confirmationElements.InputLabel>
            <confirmationElements.SubmitForm onSubmit={upload}>
              <confirmationElements.SaveButton type='submit'>
                Save
              </confirmationElements.SaveButton>
              <confirmationElements.CancelButton onClick={cancelUpload}>
                Cancel
              </confirmationElements.CancelButton>
            </confirmationElements.SubmitForm>
          </confirmationElements.FormContent>
        </confirmationElements.FormContainer>
      </confirmationElements.ContentContainer>
    </confirmationElements.StyledContainer>
  )
}

export default UploadConfirmation
