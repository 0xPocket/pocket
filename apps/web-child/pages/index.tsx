import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import MainWrapper from '../components/wrappers/MainWrapper';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../components/Connectors';
import axios from 'axios';
import { Web3Provider } from '@ethersproject/providers';
import Button from '../components/common/Button';

type ChildrenSignupProps = {};

function ChildrenSignup({}: ChildrenSignupProps) {
  const [token, setToken] = useState<string>();
  const [authenticating, setAuthenticating] = useState(false);
  const router = useRouter();
  const { active, account, error, library, activate, deactivate } =
    useWeb3React<Web3Provider>();

  useEffect(() => {
    if (router.query.token) {
      setToken(router.query.token as string);
    }
  }, [router]);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized && !active && !error) {
        activate(injected);
      }
    });
  }, []);

  console.log(active);

  useEffect(() => {
    const connect = async () => {
      if (token) {
        const registered = await axios
          .post<{ nonce: string }>('http://localhost:5000/metamask/register', {
            token: token,
            walletAddress: account,
          })
          .then((res) => res.data);
      }
      const nonce = await axios
        .post<{ nonce: string }>('http://localhost:5000/metamask/nonce', {
          walletAddress: account,
        })
        .then((res) => res.data.nonce);
      library?.provider.sendAsync;
      const signature = await library
        ?.send('personal_sign', [account, nonce])
        .catch((e) => {
          setAuthenticating(false);
        });
      const accessToken = await axios
        .post<{ access_token: string }>(
          'http://localhost:5000/metamask/verify',
          {
            signature: signature,
            walletAddress: account,
          },
        )
        .then((res) => res.data.access_token);
      console.log(accessToken);
      setAuthenticating(false);
    };
    if (active && authenticating) {
      connect();
    }
  }, [active, authenticating]);

  const connectToMetamask = async () => {
    try {
      setAuthenticating(true);
      await activate(injected);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <MainWrapper>
      <section className=" h-screen bg-primary">
        {!active ? (
          <button onClick={() => connectToMetamask()}>
            CONNECT TO METAMASK
          </button>
        ) : (
          <div className="flex gap-4 p-8">
            <Button action={() => {}}>Claim</Button>
            <Button action={() => {}}>Claim & Swap</Button>
          </div>
        )}
      </section>
    </MainWrapper>
  );
}

export default ChildrenSignup;
