import { useEffect, createContext, ReactNode, useState } from "react";
import { auth, firebase } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}


export const AuthContext = createContext({} as AuthContextType);

type AuthContextProviderProps = {
    children: ReactNode;
}

export function AuthContextProvider(props: AuthContextProviderProps) {


    const [user, setUser] = useState<User>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {

            if (user) {
                const { displayName, photoURL, uid } = user

                if (!displayName || !photoURL) {
                    throw new Error('Missing information from Google Account.');
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        })

        return () => {
            unsubscribe();
        }
    }, [])

    async function signInWithGoogle() {

        const provider = new firebase.auth.GoogleAuthProvider();

        //abra o login do google como um popup
        const result = await auth.signInWithPopup(provider);

        //assim que usuário fizer login
        if (result.user) {
            const { displayName, photoURL, uid } = result.user

            if (!displayName || !photoURL) {
                throw new Error('Missing information from Google Account.');
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }

    return (

        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}