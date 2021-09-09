import { AffirmActionButton, Form } from "../ui";

export const Login = () => {
  return (
    <div className="login-container">
      <Form>
        <Form.Field>
          <label>Email</label>
          <input placeholder="Email" />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input placeholder="Password" />
        </Form.Field>
        <AffirmActionButton>Sign In</AffirmActionButton>
      </Form>
    </div>
  );
};
