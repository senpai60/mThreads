import React from 'react'
import Navbar from './components/layouts/Navbar'
import Home from './components/layouts/Home'
import LoginSignup from './components/auth/LoginSignup'

function App() {
  return (
    <div className='text-zinc-200 overflow-x-hidden'>
      <Navbar />
      <Home />
      <LoginSignup />``
    </div>
  )
}

export default App