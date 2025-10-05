import React from 'react'
import Navbar from './components/layouts/Navbar'
import Home from './components/layouts/Home'

function App() {
  return (
    <div className='text-zinc-200 overflow-x-hidden'>
      <Navbar />
      <Home />
    </div>
  )
}

export default App