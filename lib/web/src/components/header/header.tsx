import * as React from 'react'
import { Nav } from 'react-bootstrap'
import { BsArrowLeft } from 'react-icons/bs'
import { TbWaveSawTool } from 'react-icons/tb'
import { GoGraph } from 'react-icons/go'
import { ImStack } from 'react-icons/im'
import { FaUserCircle } from 'react-icons/fa'

const Header = () => {
  return (
    <div className="bg-surface-primary border-bottom">
      <div className="container-fluid">
        <div className="mb-npx">
          <div className="row">
            <div className="col-md-9">
              <div className="row" style={{ backgroundColor: '#EEEEEE' }}>
                <div className="col-md-1" style={{ width: 60 }}>
                  <BsArrowLeft
                    style={{
                      color: '#0081C9',
                      fontSize: '40px',
                      paddingTop: 5,
                    }}
                  />
                </div>
                <div className="col-md-10 mb-1 mb-sm-0">
                  <span
                    className="font-semibold text-muted  d-block"
                    style={{ textAlign: 'left' }}
                  >
                    IOT PORTAL
                  </span>
                  <span
                    className="font-bold d-block mb-0"
                    style={{ textAlign: 'left', fontWeight: 600 }}
                  >
                    24/7 CloudView
                  </span>
                </div>
                <div className="col-md-1">
                  <FaUserCircle
                    style={{
                      fontSize: '35px',
                      color: '#0081C9',
                      marginLeft: '70px',
                      marginTop: 5,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row" style={{ backgroundColor: '#F6F6F6', paddingLeft: '30px' }}>
            <Nav activeKey="link-1">
              <Nav.Item className="Nav-item">
                <Nav.Link href="/home" disabled>
                  Equipment
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="Nav-item active">
                <Nav.Link eventKey="link-1">
                  <ImStack /> Devices
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="Nav-item">
                <Nav.Link eventKey="link-2" disabled>
                  <TbWaveSawTool /> Live data
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="Nav-item">
                <Nav.Link eventKey="link-2" disabled>
                  <GoGraph /> Statastic
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="Nav-item">
                <Nav.Link eventKey="disabled" disabled>
                  Events
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
