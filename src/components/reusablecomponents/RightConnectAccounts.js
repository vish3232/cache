import React, { useState, useContext } from 'react'
import '../reusablecomponentscss/RightConnectAccounts.css'
import Twitter from '../../assets/Twitter.svg'
import Facebook from '../../assets/Facebook.svg'
import Instagram from '../../assets/Instagram.svg'
import LinkedIn from '../../assets/LinkedIn.svg'
import constant from '../../Constant'
import Axios from 'axios'
import jwt_decode from "jwt-decode";
import AppContext from '../../store/DataProvider'

const RightConnectAccounts = (props) => {

    const [user, setuser] = useState(null)
    const context = useContext(AppContext)

    const connectToPages = (facebookUser) => {
        try {
            window.FB.api(`/${facebookUser.userID}/accounts?limit=100`, async (response) => {
                const pages = response.data
                let filterPages = pages.map(async (data) => {
                    let res = await Axios.get(`https://graph.facebook.com/v10.0/${data.id}/picture?redirect=0`)
                    let obj = {
                        id: data.id,
                        name: data.name,
                        access_token: data.access_token,
                        active: false,
                        type: "facebookpage",
                        url: res.data.data.url
                    }
                    return obj
                })
                filterPages = await Promise.all(filterPages)
                context.addConnectAccounts(filterPages)
                context.changeCenterContainer("centerselecttoconnect")
            })
        } catch (error) {
            console.log(error)
        }
    }

    const connectToGroupes = async (facebookUser) => {
        try {
            window.FB.api(`/${facebookUser.userID}/groups?limit=100`, async (response) => {
                const groupes = response.data
                let filterGroupes = groupes.map(async (data) => {
                    let res = await Axios.get(`https://graph.facebook.com/v10.0/${data.id}/picture?redirect=0&access_token=${facebookUser.accessToken}`)
                    let obj = {
                        id: data.id,
                        name: data.name,
                        access_token: facebookUser.accessToken,
                        active: false,
                        type: "facebookgroup",
                        url: res.data.data.url
                    }
                    return obj
                })
                filterGroupes = await Promise.all(filterGroupes)
                context.addConnectAccounts(filterGroupes)
                context.changeCenterContainer("centerselecttoconnect")
            })
        } catch (error) {
            console.log(error)
        }
    }

    const connectToInstagram = async (facebookUser) => {
        try {
            window.FB.api(`/${facebookUser.userID}/accounts?limit=100`, async (response) => {
                const instagramPages = response.data
                for (const data of instagramPages) {
                    const response = await Axios.get(`https://graph.facebook.com/v10.0/${data.id}?fields=instagram_business_account&access_token=${data.access_token}`)
                    if (response.data.instagram_business_account !== undefined) {
                        data.instagram_id = response.data.instagram_business_account.id
                    }
                }

                const filterThePagesHasInstagramId = instagramPages.filter(data => data.instagram_id !== undefined)
                let filterInstagram = filterThePagesHasInstagramId.map(async (data) => {
                    let res = await Axios.get(`https://graph.facebook.com/v10.0/${data.instagram_id}?fields=profile_picture_url,username&access_token=${data.access_token}`)
                    let obj = {
                        id: data.instagram_id,
                        name: res.data.username,
                        access_token: data.access_token,
                        active: false,
                        type: "instagram",
                        url: res.data.profile_picture_url
                    }
                    return obj
                })
                filterInstagram = await Promise.all(filterInstagram)
                context.addConnectAccounts(filterInstagram)
                context.changeCenterContainer("centerselecttoconnect")
            })
        } catch (error) {
            console.log(error)
        }
    }

    const callThePlatform = (value, user) => {
        if (value === "facebookpage") {
            connectToPages(user)
        } else if (value === "facebookgroup") {
            connectToGroupes(user)
        } else {
            connectToInstagram(user)
        }
    }

    const getTheLoneLivedAccessToken = async (facebookUser, value) => {
        try {
            let user = facebookUser
            let res = await Axios.get(`https://graph.facebook.com/v10.0/oauth/access_token?grant_type=fb_exchange_token&client_id=1205114316533718&client_secret=c8201f01c2d1ce03476a0036d8e08792&fb_exchange_token=${user.accessToken}`)
            user.accessToken = res.data.access_token
            callThePlatform(value, user)
            setuser(user)
        } catch (error) {
            console.log(error)
        }
    }

    const connectToFacebook = async (value) => {
        return alert("Currently unavailable")
        /*if(context.userAccounts.length >= 3) return alert("You can't connect more than 3 accounts")
        if (user !== null) return callThePlatform(value, user)
        window.FB.login(response => {
            const facebookUser = response.authResponse
            getTheLoneLivedAccessToken(facebookUser, value)
        }, {
            scope: [
                 "pages_show_list",
                 "public_profile",
                 "pages_read_engagement",
                 "pages_manage_posts",
                 "publish_to_groups",
                 "instagram_content_publish",
                 "instagram_basic",
                 "email"
            ]
        });*/
    }

    const loginWithTwitter = async () => {
        if(context.userAccounts.length >= 3) return alert("You can't connect more than 3 accounts")
        const token = localStorage.getItem('token')
        const decoded = jwt_decode(token);
        window.open(constant.url + "twitter/login/" + decoded.id, "_self");
    }

    const loginWithLinkedIn = () => {
        if(context.userAccounts.length >= 3) return alert("You can't connect more than 3 accounts")
        const token = localStorage.getItem('token')
        const decoded = jwt_decode(token);
        window.open("https://cache.creatosaurus.io/cache/linkedin/login/" + decoded.id, "_self");
    }

    return (
        <div className="right-connect-accounts">
            <div className="title">Connect New</div>
            <button onClick={loginWithTwitter}>
                <img src={Twitter} alt="" />
                <span>Twitter</span>
            </button>
            <button onClick={loginWithLinkedIn}>
                <img src={LinkedIn} alt="" />
                <span>LinkedIn Profile</span>
            </button>
            <button onClick={() => connectToFacebook("instagram")}>
                <img src={Instagram} alt="" />
                <span>Instagram Business</span>
            </button>
            <button onClick={() => connectToFacebook("facebookpage")}>
                <img src={Facebook} alt="" />
                <span>Facebook Page</span>
            </button>
            <button onClick={() => connectToFacebook("facebookgroup")}>
                <img src={Facebook} alt="" />
                <span>Facebook Group</span>
            </button>
            <button>
                <img src={LinkedIn} alt="" />
                <span>LinkedIn Page</span>
            </button>
        </div>
    )
}

export default RightConnectAccounts
