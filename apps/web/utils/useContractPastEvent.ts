/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Abi, ExtractAbiEventNames } from 'abitype';
import type { Event } from 'ethers';
import { useEffect, useState } from 'react';
import { useContract, useContractEvent, useProvider } from 'wagmi';

type UseContractPastEventParams<
  TAbi extends Abi,
  TEvent extends ExtractAbiEventNames<TAbi>,
> = {
  addressOrName: string;
  contractInterface: TAbi;
  eventName: TEvent;
  reverse?: boolean;
};

// We need to type the return manually for now
export function useContractPastEvent<
  TData,
  TAbi extends Abi = Abi,
  TEventName extends ExtractAbiEventNames<TAbi> = ExtractAbiEventNames<TAbi>,
>({
  addressOrName,
  contractInterface,
  eventName,
  reverse = true,
}: UseContractPastEventParams<TAbi, TEventName>) {
  const [data, setData] = useState<TData[]>();
  const provider = useProvider();
  const contract = useContract({
    addressOrName,
    contractInterface: contractInterface as any,
    signerOrProvider: provider,
  });

  useContractEvent({
    addressOrName,
    contractInterface: contractInterface as any,
    eventName: eventName,
    listener: (data: Event[]) => {
      const event = data[data.length - 1] as any;
      if (reverse) {
        setData((prev) => [event.args, ...prev!]);
      } else {
        setData((prev) => [...prev!, event.args]);
      }
    },
  });

  useEffect(() => {
    const filter = contract.filters[eventName]();

    const getPastData = async () => {
      const past: Event[] = await contract.queryFilter(filter);
      const data = past.map((event) => event.args);
      if (reverse) {
        data.reverse();
      }
      setData(data as any);
    };

    getPastData();
  }, [contract, eventName, reverse]);

  return { data };
}
