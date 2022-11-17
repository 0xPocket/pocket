import TextEmail from "../emails/TextEmail";
import VerifyEmailCodeComponent from "../emails/VerifyEmailCode";

export function VerifyEmailCode() {
  return (
    <VerifyEmailCodeComponent
      name="Solal Dunckel"
      body={<>Please enter this verification code to verify your account:</>}
      code="123456"
    />
  );
}
