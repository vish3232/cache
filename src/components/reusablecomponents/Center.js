import React, {useContext } from 'react'
import CenterConnectAccounts from './CenterConnectAccounts'
import Schedulecontainer from './CenterSchedulecontainer'
import CenterQueue from './CenterQueue'
import CenterTextEditScreenFull from './CenterTextEditScreenFull'
import AppContext from '../../store/DataProvider'
import CenterSelectToConnect from './CenterSelectToConnect'
import CenterHistory from './CenterHistory'
import CenterDraft from './CenterDraft'
import CenterDashBoard from './CenterDashBoard'

const Center = () => {

    const context = useContext(AppContext)

    return (
        <div>
            {context.centerContainer === "schedulecontainer" ? <Schedulecontainer /> : null}
            {context.centerContainer === "connectaccounts" ? <CenterConnectAccounts /> : null}
            {context.centerContainer === "centerqueue" ? <CenterQueue /> : null}
            {context.centerContainer === "centerselecttoconnect" ? <CenterSelectToConnect /> : null}
            {context.centerContainer === "centertexteditscreenfull" ? <CenterTextEditScreenFull  /> : null}
            {context.centerContainer === "centerhistory" ? <CenterHistory /> : null}
            {context.centerContainer === "centerdraft" ? <CenterDraft /> : null}
            {context.centerContainer === "centerdashboard" ? <CenterDashBoard />: null}
        </div>
    )
}

export default Center
