import React from 'react'
import styled from '@emotion/styled'
import { Button, Form, InputOnChangeData } from 'semantic-ui-react'

const LoginContainer = styled.div`
  display: flex;
  flex-flow: column;
`

const LoginFormHeader = styled.div`
  padding-bottom: 8px;
  div {
    margin-top: -8px;
    a {
      text-decoration: underline;
    }
  }
`

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
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          label="Email"
          name="email"
          value={email}
          onChange={this.handleChange}
        />
        <Form.Input
          label="Password"
          name="password"
          value={password}
          onChange={this.handleChange}
        />
        <Button type="submit" basic>
          Sign In
        </Button>
      </Form>
    )
  }
}
