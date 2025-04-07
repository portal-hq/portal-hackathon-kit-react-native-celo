import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from 'react'
import {
  Text,
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
} from 'react-native'
import { styles } from '../../style/stylesheet'
import Chain from '../../lib/chains'
import {
  getAssetBalances,
  transferToken,
  fundWalletWithTestnetTokens,
  CELO_TOKEN_SYMBOL,
  CUSD_TOKEN_SYMBOL,
  USDC_TOKEN_SYMBOL,
  USDT_TOKEN_SYMBOL,
} from '../../lib/portal'
import Screen from '../../lib/screens'
import PortalButton from '../shared/button'
import BackupWallet from './backup-wallet'
import CopyableText from '../shared/copyable-text'

interface WalletComponentProps {
  address: string
  chain: Chain
  setScreen: Dispatch<SetStateAction<Screen>>
}

const WalletComponent: FC<WalletComponentProps> = ({
  address,
  chain,
  setScreen,
}) => {
  const [celoBalance, setCeloBalance] = useState<number>()
  const [cusdBalance, setCusdBalance] = useState<number>()
  const [usdcBalance, setUsdcBalance] = useState<number>()
  const [usdtBalance, setUsdtBalance] = useState<number>()

  const [selectedToken, setSelectedToken] = useState<string>(CELO_TOKEN_SYMBOL)
  const [sendAddress, setSendAddress] = useState<string>()
  const [sendAmount, setSendAmount] = useState<number>()
  const [transactionHash, setTransactionHash] = useState<string>()
  const [isFunding, setIsFunding] = useState<boolean>(false)
  const [fundingTxHash, setFundingTxHash] = useState<string>()
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const sendToken = async () => {
    if (sendAddress && sendAmount) {
      const transactionHash = await transferToken(
        chain,
        sendAddress,
        selectedToken,
        sendAmount,
      )

      setTransactionHash(transactionHash)
    }
  }

  const updateBalances = async () => {
    try {
      const balances = await getAssetBalances(address, chain === Chain.Testnet)

      // Get CELO native balance
      const celoBalance = parseFloat(balances.nativeBalance.balance)
      setCeloBalance(celoBalance)

      // Get token balances
      balances.tokenBalances.forEach((token) => {
        switch (token.symbol) {
          case CUSD_TOKEN_SYMBOL:
            setCusdBalance(parseFloat(token.balance))
            break
          case USDC_TOKEN_SYMBOL:
            setUsdcBalance(parseFloat(token.balance))
            break
          case USDT_TOKEN_SYMBOL:
            setUsdtBalance(parseFloat(token.balance))
            break
        }
      })
    } catch (error) {
      console.error('Error updating balances:', error)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await updateBalances()
    setRefreshing(false)
  }, [address, chain])

  const fundWallet = async () => {
    try {
      setIsFunding(true)
      // Use "eip155:44787" for Celo Alfajores testnet
      const fundingChainId = 'eip155:44787'

      // Fund wallet with 0.01 CELO (native token)
      const response = await fundWalletWithTestnetTokens(
        fundingChainId,
        '0.01',
        'NATIVE',
      )

      setFundingTxHash(response.data.txHash)

      // Update balances after a short delay to allow transaction to process
      setTimeout(() => {
        updateBalances()
        setIsFunding(false)
      }, 5000)
    } catch (error) {
      console.error('Error funding wallet:', error)
      setIsFunding(false)
    }
  }

  useEffect(() => {
    if (address) {
      updateBalances()
    }
  }, [address, chain])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor={'#2E7D32'}
            title="Refreshing balances..."
            titleColor="#555"
          />
        }
      >
        <View style={[{ marginTop: 10 }]}>
          <CopyableText value={address} label="Address" maxDisplayLength={40} />
        </View>

        {/* Display all token balances */}
        <View
          style={[
            {
              marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            },
          ]}
        >
          <View>
            <Text style={styles.formLabel}>CELO Balance</Text>
            <Text>{celoBalance !== undefined ? celoBalance : '...'} CELO</Text>
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <PortalButton
              title="Refresh"
              onPress={onRefresh}
              style={{
                backgroundColor: refreshing ? '#888' : '#007AFF',
                maxWidth: 100,
                paddingVertical: 10,
              }}
              disabled={refreshing}
            />

            {chain === Chain.Testnet && (
              <PortalButton
                title={isFunding ? 'Funding...' : 'Fund Wallet'}
                onPress={fundWallet}
                style={{
                  backgroundColor: isFunding ? 'gray' : '#4BB543',
                  maxWidth: 120,
                  paddingVertical: 10,
                }}
                disabled={isFunding}
              />
            )}
          </View>
        </View>

        <View style={[{ marginTop: 10 }]}>
          <Text style={styles.formLabel}>cUSD Balance</Text>
          <Text>{cusdBalance !== undefined ? cusdBalance : '...'} cUSD</Text>
        </View>

        <View style={[{ marginTop: 10 }]}>
          <Text style={styles.formLabel}>USDC Balance</Text>
          <Text>{usdcBalance !== undefined ? usdcBalance : '...'} USDC</Text>
        </View>

        <View style={[{ marginTop: 10 }]}>
          <Text style={styles.formLabel}>USDT Balance</Text>
          <Text>{usdtBalance !== undefined ? usdtBalance : '...'} USDT</Text>
        </View>

        <View style={[{ marginTop: 20 }]}>
          <Text style={styles.screenTitle}>Send Tokens</Text>

          {/* Token selector */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Token</Text>
            <View style={styles.toggle}>
              {[
                CELO_TOKEN_SYMBOL,
                CUSD_TOKEN_SYMBOL,
                USDC_TOKEN_SYMBOL,
                USDT_TOKEN_SYMBOL,
              ].map((token, index) => (
                <Pressable
                  key={token}
                  onPress={() => setSelectedToken(token)}
                  style={[
                    styles.toggleItem,
                    index === 0
                      ? { marginRight: 2 }
                      : index === 3
                      ? { marginLeft: 2 }
                      : { marginHorizontal: 2 },
                    selectedToken === token ? styles.toggleItemActive : {},
                  ]}
                >
                  <Text
                    style={[
                      styles.toggleItemText,
                      selectedToken === token
                        ? styles.toggleItemTextActive
                        : {},
                    ]}
                  >
                    {token}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Recipient</Text>
            <TextInput
              placeholder="Recipient address"
              onChangeText={setSendAddress}
              style={styles.textInput}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Amount</Text>
            <TextInput
              placeholder="Amount"
              onChangeText={(text) => setSendAmount(parseFloat(text))}
              style={styles.textInput}
              keyboardType="decimal-pad"
            />
          </View>

          <PortalButton
            title={`Send ${selectedToken}`}
            onPress={sendToken}
            style={{ marginTop: 10 }}
          />
        </View>

        {typeof transactionHash !== 'undefined' &&
          transactionHash.length > 0 && (
            <View style={[{ marginTop: 10 }]}>
              <CopyableText
                value={transactionHash}
                label="Transaction Hash"
                maxDisplayLength={40}
              />
            </View>
          )}

        {typeof fundingTxHash !== 'undefined' && fundingTxHash.length > 0 && (
          <View style={[{ marginTop: 10 }]}>
            <CopyableText
              value={fundingTxHash}
              label="Funding Transaction Hash"
              maxDisplayLength={40}
            />
          </View>
        )}

        <BackupWallet />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default WalletComponent
