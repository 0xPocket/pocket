import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { useDisconnect } from 'wagmi';

export function useSignOut() {
  const { disconnectAsync } = useDisconnect();
  const queryClient = useQueryClient();

  return useMutation(() => disconnectAsync(), {
    onSuccess: async () => {
      queryClient.removeQueries();
      signOut({ callbackUrl: '/connect' });
    },
  });
}
