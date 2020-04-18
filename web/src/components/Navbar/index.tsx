import styled from 'theme'
import Logo from 'components/Logo'
import React, { useState } from 'react'
import { Container, Menu, MenuItemProps } from 'semantic-ui-react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'

const StyledContainer = styled(Container)`
  display: flex !important;
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
  margin-top: 40px;
  .menu a {
    margin: 0 20px !important;
    &:hover:not(.active) {
      opacity: 0.8;
    }
    &.active,
    &:hover {
      border-color: ${({ theme }) => theme.colors.primary} !important;
      color: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`

const menuItems = [
  { text: 'About', route: 'about' },
  { text: 'Upload', route: 'upload' },
  { text: 'Maps', route: 'maps' }
]

interface RouteParams {
  pathname: string
}

const Header: React.FunctionComponent<RouteComponentProps<RouteParams>> = ({
  location
}) => {
  const [activeItem, setActiveItem] = useState<string>(
    location.pathname.split('/')[1]
  )

  const handleItemClick: MenuItemProps['onClick'] = (
    _: React.MouseEvent<HTMLAnchorElement>,
    { name }: MenuItemProps
  ) => setActiveItem(name || '')

  return (
    <StyledContainer>
      <Link to='/'>
        <Logo />
      </Link>
      <Menu
        stackable
        pointing
        secondary
        style={{ borderBottom: 'none', marginTop: 0 }}
      >
        <Menu.Menu position='right'>
          {menuItems.map(({ text, route }) => (
            <Menu.Item
              className='menu-item'
              key={route}
              name={route}
              link
              as={Link}
              to={`/${route}`}
              active={activeItem === route}
              onClick={handleItemClick}
            >
              {text}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </Menu>
    </StyledContainer>
  )
}

export default withRouter(Header)
