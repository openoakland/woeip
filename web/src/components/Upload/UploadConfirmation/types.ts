import { FileWithPath } from 'react-dropzone'

export type ConfirmationProps = {
  files: Array<FileWithPath>
  setFiles: (files: Array<FileWithPath>) => void
  setProceed: (proceed: boolean) => void
}
