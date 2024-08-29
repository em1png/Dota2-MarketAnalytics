import { Route, Routes } from "react-router-dom"
import { TopBar } from "./components/TopBar"
import { Toaster } from "@/components/ui/toaster"

import { Home, Item, ItemsAll, ItemsRating, MyHeroes, MyItems, MyProfile, AuthLayout, SignIn, SignUp, AdminPanel } from "./pages"

function App() {
  return (
    <>
      <main>
        <div className="hidden lg:block">
          <Routes>
            <Route element={<TopBar />}>
              <Route index element={<Home />} />
              <Route path="/rating" element={<ItemsRating />} />
              <Route path="/items" element={<ItemsAll />} />
              <Route path="/myprofile" element={<MyProfile />} />
              <Route path="/myitems" element={<MyItems />} />
              <Route path="/myheroes" element={<MyHeroes />} />
              <Route path="/item/:itemID" element={<Item />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path='/signin' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
            </Route>
          </Routes>
          <Toaster />
        </div>

        <div className="lg:hidden w-[100vw] h-[100vh] flex-center overflow-hidden bg-gradient-to-t from-zinc-900">
          <span className="font-semibold text-xl underline decoration-wavy underline-offset-8">❌ Unsupported resolution 😕</span>
        </div>
      </main>
    </>
  )
}

export default App
