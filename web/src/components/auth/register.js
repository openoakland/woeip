import { Form, AffirmActionButton } from "../ui";

export const Register = () => {


  return (
    <div className="register-container">
      <Form>
        <Form.Field>
          <label>First Name</label>
          <input placeholder="First Name" />
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          <input placeholder="Last Name" />
        </Form.Field>
        <Form.Field>
          <label>Email</label>
          <input placeholder="Email" />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input placeholder="Password" />
        </Form.Field>
        <Form.Field>
          <label>Re password</label>
          <input placeholder="Re password" />
        </Form.Field>
        <AffirmActionButton>Create Account</AffirmActionButton>
      </Form>
    </div>
  );
};
