import React, { useEffect, useContext } from 'react'
import AppContext from '../../store/DataProvider'
import queryString from 'query-string'
import { useHistory } from 'react-router-dom'

const Socialauth = (props) => {

    const context = useContext(AppContext)
    const history = useHistory()

    useEffect(() => {
        checkMessage()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps


    const checkMessage = async () => {
        try {
            const url = queryString.parse(props.location.search)
            if (url.error) {
                history.push('/home')
                alert("Authentication Failed")
            } else {
                context.addConnectAccounts([{
                    type: url.type,
                    url: url.url,
                    name: url.name,
                    active: false,
                    id: url.id
                }])
                history.push('/home')
                context.toggleActiveButtonLeft(3)
                context.changeCenterContainer("centerselecttoconnect")
                context.changeRightSideBar("connectaccounts")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <React.Fragment>
        </React.Fragment>
    )
}

export default Socialauth
