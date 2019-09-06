import styled from '@emotion/styled'
import React from 'react'

const LogoContainer = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 32px;
  line-height: 48px;
  display: flex;
  align-items: center;
  color: #000000;
`

const Logo: React.FunctionComponent<{}> = () => (
  <LogoContainer>WOAQ</LogoContainer>
)

export default Logo
