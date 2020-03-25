import styled from 'theme'

const LogoText = 'WOAQ'

const Logo = styled.div`
  &::after {
    content: '${LogoText}';
  }
  color: ${({ theme }) => theme.colors.text};
  font-size: 36px;
  line-height: 48px;
  text-align: right;
  width: 100px;
`

export default Logo
