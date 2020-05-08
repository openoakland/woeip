import moment from 'moment-timezone'
import * as fs from 'fs'
import { getDustrakStart, getGpsStart } from 'components/Upload/util'

const testDir: string = `${__dirname}/test-data`

describe('successful gps parse', () => {
  let validGps: Array<string> | undefined
  beforeEach(() => {
    validGps = fs
      .readFileSync(`${testDir}/valid.log`)
      .toString()
      .split('\n')
  })

  afterEach(() => {
    validGps = undefined
  })

  it('should find the time listed in the GPS', () => {
    expect(getGpsStart(validGps!)).toEqual(
      moment.utc('060814 192152.825', 'DDMMYYYY hh mm ss.SS')
    )
  })
})

describe('start (gprmc) not found in gps', () => {
  let noGprmc: Array<string> | undefined
  beforeEach(() => {
    noGprmc = fs
      .readFileSync(`${testDir}/gprmc_missing.log`)
      .toString()
      .split('\n')
  })

  afterEach(() => {
    noGprmc = undefined
  })

  it('has an error from not finding a start datetime', () => {
    expect(getGpsStart(noGprmc!)).toEqual(
      new Error('start time not found')
    )
  })
})

describe('start (gprmc) missing data in gps', () => {
  let gprmcCorrupt: Array<string> | undefined
  beforeEach(() => {
    gprmcCorrupt = fs
      .readFileSync(`${testDir}/gprmc_missing.log`)
      .toString()
      .split('\n')
  })
  afterEach(() => {
    gprmcCorrupt = undefined
  })

  it('should fail to create a valid moment in gps', () => {
    expect(getDustrakStart(gprmcCorrupt!)).toEqual(new Error())
  })
})

describe('parse dustrak file', () => {
  test.skip('finds the start and end times in the dustrak file', () => {
    const validCsvData: Buffer = fs.readFileSync(
      `${__dirname}/test-data/valid.csv`
    )
    console.log(validCsvData.toString())
  })
})
