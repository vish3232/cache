import React, { useState, useContext } from 'react'
import '../reusablecomponentscss/RightTextEditor.css'
import AppContext from '../../store/DataProvider'

const TextEditor = (props) => {

    const [buttonName, setbuttonName] = useState("Full Screen Input")
    const context = useContext(AppContext)

    const toggleCenterScreenAndButtonName = () => {
        if (buttonName === "Full Screen Input") {
            context.changeCenterContainer("centertexteditscreenfull")
            setbuttonName("Back To Normal")
        } else {
            context.changeCenterContainer("schedulecontainer")
            setbuttonName("Full Screen Input")
        }
    }

    return (
        <div className="text-editor-container">
            <div className="title">Text Editor</div>
            <div className="button-container">
                <button onClick={toggleCenterScreenAndButtonName}>{buttonName}</button>
            </div>
        </div>
    )
}

export default TextEditor
