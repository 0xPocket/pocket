import { SwapWidgetProps, Theme } from '@uniswap/widgets';
import { env } from 'config/env/client';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import { useTheme } from '../../../contexts/theme';
import FormattedMessage from '../../common/FormattedMessage';

const SwapWidget = dynamic<SwapWidgetProps>(
  () => import('@uniswap/widgets').then((mod) => mod.SwapWidget),
  { ssr: false },
);
type SwapperProps = {};

const jsonrpcmap = { [Number(env.CHAIN_ID)]: [env.RPC_URL] };

const mapLanguage = {
  fr: 'fr-FR',
  en: 'en-US',
};

function Swapper({}: SwapperProps) {
  const { dark } = useTheme();
  const intl = useIntl();

  const theme: Theme = dark
    ? {
        primary: '#FFF',
        secondary: '#A9A9A9',
        interactive: '#64748b',
        container: '#1e293b',
        module: '#0f172a',
        accent: 'rgb(13,176,233)',
        outline: 'rgba(224,95,144,1)',
        dialog: '#000',
        fontFamily: 'Raleway',
        borderRadius: 0.5,
      }
    : {
        primary: '#000',
        secondary: '#666',
        interactive: '#E7E7E7',
        container: '#FFF',
        module: '#E7E7E7',
        accent: 'rgb(13,176,233)',
        outline: 'rgba(224,95,144,1)',
        dialog: '#FFF',
        fontFamily: 'Raleway',
        borderRadius: 0.5,
      };

  return (
    <div className="space-y-4">
      <h2>
        <FormattedMessage id="card.child.swapper" />
      </h2>
      <SwapWidget
        theme={theme}
        className="container-classic"
        defaultInputTokenAddress={env.ERC20_ADDRESS}
        jsonRpcUrlMap={jsonrpcmap}
        locale={mapLanguage[intl.locale as 'fr' | 'en']}
        width={'100%'}
        hideConnectionUI
      />
    </div>
  );
}

export default Swapper;
