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
import { ReactElement } from "react";
import ButtonPrimary from "../components/ButtonPrimary";

type VerifyEmailCodeProps = {
  name: string;
  headline?: string;
  code: string;
  body: ReactElement;
};

const VerifyEmailCode: React.FC<VerifyEmailCodeProps> = ({
  name,
  code,
  body,
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
              <>{body}</>
            </MjmlText>
            <MjmlSpacer height="24px" />
            <MjmlText fontSize={48} color={"white"} align="center">
              {code}
            </MjmlText>
            <MjmlSpacer height="24px" />
          </MjmlColumn>
        </MjmlSection>
        <Footer />
      </MjmlBody>
    </Mjml>
  );
};

export default VerifyEmailCode;
