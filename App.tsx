import React, { useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
} from 'react-native-safe-area-context'
import { styles } from './style/stylesheet'
import Portal, { PortalContextProvider } from '@portal-hq/core'
import Screen from './lib/screens'
import Home from './screens/Home'
import Chain from './lib/chains'
import ChainPickerComponent from './components/shared/chain-picker'
import { createPortalInstance } from './lib/portal'
import Wallet from './screens/Wallet'

function App(): JSX.Element {
  const [address, setAddress] = useState<string>('')
  const [chain, setChain] = useState<Chain>(Chain.Devnet)
  const [portal, setPortal] = useState<Portal | null>(null)
  const [screen, setScreen] = useState<Screen>(Screen.Home)

  useEffect(() => {
    if (!portal) {
      const portal = createPortalInstance('PORTAL_CLIENT_API_KEY')
      setPortal(portal)
    } else {
      ;(async () => {
        const addresses = await portal.addresses

        if (addresses?.solana) {
          console.log(`Solana address: ${addresses.solana}`)
          setAddress(addresses.solana)
        }
      })()
    }
  }, [portal])

  return (
    <SafeAreaProvider>
      <PortalContextProvider value={portal as Portal}>
        <SafeAreaInsetsContext.Consumer>
          {(insets) => (
            <View
              style={[
                styles.container,
                styles.safeArea,
                {
                  paddingTop: insets ? insets.top : 0,
                },
              ]}
            >
              <StatusBar barStyle="dark-content" />
              {chain && (
                <ChainPickerComponent chain={chain} setChain={setChain} />
              )}
              <View style={styles.container}>
                {screen === Screen.Home && (
                  <Home setAddress={setAddress} setScreen={setScreen} />
                )}
                {screen === Screen.Wallet && (
                  <Wallet
                    address={address}
                    chain={chain}
                    setScreen={setScreen}
                  />
                )}
              </View>
            </View>
          )}
        </SafeAreaInsetsContext.Consumer>
      </PortalContextProvider>
    </SafeAreaProvider>
  )
}

export default App
