import { MjmlSection, MjmlColumn, MjmlText } from "mjml-react";
import { grayDark, textSm } from "./theme";

type FooterProps = {
  unsubscribe?: boolean;
};

const Footer: React.FC<FooterProps> = ({ unsubscribe = false }) => {
  return (
    <MjmlSection cssClass="smooth">
      <MjmlColumn>
        <MjmlText
          cssClass="footer"
          padding="24px 24px 48px"
          fontSize={textSm}
          color={grayDark}
        >
          © 2022 Pocket&nbsp;&nbsp;
          {unsubscribe && (
            <>
              ·&nbsp;&nbsp;
              <a href="#" target="_blank">
                Unsubscribe
              </a>
            </>
          )}
        </MjmlText>
      </MjmlColumn>
    </MjmlSection>
  );
};

export default Footer;
