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

  return (
    <div className={classes.join(' ')}>

      <Head title="Home" />

      {/* <PhoneObj /> */}

      <div className="wrapper">

        <h2>
          iPhone 12 Sensor Data
        </h2>

        <p>
          This is recorded sensor data from an iPhone 12 mini using the <a href="https://apps.apple.com/us/app/sensorlog/id388014573">SensorLo‪g‬</a> app. It represents approximiately an 30 minutes walk. 
        </p>
        <p>
          This data has been trimmed-down and portioned into separate files to make it displayable in a browser.
        </p>
        
        <Data />

        <footer>
          2021 &copy; <a href="https://olivierbrueckner.de/">Olivier Brückner</a>
        </footer>

      </div>
      

    </div>
  )
}

export default Home
