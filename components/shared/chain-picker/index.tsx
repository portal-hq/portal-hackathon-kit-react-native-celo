import React, { Dispatch, FC, SetStateAction } from 'react'
import { Pressable, Text, View } from 'react-native'

import Chain from '../../../lib/chains'
import { styles } from '../../../style/stylesheet'

interface ChainPickerComponentProps {
  chain: Chain
  setChain: Dispatch<SetStateAction<Chain>>
}

const ChainPickerComponent: FC<ChainPickerComponentProps> = ({
  chain,
  setChain,
}) => {
  return (
    <View style={[styles.formGroup, { marginBottom: 10 }]}>
      <Text style={styles.formLabel}>Chain</Text>
      <View style={styles.toggle}>
        {Object.entries(Chain).map(([key, value], index) => (
          <Pressable
            key={key}
            onPress={() => setChain(value)}
            style={[
              styles.toggleItem,
              index === 0 ? styles.toggleItemFirst : styles.toggleItemLast,
              chain === value ? styles.toggleItemActive : {},
            ]}
          >
            <Text
              style={[
                styles.toggleItemText,
                chain === value ? styles.toggleItemTextActive : {},
              ]}
            >
              {key}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export default ChainPickerComponent
