import styled from 'theme'
import { Container, Segment } from 'semantic-ui-react'

export const StyledContainer = styled(Container)`
  margin-top: 30px;
`

export const ContentContainer = styled.div`
  margin: 0px 130px 92px 130px;
`

export const LowerHalfContainer = styled.div`
  margin-top: 22px;
  display: flex;
`

export const MapContainer = styled(Segment)`
         height: 548px;
         width: 65%;
         margin: 0px !important;
         padding: 0px !important;
         border-radius: 0px !important;
         border: none !important;
         box-shadow: none !important;
       `

export const ControlPanelContainer = styled.div`
  height: 548px;
  width: 35%;
  padding-left: 54px;
`

export const FormMessage = styled.h3`
  font-size: 1.5rem;
`

export const LoadingContainer = styled.div`
`
