import { FileWithPath } from 'react-dropzone'
import moment from 'moment-timezone'
import { DustrakMeta, ValidateMeta } from 'components/Upload/types'

export const getGpsStart = (
  textLines: Array<string>
): moment.Moment | Error => {
  for (const line of textLines) {
    if (line.startsWith('$GPRMC')) {
      const lineFields: Array<string> = line.split(',')
      const encodedTime: string = lineFields[1]
      const encodedDate: string = lineFields[9]
      const endTime: moment.Moment = moment.utc(
        `${encodedDate} ${encodedTime}`,
        'DDMMYYYY hh mm ss.SS'
      )
      return endTime
    }
  }
  return new Error('start time not found')
}

export const getDustrakStart = (textLines: Array<string>): moment.Moment => {
  const startTime: string = textLines[6].split(',')[1]
  const startDate: string = textLines[7].split(',')[1]
  const startDatetime: moment.Moment = moment.tz(
    `${startDate} ${startTime}`,
    'MM-DD-YYYY hh:mm:ss a',
    'America/Los_Angeles'
  )
  return startDatetime
}

export const getDustrakEnd = (
  textLines: Array<string>,
  startDatetime: moment.Moment
): moment.Moment => {
  const endDatetime: moment.Moment = startDatetime.clone()
  const testLength: string = textLines[8].split(',')[1]
  const [days, hours, minutes]: Array<string> = testLength.split(':')
  endDatetime
    .add(days, 'days')
    .add(hours, 'hours')
    .add(minutes, 'minutes')
  return endDatetime
}

export const validateFiles = async (
  files: Array<FileWithPath>
): Promise<ValidateMeta> => {
  const dustrakData: DustrakMeta = {
    startDatetime: '',
    endDatetime: ''
  }
  const validateData: ValidateMeta = {
    message: '',
    dustrakMeta: dustrakData
  }

  if (files.length > 0 && files.length < 2) {
    validateData.message =
      'We need one GPS log file and one DusTrak cvs file. Please add a file to continue.'
  } else if (files.length > 2) {
    validateData.message =
      'We need exactly one GPS log file and one DusTrak cvs file. Please remove additional files.'
  } else if (files.length === 2) {
    let logFile: File | undefined
    let csvFile: File | undefined

    files.forEach(file => {
      if (file.type === 'text/csv') {
        csvFile = file
      }

      if (file.type === 'text/x-log') {
        logFile = file
      }
    })

    if (!logFile || !csvFile) {
      validateData.message =
        'We need one GPS log file and one DusTrak csv file. Please replace one of your files to continue.'
    } else {
      const [logText, csvText]: Array<string> = await Promise.all([
        logFile.text(),
        csvFile.text()
      ])
      const csvTextLines: Array<string> = csvText.split('\n')
      const dustrakStart: moment.Moment = getDustrakStart(csvTextLines)
      const dustrakEnd: moment.Moment = getDustrakEnd(
        csvTextLines,
        dustrakStart
      )
      const logTextLines: Array<string> = logText.split('\n')
      const gpsStart: moment.Moment | Error = getGpsStart(logTextLines)
      validateData.message = ''
      dustrakData.startDatetime = dustrakStart.format()
      dustrakData.endDatetime = dustrakEnd.format()
    }
  }
  return validateData
}
