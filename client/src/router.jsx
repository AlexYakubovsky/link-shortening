import React from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import {LinksPage} from "./pages/LinksPage";
import {CreatePage} from "./pages/CreatePage";
import {DetailPage} from "./pages/DetailPage";
import {AuthPage} from "./pages/AuthPage";

export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path='/create' exact component={CreatePage}/>
                <Route path='/links' exact component={LinksPage}/>
                <Route path='/detail/:id' component={DetailPage}/>
                <Redirect to='/create'/>
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path='/' exact component={AuthPage}/>
            <Redirect to='/'/>
        </Switch>
    )
}