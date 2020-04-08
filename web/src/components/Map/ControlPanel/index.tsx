// // import styled from 'theme'
// import React, { useState, useEffect, FunctionComponent } from 'react'
// import SemanticDatepicker, {
//   SemanticDatepickerProps
// } from 'react-semantic-ui-datepickers'
// import { NavigationControl } from 'react-map-gl'
// // import moment from 'moment'
// import './index.scss'

// const FiltersContainer = styled.div`
//   position: absolute;
//   left: 20px;
//   padding: 10px;
//   min-width: 250px;
// `

// const MapFilters: FunctionComponent = () => {
//   const [_, setDates] = useState<Array<Date>>([])
//   const onChange: SemanticDatepickerProps['onChange'] = (
//     __: React.SyntheticEvent, data: SemanticDatepickerProps
//   ) => setDates(data.value)

//   return (
//     <FiltersContainer className='filters-container'>
//       <SemanticDatepicker
//         format='MMM D, YYYY'
//         onChange={onChange}
//         type='range'
//         className='date-picker'
//       />
//       <NavigationControl className='navigation-control' />
//     </FiltersContainer>
//   )
// }

// export default MapFilters
