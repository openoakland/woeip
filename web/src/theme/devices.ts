const breakpoints: { [key: string]: number } = {
  mobileSm: 320,
  mobileMd: 375,
  mobileLg: 425,
  tablet: 768,
  laptop: 1024,
  laptopLg: 1440,
  desktop: 2560
}

export interface Devices {
  [key: string]: string
}

const devices: Devices = Object.keys(breakpoints).reduce(
  (acc: Devices, curr) => {
    const width: number = breakpoints[curr]
    acc[curr] = `(min-width: ${width}px)`
    return acc
  },
  {}
)

export default devices
