import { FC, useState } from 'react'
import { View } from 'react-native'
import PortalButton from '../../shared/button'
import PinModal from '../../shared/pin-modal'
import { styles } from '../../../style/stylesheet'
import { BackupMethods, usePortal } from '@portal-hq/core'

const BackupWallet: FC = () => {
  const portal = usePortal()

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [pin, setPin] = useState<string>('')

  const backupWallet = async () => {
    await portal?.backupWallet(BackupMethods.Password, () => {}, {
      passwordStorage: {
        password: pin,
      },
    })
  }

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
          onSubmit={backupWallet}
          pinLength={4}
          setPin={setPin}
          setVisible={setIsModalVisible}
        />
      ) : null}
    </>
  )
}

export default BackupWallet
