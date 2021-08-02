import React,{useState,useEffect} from 'react'
import '../reusablecomponentscss/RightQuotes.css'
import Axios from 'axios'

const RightQuotes = () => {
    const [quotesClipboard,setquotesClipboard]=useState([])

    useEffect(() => {
        getQueoteClipboardData()
    }, [])

    const getQueoteClipboardData=async()=>{
        const res = await Axios.get('https://quotes.creatosaurus.io/quotes/saved/60c19cab66b6965311ea594c')

        setquotesClipboard(res.data)
    }
    return (
        <div className="right-quotes">
            <h1>Quotes</h1>
            <div className="create-copy-button" >
                <span className="create-copy-button-header" >CREATE COPY</span>
            </div>
            <div className="generate-copy-and-saved-copy-tab-container" >
                <span className="generate-copy-header" >Generate copy</span>
                <span className="saved-copy-header" >Saved copy</span>
            </div>
            {
            quotesClipboard.length?
            
            <div className="saved-copy-container" >
            {
                quotesClipboard.map((data)=>{
                    return(
                        <div className="saved-copy-container-item" >
                            {data.quote}
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

export default RightQuotes
