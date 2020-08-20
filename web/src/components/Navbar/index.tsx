import styled from 'theme'
import Logo from 'components/Logo'
import React, { useState, useEffect } from 'react'
import { Container, Menu } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom'
import { RouteComponentProps} from 'react-router'

const StyledContainer = styled(Container)`
  display: flex !important;
  justify-content: space-between;
  align-items: flex-start;
  align-content: center;
  padding-top: 40px;
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

interface RouteParams extends RouteComponentProps {
  pathname: string
}

const Header: React.FunctionComponent<RouteParams> = ({
  location
}: RouteComponentProps) => {
  const [activeItem, setActiveItem] = useState<string>(
    location.pathname.split('/')[1]
  )

  useEffect(()=> setActiveItem(location.pathname.split('/')[1]))

  return (
    <StyledContainer>
      <Link to='/'>
        <Logo />
      </Link>
      <Menu
        stackable={true}
        pointing={true}
        secondary={true}
        style={{ borderBottom: 'none', marginTop: 0 }}
      >
        <Menu.Menu position='right'>
          {menuItems.map(({ text, route }) => (
            <Menu.Item
              className='menu-item'
              key={route}
              name={route}
              link={true}
              as={Link}
              to={`/${route}`}
              active={activeItem === route}
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
