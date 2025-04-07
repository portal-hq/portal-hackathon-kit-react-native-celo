import Portal, { PortalCurve, PortalSharePairStatus } from '@portal-hq/core'
import { PasswordStorage } from '@portal-hq/utils/src/definitions'
import Chain from './chains'

// Token symbols
export const USDC_TOKEN_SYMBOL = 'USDC'
export const USDT_TOKEN_SYMBOL = 'USDT'
export const CUSD_TOKEN_SYMBOL = 'CUSD'
export const CELO_TOKEN_SYMBOL = 'CELO'

export interface AssetsResponse {
  nativeBalance: {
    balance: string
    decimals: number
    name: string
    rawBalance: string
    symbol: string
    metadata: {
      address?: string
    }
  }
  tokenBalances: {
    balance: string
    decimals: number
    name: string
    rawBalance: string
    symbol: string
    metadata: {
      address?: string
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
        'eip155:42220': 'https://forno.celo.org', // Celo Mainnet
        'eip155:44787': 'https://alfajores-forno.celo-testnet.org', // Celo Alfajores Testnet
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
    if (wallet.curve === PortalCurve.SECP256K1) {
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
  isTestnet: boolean = false,
): Promise<AssetsResponse> => {
  const response = await fetch(
    `https://api.portalhq.io/api/v3/clients/me/chains/celo-${
      isTestnet ? 'alfajores' : 'mainnet'
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
    if (wallet.curve === PortalCurve.SECP256K1) {
      for (let share of wallet.signingSharePairs) {
        if (share.status === PortalSharePairStatus.COMPLETED) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * Checks if the wallet has been backed up
 * @returns Promise<boolean>
 */
export const isWalletBackedUp = async (): Promise<boolean> => {
  const client = await portal.api.getClient()

  for (let wallet of client.wallets) {
    if (wallet.curve === PortalCurve.SECP256K1) {
      for (let share of wallet.backupSharePairs) {
        if (share.status === PortalSharePairStatus.COMPLETED) {
          return true
        }
      }
    }
  }
  return false
}

export const isWalletOnDevice = async (): Promise<boolean> => {
  return true
}

/**
 * Funds a wallet with testnet tokens
 * @param chainId - The chain ID to fund on
 * @param amount - The amount to fund
 * @param token - The token symbol to fund (use "NATIVE" for the chain's native token)
 * @returns Promise<{ data: { txHash: string } }>
 */
export const fundWalletWithTestnetTokens = async (
  chainId: string,
  amount: string = '0.01',
  token: string = 'NATIVE',
): Promise<{ data: { txHash: string } }> => {
  if (!portal) {
    throw new Error('Portal instance not initialized')
  }

  const params = {
    amount,
    token,
  }

  try {
    // Fund your Portal wallet
    //@todo: remove once we release react native sdk
    const response = { data: { txHash: '0x1234567890abcdef' } }
    //await portal.receiveTestnetAsset(chainId, params)
    //console.log(`✅ Transaction hash: ${response.data.txHash}`)
    return response
  } catch (error) {
    console.error('Error funding wallet:', error)
    throw error
  }
}

interface BuildTransactionResponse {
  transaction: {
    from: string
    to: string
    data: string
  }
  metadata: {
    amount: string
    fromAddress: string
    toAddress: string
    tokenAddress: string
    tokenDecimals: number
    rawAmount: string
  }
}

/**
 * Transfers tokens to another address
 * @param chainId
 * @param recipient
 * @param token
 * @param amount
 * @returns Promise<string> The transaction hash
 */
export const transferToken = async (
  chainId: string,
  recipient: string,
  token: string,
  amount: number,
): Promise<string> => {
  try {
    const isTestnet = chainId === Chain.Testnet

    const url = `https://api.portalhq.io/api/v3/clients/me/chains/celo${
      isTestnet ? '-alfajores' : ''
    }/assets/send/build-transaction`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${portal.apiKey}`,
      },
      body: JSON.stringify({
        amount: amount.toString(),
        to: recipient,
        token,
      }),
    })

    const transactionResponse =
      (await response.json()) as BuildTransactionResponse

    const transactionHash = await portal.request(
      'eth_sendTransaction',
      [transactionResponse.transaction],
      chainId,
    )

    return transactionHash
  } catch (error) {
    console.error(error)
    throw error
  }
}
