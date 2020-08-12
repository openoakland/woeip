import * as React from 'react'
import { FooterLink } from 'components/Footer/types'

const footerLinks: FooterLink[] = [
    { name: 'WOAQ on GitHub', url: 'https://github.com/openoakland/woeip' },
    { name: 'OpenOakland', url: 'https://openoakland.org' },
    { name: 'WOEIP', url: 'https://woeip.org' }
]

const Footer: React.FunctionComponent = () => {
    const footerItems = footerLinks.map((link: FooterLink) => (
        <li key={link.name}>
            <a href={link.url}>{link.name}</a>
        </li>
    ))
    return <div>
        <ul>{footerItems}</ul>
    </div>
}

export default Footer
