const font = {
  primary: 'Fakt Pro',
  secondary: 'Fakt Pro Light'
}

type FontType = typeof font

export interface Fonts extends FontType {
  [key: string]: string
}

export default font
