import React from 'react'

import { Footer, Header } from '../../components'
import { About } from '../../components/About'
import { BridgesPageSelection } from '../../components/BridgesPageSelection'
import { OtherSites } from '../../components/OtherSites'
import { Page } from '../../components/Page'
import { BridgesRiskViewProps, RiskView } from './BridgesRiskView'

export type BridgesRiskPageProps = BridgesRiskViewProps

export function BridgesRiskPage(props: BridgesRiskPageProps) {
  return (
    <Page>
      <BridgesPageSelection selected="risk" />
      <main>
        <Header title="Risk Analysis" />
        <RiskView {...props} />
        <OtherSites />
        <About />
      </main>
      <Footer />
    </Page>
  )
}
