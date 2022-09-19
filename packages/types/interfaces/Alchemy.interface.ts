import {
  AssetTransfersParams,
  AssetTransfersResponse,
  AssetTransfersResult,
} from "alchemy-sdk";

export type AssetTransfersResultWithMetadata = AssetTransfersResult & {
  metadata: { blockTimestamp: string };
};

export type AssetTransfersParamsWithMetadata = AssetTransfersParams & {
  withMetadata: boolean;
};

export type AssetTransfersResponseWithMetadata = AssetTransfersResponse & {
  transfers: AssetTransfersResultWithMetadata[];
};
