import React, { Dispatch, FC, SetStateAction } from 'react'
import { Text, View } from 'react-native'
import { styles } from '../style/stylesheet'
import WalletComponent from '../components/wallet'
import Screen from '../lib/screens'
import Chain from '../lib/chains'

interface WalletProps {
  address: string
  chain: Chain
  setScreen: Dispatch<SetStateAction<Screen>>
}

const Wallet: FC<WalletProps> = ({ address, chain, setScreen }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Wallet</Text>
      <WalletComponent address={address} chain={chain} setScreen={setScreen} />
    </View>
  )
}

export default Wallet
