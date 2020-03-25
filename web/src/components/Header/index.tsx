import styled from 'theme'
import Logo from 'components/Logo'
import React, { useState } from 'react'
import { Container, Menu, MenuItemProps } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const StyledContainer = styled(Container)`
  display: flex !important;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  padding-top: 48px;
  .menu a {
    line-height: 16px;
    padding: 20px 40px !important;
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
  { route: 'about', text: 'Visit WOEIP' },
  { text: 'Add Data', route: 'upload' },
  { text: 'View Maps', route: 'maps' }
]

const Header: React.FunctionComponent = () => {
  const [activeItem, setActiveItem] = useState<MenuItemProps['name']>(
    menuItems[menuItems.length - 1]
  )

  const handleItemClick: MenuItemProps['onClick'] = (
    _: React.MouseEvent<HTMLAnchorElement>,
    { name }: MenuItemProps
  ) => setActiveItem(name)

  return (
    <StyledContainer>
      <Link to='/'>
        <Logo />
      </Link>
      <Menu stackable pointing secondary>
        <Menu.Menu position='right'>
          {menuItems.map(({ text, route }) => (
            <Menu.Item
              className='menu-item'
              key={text}
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

export default Header
