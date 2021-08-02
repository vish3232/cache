import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import jwt_decode from "jwt-decode";

const ProtectedRoutes = ({ component: Component, ...rest }) => {
    return <Route {...rest} render={(props) => {
        const token = localStorage.getItem('token')
        //if token is not there redirect to login
        if (token === null) return <Redirect to={{ pathname: '/', state: { from: props.location } }} />

        //decode the jwt token and check the expiration time
        const decoded = jwt_decode(token);
        const expirationTime = decoded.exp * 1000
        if (Date.now() >= expirationTime) {
            return window.open('https://app.creatosaurus.io/login?app=cache', "_self")
        } else {
            return <Component {...props} />
        }
    }} />
}

export default ProtectedRoutes
