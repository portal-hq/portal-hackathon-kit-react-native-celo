import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import { styles } from '../../style/stylesheet'
import Chain from '../../lib/chains'
import { getAssetBalances, transferToken } from '../../lib/portal'
import Screen from '../../lib/screens'

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
  const [pyusdBalance, setPyusdBalance] = useState<number>()
  const [sendAddress, setSendAddress] = useState<string>()
  const [sendAmount, setSendAmount] = useState<number>()
  const [solBalance, setSolBalance] = useState<number>()
  const [transactionHash, setTransactionHash] = useState<string>()

  const sendPyusd = async () => {
    if (sendAddress && sendAmount) {
      const transactionHash = await transferToken(
        chain,
        sendAddress,
        'PYUSD',
        sendAmount,
      )

      setTransactionHash(transactionHash)
    }
  }

  const updateBalances = async () => {
    const balances = await getAssetBalances(address, chain === Chain.Devnet)

    // Get SOL balance
    const solBalance = parseFloat(balances.nativeBalance.balance)

    // Get PyUSD balance
    const pyusd = balances.tokenBalances.find(
      (balance) => balance.symbol === 'PYUSD',
    )
    const pyusdBalance = parseFloat(pyusd ? pyusd.balance : '0')

    setSolBalance(solBalance)
    setPyusdBalance(pyusdBalance)
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

      {typeof transactionHash !== 'undefined' && transactionHash.length > 0 && (
        <View style={[{ marginTop: 10 }]}>
          <Text style={styles.formLabel}>Transaction Hash</Text>
          <Text>{transactionHash}</Text>
        </View>
      )}
    </View>
  )
}

export default WalletComponent
