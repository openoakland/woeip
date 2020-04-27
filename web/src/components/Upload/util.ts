import { FileWithPath } from 'react-dropzone'

// export const parseDatesFromCsv = (file: FileWithPath): Array<string> => {}

const parseDateFromLogFileName = (fileName: string): string => {
  const fileNameArr = fileName.split('_')
  const dateString = fileNameArr[1]
  return `${dateString.slice(0, 4)}/${dateString.slice(
    4,
    6
  )}/${dateString.slice(6)}`
}

export const validateFiles = (files: Array<FileWithPath>): string => {
  if (files.length > 0 && files.length < 2) {
    return 'We need one GPS log file and one DusTrak cvs file. Please add a file to continue.'
  }

  if (files.length > 2) {
    return 'We need exactly one GPS log file and one DusTrak cvs file. Please remove additional files.'
  }

  if (files.length === 2) {
    let logFile: FileWithPath | undefined
    let csvFile: FileWithPath | undefined

    files.forEach(file => {
      if (file.name.endsWith('.csv')) {
        csvFile = file
      }

      if (file.name.endsWith('.log')) {
        logFile = file
      }
    })

    if (!logFile || !csvFile) {
      return 'We need one GPS log file and one DusTrak csv file. Please replace one of your files to continue.'
    }
  }

  return ''
}
