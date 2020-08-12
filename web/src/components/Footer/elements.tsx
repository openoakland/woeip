import styled from 'theme'

export const Container = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.gray};
`

export const LinkList = styled.ul`
  list-style: none;
  padding: 32px 40px;
`

export const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
`
