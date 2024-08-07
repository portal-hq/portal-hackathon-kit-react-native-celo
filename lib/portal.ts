import Portal, { PortalCurve, PortalSharePairStatus } from '@portal-hq/core'
import { PasswordStorage } from '@portal-hq/utils/src/definitions'

export interface AssetsResponse {
  nativeBalance: {
    balance: string
    decimals: number
    name: string
    rawBalance: string
    symbol: string
    metadata: {
      mint?: string
    }
  }
  tokenBalances: {
    balance: string
    decimals: number
    name: string
    rawBalance: string
    symbol: string
    metadata: {
      mint?: string
    }
  }[]
}

let portal: Portal

// Portal Initialization functions

/**
 * Initializes and instance of the Portal SDK
 * @param token
 * @returns Portal
 */
export const createPortalInstance = (token: string): Portal => {
  if (!portal || portal.apiKey !== token) {
    portal = new Portal({
      apiKey: token,
      autoApprove: true, // Remove this to add custom approval logic
      backup: {
        password: new PasswordStorage(),
      },
      gatewayConfig: {
        'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp':
          'https://api.portalhq.io/rpc/v1/solana/5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp', // Solana Mainnet
        'solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1':
          'https://api.portalhq.io/rpc/v1/solana/EtWTRABZaYq6iMfeYKouRu166VU2xqa1', // Solana Devnet
      },
    })
  }

  return portal
}

// Portal Wallet Status functions

/**
 * Gets a list of available recovery methods
 * @returns Promise<string[]>
 */
export const availableRecoveryMethods = async (): Promise<string[]> => {
  const client = await portal.api.getClient()
  let recoveryMethods = []

  for (let wallet of client.wallets) {
    if (wallet.curve === PortalCurve.ED25519) {
      for (let share of wallet.backupSharePairs) {
        if (share.status === PortalSharePairStatus.COMPLETED) {
          recoveryMethods.push(share.backupMethod)
        }
      }
    }
  }

  return recoveryMethods
}

export const getAssetBalances = async (
  address: string,
  isDevnet: boolean = false,
): Promise<AssetsResponse> => {
  const response = await fetch(
    `https://api.portalhq.io/api/v3/clients/me/chains/solana-${
      isDevnet ? 'devnet' : 'mainnet'
    }/assets`,
    {
      headers: {
        Authorization: `Bearer ${portal.apiKey}`,
      },
    },
  )

  return (await response.json()) as AssetsResponse
}

/**
 * Checks if the wallet has been created yet
 * @returns Promise<boolean>
 */
export const doesWalletExist = async (): Promise<boolean> => {
  const client = await portal.api.getClient()

  for (let wallet of client.wallets) {
    if (wallet.curve === PortalCurve.ED25519) {
      for (let share of wallet.signingSharePairs) {
        if (share.status === PortalSharePairStatus.COMPLETED) {
          return true
        }
      }
    }
  }
}

/**
 * Checks if the wallet has been backed up
 * @returns Promise<boolean>
 */
export const isWalletBackedUp = async (): Promise<boolean> => {
  const client = await portal.api.getClient()

  for (let wallet of client.wallets) {
    if (wallet.curve === PortalCurve.ED25519) {
      for (let share of wallet.backupSharePairs) {
        if (share.status === PortalSharePairStatus.COMPLETED) {
          return true
        }
      }
    }
  }
}

export const isWalletOnDevice = async (): Promise<boolean> => {
  return true
}
