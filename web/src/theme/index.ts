import devices, { Devices } from './devices'
import fonts, { Fonts } from './fonts'
import colors, { Palette } from './colors'

export interface Theme {
  fonts: Fonts
  colors: Palette
  devices: Devices
}

const theme: Theme = {
  fonts,
  colors,
  devices
}

export default theme
