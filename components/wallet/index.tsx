import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { styles } from '../../style/stylesheet'
import Chain from '../../lib/chains'
import { usePortal } from '@portal-hq/core'
import { AssetsResponse, getAssetBalances } from '../../lib/portal'

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
  const portal = usePortal()

  const [fetchingBalance, setFetchingBalance] = useState<boolean>(false)
  const [pyusdBalance, setPyusdBalance] = useState<number>()
  const [sendAddress, setSendAddress] = useState<string>()
  const [sendAmount, setSendAmount] = useState<number>()
  const [solBalance, setSolBalance] = useState<number>()

  const sendPyusd = async () => {}

  const updateBalances = async () => {
    setFetchingBalance(true)
    console.log(`Getting balance for chain ${chain} and address ${address}`)

    const balances = await getAssetBalances(address, chain === Chain.Devnet)

    // Get SOL balance
    const solBalance = parseFloat(balances.nativeBalance.balance)

    // Get PyUSD balance
    const pyusd = balances.tokenBalances.find(
      (balance) => balance.symbol === 'PYUSD',
    )
    const pyusdBalance = parseFloat(pyusd ? pyusd.balance : '0')

    console.log(`SOL Balance: ${solBalance}`)
    console.log(`PyUSD Balance: ${pyusdBalance}`)

    setSolBalance(solBalance)
    setPyusdBalance(pyusdBalance)
    setFetchingBalance(false)
  }

  useEffect(() => {
    if (!solBalance && address) {
      updateBalances()
    }
  }, [address, solBalance])

  return (
    <View style={styles.container}>
      <View style={[{ marginTop: 10 }]}>
        <Text style={styles.formLabel}>Address</Text>
        <Text>{address}</Text>
      </View>

      {typeof solBalance !== 'undefined' &&
        typeof pyusdBalance !== 'undefined' && (
          <>
            <View style={[{ marginTop: 10 }]}>
              <Text style={styles.formLabel}>SOL Balance</Text>
              <Text>{solBalance} SOL</Text>
            </View>
            <View style={[{ marginTop: 10 }]}>
              <Text style={styles.formLabel}>PyUSD Balance</Text>
              <Text>{pyusdBalance} PyUSD</Text>
            </View>
          </>
        )}

      <View style={[{ marginTop: 10 }]}>
        <Text style={styles.screenTitle}>Send PyUSD</Text>
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
          />
        </View>
        <Button title="Send PyUSD" onPress={sendPyusd} />
      </View>
    </View>
  )
}

export default WalletComponent
