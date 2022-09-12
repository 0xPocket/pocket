import React from 'react';
import { FormattedMessage as ReactFormattedMessage } from 'react-intl';
import { IntlMessageID } from '../../pages/_app';

type FormattedMessageProps = {
  id?: IntlMessageID;
  values?: Record<string, React.ReactNode>;
};

export default function FormattedMessage(props: FormattedMessageProps) {
  return <ReactFormattedMessage {...props} />;
}
