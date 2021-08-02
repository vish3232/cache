import React, { useState, useEffect, useContext } from 'react'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import Twitter from '../../assets/Twitter.svg'
import AppContext from '../../store/DataProvider'
import Axios from 'axios'
import '../reusablecomponentscss/CenterSelectToConnect.css'
import jwt_decode from 'jwt-decode'
import constant from '../../Constant'

const CenterSelectToConnect = () => {

    const [data, setdata] = useState([])
    const [activeAccountsLength, setactiveAccountsLength] = useState(0)
    const [loading, setloading] = useState(false)
    const context = useContext(AppContext)

    useEffect(() => {
        setdata(context.connectAccounts)
    }, [context.connectAccounts])

    const toggleTheSelectedAccount = (id) => {
        try {
            const toggleData = data.map(account => {
                if (account.id === id) {
                    account.active = !account.active
                }
                return account
            })
            let count = 0
            toggleData.forEach(account => {
                if (account.active === true) count = count + 1
            })
            setactiveAccountsLength(count)
            setdata(toggleData)
        } catch (error) {
            console.log(error)
        }
    }

    const saveTheInstagramData = async () => {
        try {
            if (context.userAccounts.length + activeAccountsLength > 3) return alert("You can't connect more than 3 accounts")
            setloading(true)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const res = await Axios.post(constant.url + `facebook/instagram/${decoded.id}`, {
                data: data
            })
            context.getUserAccounts()
            if (res.data === "done") {
                context.changeCenterContainer("connectaccounts")
                setloading(false)
            }
        } catch (error) {
            setloading(false)
            console.log(error.response.data)
        }
    }

    const saveTheFacebookPageData = async () => {
        try {
            if (context.userAccounts.length + activeAccountsLength > 3) return alert("You can't connect more than 3 accounts")
            setloading(true)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const res = await Axios.post(constant.url + `facebook/facebookpage/${decoded.id}`, {
                data: data
            })
            context.getUserAccounts()
            if (res.data === "done") {
                setloading(false)
                context.changeCenterContainer("connectaccounts")
            }
        } catch (error) {
            setloading(false)
            console.log(error.response.data)
        }
    }

    const saveTheFacebookGroupData = async () => {
        try {
            if (context.userAccounts.length + activeAccountsLength > 3) return alert("You can't connect more than 3 accounts")
            setloading(true)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const res = await Axios.post(constant.url + `facebook/facebookgroup/${decoded.id}`, {
                data: data
            })
            context.getUserAccounts()
            if (res.data === "done") {
                context.changeCenterContainer("connectaccounts")
                setloading(false)
            }
        } catch (error) {
            setloading(false)
            console.log(error.response.data)
        }
    }

    const saveTheTwitterData = async () => {
        try {
            if (data[0].active === false) return
            setloading(true)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token)
            const res = await Axios.post(constant.url + "twitter/upadate", {
                id: data[0].id,
                user_id: decoded.id
            })
            context.getUserAccounts()
            if (res.data === "done") {
                setloading(false)
                context.changeCenterContainer("connectaccounts")
            }
        } catch (error) {
            setloading(false)
            console.log(error)
        }
    }

    const saveTheLinkedinData = async () => {
        try {
            if (data[0].active === false) return
            setloading(true)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const res = await Axios.post(constant.url + "linkedin/upadate", {
                id: data[0].id,
                user_id: decoded.id
            })
            context.getUserAccounts()
            if (res.data === "done") {
                setloading(false)
                context.changeCenterContainer("connectaccounts")
            }
        } catch (error) {
            setloading(false)
            console.log(error.response.data)
        }
    }

    const saveAccountsToBackend = async () => {
        if (data.length === 0) return
        if (context.userAccounts.length >= 3) return alert("You can't connect more than 3 accounts")
        const type = data[0].type
        if (type === "instagram") {
            saveTheInstagramData()
        } else if (type === "twitter") {
            saveTheTwitterData()
        } else if (type === "linkedin") {
            saveTheLinkedinData()
        } else if (type === "facebookgroup") {
            saveTheFacebookGroupData()
        } else {
            saveTheFacebookPageData()
        }
    }

    return (
        <div className="select-to-connect-account">
            <div className="title">Select to connect</div>
            {
                data.map(data => {
                    return <div key={data.id} className="account-container">
                        <div className="image-container">
                            <div className="images">
                                <img src={data.url} alt="" />
                                <img
                                    className="account"
                                    src={data.type === "instagram" ? Instagram : data.type === "twitter" ? Twitter : data.type === "linkedin" ? LinkedIn : Facebook}
                                    alt="" />
                            </div>
                            <span>{data.name}</span>
                        </div>
                        <button onClick={() => toggleTheSelectedAccount(data.id)}>
                            {
                                data.active === false ? "connect" : "connected"
                            }
                        </button>
                    </div>
                })
            }
            <button className="save-button" onClick={loading ? null : saveAccountsToBackend}>{loading ? "Saving ..." : "Save"}</button>
        </div>
    )
}

export default CenterSelectToConnect
