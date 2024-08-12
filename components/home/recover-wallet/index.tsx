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
  const [pin, setPin] = useState<string>('')

  const recoverWallet = async () => {
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
