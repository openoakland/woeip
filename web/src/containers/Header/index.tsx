import styled from '@emotion/styled'
import Logo from 'components/Logo'
import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Menu, MenuItemProps } from 'semantic-ui-react'

let flexStyle = {
  display: 'flex',
  justifyContent: 'space-between'
}

let menuItemStyle = {
  color: '#fff'
}

const menuItems = [
  {
    name: '',
    value: 'Home'
  },
  {
    name: 'upload',
    value: 'Add Data'
  },
  {
    name: 'explore',
    value: 'View Maps'
  },
  {
    name: 'login',
    value: 'Sign In'
  }
]

interface Props {
  loggedIn: boolean
  firstname?: string
}

interface State {
  activeItem: string
}

class Header extends React.Component<Props> {
  public static displayName = 'Header'

  public static defaultProps = {
    loggedIn: false
  }

  public readonly state: State = {
    activeItem: 'Sign In'
  }

  private handleItemClick = (
    _: React.MouseEvent<HTMLAnchorElement>,
    { name }: MenuItemProps
  ) => this.setState({ activeItem: name })

  public render() {
    const { activeItem } = this.state
    return (
      <div style={flexStyle}>
        <Logo />
        <Menu stackable pointing secondary borderless>
          <Menu.Menu position="right">
            {menuItems.map(item => (
              <Menu.Item
                style={menuItemStyle}
                key={item.name}
                {...item}
                as={Link}
                to={item.name}
                active={activeItem === item.name}
                onClick={this.handleItemClick}
              >
                {item.value}
              </Menu.Item>
            ))}
          </Menu.Menu>
        </Menu>
      </div>
    )
  }
}

export default Header
