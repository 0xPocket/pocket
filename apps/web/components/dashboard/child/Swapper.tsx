import { useTheme } from '@lib/ui/src/Theme/ThemeContext';
import { SwapWidgetProps, Theme } from '@uniswap/widgets';
import { env } from 'config/env/client';
import dynamic from 'next/dynamic';

const SwapWidget = dynamic<SwapWidgetProps>(
  () => import('@uniswap/widgets').then((mod) => mod.SwapWidget),
  { ssr: false },
);
type SwapperProps = {};

const jsonrpcmap = { [Number(env.CHAIN_ID)]: [env.RPC_URL] };

function Swapper({}: SwapperProps) {
  const { dark } = useTheme();

  const theme: Theme = dark
    ? {
        primary: '#FFF',
        secondary: '#A9A9A9',
        interactive: '#64748b',
        container: '#4E4E5A',
        module: '#222633',
        accent: 'rgb(13,176,233)',
        outline: '#CC1',
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
        outline: '#343D3A',
        dialog: '#FFF',
        fontFamily: 'Raleway',
        borderRadius: 0.5,
      };

  return null;
  return (
    <SwapWidget
      theme={theme}
      defaultInputTokenAddress={env.ERC20_ADDRESS}
      jsonRpcUrlMap={jsonrpcmap}
      hideConnectionUI
    />
  );
}

export default Swapper;
