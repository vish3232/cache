import React, { useContext, useState, useEffect } from 'react'
import '../reusablecomponentscss/EditPost.css'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import Twitter from '../../assets/Twitter.svg'
import AppContext from '../../store/DataProvider'
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import constant from '../../Constant'

const EditPost = (props) => {

    const [imagesFile, setimagesFile] = useState([])
    const [url, seturl] = useState([])
    const [caption, setcaption] = useState("")
    const [time, settime] = useState("")
    const [accounts, setaccounts] = useState([])
    const [useraccounts, setuseraccounts] = useState([])
    const [loading, setloading] = useState(false)
    const [active, setactive] = useState(0)
    const [currentDate, setcurrentDate] = useState(null)
    const context = useContext(AppContext)

    useEffect(() => {
        setcaption(context.historyClick.caption)
        settime(context.historyClick.time)
        setaccounts(context.historyClick.accounts)
        getTheUrl()
        getTheUserAccounts()

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
        setcurrentDate(todayDate)
    }, [context.historyClick]) // eslint-disable-line react-hooks/exhaustive-deps

    const getTheUserAccounts = async () => {
        try {
            setloading(true)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const response = await Axios.get(constant.url + "user/accounts/" + decoded.id)
            setuseraccounts(response.data)
            setloading(false)
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    const getTheUrl = () => {
        if(context.historyClick.media === null) return
        const data = context.historyClick.media.map(data => {
            let obj = {
                type: data.mediaType,
                url: data.url,
                fileName: data.fileName
            }
            return obj
        })
        seturl(data)
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

    const addUserAccounts = (data) => {
        setaccounts([...accounts, data])
    }

    const removeUserAccount = (id) => {
        const filterAccounts = accounts.filter(data => data._id !== id)
        setaccounts(filterAccounts)
    }

    const removeURL = (indexURL) => {
        const urls = url.filter((data, index) => index !== indexURL)
        seturl(urls)
    }

    const addMedia = () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.id = "temporary"
        input.accept = "image/*,video/*"
        input.onchange = () => {
            if (url.length === 1) return alert("For of now only one media is supported")
            const data = input.files[0]
            setimagesFile((prev) => [...prev, data])
            const localURL = URL.createObjectURL(data)
            if (data.type.match('image.*')) {
                let data = {
                    type: "image",
                    url: localURL
                }
                seturl((prev) => [...prev, data])
            } else {
                let data = {
                    type: "video",
                    url: localURL
                }
                seturl((prev) => [...prev, data])
            }
            input.remove();
        };
        input.click();
    }

    const updateThePost = async () => {
        try {
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const formData = new FormData()
            if (imagesFile.length === 0) {
                formData.append("id", context.historyClick._id)
                formData.append("accounts", JSON.stringify(accounts))
                formData.append("caption", caption)
                formData.append("user_id", decoded.id)
                formData.append("time", time)
                formData.append("type", props.type)
            } else {
                formData.append("id", context.historyClick._id)
                formData.append("accounts", JSON.stringify(accounts))
                formData.append("caption", caption)
                formData.append("user_id", decoded.id)
                formData.append("time", time)
                formData.append("media", imagesFile[0])
                formData.append("type", props.type)
            }

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }

            const response = await Axios.post(constant.url + "post/update", formData, config)
            if (response.data === "done") {
                if(props.type === "draft"){
                    alert("Draft Saved")
                    context.getDraft()
                }else{
                    alert("Queue Saved")
                    context.getQueue()
                }
                context.changeRightSideBar(null)
                props.hideTheEditDraftOverlay()
            }
        } catch (error) {

        }
    }

    return (
        <div className="draft-edit">
            <div className="editor-container1">
                <div className="add-button-container">
                    {
                        accounts.map(data => {
                            return <div key={data._id} className="add-button-preview">
                                <img src={data.url} alt="" />
                                <button onClick={() => removeUserAccount(data._id)}>x</button>
                                <img className="logo"
                                    src={data.type === "instagram" ? Instagram : data.type === "twitter" ? Twitter : data.type === "linkedin" ? LinkedIn : Facebook}
                                    alt="" />
                            </div>
                        })
                    }
                    <div className="add-button" onClick={() => setactive(1)}>+</div>
                </div>

                <div className="post-editor">
                    <textarea
                        value={caption}
                        onFocus={() => setactive(0)}
                        onChange={(e) => setcaption(e.target.value)}
                        placeholder="Today is an amazing day..." />
                    <div className="post">
                        {
                            url.map((data, index) => {
                                return <div key={data.url} className="image-container">
                                    {
                                        data.type === "image" ?
                                            <img src={data.url} alt="" /> :
                                            <video src={data.url} controls={false} />
                                    }
                                    <button onClick={() => removeURL(index)}>x</button>
                                </div>
                            })
                        }
                        <button onClick={addMedia}>+</button>
                    </div>
                </div>

                <div className="button-editor">
                    <button onClick={() => props.hideTheEditDraftOverlay()}><span>❌</span>Cancel</button>
                    <button onClick={() => setactive(2)}><span>📅</span>{formatDate(time)}</button>
                    <button onClick={updateThePost}><span>📲</span>Update</button>
                </div>
            </div>
            <div className="right-side-bar">
                {
                    active === 1 ?
                        <div className="social-accounts">
                            <div className="title">Select your social account</div>
                            {
                                loading === true ? <div className="loading"><span>Loading...</span></div> :
                                    <div>
                                        {
                                            useraccounts.map(data => {
                                                if (data.active === true) {
                                                    return <button key={data._id} onClick={() => addUserAccounts(data)}>
                                                        <div className="image-container">
                                                            <img src={data.url} alt="" />
                                                            <img className="mini-image"
                                                                src={data.type === "instagram" ? Instagram : data.type === "twitter" ? Twitter : data.type === "linkedin" ? LinkedIn : Facebook}
                                                                alt="" />
                                                        </div>
                                                        <span>{data.name}</span>
                                                    </button>
                                                } else {
                                                    return null
                                                }
                                            })
                                        }
                                    </div>
                            }
                        </div> : active === 2 ?
                            <div className="date-picker-container">
                                <span>Select Time</span>
                                <input type="datetime-local"
                                    id="schedule-post"
                                    value={currentDate}
                                    min={currentDate}
                                    onChange={(e) => {
                                        setcurrentDate(e.target.value)
                                        settime(e.target.value)
                                    }} />
                            </div> :
                            <div className="Language">
                                <span>Select Language</span>
                                <button>Language</button>
                            </div>
                }
            </div>
        </div>
    )
}

export default EditPost
