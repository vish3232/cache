import React, { useContext, useState, useEffect } from 'react'
import AppContext from '../../store/DataProvider'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import Twitter from '../../assets/Twitter.svg'
import Axios from 'axios'
import constant from '../../Constant'
import '../reusablecomponentscss/RightHistory.css'

const RightHistory = () => {

    const [active, setactive] = useState(1)
    const context = useContext(AppContext)
    const [overlay, setoverlay] = useState(false)
    const [showPostAgain, setshowPostAgain] = useState(false)
    const [date, setdate] = useState(new Date())
    const [loading, setloading] = useState(false)

    useEffect(() => {
        const d = new Date()
        d.setMinutes(d.getMinutes() + 5);

        let yyyy = d.getFullYear()
        let MM = d.getMonth() + 1
        if (MM < 10) {
            MM = "0" + MM
        }
        let dd = d.getDate()
        if (dd < 10) {
            dd = "0" + dd
        }
        let hh = d.getHours()
        if (hh < 10) {
            hh = "0" + hh
        }
        let mm = d.getMinutes()
        if (mm < 10) {
            mm = "0" + mm
        }

        let todayDate = `${yyyy}-${MM}-${dd}T${hh}:${mm}`
        setdate(todayDate)
    }, [])

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

    const deleteFromHistory = async () => {
        try {
            setloading(true)
            const res = await Axios.delete(constant.url + "post/" + context.historyClick._id)
            if (res.data === "done") {
                context.changeRightSideBar(null)
                context.getHistory()
                setoverlay(false)
                setloading(false)
            }
        } catch (error) {
            setloading(false)
            console.log(error.response.data)
        }
    }

    const postAgain = async () => {
        try {
            setloading(true)
            let post = context.historyClick
            post.time = new Date(date).toString()
            const res = await Axios.post(constant.url + "user/post/media/again", {
                post: post
            })
            if (res.data === "done") {
                context.changeRightSideBar(null)
                context.getHistory()
                setloading(false)
                setshowPostAgain(false)
            }
        } catch (error) {
            setloading(false)
            console.log(error.response.data)
        }
    }

    return (
        <div className="right-history">
            <div className={overlay === true ? "overlay" : "hide"} onClick={() => setoverlay(!overlay)}>
                <div className="select-draft" onClick={(e) => e.stopPropagation()}>
                    <strong>Delete</strong>
                    <p>{loading ? "Removing post from history" : "Are your sure you want to remove post from history ?"}</p>
                    {
                        loading ?
                            <div className="select-button-draft">
                                <button className="yes">Removing . . .</button>
                            </div> :
                            <div className="select-button-draft">
                                <button className="no" onClick={() => setoverlay(false)}>No</button>
                                <button className="yes" onClick={deleteFromHistory}>Yes</button>
                            </div>
                    }
                </div>
            </div>

            <div className={showPostAgain === true ? "overlay" : "hide"}>
                <div className="select-draft">
                    <strong>Post Again!</strong>
                    <p>{loading ? "Posting your post again" : "Are your sure you want to post again ?"}</p>
                    {
                        loading ? <div className="select-button-draft">
                            <button className="yes">Posting . . .</button>
                        </div> :
                            <>
                                <input type="datetime-local"
                                    id="schedule post"
                                    value={date}
                                    min={date}
                                    className="date-picker"
                                    onChange={(e) => setdate(e.target.value)} />
                                <div className="select-button-draft">
                                    <button className="no" onClick={() => setshowPostAgain(false)}>Cancel</button>
                                    <button className="yes" onClick={postAgain}>Post</button>
                                </div>
                            </>
                    }
                </div>
            </div>

            <div>📅  {formatDate(context.historyClick.time)}</div>
            <div className="button-container">
                <button className="post-again" onClick={() => setshowPostAgain(true)}>Post again</button>
                <button className="delete" onClick={() => setoverlay(true)}>Delete</button>
            </div>
            <div className="toggle-container">
                <button onClick={() => setactive(1)} className={active === 1 ? "active" : null}>Post</button>
                <button onClick={() => setactive(2)} className={active === 2 ? "active" : null}>Accounts</button>
                <button onClick={() => setactive(3)} className={active === 3 ? "active" : null}>Attachment</button>
            </div>
            {
                active === 1 ?
                    <p>
                        {context.historyClick.caption}
                    </p> : active === 2 ?
                        <div className="accounts-container">
                            {
                                context.historyClick.accounts.map(data => {
                                    return <button key={data._id}>
                                        <div className="image-container">
                                            <img src={data.url} alt="" />
                                            <img className="mini-image"
                                                src={data.type === "instagram" ? Instagram : data.type === "twitter" ? Twitter : data.type === "linkedin" ? LinkedIn : Facebook}
                                                alt="" />
                                        </div>
                                        <span>{data.name}</span>
                                    </button>
                                })
                            }
                        </div> : <div className="image-container-attachement">
                            {
                                context.historyClick.media === null ? null :
                                context.historyClick.media.map(image => {
                                    if (image.mediaType === "image") {
                                        return <img key={image._id} src={image.url} alt="" />
                                    } else {
                                        return <video key={image._id} src={image.url} controls={false} />
                                    }
                                })
                            }
                        </div>
            }
        </div>
    )
}

export default RightHistory
