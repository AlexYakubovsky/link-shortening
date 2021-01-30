import {useCallback, useEffect, useState} from "react";

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUsedId] = useState(null)
    const [isReady, setIsReady] = useState(false)

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setUsedId(id)

        localStorage.setItem(storageName, JSON.stringify({
            token: jwtToken,
            userId: id}))

    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUsedId(null)

        localStorage.removeItem(storageName)
    }, [])

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem(storageName))

        if (userData && userData.token) {
            login(userData.token, userData.userId)
        }

        setIsReady(true)
    }, [login])

    return {login, logout, token, userId, isReady}
}