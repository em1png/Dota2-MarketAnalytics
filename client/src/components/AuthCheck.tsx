import { AppDispatch, IUserData } from "@/types/types";
import { fetchAuthMe } from "@/store/slices/authSlice";
import { fetchItems } from "@/store/slices/itemsSlice";
import { PropsWithChildren, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthCheck: React.FC<PropsWithChildren> = ({ children }) => {
    console.log('AuthCheck')
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data: IUserData = await dispatch(fetchAuthMe()).then(data => data.payload as IUserData);

                if (data && data._id) {
                    console.log('User is authenticated');
                    if (window.location.pathname.startsWith('/auth')) {
                        navigate('/');
                    }
                } else {
                    console.log('User is not authenticated');
                    if (!window.location.pathname.startsWith('/auth')) {
                        navigate('/signin');
                    }
                }
                dispatch(fetchItems());

                return false;
            } catch (error) {
                console.error('[AuthProvider] An error occurred:', error);
                return true;
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            checkAuth().then((req) => setIsLoading(req));
        } else {
            const currentPath = window.location.pathname
            if (currentPath != '/signin' && currentPath != '/signup') {
                navigate('/signin');
            }
            setIsLoading(false);
        }
    }, []);

    return (
        <>
            {isLoading
                ?
                <div className="w-[100vw] h-[100vh] flex justify-center items-center">
                    <div className="loader"></div>
                </div>
                : children
            }
        </>
    )
}

export default AuthCheck