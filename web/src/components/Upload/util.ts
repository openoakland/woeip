import { FileWithPath } from 'react-dropzone'
import moment from 'moment-timezone'

export const getGpsStart = (textLines: Array<string>): moment.Moment => {
  /* Return moment under all circumstances.
  This enables validity checks on returned moment */
  for (const line of textLines) {
    if (line.startsWith('$GPRMC')) {
      const lineFields: Array<string> = line.split(',', 10)
      const startTime: string = lineFields[1]
      const startDate: string = lineFields[9]
      const startDateTime: moment.Moment = moment.utc(
        `${startDate} ${startTime}`,
        'DDMMYYYY hh mm ss.SS'
      )
      return startDateTime
    }
  }
  return moment.utc('')
}

export const getDustrakStart = (textLines: Array<string>): moment.Moment => {
  if (textLines.length > 7) {
    const startTime: string = textLines[6].split(',')[1]
    const startDate: string = textLines[7].split(',')[1]
    const startDatetime: moment.Moment = moment.tz(
      `${startDate} ${startTime}`,
      'MM-DD-YYYY hh:mm:ss a',
      'America/Los_Angeles'
    )
    return startDatetime
  } else {
    return moment('')
  }
}

export const getDustrakEnd = (
  textLines: Array<string>,
  startDatetime: moment.Moment
): moment.Moment => {
  if (textLines.length > 8) {
    const endDatetime: moment.Moment = startDatetime.clone()
    const testLength: string = textLines[8].split(',')[1]
    const [days, hours, minutes]: Array<string> = testLength.split(':')
    endDatetime
      .add(days, 'days')
      .add(hours, 'hours')
      .add(minutes, 'minutes')
    return endDatetime
  } else {
    return moment('')
  }
}

export const identFiles = (
  files: Array<FileWithPath>
): Array<File | undefined> => {
  let gpsFile: File | undefined
  let dustrakFile: File | undefined

  files.forEach(file => {
    if (file.name.endsWith('.csv')) {
      dustrakFile = file
    }

    if (file.name.endsWith('.log')) {
      gpsFile = file
    }
  })
  return [gpsFile, dustrakFile]
}

export const validateFiles = async (
  files: Array<FileWithPath>
): Promise<string> => {
  if (files.length > 0 && files.length < 2) {
    return 'We need one GPS log file and one DusTrak cvs file. Please add a file to continue.'
  }
  if (files.length > 2) {
    return 'We need exactly one GPS log file and one DusTrak cvs file. Please remove additional files.'
  }
  if (files.length === 2) {
    const [gpsFile, dustrakFile] = identFiles(files)
    if (!gpsFile || !dustrakFile) {
      return 'We need one GPS log file and one DusTrak csv file. Please replace one of your files to continue.'
    }

    const [logText, csvText]: Array<string> = await Promise.all([
      gpsFile.text(),
      dustrakFile.text()
    ])
    const csvTextLines: Array<string> = csvText.split('\n', 9)
    const dustrakStart: moment.Moment = getDustrakStart(csvTextLines)
    const dustrakEnd: moment.Moment = getDustrakEnd(csvTextLines, dustrakStart)
    const logTextLines: Array<string> = logText.split('\n', 10)
    const gpsStart: moment.Moment = getGpsStart(logTextLines)

    if (
      !dustrakStart.isValid() ||
      !dustrakEnd.isValid() ||
      !gpsStart.isValid()
    ) {
      return 'Files could not be uploaded. Try again or choose a different file.'
    }
    if (
      !(
        dustrakStart.subtract(2, 'minutes') <= gpsStart &&
        gpsStart <= dustrakStart.add(2, 'minutes')
      )
    ) {
      return `Dates don't match. Please replace one of your files to continue.`
    }
  }
  return ''
}
