import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './Home'
import Form from './Form'
import schemas from './schemas'

function App() {
  return (
    <div id="app">
      <nav>
        {/* NavLinks here */}
        <NavLink to="/">Home</NavLink>
        <NavLink to="/order">Order</NavLink>
      </nav>
      {/* Route and Routes here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
      </Routes>
    </div>
  )
}

export default App
