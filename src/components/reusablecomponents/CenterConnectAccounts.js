import React, { useState, useEffect, useContext } from 'react'
import '../reusablecomponentscss/CenterConnectAccounts.css'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import Twitter from '../../assets/Twitter.svg'
import Axios from 'axios'
import constant from '../../Constant'
import jwt_decode from "jwt-decode";
import AppContext from '../../store/DataProvider'

const CenterConnectAccounts = () => {

    const [loading, setloading] = useState(true)
    const [accounts, setaccounts] = useState([])

    const [removeId, setremoveId] = useState(null)
    const context = useContext(AppContext)

    const getTheUserAccounts = async () => {
        try {
            setloading(true)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const response = await Axios.get(constant.url + "user/accounts/" + decoded.id)
            setaccounts(response.data)
            setloading(false)
        } catch (error) {
            setloading(false)
            console.log(error.response)
        }
    }

    useEffect(() => {
        getTheUserAccounts()
    }, [])

    const removeInstagramAccount = async (data) => {
        try {
            setremoveId(data.id)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const res = await Axios.delete(`${constant.url}facebook/instagram/${data.id}/${decoded.id}`)
            getTheUserAccounts()
            if (res.data === "done") {
                context.checkTheAddedAccountsToScheduleIsRemovedFromConnectinon(data._id)
                context.getUserAccounts()
            }
            setremoveId(null)
        } catch (error) {
            setremoveId(null)
            console.log(error.response)
        }
    }

    const removeTwitterAccount = async (data) => {
        try {
            setremoveId(data.id)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const res = await Axios.delete(`${constant.url}twitter/${decoded.id}`)
            getTheUserAccounts()
            if (res.data === "done") {
                context.checkTheAddedAccountsToScheduleIsRemovedFromConnectinon(data._id)
                context.getUserAccounts()
            }
            setremoveId(null)
        } catch (error) {
            setremoveId(null)
            console.log(error.response)
        }
    }

    const removeLinkedinAccount = async (data) => {
        try {
            setremoveId(data.id)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const res = await Axios.delete(`${constant.url}linkedin/${decoded.id}`)
            getTheUserAccounts()
            if (res.data === "done") {
                context.checkTheAddedAccountsToScheduleIsRemovedFromConnectinon(data._id)
                context.getUserAccounts()
            }
            setremoveId(null)
        } catch (error) {
            setremoveId(null)
            console.log(error.response)
        }
    }

    const removeFacebookPageAccount = async (data) => {
        try {
            setremoveId(data.id)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const res = await Axios.delete(`${constant.url}facebook/page/${data.id}/${decoded.id}`)
            getTheUserAccounts()
            if (res.data === "done") {
                context.checkTheAddedAccountsToScheduleIsRemovedFromConnectinon(data._id)
                context.getUserAccounts()
            }
            setremoveId(null)
        } catch (error) {
            setremoveId(null)
            console.log(error.response)
        }
    }

    const removeFacebookGroupAccount = async (data) => {
        try {
            setremoveId(data.id)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const res = await Axios.delete(`${constant.url}facebook/group/${data.id}/${decoded.id}`)
            getTheUserAccounts()
            if (res.data === "done") {
                context.checkTheAddedAccountsToScheduleIsRemovedFromConnectinon(data._id)
                context.getUserAccounts()
            }
            setremoveId(null)
        } catch (error) {
            setremoveId(null)
            console.log(error)
        }
    }


    const removeAccount = async (data) => {
        if (data.type === "instagram") {
           removeInstagramAccount(data)
        } else if (data.type === "twitter") {
            removeTwitterAccount(data)
        } else if (data.type === "linkedin") {
            removeLinkedinAccount(data)
        } else if (data.type === "facebookpage") {
            removeFacebookPageAccount(data)
        } else {
            removeFacebookGroupAccount(data)
        }
    }

    return (
        <div className="center-connect-accounts">
            {
                loading === true ? <div className="loading"><span>Loading...</span></div> :
                    <React.Fragment>
                        <div className="header">
                            <span className="title">Connected Accounts</span>
                        </div>
                        {
                            accounts.map(data => {
                                return <div key={data._id} className="account-container">
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
                                    <button className="remove" onClick={() => data.id === removeId ? null : removeAccount(data)}>{data.id === removeId ? "Removing ..." : "Remove"}</button>
                                </div>
                            })
                        }
                    </React.Fragment>
            }
        </div>
    )
}

export default CenterConnectAccounts
