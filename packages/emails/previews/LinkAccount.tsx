import TextEmail from "../emails/TextEmail";
import LinkAccountComponent from "../emails/LinkAccount";

export function FromParent() {
  return (
    <LinkAccountComponent
      name="Solal Dunckel"
      from="Parent"
      fromName="John Doe"
      ctaText="Link Account"
      link="https://gopocket.fr"
    />
  );
}

export function FromChild() {
  return (
    <LinkAccountComponent
      name="John Doe"
      from="Child"
      fromName="Solal Dunckel"
      ctaText="Link Account"
      link="https://gopocket.fr"
    />
  );
}
