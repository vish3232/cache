import React, { useContext } from 'react'
import '../reusablecomponentscss/Rightsidebar.css'
import RightConnectAccounts from './RightConnectAccounts'
import RightDateTimePicker from './RightDateTimePicker'
import RightSocialAccounts from './RightSocialAccounts'
import RightTextEditor from './RightTextEditor'
import AppContext from '../../store/DataProvider'
import RightHistory from './RightHistory'
import RightDraft from './RightDraft'
import RightQueue from './RightQueue'
import RightDashBoard from './RightDashBoard'
import RightNullBox from './RightNullBox'
import RightCaptionater from './RightCaptionater'
import RightHashTag from './RightHashTag'
import RightQuotes from './RightQuotes'


const Rightsidebar = () => {

    const context = useContext(AppContext)

    return (
        <div className="right-side-bar-container">
            {context.showRightSideBar === "texteditor" ? <RightTextEditor /> : null}
            {context.showRightSideBar === "socialaccounts" ? <RightSocialAccounts /> : null}
            {context.showRightSideBar === "dateandtime" ? <RightDateTimePicker /> : null}
            {context.showRightSideBar === "connectaccounts" ? <RightConnectAccounts /> : null}
            {context.showRightSideBar === "history" ? <RightHistory /> : null}
            {context.showRightSideBar === "draft" ? <RightDraft /> : null}
            {context.showRightSideBar === "queue" ? <RightQueue /> : null}
            {context.showRightSideBar === "rightdashboard" ? <RightDashBoard /> : null}
            {context.showRightSideBar === null ? <RightNullBox /> : null}
            {context.showRightSideBar === "captionater" ? <RightCaptionater /> : null}
            {context.showRightSideBar === "quotes" ? <RightQuotes/> : null}
            {context.showRightSideBar === "hashtag" ? <RightHashTag /> : null}
        </div>
    )
}

export default Rightsidebar
