import moment from 'moment-timezone'
import * as fs from 'fs'
import {
  getDustrakStart,
  getDustrakEnd,
  getGpsStart
} from 'components/Upload/util'

const testDir = `${__dirname}/test-data`

describe('parses gps and dustrak files', () => {
  let validGps: Array<string>
  let gprmcMissing: Array<string>
  let gprmcCorrupt: Array<string>
  let validDustrak: Array<string>
  let wrongDustrak: Array<string>
  let missingStartDustrak: Array<string>
  let empty: Array<string>
  beforeAll(async () => {
    const readFile = (path: string, opts = 'utf8'): Promise<Array<string>> =>
      new Promise((resolve, reject) => {
        fs.readFile(path, opts, (err, data) => {
          if (err) reject(`error: ${err}`)
          else resolve(data.toString().split('\n', 10))
        })
      })

    const fileNames: Array<string> = [
      'valid.log',
      'gprmc_missing.log',
      'gprmc_corrupt.log',
      'valid.csv',
      'wrong.csv',
      'start_missing.csv',
      'empty.txt'
    ]
    const filePromises: Array<Promise<Array<string>>> = []
    for (const file of fileNames) {
      const filePomise: Promise<Array<string>> = readFile(`${testDir}/${file}`)
      filePromises.push(filePomise)
    }
    // tslint:disable-next-line
    ;[
      validGps,
      gprmcMissing,
      gprmcCorrupt,
      validDustrak,
      wrongDustrak,
      missingStartDustrak,
      empty
    ] = await Promise.all(filePromises)
  })

  it('should find the time listed in the GPS', () => {
    expect(getGpsStart(validGps).isValid()).toBe(true)
  })

  it('has an error from not finding a start datetime', () => {
    expect(getGpsStart(gprmcMissing).isValid()).toBe(false)
  })

  it('should fail to create a valid moment in gps', () => {
    expect(getGpsStart(gprmcCorrupt).isValid()).toBe(false)
  })

  it('finds the start and end dustrak datetimes', () => {
    const startDatetime: moment.Moment = getDustrakStart(validDustrak)
    expect(startDatetime.isValid()).toBe(true)
    expect(getDustrakEnd(validDustrak, startDatetime).isValid()).toBe(true)
  })

  it('moment handles non-datetime data', () => {
    const startDatetime: moment.Moment = getDustrakStart(wrongDustrak)
    expect(startDatetime.isValid()).toBe(false)
    expect(getDustrakEnd(wrongDustrak, startDatetime).isValid()).toBe(false)
  })

  it('cant find start and end', () => {
    const startDatetime: moment.Moment = getDustrakStart(missingStartDustrak)
    expect(startDatetime.isValid()).toBe(false)
    expect(getDustrakEnd(missingStartDustrak, startDatetime).isValid()).toBe(
      false
    )
  })

  it('should handle empty in gps module', () => {
    expect(getGpsStart(empty).isValid()).toBe(false)
  })

  it('should handle empty in dustrak modules', () => {
    const startDatetime: moment.Moment = getDustrakStart(empty)
    expect(startDatetime.isValid()).toBe(false)
    expect(getDustrakEnd(empty, startDatetime).isValid()).toBe(false)
  })
})
