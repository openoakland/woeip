import styled from 'theme'

export const Content = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
`

export const Header = styled.h3`
  font-size: 1.5rem;
`

export const LabelContainer = styled.div`
  overflow: hidden;
`

export const SessionLabelContainer = styled.div`
  overflow: hidden;
  margin-top: 40px;
`

export const Label = styled.p`
  font-size: 1rem;
  float: right;
`

export const BoldedLabel = styled.p`
  font-size: 1rem;
  font-weight: bold;
  float: left;
  margin-bottom: 0.7rem;
`

export const TextLabel = styled.label`
  margin-left: 0.2rem;
`

export const BoldedSessionLabel = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.7rem;
`

export const DateContainer = styled.div`
  padding-top: 5px;
  display: flex;
  .input {
    width: 140px;
  }
`

export const NoDataContainer = styled.div`
  display: flex;
  height: 100%;
  margin-top: 30px;
`

export const NoDataText = styled.label`
  font-weight: bold;
`

export const SessionDataContainer = styled.div`
  position: relative;
  height: 100%;
`

export const SessionLabel = styled.p`
  text-decoration: underline;
  cursor: pointer;
`

export const ViewDataLabel = styled.p`
  text-decoration: underline;
  cursor: pointer;
  position: absolute;
  bottom: 0;
`
