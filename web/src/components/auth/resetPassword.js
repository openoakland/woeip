import { Container, Form } from "semantic-ui-react";
import { AffirmActionButton } from "../ui";

export const ResetPassword = () => {
  return (
    <Container>
      <h2>Reset Password</h2>
      <div className="reset-password-container"></div>
      <Form>
        <Form.Field>
          <label>Email</label>
          <input placeholder="Email" />
        </Form.Field>
        <AffirmActionButton>Submit</AffirmActionButton>
      </Form>
    </Container>
  );
};
