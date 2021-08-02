import React, {useContext} from 'react'
import '../reusablecomponentscss/CenterTextEditScreenFull.css'
import FullScreen from '../../assets/FullScreen.svg'
import AppContext from '../../store/DataProvider'

const CenterTextEditScreenFull = (props) => {

    const context = useContext(AppContext)

    return (
        <div className="center-edit-screen">
            <textarea 
            onChange={(e) => context.changeCaption(e.target.value)}
            value={context.caption} 
            placeholder="Today is an amazing day..." />
            <img src={FullScreen} alt="" onClick={()=> context.changeCenterContainer("schedulecontainer")} />
        </div>
    )
}

export default CenterTextEditScreenFull
