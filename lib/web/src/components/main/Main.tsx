import * as React from 'react'
import { FiBell } from 'react-icons/fi'
import { TbWaveSawTool } from 'react-icons/tb'
import { GoPrimitiveDot } from 'react-icons/go'
import { useState, useEffect } from 'react'
import { getDevices } from '../../../util';

function Main() {
  let [time, setTime] = useState('');
  let [today, setDate] = useState('');
  let [connectStatus, setConnectStatus] = useState('');

  useEffect(() => {
    getDevices()
      .then((response) => {
        let result = `-/-`
        if (response.length) {
          let pActive = 0
          let pConnect = 0
          for (let i = 0; i < response.length; i++) {
            if (response[i]['provisionStatus'] === 'Active') {
              pActive++;
            }
            if (response[i]['deviceStatus'] === 'Connect') {
              pConnect++;
            }
          }
          result = `${pConnect}/${pActive}`;
        }
        setConnectStatus(connectStatus);
      })
  }, []);

  setInterval(() => {
    let date = new Date().toISOString().split('T')[0]
    let hr = new Date().getHours()
    let min = new Date().getMinutes()
    let sec = new Date().getSeconds()
    // console.log(`${hr}:${min}:${sec}`);
    setDate(date)
    setTime(`${hr}:${min}:${sec}`)
  }, 1000)
  return (
    <div className="container-fluid">
      <div
        className="row g-6 mb-6"
        style={{ marginLeft: '2rem', marginRight: '2rem' }}
      >
        <div className="col-xl-4 col-sm-6 col-12">
          <div
            className="card border-0"
            style={{ backgroundColor: '#F6F6F6', borderRadius: 0 }}
          >
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                    Device Status
                  </span>
                  <div>
                    <span className="h3 font-bold mb-0">2/2</span>
                  </div>
                  <div className="mt-2 mb-1 text-sm">
                    <span className="text-nowrap text-xs text-muted">
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-sm-6 col-12">
          <div
            className="card border-0"
            style={{ backgroundColor: '#F6F6F6', borderRadius: 0 }}
          >
            <div className="card-body">
              <div className="row">
                <div className="col col-4" style={{ textAlign: 'right' }}>
                  <TbWaveSawTool
                    style={{ fontSize: '80px', paddingTop: '15px', paddingRight: '10px' }}
                  />
                  <GoPrimitiveDot style={{ fontSize: '40px', color: 'green', paddingTop: '10px', paddingRight: '25px' }} />
                </div>
                <div className="col col-8" style={{ textAlign: 'left' }}>
                  <span className="text-muted text-sm d-block mb-0">
                    24/7 CLOUD
                  </span>
                  <div>
                    <span className="font-bold mb-0 mt-0">{today}</span>
                  </div>
                  <div>
                    <span className="font-bold mb-0">{time}</span>
                  </div>
                  <div>
                    <span className="text-nowrap text-xs text-muted mb-2 mt-2">
                      CONNECTED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-sm-6 col-12">
          <div
            className="card border-0"
            style={{ backgroundColor: '#F6F6F6', borderRadius: 0 }}
          >
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <span className="h6 font-semibold text-muted text-sm d-block mb-2">
                    EMERGENCY PHONE STATUS
                  </span>
                  <FiBell style={{ fontSize: '30px' }} />
                </div>
              </div>
              <div className="mt-2 mb-2 text-sm">
                <span className="text-nowrap text-xs text-muted">N/A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
