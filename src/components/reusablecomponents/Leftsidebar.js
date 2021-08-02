import React, { useContext } from 'react'
import AppContext from '../../store/DataProvider'
import '../reusablecomponentscss/Leftsidebar.css'

const Leftsidebar = () => {

    const context = useContext(AppContext)

    const changeTheContainers = (centerContainer, rightContainer, number) => {
        context.changeCenterContainer(centerContainer)
        context.changeRightSideBar(rightContainer)
        context.toggleActiveButtonLeft(number)
    }

    return (
        <div className="left-side-bar-container">
              <div onClick={() => changeTheContainers("centerdashboard", "rightdashboard", 7)}
                className={context.activeButtonLeft === 7 ? "button-container active" : "button-container"}>
                <span className="emoji rotate">👀</span>
                <span className="title">Dashboard</span>
            </div>
            <div onClick={() => changeTheContainers("schedulecontainer", "socialaccounts", 1)}
                className={context.activeButtonLeft === 1 ? "button-container active" : "button-container"}>
                <span className="emoji">✍🏻</span>
                <span className="title">Create</span>
            </div>
            <div onClick={() => changeTheContainers("centerqueue", null, 2)}
                className={context.activeButtonLeft === 2 ? "button-container active" : "button-container"}>
                <span className="emoji">📅</span>
                <span className="title">Queue</span>
                <span className="count">{context.queue.length}</span>
            </div>
            <div onClick={() => changeTheContainers("connectaccounts", "connectaccounts", 3)}
                className={context.activeButtonLeft === 3 ? "button-container active" : "button-container"}>
                <span className="emoji">🌐</span>
                <span className="title">Accounts</span>
                <span className="count">{context.userAccounts.length}</span>
            </div>
            <div onClick={() => changeTheContainers("centerdraft", null, 4)}
                className={context.activeButtonLeft === 4 ? "button-container active" : "button-container"}>
                <span className="emoji">📝</span>
                <span className="title">Draft</span>
            </div>
            <div onClick={() => changeTheContainers("centerhistory", null, 5)}
                className={context.activeButtonLeft === 5 ? "button-container active" : "button-container"}>
                <span className="emoji">📚</span>
                <span className="title">History</span>
            </div>
            <div onClick={() => changeTheContainers("settings", null, 6)}
                className={context.activeButtonLeft === 6 ? "button-container active" : "button-container"}>
                <span className="emoji">⚙️</span>
                <span className="title">Settings</span>
            </div>
        </div>
    )
}

export default Leftsidebar
