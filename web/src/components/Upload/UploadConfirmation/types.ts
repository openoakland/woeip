import {FileWithPath} from 'react-dropzone'

export type ConfirmationProps = {
    files: FileWithPath[]
    setFiles: (files: FileWithPath[]) => void
}
