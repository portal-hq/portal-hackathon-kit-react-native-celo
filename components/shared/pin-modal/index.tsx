import { Dispatch, FC, SetStateAction } from 'react'
import { Text, View } from 'react-native'
import { styles } from '../../../style/stylesheet'
import PinPad from './pin-pad'
import Icon from 'react-native-vector-icons/Ionicons'

interface PinModalProps {
  onSubmit: () => void | Promise<void>
  pinLength: number
  setPin: Dispatch<SetStateAction<string>>
  setVisible: Dispatch<SetStateAction<boolean>>
}

const PinModal: FC<PinModalProps> = ({ pinLength, setPin, setVisible }) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.container}>
        <View
          style={[
            styles.section,
            {
              alignItems: 'flex-end',
              alignContent: 'flex-end',
              flexDirection: 'row',
              flexGrow: 0,
              justifyContent: 'flex-end',
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 101,
            },
          ]}
        >
          <Icon
            color="black"
            name="close-outline"
            onPress={() => setVisible(false)}
            size={40}
            style={{
              marginLeft: 'auto',
            }}
          />
        </View>
        <PinPad pinLength={pinLength} setPin={setPin} />
      </View>
    </View>
  )
}

export default PinModal
