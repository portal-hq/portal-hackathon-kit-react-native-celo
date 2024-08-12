import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { View } from 'react-native'
import { BackupMethods, usePortal } from '@portal-hq/core'

import Screen from '../../../lib/screens'

import { styles } from '../../../style/stylesheet'
import PinModal from '../../shared/pin-modal'
import PortalButton from '../../shared/button'

interface RecoverWalletComponentProps {
  setAddress: Dispatch<SetStateAction<string>>
  setScreen: Dispatch<SetStateAction<Screen>>
}

const RecoverWalletComponent: FC<RecoverWalletComponentProps> = ({
  setAddress,
  setScreen,
}) => {
  const portal = usePortal()

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isRecovering, setIsRecovering] = useState<boolean>(false)
  const [pin, setPin] = useState<string>('')
  const [recoveryDone, setRecoveryDone] = useState<boolean>(false)

  const recoverWallet = async () => {
    console.log(`Pin: ${pin}`)

    if (!pin || pin.length !== 4) {
      return
    }

    setIsRecovering(true)
    setIsModalVisible(false)
    const addresses = await portal?.recoverWallet(
      '',
      BackupMethods.Password,
      () => {},
      {
        passwordStorage: {
          password: pin,
        },
      },
    )

    if (addresses?.solana) {
      setAddress(addresses.solana)
      setScreen(Screen.Wallet)
      setRecoveryDone(true)
      setIsRecovering(false)

      setTimeout(() => {
        setRecoveryDone(false)
      }, 2500)
    }
  }

  useEffect(() => {
    console.log(`Modal is visiable: ${isModalVisible}`)
  }, [isModalVisible])

  return (
    <>
      <View style={styles.section}>
        <PortalButton
          title="Recover Wallet"
          onPress={() => {
            setIsModalVisible(true)
          }}
        />
      </View>

      {isModalVisible ? (
        <PinModal
          label="Recover"
          onSubmit={recoverWallet}
          pinLength={4}
          setPin={setPin}
          setVisible={setIsModalVisible}
        />
      ) : null}
    </>
  )
}

export default RecoverWalletComponent
