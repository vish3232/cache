import React, { useEffect, useState, useContext } from 'react'
import '../reusablecomponentscss/RightSocialAccounts.css'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import Twitter from '../../assets/Twitter.svg'
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import constant from '../../Constant'
import AppContext from '../../store/DataProvider'

const RightSocialAccounts = () => {

    const [loading, setloading] = useState(true)
    const [accounts, setaccounts] = useState([])
    const context = useContext(AppContext)

    useEffect(() => {
        getTheUserAccounts()
    }, [])

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
            console.log(error)
        }
    }

    return (
        <div className="social-accounts">
            <div className="title">Select your social account</div>
            {
                loading === true ? <div className="loading"><span>Loading...</span></div> :
                    <div>
                        {
                            accounts.map(data => {
                                return <button key={data._id} onClick={() => context.addAccountsToSchedule(data)}
                                    style={context.addedAccountsToScheduleId.includes(data._id) ? data.type === "instagram" ? { backgroundColor: 'rgba(225, 48, 108, 0.1)' } : data.type === "twitter" ? { backgroundColor: 'rgba(67, 221, 255, 0.1)' } : data.type === "linkedin" ? { backgroundColor: 'rgba(0, 114, 177, 0.1)' } : { backgroundColor: 'rgba(66, 103, 178, 0.1)' } : null}>
                                    <div className="image-container">
                                        <img src={data.url} alt="" />
                                        <img className="mini-image"
                                            src={data.type === "instagram" ? Instagram : data.type === "twitter" ? Twitter : data.type === "linkedin" ? LinkedIn : Facebook}
                                            alt="" />
                                    </div>
                                    <span>{data.name}</span>
                                </button>
                            })
                        }
                    </div>
            }
        </div>
    )
}

export default RightSocialAccounts
