import React,{useState,useEffect} from 'react'
import '../reusablecomponentscss/RightHashTag.css'
import Axios from 'axios'

const RightHashTag = () => {
    const [hashtagClipboard,sethashtaglipboard]=useState([])
    useEffect(() => {
        getHashTagClipboard()
    }, [])

    const getHashTagClipboard=async()=>{
        const res = await Axios.get('https://hashtags.creatosaurus.io/hashtag/60c19cab66b6965311ea594c')
        sethashtaglipboard(res.data)
    }
    return (
        <div className="right-hash-tag">
            <h1>Hash Tag</h1>
            <div className="create-copy-button" >
                <span className="create-copy-button-header" >CREATE COPY</span>
            </div>
            <div className="generate-copy-and-saved-copy-tab-container" >
                <span className="generate-copy-header" >Generate copy</span>
                <span className="saved-copy-header" >Saved copy</span>
            </div>
            {
            hashtagClipboard.length?
            
            <div className="saved-copy-container" >
            {
                hashtagClipboard.map((data)=>{
                    return(
                        <div className="saved-copy-container-item" >
                            {data.tags}
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

export default RightHashTag
