import React, { useContext, useState } from 'react'
import AppContext from '../../store/DataProvider'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import Twitter from '../../assets/Twitter.svg'
import Axios from 'axios'
import '../reusablecomponentscss/RightHistory.css'
import constant from '../../Constant'
import EditPost from './EditPost'

const RightDraft = () => {

    const [active, setactive] = useState(1)
    const context = useContext(AppContext)
    const [overlay, setoverlay] = useState(false)
    const [editDraftOverLay, seteditDraftOverLay] = useState(false)
    const [addQueueOverlay, setaddQueueOverlay] = useState(false)
    const [loading, setloading] = useState(false)
    const [postDraftLoading, setpostDraftLoading] = useState(false)

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

    const deleteDraft = async () => {
        try {
            setloading(true)
            const res = await Axios.delete(constant.url + "post/" + context.historyClick._id)
            if (res.data === "done") {
                context.changeRightSideBar(null)
                context.getDraft()
                setoverlay(false)
                setloading(false)
            }
        } catch (error) {
            setloading(false)
            console.log(error.response.data)
        }
    }

    const hideTheEditDraftOverlay = () => {
        seteditDraftOverLay(false)
    }

    const checkValidDate = () => {
        let nowTime = new Date();
        nowTime.setMinutes(nowTime.getMinutes() + 4); // timestamp
        nowTime = new Date(nowTime); // Date object
        let scheduleTime = new Date(context.historyClick.time)
        if (scheduleTime < nowTime) {
            return false
        } else {
            return true
        }
    }

    const postDraft = async () => {
        try {
            if (!checkValidDate()) {
                alert("Please add valid date! You can add date from edit section")
            } else {
                setpostDraftLoading(true)
                let post = context.historyClick
                const res = await Axios.post(constant.url + "user/post/media/again", {
                    post: post
                })
                if (res.data === "done") {
                    context.changeRightSideBar(null)
                    context.getDraft()
                    setaddQueueOverlay(false)
                    setpostDraftLoading(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="right-history">
            <div>📅  {formatDate(context.historyClick.time)}</div>

            <div className={overlay === true ? "overlay" : "hide"} onClick={() => setoverlay(!overlay)}>
                <div className="select-draft" onClick={(e) => e.stopPropagation()}>
                    <strong>Delete</strong>
                    {
                        loading ? <p>Deleting your draft ...</p> :
                            <>
                                <p>Are your sure you want to delete draft ?</p>
                                <div className="select-button-draft">
                                    <button className="no" onClick={() => setoverlay(false)}>No</button>
                                    <button className="yes" onClick={deleteDraft}>Yes</button>
                                </div>
                            </>
                    }
                </div>
            </div>

            <div className={addQueueOverlay === true ? "overlay" : "hide"} onClick={() => setaddQueueOverlay(!addQueueOverlay)}>
                <div className="select-draft" onClick={(e)=> e.stopPropagation()}>
                    <strong>Post</strong>
                    <p>{postDraftLoading ? "We are posting your post in Queue" : "Are your sure you want to post this draft ?"}</p>
                    <div className="select-button-draft">
                        {
                            postDraftLoading ? <button className="yes">Posting ...</button> :
                                <>
                                    <button className="no" onClick={() => setaddQueueOverlay(false)}>No</button>
                                    <button className="yes" onClick={() => postDraft()}>Yes</button>
                                </>
                        }
                    </div>
                </div>
            </div>

            <div className={editDraftOverLay === true ? "overlay" : "hide"}>
                <EditPost type="draft" hideTheEditDraftOverlay={hideTheEditDraftOverlay} />
            </div>

            <div className="button-container">
                <button className="post-again" onClick={() => setaddQueueOverlay(true)}>Queue</button>
                <button className="edit" onClick={() => seteditDraftOverLay(true)}>Edit</button>
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

export default RightDraft
