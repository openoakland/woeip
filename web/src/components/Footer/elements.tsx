import styled from 'theme'

export const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray};
`

export const LinkList = styled.ul`
  list-style: none;
  padding-top: 32px;
  padding-bottom: 32px;
  padding-left: 40px;
`

export const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
`
