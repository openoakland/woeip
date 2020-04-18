import React from 'react'
import { Link } from 'react-router-dom'

class Home extends React.Component<{}, {}> {
  public render() {
    return (
      <div className='Home'>
        <div className='Home-header'>
          <h2>WOAQ</h2>
        </div>
        <ul className='Home-resources'>
          <li>
            <Link to='/maps'>Maps</Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default Home
