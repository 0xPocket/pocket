import {
  Mjml,
  MjmlBody,
  MjmlSection,
  MjmlColumn,
  MjmlText,
  MjmlSpacer,
} from "mjml-react";

import Footer from "../components/Footer";
import Head from "../components/Head";
import Header from "../components/Header";
import { leadingRelaxed, textBase } from "../components/theme";
import ButtonPrimary from "../components/ButtonPrimary";

type LinkAccountProps = {
  from: "Parent" | "Child";
  name: string;
  fromName: string;
  link: string;
  ctaText?: string;
};

const LinkAccount: React.FC<LinkAccountProps> = ({
  name,
  link,
  ctaText,
  from,
  fromName,
}) => {
  return (
    <Mjml>
      <Head />
      <MjmlBody width={600}>
        <Header />
        <MjmlSection padding="0 24px 0" cssClass="smooth">
          <MjmlColumn>
            <MjmlText
              padding="16px 0 16px"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
              cssClass="paragraph"
            >
              Hello{" "}
              <MjmlText fontStyle="bold" color={"blue"}>
                {name}
              </MjmlText>
              ,
            </MjmlText>
            <MjmlText
              cssClass="paragraph"
              padding="0"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
            >
              {from === "Child" ? (
                <>
                  Your child {fromName} has requested to link their account to
                  yours. If you would like to link your accounts, please click
                  the button below.
                </>
              ) : (
                <>
                  Your parent {fromName} has requested to link their account to
                  yours. If you would like to link your accounts, please click
                  the button below.
                </>
              )}
            </MjmlText>
            {ctaText && (
              <>
                <MjmlSpacer height="24px" />
                <ButtonPrimary link={link} uiText={ctaText} />
                <MjmlSpacer height="24px" />
              </>
            )}
            <MjmlText
              cssClass="paragraph"
              padding="0"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
            >
              <>Or copy and paste this URL into your browser: </>
            </MjmlText>
            <MjmlSpacer height="12px" />
            <MjmlText
              cssClass="paragraph"
              padding="0"
              fontSize={textBase}
              lineHeight={leadingRelaxed}
            >
              <a href={link}>{link}</a>
            </MjmlText>
          </MjmlColumn>
        </MjmlSection>
        <Footer />
      </MjmlBody>
    </Mjml>
  );
};

export default LinkAccount;
