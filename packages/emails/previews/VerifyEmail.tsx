import TextEmail from "../emails/TextEmail";
import VerifyEmailComponent from "../emails/VerifyEmail";

export function VerifyEmail() {
  return (
    <VerifyEmailComponent
      name="Solal Dunckel"
      body={<>Please click on the link below to verify your email :</>}
      ctaText="Verify Email"
      link="https://gopocket.fr"
    />
  );
}

export function ChildInvitation() {
  return (
    <VerifyEmailComponent
      name="Solal Dunckel"
      body={
        <>
          You've been invited to join Pocket !
          <br /> Please click on the link below to complete your registration:
        </>
      }
      ctaText="Complete registration"
      link="https://gopocket.fr"
    />
  );
}
