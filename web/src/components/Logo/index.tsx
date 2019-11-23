import styled from '@emotion/styled'
import React from 'react'

const LogoContainer = styled.div`
  font-size: 56px;
  line-height: 48px;
  word-wrap: break-word;
  color: ${({ theme }) => theme.colors.text};
  width: 100px;
  text-align: right;
`

const Logo: React.FunctionComponent<{}> = () => (
  <LogoContainer>WOAQ</LogoContainer>
)

export default Logo
