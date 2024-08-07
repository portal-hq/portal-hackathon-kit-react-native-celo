import React, { Dispatch, FC, SetStateAction } from 'react'
import { Text, View } from 'react-native'
import Portal from '@portal-hq/core'
import { styles } from '../style/stylesheet'
import HomeComponent from '../components/home'
import Screen from '../lib/screens'

interface HomeProps {
  setAddress: Dispatch<SetStateAction<string>>
  setScreen: Dispatch<SetStateAction<Screen>>
}

const Home: FC<HomeProps> = ({ setAddress, setScreen }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Home</Text>

      <HomeComponent setAddress={setAddress} setScreen={setScreen} />
    </View>
  )
}

export default Home
