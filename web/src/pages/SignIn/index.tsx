import React, { Component } from 'react'
import LoginForm from 'components/Login'

let bodyStyle = {
  width: '70%',
  margin: '0 auto',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
}

class SignIn extends Component {
  render() {
    return (
      <div className='login-form' style={bodyStyle}>
        <LoginForm />
      </div>
    )
  }
}

export default SignIn
