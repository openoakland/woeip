import { Container, SuccessMessage } from "../ui";

export const ResetPasswordConfirm = () => {
  return (
    <Container>
      <SuccessMessage>Success! Your password has been reset.</SuccessMessage>
        <div className="reset-password-confirm-container">
          <h4>You can now log in with your new password.</h4>
        </div>;
    </Container>
  );
};
