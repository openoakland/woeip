import styled, { CreateStyled } from '@emotion/styled'

enum breakpoints {
  mobileSm = '(min-width: 320px)',
  mobileMd = '(min-width: 375px)',
  mobileLg = '(min-width: 425px)',
  tablet = '(min-width: 768px)',
  laptop = '(min-width: 1024px)',
  laptopLg = '(min-width: 1440px)',
  desktop = '(min-width: 2560px)'
}

enum colors {
  primary = '#26AE60',
  secondary = '#FFFF57',
  text = '#404040',
  white = '#FFF',
  black = '000',
  gray = '#CFD0CE'
}

enum fonts {
  primary = 'Fakt Pro',
  secondary = 'Fakt Pro Light'
}

interface Theme {
  breakpoints: typeof breakpoints
  colors: typeof colors
  fonts: typeof fonts
}

export const theme: Theme = {
  breakpoints,
  colors,
  fonts
}

export default styled as CreateStyled<Theme>
