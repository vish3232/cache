import React, { useEffect } from 'react'
import '../pagesCss/Loading.css'
import Guest from 'cross-domain-storage/guest'
import Logo from '../../assets/Logo.svg'

const Loading = (props) => {

    useEffect(() => {
        localStorage.setItem('token', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc0FkbWluIjp0cnVlLCJ1c2VyTmFtZSI6ImdhaWt3YWRtYXl1cjc0NzQiLCJpZCI6IjYwYzE5Y2FiNjZiNjk2NTMxMWVhNTk0YyIsImlhdCI6MTYyNzgwMzA3NywiZXhwIjoxNjI3ODE3NDc3fQ.mSKGz-Mk9kx7aZYSw9zvK3w26Y93HQSt1dOehBzPCRo")
        props.history.push('/home')
   
        // const token = Guest('https://app.creatosaurus.io/');
        // token.get('token', function (error, value) {
        //     if (!error) {
        //         if (value === null) return window.open('https://app.creatosaurus.io/login?app=cache', "_self")
        //         localStorage.removeItem('token')
        //     } else {
        //         window.open('https://app.creatosaurus.io/login?app=cache', "_self")
        //     }
        // })
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <React.Fragment>
            <nav>
                <div className="row">
                    <img src={Logo} alt="" />
                    <div><span>Creatosaurus</span> | Cache</div>
                </div>
                <div className="circle-container" />
            </nav>

            <div className="loader-container-loading">
                <h1>Loading . . .</h1>
            </div>
        </React.Fragment>
    )
}

export default Loading
