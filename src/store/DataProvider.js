import { createContext, useState } from 'react'
import constant from '../Constant'
import jwt_decode from "jwt-decode";
import Axios from 'axios'

const AppContext = createContext({
    showRightSideBar: "",
    centerContainer: "",
    addedAccountsToSchedule: [],
    addedAccountsToScheduleId: [],
    date: "",
    originalDateValue: null,
    connectAccounts: [],
    activeButtonLeft: 7,
    historyClick: null,
    caption: "",
    images: [],
    imagesFiles: [],
    draft: [],
    queue: [],
    history: [],

    //get user account
    userAccounts: [],
    userAccountsLoading: false,

    //functions
    changeRightSideBar: () => { },
    changeCenterContainer: () => { },
    changeDateTime: () => { },
    addAccountsToSchedule: () => { },
    removeAccountsToSchedule: () => { },
    toggleActiveButtonLeft: () => { },
    addConnectAccounts: () => { },
    checkTheAddedAccountsToScheduleIsRemovedFromConnectinon: () => { },
    showHistoryClickData: () => { },
    removeAllAccountsFromSchedule: () => { },
    changeCaption: () => { },
    changeImage: () => { },
    addAccountsToScheduleFromEdit: () => { },
    getDraft: () => { },
    getQueue: () => { },
    getHistory: () => { },
    getUserAccounts: () => { }
})

export const AppContextProvider = (props) => {

    const [showRightSideBar, setshowRightSideBar] = useState("rightdashboard")
    const [centerContainer, setcenterContainer] = useState("centerdashboard")
    const [addedAccountsToSchedule, setaddedAccountsToSchedule] = useState([])
    const [addedAccountsToScheduleId, setaddedAccountsToScheduleId] = useState([])
    const [date, setdate] = useState("")
    const [originalDateValue, setoriginalDateValue] = useState(null)
    const [connectAccounts, setconnectAccounts] = useState([])
    const [activeButtonLeft, setactiveButtonLeft] = useState(7)
    const [historyClick, sethistoryClick] = useState(null)
    const [caption, setcaption] = useState("")
    const [images, setimages] = useState([])
    const [imagesFiles, setimagesFiles] = useState([])
    const [draft, setdraft] = useState([])
    const [queue, setqueue] = useState([])
    const [history, sethistory] = useState([])

    //get user accounts
    const [userAccounts, setuserAccounts] = useState([])
    const [userAccountsLoading, setuserAccountsLoading] = useState(false)

    const changeRightSideBar = (value) => {
        setshowRightSideBar(value)
    }

    const changeCenterContainer = (value) => {
        setcenterContainer(value)
    }

    const changeDateTime = (value) => {
        if (value === null) {
            setdate(null)
        } else {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
            const date = new Date(value)
            setoriginalDateValue(date)

            const day = days[date.getDay()];
            const month = months[date.getMonth()];
            let hours = date.getHours()
            let minutes = date.getMinutes()

            let ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            const strTime = hours + ':' + minutes + ' ' + ampm;
            setdate(`${day}, ${month} at ${strTime}`)
        }
    }

    const addAccountsToSchedule = (value) => {
        const accountExists = addedAccountsToSchedule.filter(data => data._id === value._id)
        if (accountExists.length === 0) {
            setaddedAccountsToScheduleId([...addedAccountsToScheduleId, value._id])
            setaddedAccountsToSchedule([...addedAccountsToSchedule, value])
        } else {
            const filterAccounts = addedAccountsToSchedule.filter(data => data._id !== value._id)
            const filterExictingAccount = addedAccountsToScheduleId.filter((id) => id !== value._id)
            setaddedAccountsToScheduleId(filterExictingAccount)
            setaddedAccountsToSchedule(filterAccounts)
        }
    }

    const removeAllAccountsFromSchedule = () => {
        setaddedAccountsToSchedule(() => [])
        setaddedAccountsToScheduleId(() => [])
    }

    const addAccountsToScheduleFromEdit = (accounts) => {
        setaddedAccountsToSchedule(accounts)
    }

    const removeAccountsToSchedule = (value) => {
        const filterAccounts = addedAccountsToSchedule.filter(data => data._id !== value._id)
        const filterExictingAccount = addedAccountsToScheduleId.filter((id) => id !== value._id)
        setaddedAccountsToScheduleId(filterExictingAccount)
        setaddedAccountsToSchedule(filterAccounts)
    }

    const toggleActiveButtonLeft = (value) => {
        setactiveButtonLeft(value)
    }

    const addConnectAccounts = (value) => {
        setconnectAccounts(value)
    }

    const checkTheAddedAccountsToScheduleIsRemovedFromConnectinon = (id) => {
        const filterAccounts = addedAccountsToSchedule.filter(data => data._id !== id)
        setaddedAccountsToSchedule(filterAccounts)
    }

    const showHistoryClickData = (account) => {
        sethistoryClick(account)
    }

    const changeCaption = (value) => {
        setcaption(value)
    }

    const changeImage = (image, imageFile) => {
        setimages(image)
        setimagesFiles(imageFile)
    }

    const getHistory = async () => {
        try {
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token)
            const res = await Axios.get(constant.url + "post/history/" + decoded.id)
            sethistory(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getQueue = async () => {
        try {
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token)
            const res = await Axios.get(constant.url + "post/queue/" + decoded.id)
            setqueue(res.data)
        } catch (error) {
            console.log(error.response)
        }
    }

    const getDraft = async () => {
        try {
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token)
            const res = await Axios.get(constant.url + "post/draft/" + decoded.id)
            setdraft(res.data)
        } catch (error) {
            console.log(error.response)
        }
    }

    const getUserAccounts = async () => {
        try {
            setuserAccountsLoading(true)
            const token = localStorage.getItem('token')
            const decoded = jwt_decode(token);
            const response = await Axios.get(constant.url + "user/accounts/" + decoded.id)
            setuserAccounts(response.data)
            setuserAccountsLoading(false)
        } catch (error) {
            setuserAccountsLoading(false)
            console.log(error)
        }
    }

    const context = {
        //state
        showRightSideBar: showRightSideBar,
        centerContainer: centerContainer,
        addedAccountsToSchedule: addedAccountsToSchedule,
        addedAccountsToScheduleId: addedAccountsToScheduleId,
        date: date,
        originalDateValue: originalDateValue,
        connectAccounts: connectAccounts,
        activeButtonLeft: activeButtonLeft,
        historyClick: historyClick,
        caption: caption,
        images: images,
        imagesFiles: imagesFiles,
        queue: queue,
        draft: draft,
        history: history,

        //user account
        userAccounts: userAccounts,
        userAccountsLoading: userAccountsLoading,

        //functions
        changeRightSideBar: changeRightSideBar,
        changeCenterContainer: changeCenterContainer,
        changeDateTime: changeDateTime,
        addAccountsToSchedule: addAccountsToSchedule,
        removeAccountsToSchedule: removeAccountsToSchedule,
        toggleActiveButtonLeft: toggleActiveButtonLeft,
        addConnectAccounts: addConnectAccounts,
        checkTheAddedAccountsToScheduleIsRemovedFromConnectinon: checkTheAddedAccountsToScheduleIsRemovedFromConnectinon,
        showHistoryClickData: showHistoryClickData,
        removeAllAccountsFromSchedule: removeAllAccountsFromSchedule,
        changeCaption: changeCaption,
        changeImage: changeImage,
        addAccountsToScheduleFromEdit: addAccountsToScheduleFromEdit,
        getQueue: getQueue,
        getDraft: getDraft,
        getHistory: getHistory,
        getUserAccounts: getUserAccounts,
    }

    return <AppContext.Provider value={context}>
        {props.children}
    </AppContext.Provider>
}

export default AppContext