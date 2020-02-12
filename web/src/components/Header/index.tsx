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
    &:hover:not(.active) {
      font-weight: lighter;
      opacity: 0.5;
    }
    &.active,
    &:hover {
      border-color: ${({ theme }) => theme.colors.primary} !important;
      color: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`

const menuItems = ['about', 'upload', 'maps']

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
          {menuItems.map(item => (
            <Menu.Item
              key={item}
              name={item}
              link
              as={Link}
              to={`/${item}`}
              active={activeItem === item}
              onClick={handleItemClick}
            >
              {item}
            </Menu.Item>
          ))}
        </Menu.Menu>
      </Menu>
    </StyledContainer>
  )
}

export default Header
