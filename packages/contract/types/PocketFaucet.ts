import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import {
  PromiEvent,
  TransactionReceipt,
  EventResponse,
  EventData,
  Web3ContractContext,
} from 'ethereum-abi-types-generator';

export interface CallOptions {
  from?: string;
  gasPrice?: string;
  gas?: number;
}

export interface SendOptions {
  from: string;
  value?: number | string | BN | BigNumber;
  gasPrice?: string;
  gas?: number;
}

export interface EstimateGasOptions {
  from?: string;
  value?: number | string | BN | BigNumber;
  gas?: number;
}

export interface MethodPayableReturnContext {
  send(options: SendOptions): PromiEvent<TransactionReceipt>;
  send(
    options: SendOptions,
    callback: (error: Error, result: any) => void
  ): PromiEvent<TransactionReceipt>;
  estimateGas(options: EstimateGasOptions): Promise<number>;
  estimateGas(
    options: EstimateGasOptions,
    callback: (error: Error, result: any) => void
  ): Promise<number>;
  encodeABI(): string;
}

export interface MethodConstantReturnContext<TCallReturn> {
  call(): Promise<TCallReturn>;
  call(options: CallOptions): Promise<TCallReturn>;
  call(
    options: CallOptions,
    callback: (error: Error, result: TCallReturn) => void
  ): Promise<TCallReturn>;
  encodeABI(): string;
}

export interface MethodReturnContext extends MethodPayableReturnContext {}

export type ContractContext = Web3ContractContext<
  PocketFaucet,
  PocketFaucetMethodNames,
  PocketFaucetEventsContext,
  PocketFaucetEvents
>;
export type PocketFaucetEvents =
  | 'RoleAdminChanged'
  | 'RoleGranted'
  | 'RoleRevoked'
  | 'bigIssue'
  | 'childRm'
  | 'coinWithdrawed'
  | 'configChanged'
  | 'fundsAdded'
  | 'moneyClaimed'
  | 'newChildAdded'
  | 'tokenWithdrawed';
export interface PocketFaucetEventsContext {
  RoleAdminChanged(
    parameters: {
      filter?: {
        role?: string | number[] | string | number[][];
        previousAdminRole?: string | number[] | string | number[][];
        newAdminRole?: string | number[] | string | number[][];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  RoleGranted(
    parameters: {
      filter?: {
        role?: string | number[] | string | number[][];
        account?: string | string[];
        sender?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  RoleRevoked(
    parameters: {
      filter?: {
        role?: string | number[] | string | number[][];
        account?: string | string[];
        sender?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  bigIssue(
    parameters: {
      filter?: { errorMsg?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  childRm(
    parameters: {
      filter?: {
        parentUID?: string | number[] | string | number[][];
        child?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  coinWithdrawed(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  configChanged(
    parameters: {
      filter?: { child?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  fundsAdded(
    parameters: {
      filter?: { parentUID?: string | number[] | string | number[][] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  moneyClaimed(
    parameters: {
      filter?: { child?: string | string[] };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  newChildAdded(
    parameters: {
      filter?: {
        parentUID?: string | number[] | string | number[][];
        child?: string | string[];
      };
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
  tokenWithdrawed(
    parameters: {
      filter?: {};
      fromBlock?: number;
      toBlock?: 'latest' | number;
      topics?: string[];
    },
    callback?: (error: Error, event: EventData) => void
  ): EventResponse;
}
export type PocketFaucetMethodNames =
  | 'new'
  | 'CHILD_ROLE'
  | 'DEFAULT_ADMIN_ROLE'
  | 'PARENT_ROLE'
  | 'WITHDRAW_ROLE'
  | 'addFunds'
  | 'addNewChild'
  | 'changeAddress'
  | 'changeConfig'
  | 'childToConfig'
  | 'claim'
  | 'getRoleAdmin'
  | 'grantRole'
  | 'hasRole'
  | 'lastPeriod'
  | 'parentToChildren'
  | 'parentsBalance'
  | 'renounceRole'
  | 'revokeRole'
  | 'rmChild'
  | 'supportsInterface'
  | 'updateLastPeriod'
  | 'withdrawCoin'
  | 'withdrawToken';
export interface RoleAdminChangedEventEmittedResponse {
  role: string | number[];
  previousAdminRole: string | number[];
  newAdminRole: string | number[];
}
export interface RoleGrantedEventEmittedResponse {
  role: string | number[];
  account: string;
  sender: string;
}
export interface RoleRevokedEventEmittedResponse {
  role: string | number[];
  account: string;
  sender: string;
}
export interface BigIssueEventEmittedResponse {
  errorMsg: string;
}
export interface ChildRmEventEmittedResponse {
  parentUID: string | number[];
  child: string;
}
export interface CoinWithdrawedEventEmittedResponse {
  amount: string;
}
export interface ConfigChangedEventEmittedResponse {
  child: string;
  active: boolean;
  ceiling: string;
  claimable: string;
}
export interface FundsAddedEventEmittedResponse {
  parentUID: string | number[];
  amount: string;
}
export interface MoneyClaimedEventEmittedResponse {
  child: string;
  amount: string;
}
export interface NewChildAddedEventEmittedResponse {
  parentUID: string | number[];
  child: string;
}
export interface TokenWithdrawedEventEmittedResponse {
  token: string;
  amount: string;
}
export interface AddNewChildRequest {
  ceiling: string;
  claimable: string;
  active: boolean;
  lastClaim: string;
  parent: string | number[];
}
export interface ChangeConfigRequest {
  ceiling: string;
  claimable: string;
  active: boolean;
  lastClaim: string;
  parent: string | number[];
}
export interface ChildToConfigResponse {
  ceiling: string;
  claimable: string;
  active: boolean;
  lastClaim: string;
  parent: string;
}
export interface PocketFaucet {
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: constructor
   * @param begin Type: uint256, Indexed: false
   * @param token Type: address, Indexed: false
   */
  'new'(begin: string, token: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  CHILD_ROLE(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  DEFAULT_ADMIN_ROLE(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  PARENT_ROLE(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  WITHDRAW_ROLE(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param parent Type: bytes32, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  addFunds(parent: string | number[], amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param conf Type: tuple, Indexed: false
   * @param child Type: address, Indexed: false
   */
  addNewChild(conf: AddNewChildRequest, child: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param oldAddr Type: address, Indexed: false
   * @param newAddr Type: address, Indexed: false
   */
  changeAddress(oldAddr: string, newAddr: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param newConf Type: tuple, Indexed: false
   * @param child Type: address, Indexed: false
   */
  changeConfig(
    newConf: ChangeConfigRequest,
    child: string
  ): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: address, Indexed: false
   */
  childToConfig(
    parameter0: string
  ): MethodConstantReturnContext<ChildToConfigResponse>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  claim(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param role Type: bytes32, Indexed: false
   */
  getRoleAdmin(role: string | number[]): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param role Type: bytes32, Indexed: false
   * @param account Type: address, Indexed: false
   */
  grantRole(role: string | number[], account: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param role Type: bytes32, Indexed: false
   * @param account Type: address, Indexed: false
   */
  hasRole(
    role: string | number[],
    account: string
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   */
  lastPeriod(): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   * @param parameter1 Type: address, Indexed: false
   */
  parentToChildren(
    parameter0: string | number[],
    parameter1: string
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param parameter0 Type: bytes32, Indexed: false
   */
  parentsBalance(
    parameter0: string | number[]
  ): MethodConstantReturnContext<string>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param role Type: bytes32, Indexed: false
   * @param account Type: address, Indexed: false
   */
  renounceRole(role: string | number[], account: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param role Type: bytes32, Indexed: false
   * @param account Type: address, Indexed: false
   */
  revokeRole(role: string | number[], account: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param child Type: address, Indexed: false
   */
  rmChild(child: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: true
   * StateMutability: view
   * Type: function
   * @param interfaceId Type: bytes4, Indexed: false
   */
  supportsInterface(
    interfaceId: string | number[]
  ): MethodConstantReturnContext<boolean>;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   */
  updateLastPeriod(): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param amount Type: uint256, Indexed: false
   */
  withdrawCoin(amount: string): MethodReturnContext;
  /**
   * Payable: false
   * Constant: false
   * StateMutability: nonpayable
   * Type: function
   * @param token Type: address, Indexed: false
   * @param amount Type: uint256, Indexed: false
   */
  withdrawToken(token: string, amount: string): MethodReturnContext;
}
