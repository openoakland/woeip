import { CancelToken } from 'axios'
import moment from 'moment-timezone'

export type ControlPanelProps = {
    date: moment.Moment
    setDate: (date: moment.Moment) => void
    setPollutants: (values: Array<any>) => void
    collections: Array<number>
    currentCollection: any
    getPollutants: any
}
