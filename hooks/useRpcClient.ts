import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Rpc as ProtobufRpcClient } from "interchainjs/helpers";
import { DEFAULT_RPC_CLIENT_QUERY_KEY, UseRpcClientQuery } from 'interchainjs/react-query'
import { getRpcClient } from 'interchainjs/extern'

export const useRpcClient = <TData = ProtobufRpcClient>({
  rpcEndpoint,
  options,
  rpcClientQueryKey,
}: UseRpcClientQuery<TData>) => {
  const queryClient = useQueryClient();
  const key = rpcClientQueryKey || DEFAULT_RPC_CLIENT_QUERY_KEY;
  return useQuery<ProtobufRpcClient, Error, TData>([key, rpcEndpoint], async () => {
    if(!rpcEndpoint) {
      throw new Error('rpcEndpoint is required');
    }
    const client = await getRpcClient(rpcEndpoint);
    if(!client) {
        throw new Error('Failed to connect to rpc client');
    }
    queryClient.setQueryData([key], client);
    return client;
  }, options);
};