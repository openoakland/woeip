import { getDatetimeDustrak } from 'components/Upload/util'
import dustrak from 'components/Upload/test-data/dustrak.csv'

describe('parse dustrak file', () => {
  test('finds the start and end times in the dustrak file', () => {
    console.log(dustrak)
    // expect(getDatetimeDustrak(dustrak)).toBe(true)
  })
})
