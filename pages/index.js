// React
import React, { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'


// Components
import Head from '../components/Head'
import Footer from '../components/Footer'
import Data from '../components/Data'
import PhoneObj from '../components/PhoneObj'

// const Data = dynamic(() => import('../components/Data'))

const Home = () => {

  let classes = ['home'];

  const [elTime,setElTime] = useState(0)

  return (
    <div className={classes.join(' ')}>

      <Head title="Home" />

      <div className="wrapper">

        <div className="row">

          <div className="d50">

            <h2>
              iPhone 12 Sensor Data
            </h2>

            <p>
              This is recorded sensor data from an iPhone 12 mini using the <a href="https://apps.apple.com/us/app/sensorlog/id388014573">SensorLo‪g‬</a> app. It represents approximiately an 30 minutes walk. 
            </p>
            <p>
              This data has been trimmed-down and portioned into separate files to make it displayable in a browser.
            </p>
            <p>
              The iPhone model displays the movement, shown in the graph below. It shows a portion of me walking for a bit, waiting at a traffic light. Eventually, one can see how I pick it out of my pocket and holding it in my hand until I look something up.
            </p>

          </div>

          <div className="d50">

            <PhoneObj updateTime={ (t)=>{setElTime(t)} } />

          </div>

        </div>
        
        <Data elTime={elTime} />

        <footer>
          2021 &copy; <a href="https://olivierbrueckner.de/">Olivier Brückner</a>
        </footer>

      </div>
      

    </div>
  )
}

export default Home
