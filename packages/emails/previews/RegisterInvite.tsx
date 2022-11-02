import RegisterInvite from "../emails/RegisterInvite";

export function FromParent() {
  return (
    <RegisterInvite
      from="Parent"
      fromName="John Doe"
      ctaText="Register to Pocket"
      link="https://gopocket.fr"
    />
  );
}

export function FromChild() {
  return (
    <RegisterInvite
      from="Child"
      fromName="Solal Dunckel"
      ctaText="Register to Pocket"
      link="https://gopocket.fr"
    />
  );
}
