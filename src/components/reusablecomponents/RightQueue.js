import React, { useContext, useState } from 'react'
import AppContext from '../../store/DataProvider'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import Twitter from '../../assets/Twitter.svg'
import Axios from 'axios'
import constant from '../../Constant'
import EditPost from '../reusablecomponents/EditPost'
import '../reusablecomponentscss/RightHistory.css'

const RightQueue = () => {

    const [active, setactive] = useState(1)
    const [editQueueOverlay, seteditQueueOverlay] = useState(false)
    const [deleteLoading, setdeleteLoading] = useState(false)
    const context = useContext(AppContext)

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

    const deleteFromQueue = async () => {
        try {
            setdeleteLoading(true)
            const res = await Axios.delete(constant.url + "post/queue/" + context.historyClick._id)
            if (res.data === "done") {
                context.changeRightSideBar(null)
                context.getQueue()
                setdeleteLoading(false)
            }
        } catch (error) {
            setdeleteLoading(false)
            console.log(error)
        }
    }

    const hideTheEditDraftOverlay = () => {
        seteditQueueOverlay(false)
    }


    return (
        <div className="right-history">
            <div>📅  {formatDate(context.historyClick.time)}</div>

            <div className="button-container">
                <button className="edit" onClick={() => seteditQueueOverlay(true)}>Edit</button>
                <button className="delete" onClick={deleteLoading ? null : deleteFromQueue}>{deleteLoading ? "Deleting ..." : "Delete"}</button>
            </div>

            <div className={editQueueOverlay === true ? "overlay" : "hide"}>
                <EditPost type="queue" hideTheEditDraftOverlay={hideTheEditDraftOverlay} />
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

export default RightQueue
