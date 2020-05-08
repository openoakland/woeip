import moment from 'moment-timezone'
import * as fs from 'fs'
import {
  getDustrakStart,
  getDustrakEnd,
  getGpsStart
} from 'components/Upload/util'

const testDir: string = `${__dirname}/test-data`

describe('successful gps parse', () => {
  const validGps: Array<string> = fs
    .readFileSync(`${testDir}/valid.log`)
    .toString()
    .split('\n')

  it('should find the time listed in the GPS', () => {
    expect(getGpsStart(validGps).isValid()).toBe(true)
  })
})

describe('start (gprmc) not found in gps', () => {
  const noGprmc: Array<string> = fs
    .readFileSync(`${testDir}/gprmc_missing.log`)
    .toString()
    .split('\n')

  it('has an error from not finding a start datetime', () => {
    expect(getGpsStart(noGprmc).isValid()).toBe(false)
  })
})

describe('start (gprmc) corrupt in gps', () => {
  const gprmcCorrupt: Array<string> = fs
    .readFileSync(`${testDir}/gprmc_corrupt.log`)
    .toString()
    .split('\n')

  it('should fail to create a valid moment in gps', () => {
    expect(getGpsStart(gprmcCorrupt).isValid()).toBe(false)
  })
})

describe('successful dustrak parse', () => {
  const validDustrak: Array<string> = fs
    .readFileSync(`${testDir}/valid.csv`)
    .toString()
    .split('\n')

  it('finds the start and end dustrak datetimes', () => {
    const startDatetime: moment.Moment = getDustrakStart(validDustrak)
    expect(startDatetime.isValid()).toBe(true)
    expect(getDustrakEnd(validDustrak, startDatetime).isValid()).toBe(true)
  })
})

describe('wrong file in place of dustrak', () => {
  const wrongDustrak: Array<string> = fs
    .readFileSync(`${testDir}/wrong.csv`)
    .toString()
    .split('\n')

  it('moment handles non-datetime data', () => {
    const startDatetime: moment.Moment = getDustrakStart(wrongDustrak)
    expect(startDatetime.isValid()).toBe(false)
    expect(getDustrakEnd(wrongDustrak, startDatetime).isValid()).toBe(false)
  })
})

describe('start time missing from dustrak', () => {
  const missingStartDustrak: Array<string> = fs
    .readFileSync(`${testDir}/start_missing.csv`)
    .toString()
    .split('\n')

  it('cant find start and end', () => {
    const startDatetime: moment.Moment = getDustrakStart(missingStartDustrak)
    expect(startDatetime.isValid()).toBe(false)
    expect(getDustrakEnd(missingStartDustrak, startDatetime).isValid()).toBe(
      false
    )
  })
})
