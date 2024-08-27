"use client"
import { ExitIcon } from '@radix-ui/react-icons'
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "./ui/button"
import { signout } from "@/store/slices/authSlice"
import { RootState } from "@/types/types"

import logo from "../assets/logo.png"

export function TopBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className='min-h-screen flex flex-col'>
      <header className="py-3 border-b border-secondary mb-5">
        <div className="container flex items-center ">

          <Button size={'icon'} variant={'ghost'} className='mr-2 p-2'>
            <Link to='/' className="flex items-center">
              <img src={logo} alt="logo" className="w-[25px] cursor-pointer" />
            </Link>
          </Button>

          <nav className="flex-1 flex justify-start text-white/90">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/items" className={navigationMenuTriggerStyle()}>
                    Все предметы
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/rating" className={navigationMenuTriggerStyle()}>
                    Рейтинг
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/myitems" className={navigationMenuTriggerStyle()}>
                    Мои предметы
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/myheroes" className={`${navigationMenuTriggerStyle()}`}>
                    Мои герои
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="flex justify-center items-center gap-3 pl-10">
            <Link to={'/myprofile'}>
              <Button variant={'outline'}>
                {useSelector((store: RootState) => store.user.data?.username || 'None')}
              </Button>
            </Link>

            <Button variant={"outline"} className="flex gap-2" onClick={() => {
              dispatch(signout());
              navigate('/signin')
            }}>
              <ExitIcon />

            </Button>
          </div>
        </div>
      </header>

      <main className='flex-1'>
        <Outlet />
      </main>


      <footer className='py-5 border-t border-neutral-900'>
        <div className='container flex-col-center gap-2 text-xs'>
          <p>Связаться со мной..</p>
          <div className='flex-center border border-neutral-800 px-5 py-1 rounded-md'>
            <p className='border-r border-neutral-800 pr-5'>Discord ° <span className='font-semibold'>em1.png</span></p>
            <a href='https://t.me/em1png' className='pl-5'>Telegram ° <span className='font-semibold '>em1png</span></a>
          </div>

        </div>
      </footer>
    </div>
  )
}