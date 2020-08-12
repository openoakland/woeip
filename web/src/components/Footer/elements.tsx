import styled from 'theme'

export const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.gray};
`

export const LinkList = styled.ul`
  list-style: none;
`

export const ExternalLink = styled.a`
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
`
