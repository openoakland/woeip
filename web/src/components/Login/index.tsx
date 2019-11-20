import React from 'react'
import styled from '@emotion/styled'
import { Button, Form, InputOnChangeData } from 'semantic-ui-react'

const formStyles = {
  width: '80%',
  marginTop: 125
}

const underlinedText = {
  textDecoration: 'underline'
}

interface Props {
  isLoggingIn: boolean
  error?: any
}

interface State {
  email: string
  password: string
}

export default class Login extends React.Component<Props> {
  public static displayName = 'LoginForm'

  public static defaultProps = {
    isLoggingIn: false
  }

  public readonly state: State = {
    email: '',
    password: ''
  }

  private handleSubmit = () => {
    // Send api server the request
    const { email, password } = this.state
  }

  private handleChange = (
    _: React.ChangeEvent<HTMLInputElement>,
    { name, value }: InputOnChangeData
  ) => this.setState({ [name]: value })

  public render() {
    const { email, password } = this.state
    return (
      <div style={formStyles}>
        <p>Sign in to upload data</p>
        <p>
          Or <span style={underlinedText}>create an account</span>
        </p>
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            label='Email'
            name='email'
            value={email}
            onChange={this.handleChange}
          />
          <Form.Input
            label='Password'
            name='password'
            value={password}
            onChange={this.handleChange}
          />
          <Button type='submit' basic>
            Sign In
          </Button>
          <p style={underlinedText}>Forgot your password?</p>
        </Form>
      </div>
    )
  }
}
