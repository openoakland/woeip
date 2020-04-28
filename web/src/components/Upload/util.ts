import { FileWithPath } from 'react-dropzone'

export const validateFiles = (files: Array<FileWithPath>): string => {

  var needsFeedback: string = `We need one GPS log file and one DusTrak cvs file.`
  if (files.length > 0 && files.length < 2) {
    return `${needsFeedback} Please add a file to continue.`
  }

  else if (files.length > 2) {
    return `${needsFeedback} Please remove additional files.`
  }

  else if (files.length === 2) {
    let logFile: FileWithPath | undefined
    let csvFile: FileWithPath | undefined

    files.forEach(file => {
      if (file.name.endsWith('.csv')) {
        csvFile = file
      }

      else if (file.name.endsWith('.log')) {
        logFile = file
      }
    })

  if (!logFile || !csvFile) {
      return `${needsFeedback} Please replace one of your files to continue.`
    }
  }

  return ''
}
