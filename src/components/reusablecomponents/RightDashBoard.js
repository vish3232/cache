import React, { useEffect, useContext } from 'react'
import '../reusablecomponentscss/RightDashBoard.css'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import Twitter from '../../assets/Twitter.svg'
import AppContext from '../../store/DataProvider'

const RightDashBoard = () => {

    const context = useContext(AppContext)

    useEffect(() => {
        context.getUserAccounts()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    const changeTheContainers = (centerContainer, rightContainer, number) => {
        context.changeCenterContainer(centerContainer)
        context.changeRightSideBar(rightContainer)
        context.toggleActiveButtonLeft(number)
    }

    return (
        <div className="right-dash-board">
            <div className="top-info">
                <span>Looking for a little assistance?</span>
                <p>Our blog and tutorial section is loaded<br />with helpful information.</p>
                <span>Check our knowledge base</span>
                <span>Join our community</span>
            </div>
            <div className="connected-accounts">
                <div className="head">
                    <span>Connected accounts</span>
                    <span onClick={() => changeTheContainers("connectaccounts", "connectaccounts", 3)}>See all</span>
                </div>
                <button onClick={() => changeTheContainers("connectaccounts", "connectaccounts", 3)}>Connect New Account</button>
                {
                    context.userAccountsLoading ? <span>Loading...</span> :
                        context.userAccounts.map(data => {
                            return <div className="card" key={data._id}>
                                <div className="background-image" style={{ backgroundImage: `url(${data.url})` }}>
                                    <img src={data.type === "instagram" ? Instagram : data.type === "twitter" ? Twitter : data.type === "linkedin" ? LinkedIn : Facebook} alt="" />
                                </div>
                                <span>{data.name}</span>
                            </div>
                        })
                }
            </div>
        </div>
    )
}

export default RightDashBoard
