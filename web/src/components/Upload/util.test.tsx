import moment from 'moment-timezone'
import * as fs from 'fs'
import { getDustrakStart, getGpsStart } from 'components/Upload/util'


const testDir: string = `${__dirname}/test-data/`

describe('successful gps parse', () => {
  let validGpsLines: Array<string> | undefined
  beforeAll(() => {
    validGpsLines = fs
      .readFileSync(`${testDir}/valid.log`)
      .toString()
      .split('\n')
  })

  afterAll(() => {
    validGpsLines = undefined
  })

  it('should find the time listed in the GPS', ()=>{
    expect(getGpsStart(validGpsLines!)).toEqual(moment.utc('060814 192152.825','DDMMYYYY hh mm ss.SS'))
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
