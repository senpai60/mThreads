import React, { useEffect, useState } from 'react'
import Navbar from './components/layouts/Navbar'
import Home from './components/layouts/Home'
import LoginSignup from './components/auth/LoginSignup'

function App() {
  const [user, setUser] = useState(null)
  useEffect(()=>{
    const loggedInUser = JSON.parse(localStorage.getItem("user"))
    if (loggedInUser) {
      setUser(loggedInUser)
    }
  },[])
  return (
    <div className='text-zinc-200 overflow-x-hidden'>
      <Navbar />
      {user?<Home />:<LoginSignup setUser={setUser} />}
    </div>
  )
}

export default App