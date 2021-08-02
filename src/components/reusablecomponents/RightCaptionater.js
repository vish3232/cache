import React,{useState,useEffect} from 'react'
import '../reusablecomponentscss/RightCaptionater.css'
import Axios from 'axios'

const RightCaptionater = () => {
    const [captionaterClipboard,setcaptionaterClipboard]=useState([])
    useEffect(() => {
        getCaptionaterClipboard()
    }, [])

    const getCaptionaterClipboard=async()=>{
        const res = await Axios.get('https://captionator.creatosaurus.io/captionator/saved/60c19cab66b6965311ea594c')
        setcaptionaterClipboard(res.data.saved)
    }
    return (
        <div className="captionater">
            <h1>Captionater</h1>
            <div className="create-copy-button" >
                <span className="create-copy-button-header" >CREATE COPY</span>
            </div>
            <div className="generate-copy-and-saved-copy-tab-container" >
                <span className="generate-copy-header" >Generate copy</span>
                <span className="saved-copy-header" >Saved copy</span>
            </div>
            {
            captionaterClipboard.length?
            
            <div className="saved-copy-container" >
            {
                captionaterClipboard.map((data)=>{
                    return(
                        <div className="saved-copy-container-item" >
                            {data.answer}
                        </div>
                    )
                })
            }
            </div>:
            <div className="saved-copy-container-item" >
                No Data found.
            </div>
            }
        </div>
    )
}

export default RightCaptionater
