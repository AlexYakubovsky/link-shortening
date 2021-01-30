import React, {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext";
import {useHttp} from "../hooks/http.hook";
import {Preloader} from "../components/Preloader";
import {LinksList} from "../components/LinksList";

export const LinksPage = () => {
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [links, setLinks] = useState(null)

    const fetchLinks = useCallback( async () => {
        try {
            const fetched = await request('/api/link', 'GET', null, {
                Authorization: `Bearer ${token}`
            })

            setLinks(fetched)
        } catch (e) {}
    }, [token, request])

    useEffect(() => {
        fetchLinks()
    }, [fetchLinks])

    if (loading) return <Preloader/>

    return (
        <>
            {!loading && links && <LinksList links={links}/>}
        </>
    )
}