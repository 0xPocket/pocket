import { MjmlSection, MjmlColumn, MjmlImage } from "mjml-react";

type HeaderProps = {
  big?: boolean;
};

const Header: React.FC<HeaderProps> = ({ big }) => {
  return (
    <MjmlSection padding={big ? "48px 0 40px" : "48px 0 24px"}>
      <MjmlColumn>
        <MjmlImage
          padding="0 24px 0"
          width={big ? "300px" : "250px"}
          align="center"
          src="https://pocket-eu.s3.eu-west-3.amazonaws.com/PocketLogoText.png"
        />
      </MjmlColumn>
    </MjmlSection>
  );
};

export default Header;
