import React, { useState, useContext } from 'react'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import Twitter from '../../assets/Twitter.svg'
import FullScreen from '../../assets/FullScreen.svg'
import Axios from 'axios'
import constant from '../../Constant'
import jwt_decode from "jwt-decode";
import '../reusablecomponentscss/CenterSchedulecontainer.css'
import AppContext from '../../store/DataProvider'

const Schedulecontainer = () => {

    const [showDraftOverlay, setshowDraftOverlay] = useState(false)
    const [showOverlayQueueLimitReached, setshowOverlayQueueLimitReached] = useState(false)
    const context = useContext(AppContext)
    const [overlay, setoverlay] = useState(false)
    const [uploadProgress, setuploadProgress] = useState(10)
    const [loading, setloading] = useState(false)

    const getTheImageOrVideo = () => {
        let input = document.createElement('input');
        input.type = 'file';
        input.id = "temporary"
        input.accept = "image/*,video/*"
        input.onchange = () => {
            if (context.imagesFiles.length === 1) return alert("For of now only one media is supported")
            const data = input.files[0]
            const imagesFiles = [...context.imagesFiles, data]
            let images = []
            const url = URL.createObjectURL(data)
            if (data.type.match('image.*')) {
                let data = {
                    type: "image",
                    url: url
                }
                images = [...context.images, data]
            } else {
                let data = {
                    type: "video",
                    url: url
                }
                images = [...context.images, data]
            }
            context.changeImage(images, imagesFiles)
            input.remove();
        };
        input.click();
    }

    const removeTheVideoOrImage = (mediaIndex) => {
        let filterUrl = context.images.filter((data, index) => index !== mediaIndex)
        let filterData = context.imagesFiles.filter((data, index) => index !== mediaIndex)
        context.changeImage(filterUrl, filterData)
    }

    const uploadPosts = async () => {
        try {
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            let nowTime = new Date();
            nowTime.setMinutes(nowTime.getMinutes() + 4); // timestamp
            nowTime = new Date(nowTime); // Date object
            let scheduleTime = new Date(context.originalDateValue)
            if (scheduleTime < nowTime) return alert("Schedule Time must be 5 min greater then current time")
            const formData = new FormData()
            const accounts = context.addedAccountsToSchedule
            formData.append("accounts", JSON.stringify(accounts)) // to send the array in from data it need to get in string
            formData.append("caption", context.caption)
            formData.append("user_id", decoded.id)
            formData.append("time", context.originalDateValue)

            //to add the multiple files in the form data
            let n = context.imagesFiles.length
            for (let i = 0; i < n; i++) {
                formData.append("media", context.imagesFiles[i])
            }

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    const { loaded, total } = progressEvent;
                    const percentage = Math.floor((loaded * 100) / total);
                    if (percentage < 100) {
                        if (percentage >= 10) {
                            setuploadProgress(percentage)
                        }
                    }
                }
            }

            context.changeImage([], [])
            context.changeCaption("")
            context.removeAllAccountsFromSchedule()
            setloading(true)

            const response = await Axios.post(constant.url + "user/post/media", formData, config)
            if (response.data === "done") {
                setuploadProgress(100)
                setTimeout(() => {
                    setuploadProgress(0)
                    setoverlay(false)
                    setloading(false)
                }, 500);
            }
        } catch (error) {
            setloading(false)
            setuploadProgress(0)
            console.log(error)
        }
    }

    const saveDraft = async () => {
        try {
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const accounts = context.addedAccountsToSchedule

            const formData = new FormData()
            formData.append("accounts", JSON.stringify(accounts))
            formData.append("caption", context.caption)
            formData.append("user_id", decoded.id)
            formData.append("time", context.originalDateValue)
            formData.append("post_status", "draft")

            //to add the multiple files in the form data
            let n = context.imagesFiles.length
            for (let i = 0; i < n; i++) {
                formData.append("media", context.imagesFiles[i])
            }

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    const { loaded, total } = progressEvent;
                    const percentage = Math.floor((loaded * 100) / total);
                    if (percentage < 100) {
                        if (percentage >= 10) {
                            setuploadProgress(percentage)
                        }
                    }
                }
            }

            // to get all files and accounts so set state call here
            context.changeImage([], [])
            context.changeCaption("")
            context.removeAllAccountsFromSchedule()
            setloading(true)

            const response = await Axios.post(constant.url + "post/draft", formData, config)
            if (response.data === "done") {
                setuploadProgress(100)
                setTimeout(() => {
                    setuploadProgress(0)
                    setshowDraftOverlay(false)
                    setshowOverlayQueueLimitReached(false)
                    setloading(false)
                }, 500);
            }
        } catch (error) {
            setloading(false)
            setuploadProgress(0)
        }
    }

    const uploadPostsNow = async () => {
        try {
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const formData = new FormData()
            const accounts = context.addedAccountsToSchedule

            formData.append("accounts", JSON.stringify(accounts)) // to send the array in from data it need to get in string
            formData.append("caption", context.caption)
            formData.append("user_id", decoded.id)
            formData.append("time", "null")

            //to add the multiple files in the form data
            let n = context.imagesFiles.length
            for (let i = 0; i < n; i++) {
                formData.append("media", context.imagesFiles[i])
            }

            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                    const { loaded, total } = progressEvent;
                    const percentage = Math.floor((loaded * 100) / total);
                    if (percentage < 100) {
                        if (percentage >= 10) {
                            setuploadProgress(percentage)
                        }
                    }
                }
            }

            context.changeImage([], [])
            context.changeCaption("")
            context.removeAllAccountsFromSchedule()
            setloading(true)

            const response = await Axios.post(constant.url + "user/post/media/now", formData, config)
            if (response.data === "done") {
                setuploadProgress(100)
                setTimeout(() => {
                    setuploadProgress(0)
                    setoverlay(false)
                    setloading(false)
                }, 100);
            }
            console.log(response)
        } catch (error) {
            setloading(false)
            setuploadProgress(0)
            console.log(error)
        }
    }

    const yesClick = () => {
        if (context.date === null) {
            uploadPostsNow()
        } else {
            if (context.queue.length < 10) {
                uploadPosts()
            } else {
                setoverlay(false)
                setshowOverlayQueueLimitReached(true)
            }
        }
    }


    return (
        <section className="main-container">

            <div className={overlay === true ? "overlay" : "hide"} onClick={() => loading ? null : setoverlay(!overlay)}>
                <div className="select-draft" onClick={(e) => e.stopPropagation()}>
                    <strong>{context.date === null ? "Share Now" : "Schedule"}</strong>
                    {
                        loading === true ? <p>Uploading your post</p> :
                            <p>{context.date === null ? "Are your sure to share now ?" : `Are you sure you want to schedule post at ${context.date}`}</p>
                    }
                    {
                        loading === true ?
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${uploadProgress}%` }}>
                                    {uploadProgress}%
                                </div>
                            </div> :
                            <div className="select-button-draft">
                                <button className="no" onClick={() => setoverlay(false)}>No</button>
                                <button className="yes" onClick={() => yesClick()}>Yes</button>
                            </div>
                    }
                </div>
            </div>

            <div className={showDraftOverlay === true ? "overlay" : "hide"} onClick={() => setshowDraftOverlay(!showDraftOverlay)}>
                <div className="select-draft" onClick={(e) => e.stopPropagation()}>
                    <strong>Draft</strong>
                    <p>
                        {loading ? "Saving your draft" :
                            "Confirm adding to draft? It will be shown in the draft section where you can again revist the post for later use"}
                    </p>
                    {
                        loading === true ?
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${uploadProgress}%` }}>
                                    {uploadProgress}%
                                </div>
                            </div> :
                            <div className="select-button-draft">
                                <button className="no" onClick={() => setshowDraftOverlay(false)}>No</button>
                                <button className="yes" onClick={saveDraft}>Yes</button>
                            </div>
                    }
                </div>
            </div>


            <div className={showOverlayQueueLimitReached === true ? "overlay" : "hide"}  onClick={() => setshowOverlayQueueLimitReached(!showOverlayQueueLimitReached)}>
                <div className="select-draft" onClick={(e) => e.stopPropagation()}>
                    <strong style={{color:"#ffcc00"}}>Warning!</strong>
                    <p>
                        {loading ? "Saving as draft" :
                            "You have reached your queue limit. You can save the post as draft for letter use."}
                    </p>
                    {
                        loading === true ?
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${uploadProgress}%` }}>
                                    {uploadProgress}%
                                </div>
                            </div> :
                            <div className="select-button-draft">
                                <button className="no" onClick={() => setshowOverlayQueueLimitReached(false)}>No</button>
                                <button className="yes" onClick={saveDraft}>Yes</button>
                            </div>
                    }
                </div>
            </div>


            <div className="editor-container">
                <div className="add-button-container">
                    <div className="add-more">
                        <div onClick={() => context.changeRightSideBar("socialaccounts")}
                            className="add-button">+</div>
                        <div className="or" />
                    </div>
                    <div className="selected-accounts">
                        {
                            context.addedAccountsToSchedule.map(data => {
                                return <div key={data._id} className="add-button-preview">
                                    <img src={data.url} alt="" />
                                    <button onClick={() => context.removeAccountsToSchedule(data)}>x</button>
                                    <img className="logo"
                                        src={data.type === "instagram" ? Instagram : data.type === "twitter" ? Twitter : data.type === "linkedin" ? LinkedIn : Facebook}
                                        alt="" />
                                </div>
                            })
                        }
                    </div>
                </div>

                <div className="post-editor">
                    <textarea
                        value={context.caption}
                        onChange={(e) => context.changeCaption(e.target.value)}
                        //onFocus={() => context.changeRightSideBar("texteditor")}
                        placeholder="Today is an amazing day..." />
                    <div className="post">
                        {
                            context.images.map((data, index) => {
                                return <div key={data.url} className="image-container">
                                    {
                                        data.type === "image" ?
                                            <img src={data.url} alt="" /> :
                                            <video src={data.url} controls={false} />
                                    }
                                    <button onClick={() => removeTheVideoOrImage(index)}>x</button>
                                </div>
                            })
                        }
                        <button onClick={getTheImageOrVideo}>+</button>
                        <span className="word-count">{context.caption.length}</span>
                        <img className="full-screen" src={FullScreen} alt="" onClick={()=>context.changeCenterContainer("centertexteditscreenfull")} />
                    </div>
                </div>

                <div className="button-editor">
                    <button onClick={() => setshowDraftOverlay(true)}><span>📝</span>Draft</button>
                    <button onClick={() => context.changeRightSideBar("dateandtime")}><span>📅</span>{context.date === null ? "Share Now" : context.date}</button>
                    <button onClick={() => setoverlay(true)}><span>🚀</span>Share</button>
                </div>
            </div>

            <div className="app-container">
                <div className="title">
                    <span>Quick Access Apps</span>
                    <span>See all</span>
                </div>
                <div className="button-container">
                    <button style={{ borderColor: '#00ECC2' }} onClick={()=> context.changeRightSideBar("captionater")}>Captionater</button>
                    <button style={{ borderColor: '#FF8A25' }} onClick={()=> context.changeRightSideBar("quotes")}>Quotes</button>
                    <button style={{ borderColor: '#4267B2' }} onClick={()=> context.changeRightSideBar("hashtag")}>#Tags</button>
                    <button style={{ borderColor: '#FF7043' }}>Uploads</button>
                    <button style={{ borderColor: '#43DDFF' }}>Preview</button>
                </div>
            </div>
        </section>
    )
}

export default Schedulecontainer
