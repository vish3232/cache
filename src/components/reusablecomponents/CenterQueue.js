import React, { useState, useEffect, useContext } from 'react'
import '../reusablecomponentscss/CenterQueue.css'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import Twitter from '../../assets/Twitter.svg'
import AppContext from '../../store/DataProvider'

const CenterQueue = () => {

    const [active, setactive] = useState(1)
    const context = useContext(AppContext)

    useEffect(() => {
        context.getQueue()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    const setActiveButton = (value) => {
        setactive(value)
    }

    const formatDate = (time) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        const date = new Date(time)
        const day = days[date.getDay()];
        const month = months[date.getMonth()];

        let hours = date.getHours()
        let minutes = date.getMinutes()

        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;

        return `${day}, ${month} at ${strTime}`
    }

    const changeRightBarAndShowData = (data) => {
        context.changeRightSideBar("queue")
        context.showHistoryClickData(data)
    }

    return (
        <div className="center-q">
            <div className="filter-container">
                <button onClick={() => setActiveButton(1)} className={active === 1 ? "active" : ""}>All</button>
                <button onClick={() => setActiveButton(2)} className={active === 2 ? "active" : ""}>Today</button>
                <button onClick={() => setActiveButton(3)} className={active === 3 ? "active" : ""}>Tomorrow</button>
                <button onClick={() => setActiveButton(4)} className={active === 4 ? "active" : ""}>Date</button>
                <button onClick={() => setActiveButton(5)} className={active === 5 ? "active" : ""}>Account</button>
            </div>
            <div className="card-container">
                {
                    context.queue.map(data => {
                        return <div key={data._id} className="card" onClick={() => changeRightBarAndShowData(data)}>
                            <span>
                                <div>📅 {formatDate(data.time)}</div>
                                <div className="description">{data.caption}</div>
                                <div className="preview-container">
                                    {
                                        data.accounts.map((accounts, index) => {
                                            if (index <= 1) {
                                                return <div key={accounts._id} className="image-container">
                                                    <img src={accounts.url} alt="" />
                                                    <img className="preview" src={accounts.type === "instagram" ? Instagram : data.type === "twitter" ? Twitter : data.type === "linkedin" ? LinkedIn : Facebook} alt="" />
                                                </div>
                                            } else {
                                                if ((data.accounts.length - 1) === index) {
                                                    return <div key={accounts._id} className="image-container">
                                                        <div className="more-accounts-count">
                                                            +{data.accounts.length - 2}
                                                        </div>
                                                    </div>
                                                } else {
                                                    return null
                                                }
                                            }
                                        })
                                    }
                                </div>
                            </span>
                            <span className="image-error-section">
                                {
                                    data.media === null ? null :
                                        data.media.map(image => {
                                            if (image.mediaType === "image") {
                                                return <img key={image._id} className="posted-image" src={image.url} alt="" />
                                            } else {
                                                return <video key={image._id} className="posted-image" src={data.url} controls={false} />
                                            }
                                        })
                                }
                            </span>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default CenterQueue
