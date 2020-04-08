// import styled from 'theme'
// import Logo from 'components/Logo'
// import React from 'react'
// import { Container, Menu, MenuItemProps } from 'semantic-ui-react'
// import { Link } from 'react-router-dom'

// const StyledContainer = styled(Container)`
//   display: flex !important;
//   justify-content: space-between;
//   align-items: center;
//   align-content: center;
//   padding-top: 48px;
//   a {
//     line-height: 16px;
//     &:hover:not(.active) {
//       font-weight: lighter;
//       opacity: 0.5;
//     }
//     &.active,
//     &:hover {
//       border-color: ${({ theme }) => theme.colors.primary} !important;
//       color: ${({ theme }) => theme.colors.primary} !important;
//     }
//   }
// `

// const menuItems = ['about', 'upload', 'maps']

// interface Props {
//   loggedIn: boolean
//   firstname?: string
// }

// interface State {
//   activeItem: string
// }

// class Header extends React.Component<Props> {
//   public static displayName = 'Header'

//   public static defaultProps = {
//     loggedIn: false
//   }

//   public readonly state: State = {
//     activeItem: 'maps'
//   }

//   public render() {
//     const { activeItem } = this.state
//     return (
//       <StyledContainer>
//         <Logo />
//         <Menu stackable pointing secondary>
//           <Menu.Menu position='right'>
//             {menuItems.map(item => (
//               <Menu.Item
//                 key={item}
//                 name={item}
//                 link
//                 as={Link}
//                 to={`/${item}`}
//                 active={activeItem === item}
//                 onClick={this.handleItemClick}
//               >
//                 {item}
//               </Menu.Item>
//             ))}
//           </Menu.Menu>
//         </Menu>
//       </StyledContainer>
//     )
//   }

//   private handleItemClick = (
//     _: React.MouseEvent<HTMLAnchorElement>,
//     { name }: MenuItemProps
//   ) => this.setState({ activeItem: name })
// }

// export default Header
