import React from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './components/header/header'
import Main from './components/main/Main'
import Listing from './components/main/List/List'

function App() {
  return (
    <div className="App">
      <div className="d-flex flex-column flex-lg-row h-lg-full bg-surface-secondary">
        <div className="h-screen flex-grow-1 overflow-y-lg-auto bg-white">
          <Header />
          <div
            className="row mx-12"
            style={{
              fontWeight: 600,
              fontSize: '20px',
            }}
          >
            Devices
          </div>
          <br />
          <div className="row">
            <Main />
          </div>
          <div
            className="row mx-12"
            style={{
              fontWeight: 500,
              fontSize: '17px',
            }}
          >
            Installed Devices
          </div>
          <div
            style={{
              marginLeft: '3rem',
              marginRight: '3rem',
              marginTop: '1rem',
            }}
          >
            <Listing />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
