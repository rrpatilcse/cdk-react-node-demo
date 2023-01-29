import { useState, useEffect } from 'react'
import * as React from 'react'
import { Col, Row } from 'react-bootstrap'
import { GoPrimitiveDot } from 'react-icons/go'
import { IoIosArrowForward } from 'react-icons/io'
import { getDevices } from '../../../../util'

interface Device {
  deviceStatus: string
  deviceId: string
  equipmentNumber: string
  deviceType: string
  provisionStatus: string
  swVersion: string
}

let state: Device[] = []

function getStatus() {
  let result = `-/-`
  if (state.length) {
    let pActive = 0
    let pConnect = 0
    for (let i = 0; i < state.length; i++) {
      if (state[i]['provisionStatus'] === 'Active') {
        pActive++;
      }
      if (state[i]['deviceStatus'] === 'Connect') {
        pConnect++;
      }
    }
    result = `${pConnect}/${pActive}`;
  }
  return result
}

function Listing() {
  
  const [state, setDevices] = useState([])
  useEffect(() => {
    getDevices().then((response) => setDevices(response))
  }, []);

  return (
    <div className="card border-0 mb-7">
      {state.length &&
        state.map((data: Device) => (
          <div
            className="card-header"
            style={{
              backgroundColor: '#ffffff',
              border: '0px',
            }}
          >
            <Row
              style={{
                marginLeft: data.deviceStatus === 'Connect' ? 'auto' : '25px',
                backgroundColor: '#F6F6F6',
                paddingBottom: '5px',
                paddingTop: '5px',
              }}
            >
              {data.deviceStatus === 'Connect' && (
                <Col
                  className="col-6 col-sm-1"
                  style={{ width: 20, marginTop: '15px' }}
                >
                  <GoPrimitiveDot style={{ color: 'green' }} />
                </Col>
              )}

              <Col
                className="col-6 col-sm-1"
                style={{ width: 100, textAlign: 'left', marginTop: '15px' }}
              >
                <span className="font-bold mb-0" style={{ textAlign: 'left' }}>
                  {data.deviceId}
                </span>
              </Col>
              <Col style={{ textAlign: 'left' }}>
                <span className="font-semibold text-muted  d-block mb-2">
                  SERIAL NUMBER
                </span>{' '}
                <span className="font-bold mb-0">{data.equipmentNumber}</span>
              </Col>
              <Col style={{ textAlign: 'left' }}>
                {data.deviceStatus && (
                  <React.Fragment>
                    <span className="font-semibold text-muted  d-block mb-2">
                      STATUS
                    </span>{' '}
                    <span className="font-bold mb-0">{data.deviceStatus}</span>
                  </React.Fragment>
                )}
              </Col>

              <Col style={{ textAlign: 'left' }}>
                <span className="font-semibold text-muted  d-block mb-2">
                  TYPE ID
                </span>{' '}
                <span className="font-bold mb-0">{data.deviceType}</span>
              </Col>
              <Col style={{ textAlign: 'left' }}>
                {data.provisionStatus && (
                  <React.Fragment>
                    <span className="font-semibold text-muted  d-block mb-2">
                      PROVISION STATUS
                    </span>{' '}
                    <span className="font-bold mb-0">
                      {data.provisionStatus}
                    </span>
                  </React.Fragment>
                )}
              </Col>
              <Col style={{ textAlign: 'left' }}>
                <span className="font-semibold text-muted  d-block mb-2">
                  FW_VERSION
                </span>{' '}
                <span className="font-bold mb-0">{data.swVersion}</span>
              </Col>
              <Col>
                <IoIosArrowForward
                  style={{
                    float: 'right',
                    color: '#0081C9',
                    fontSize: '30px',
                    marginTop: '15px',
                  }}
                />
              </Col>
            </Row>
          </div>
        ))}
    </div>
  )
}

export default Listing;