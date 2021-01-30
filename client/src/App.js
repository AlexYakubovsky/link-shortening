import React from "react";
import {AuthContext} from "./context/AuthContext";
import {BrowserRouter} from "react-router-dom";
import {useRoutes} from "./router";
import {useAuth} from "./hooks/auth.hook";
import {Navbar} from "./components/Navbar";
import {Preloader} from "./components/Preloader";
import "materialize-css";

function App() {
    const {login, logout, token, userId, isReady} = useAuth()
    const isAuthenticated = !!token
    const routes = useRoutes(isAuthenticated)

    if (!isReady) return <Preloader/>

    return (
        <AuthContext.Provider value={{login, logout, token, userId, isAuthenticated}}>
            <BrowserRouter>
                {isAuthenticated && <Navbar/>}
                <div className={'container'}>
                    {routes}
                </div>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;
