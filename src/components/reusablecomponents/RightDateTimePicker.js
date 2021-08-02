import React, { useState, useEffect, useContext } from 'react'
import '../reusablecomponentscss/RightDateTimePicker.css'
import AppContext from '../../store/DataProvider'

const RightDateTimePicker = () => {

    const [date, setdate] = useState("")
    const [currentDate, setcurrentDate] = useState(null)
    const context = useContext(AppContext)
    const [active, setactive] = useState(null)

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
        setcurrentDate(todayDate)
    }, [])

    const setDateTime = (value) => {
        context.changeDateTime(value)
        setdate(value)
    }

    const toggleActive = (value) => {
        if (value === 1) {
            setactive(1)
            context.changeDateTime(null)
        } else {
            setactive(2)
            context.changeDateTime(new Date())
        }
    }


    return (
        <div className="date-time-picker">
            <div className="title">Date & Time</div>
            <button onClick={() => toggleActive(1)} className={active === 1 ? "active" : null}>Share Now</button>
            <br></br>
            <button onClick={() => toggleActive(2)} className={active === 2 ? "active" : null}>Schedule</button>
            {
                active === 2 ?
                    <input type="datetime-local"
                        id="schedule post"
                        value={date}
                        min={currentDate}
                        onChange={(e) => setDateTime(e.target.value)} /> : null
            }
        </div>
    )
}

export default RightDateTimePicker
