import React, { useEffect, useContext } from 'react'
import AppContext from '../../store/DataProvider'
import Twitter from '../../assets/Twitter.svg'
import '../reusablecomponentscss/CenterDashBoard.css'

const CenterDashBoard = () => {

    const context = useContext(AppContext)

    useEffect(() => {
        context.getQueue()
        context.getUserAccounts()
        context.getHistory()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps    


    const changeTheContainers = (centerContainer, rightContainer, number) => {
        context.changeCenterContainer(centerContainer)
        context.changeRightSideBar(rightContainer)
        context.toggleActiveButtonLeft(number)
    }

    function isSameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() && d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth();
    }




    return (
        <div className="center-dash-board">
            <div className="topBox">
                <div>
                    <p>Decide the effect you want to<br />produce in your reader.</p>
                    <span>– Robert Collier</span>
                </div>
                <button onClick={() => changeTheContainers("schedulecontainer", "socialaccounts", 1)}>Schedule</button>
            </div>

            <div className="info">
                <div className="info-wrapper">
                    <span>{10 - context.queue.length}</span>
                    <label>queue limit</label>
                </div>
                <div className="divider" />
                <div className="info-wrapper">
                    <span>{3 - context.userAccounts.length}</span>
                    <label>accounts limit</label>
                </div>
                <div className="divider" />
                <div className="info-wrapper">
                    <span>132</span>
                    <label>mins saved</label>
                </div>
            </div>

            <div className="today-schedule">
                <div className="head">
                    <span>Today’s schedule</span>
                    <span onClick={() => changeTheContainers("centerhistory", null, 5)}>See all</span>
                </div>
                <div className="grid-card">
                    {
                        context.history.map(data => {
                            if (isSameDay(new Date(), new Date(data.time))) {
                                return <div className="card">
                                    <div className="profile-img" style={{ backgroundImage: `url(${data.accounts[0].url})` }}>
                                        <img className="preview" src={Twitter} alt="" />
                                    </div>
                                    <div>
                                        <p>{data.caption}</p>
                                        <span>{new Date(data.time).getHours()}:{new Date(data.time).getMinutes()}</span>
                                    </div>
                                    {
                                        data.media === null ? null :
                                            data.media.length === 0 ? null :
                                                <img className="display-img" src={data.media[0].url} alt="" />
                                    }
                                </div>
                            } else {
                                return null
                            }
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default CenterDashBoard
