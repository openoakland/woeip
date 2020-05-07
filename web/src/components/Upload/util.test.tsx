import { getDustrakStart } from 'components/Upload/util'
import * as fs from 'fs'

describe('parse dustrak file', () => {
  test('finds the start and end times in the dustrak file', () => {
    const validCsvData: Buffer = fs.readFileSync(
      `${__dirname}/test-data/valid.csv`
    )
    console.log(validCsvData.toString())
  })
})
