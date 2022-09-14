import { MjmlButton } from "mjml-react";
import { primaryColor } from "./theme";
import { leadingTight, textBase, borderBase } from "./theme";

type ButtonPrimaryProps = {
  link: string;
  uiText: string;
};

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ link, uiText }) => {
  return (
    <>
      <MjmlButton
        backgroundColor={primaryColor}
        color={"black"}
        height={46}
        fontSize={textBase}
        borderRadius={borderBase}
        href={link}
      >
        {uiText}
      </MjmlButton>
    </>
  );
};

export default ButtonPrimary;
