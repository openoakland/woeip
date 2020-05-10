import moment from 'moment-timezone'
import * as fs from 'fs'
import {
  getDustrakStart,
  getDustrakEnd,
  getGpsStart
} from 'components/Upload/util'

const testDir: string = `${__dirname}/test-data`

describe('parses gps and dustrak files', () => {
  let validGps: Array<string>
  let noGprmc: Array<string>
  let gprmcCorrupt: Array<string>
  let validDustrak: Array<string>
  let wrongDustrak: Array<string>
  let missingStartDustrak: Array<string>
  let empty: Array<string>
  beforeAll(async () => {
    const readFile = (path: string, opts: string = 'utf8') =>
      new Promise((resolve, reject) => {
        fs.readFile(path, opts, (err, data) => {
          if (err) reject(err)
          else resolve(data.toString().split('\n', 10))
        })
      })

    const validGpsPromise: Promise<any> = readFile(`${testDir}/valid.log`)
    const noGprmcPromise: Promise<any> = readFile(
      `${testDir}/gprmc_missing.log`
    )
    const gprmcCorruptPromise: Promise<any> = readFile(
      `${testDir}/gprmc_corrupt.log`
    )
    const validDustrakPromise: Promise<any> = readFile(`${testDir}/valid.csv`)
    const wrongDustrakPromise: Promise<any> = readFile(`${testDir}/wrong.csv`)
    const missingStartDustrakPromise: Promise<any> = readFile(
      `${testDir}/start_missing.csv`
    )
    const emptyPromise: Promise<any> = readFile(`${testDir}/empty.txt`)
    const fileData = await Promise.all([
      validGpsPromise,
      noGprmcPromise,
      gprmcCorruptPromise,
      validDustrakPromise,
      wrongDustrakPromise,
      missingStartDustrakPromise,
      emptyPromise
    ])
    validGps = fileData[0]
    noGprmc = fileData[1]
    gprmcCorrupt = fileData[2]
    validDustrak = fileData[3]
    wrongDustrak = fileData[4]
    missingStartDustrak = fileData[5]
    empty = fileData[6]
  })

  it('should find the time listed in the GPS', () => {
    expect(getGpsStart(validGps).isValid()).toBe(true)
  })

  it('has an error from not finding a start datetime', () => {
    expect(getGpsStart(noGprmc).isValid()).toBe(false)
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
