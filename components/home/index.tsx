import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Button, View } from 'react-native'
import Portal, { usePortal } from '@portal-hq/core'
import { styles } from '../../style/stylesheet'
import Screen from '../../lib/screens'
import { doesWalletExist } from '../../lib/portal'

interface HomeComponentProps {
  setAddress: Dispatch<SetStateAction<string>>
  setScreen: Dispatch<SetStateAction<Screen>>
}

const HomeComponent: FC<HomeComponentProps> = ({ setAddress, setScreen }) => {
  const portal = usePortal()

  const createWallet = async () => {
    if (portal) {
      const addresses = await portal.createWallet()

      if (addresses.solana) {
        setAddress(addresses.solana)
        setScreen(Screen.Wallet)
      }
    }
  }

  useEffect(() => {
    if (portal) {
      ;(async () => {
        const walletExists = await doesWalletExist()

        if (walletExists) {
          setScreen(Screen.Wallet)
        }
      })()
    }
  }, [portal])

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Button title="Create Wallet" onPress={createWallet} />
      </View>
    </View>
  )
}

export default HomeComponent
