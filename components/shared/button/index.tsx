import { FC } from 'react'
import { StyleProp, Text, TouchableOpacity, ViewStyle } from 'react-native'

interface ButtonProps {
  color?: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
  textColor?: string
  title: string
}

const PortalButton: FC<ButtonProps> = ({
  color = 'black',
  onPress,
  style = {},
  textColor = 'white',
  title,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          alignItems: 'center',
          backgroundColor: color,
          borderRadius: 5,
          paddingHorizontal: 10,
          paddingVertical: 15,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: textColor,
          fontWeight: 'bold',
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default PortalButton
