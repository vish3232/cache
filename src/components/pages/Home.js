import React, { useContext, useEffect } from "react";
import "../pagesCss/Home.css";
import Center from "../reusablecomponents/Center";
import Leftsidebar from "../reusablecomponents/Leftsidebar";
import Navbar from "../reusablecomponents/Navbar";
import Rightsidebar from "../reusablecomponents/Rightsidebar";
import AppContext from '../../store/DataProvider'

const Home = () => {

    const context = useContext(AppContext)

    useEffect(() => {
        context.changeDateTime(new Date())
    }, [])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <React.Fragment>
            <Navbar />
            <main>
                <Leftsidebar />
                <Center/>
                <Rightsidebar/>
            </main>
        </React.Fragment>
    );
};

export default Home;
