import { Outlet } from 'react-router-dom'
import background from "../../assets/authBackground.jpeg"

const AuthLayout = () => {
    return (
        <main className='flex h-screen'>
            <img src={background} alt='background' className='hidden xl:block h-screen w-1/2 object-cover bg-no-repeat' />

            <section className='flex flex-1 justify-center items-center flex-col py-10'>
                <Outlet />
            </section>
        </main>
    )
}

export default AuthLayout