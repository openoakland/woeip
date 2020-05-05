import { FileWithPath } from 'react-dropzone'
import moment from 'moment-timezone'

export const getDatetimeGPS = (gps: Blob) => {
  gps
    .text()
    .then((text: string) => {
      const textLines: Array<string> = text.split('\n')
      let encodedTime: string
      for (const line of textLines) {
        if (line.startsWith('$GPRMC')) {
          encodedTime = line.split(',')[1]
          const endTime = moment.utc(
            `08/06/2014 ${encodedTime}`,
            'MM-DD-YYYY hh mm ss.SS'
          )
          console.log(`gps time: ${endTime}`)
          break
        }
      }
    })
    .catch((error: Error) => {
      console.warn(error)
    })
}

export const getDatetimeDustrak = (dustrak: Blob) => {
  dustrak
    .text()
    .then((text: string) => {
      const textLines: Array<string> = text.split('\n')
      const startTime: string = textLines[6].split(',')[1]
      const startDate: string = textLines[7].split(',')[1]
      const testLength: string = textLines[8].split(',')[1]
      const startDatetime: moment.Moment = moment.tz(
        `${startDate} ${startTime}`,
        'MM-DD-YYYY hh:mm:ss a',
        'America/Los_Angeles'
      )
      const endDatetime: moment.Moment = startDatetime.clone()
      const testIntervals: Array<string> = testLength.split(':')
      endDatetime
        .add(testIntervals[0], 'days')
        .add(testIntervals[1], 'hours')
        .add(testIntervals[2], 'minutes')

      console.log(`start: ${startDatetime} end: ${endDatetime}`)
    })
    .catch((error: Error) => {
      console.warn(error)
    })
}

export const validateFiles = (files: Array<FileWithPath>): string => {
  if (files.length > 0 && files.length < 2) {
    return 'We need one GPS log file and one DusTrak cvs file. Please add a file to continue.'
  }

  if (files.length > 2) {
    return 'We need exactly one GPS log file and one DusTrak cvs file. Please remove additional files.'
  }

  if (files.length === 2) {
    let logFile: Blob | undefined
    let csvFile: Blob | undefined

    files.forEach(file => {
      if (file.type === 'text/csv') {
        csvFile = file
      }

      if (file.type === 'text/x-log') {
        logFile = file
      }
    })

    if (!logFile || !csvFile) {
      return 'We need one GPS log file and one DusTrak csv file. Please replace one of your files to continue.'
    } else {
      getDatetimeDustrak(csvFile!)
      getDatetimeGPS(logFile!)
    }
  }

  return ''
}
