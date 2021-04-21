import React, {useState, useEffect} from 'react'
import Link from 'next/link'

import {ScatterChart,ResponsiveContainer,ComposedChart,LineChart,XAxis,YAxis,Label,CartesianGrid,Line,Tooltip,Legend,ReferenceLine} from 'recharts'

import styles from './Data.module.css';

import accLog from './logs/accelerometer.json'
import activityLog from './logs/activity.json'
import altiLog from './logs/altimeter.json'
import audioLog from './logs/audio.json'
import batteryLog from './logs/battery.json'
import gyroLog from './logs/gyro.json'
import locationLog from './logs/location.json'
import magnetLog from './logs/magnet.json'
import motionLog from './logs/motion.json'
import orientationLog from './logs/orientation.json'
import pedometerLog from './logs/pedometer.json'

// const animationUpdateTime = 1; // in sec
// const maxTimeInSec = 379; // from iPhoneMovement.json

const Data = (props) => {

  const [graphSelection,setGraphSelection] = useState('accelerometer')
  // const [frame,setFrame] = useState(0)

  // const updateFrame = () => {

  //   console.log("updateFrame")

  //   let dummyFrame = frame
  //   dummyFrame += animationUpdateTime / 60 // add one second

  //   if( dummyFrame > maxTimeInSec ){
  //     dummyFrame = 0
  //   }

  //   setFrame( dummyFrame )
  // }

  // useEffect( ()=>{
  //   setTimeout( updateFrame, animationUpdateTime * 1000 )
  // }, [frame] )

  let classes = [styles.Data];
  classes.push(props.className);

  const colors = {
    blue: '#00f',
    red: '#D95555',
    green: '#7BF6E0'
  }

  let displayGraph = null;

  const elTimeInMin = props.elTime / 60;

  const basicSetup = [
    <XAxis key="xAxis" dataKey="ts" type="number" name="Minutes" tickCount={30} domain={['dataMin', 'dataMax']} interval="preserveStart" >
      <Label value="Minutes" offset={0} position="insideBottomRight" />  
    </XAxis>,
    <CartesianGrid key="Grid" stroke="#eee"/>,
    <Tooltip key="Tooltip" contentStyle={{fontSize: 12+'px'}} />,
    <Legend key="Legend" iconType={"rect"} margin={{bottom:20}} verticalAlign="top" align="right"  />,
    <ReferenceLine key="Animation" alwaysShow stroke="red" strokeDasharray="3 3" x={elTimeInMin} />
  ];

  const yAxisPosition = "insideLeft";

  switch( graphSelection ){

    default:
    case 'accelerometer':
      displayGraph =
        <ResponsiveContainer >
          <LineChart data={accLog}>
            
            {basicSetup}

            <YAxis type="number">
              <Label value="Gravitational Force in G (9.81 m/s²)" offset={0} position={yAxisPosition} angle="-90" />  
            </YAxis>
            
            <Line type="monotone" isAnimationActive={false} dataKey="x" stroke={colors.red} dot={false} />
            <Line type="monotone" isAnimationActive={false} dataKey="y" stroke={colors.green} dot={false} />
            <Line type="monotone" isAnimationActive={false} dataKey="z" stroke={colors.blue} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      break;

      case 'activity':
      displayGraph = 
        <ResponsiveContainer>
          <ComposedChart data={activityLog}>

            {basicSetup}

            <YAxis type="number" >
              {/* <Label value="kPa" offset={0} position={yAxisPosition} angle="-90" />  */}
            </YAxis>

            <Line type="monotone" isAnimationActive={false} dataKey="confidence" stroke={colors.blue} dot={false} />
            <Line type="monotone" isAnimationActive={false} dataKey="type" stroke={colors.red} dot={false} />

          </ComposedChart>
        </ResponsiveContainer>
      break;

      case 'altimeter':
        displayGraph =
          <ResponsiveContainer>
            <LineChart data={altiLog}>

              {basicSetup}

              <YAxis type="number" domain={[95, 96]}>
                <Label value="kPa" offset={0} position={yAxisPosition} angle="-90" />  
              </YAxis>

              <Line type="monotone" isAnimationActive={false} dataKey="pressure" stroke={colors.blue} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        break;
  
      case 'audio':
        displayGraph = 
          <ResponsiveContainer>
            <LineChart data={audioLog}>
              
              {basicSetup}

              <YAxis type="number" domain={[-60,0]}>
                <Label value="db" offset={0} position={yAxisPosition} angle="-90" />  
              </YAxis>

              <ReferenceLine label="My Average Room level" strokeDasharray="1 3" stroke={colors.red} y={-30} />

              <Line type="monotone" isAnimationActive={false} dataKey="peakP" name="db Peak" stroke={colors.green} dot={false} />
              <Line type="monotone" isAnimationActive={false} dataKey="avgP" name="Average Power" stroke={colors.blue} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        break;

      case 'battery':
        displayGraph = 
          <ResponsiveContainer>
            <LineChart data={batteryLog}>
              
              {basicSetup}

              <YAxis type="number" domain={[0,1]}>
                <Label value="Battery Charge" offset={0} position={yAxisPosition} angle="-90" />  
              </YAxis>

              <Line type="monotone" isAnimationActive={false} dataKey="level" stroke={colors.blue} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        break;

      case 'location':
        displayGraph = 
          <ResponsiveContainer>
            <LineChart data={locationLog}>
              
              {basicSetup}

              <YAxis type="number" domain={[-1,600]} ticks={[0,200,400,600]}>
                <Label value="Speed [m/s] / Altitude [m] / Course [°]" offset={0} position={yAxisPosition} angle="-90" />
              </YAxis>

              <Line type="monotone" isAnimationActive={false} name="Speed [m/s]" dataKey="speed" stroke={colors.blue} dot={false} />
              <Line type="monotone" isAnimationActive={false} name="Altitude [m]" dataKey="altitude" stroke={colors.red} dot={false} />
              <Line type="monotone" isAnimationActive={false} name="Course [°]" dataKey="course" stroke={colors.green} dot={false} />

            </LineChart>
          </ResponsiveContainer>
        break;

      case 'gyro':
        displayGraph = 
          <ResponsiveContainer>
            <LineChart data={gyroLog}>
              
              {basicSetup}

              <YAxis type="number" domain={[-8, 8]}>
                <Label value="rad/s" offset={0} position={yAxisPosition} angle="-90" />  
              </YAxis>

              <Line type="monotone" isAnimationActive={false} dataKey="x" stroke={colors.red} dot={false} />
              <Line type="monotone" isAnimationActive={false} dataKey="y" stroke={colors.green} dot={false} />
              <Line type="monotone" isAnimationActive={false} dataKey="z" stroke={colors.blue} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        break;

      case 'magnet':
        displayGraph =
          <ResponsiveContainer>
            <LineChart data={magnetLog}>
              
              {basicSetup}

              <YAxis type="number" domain={[-360, 360]} interval={0} tickCount={5}>
                <Label value="μT" offset={0} position={yAxisPosition} angle="-90" />  
              </YAxis>

              <Line type="monotone" isAnimationActive={false} dataKey="magHead" name="Magnetic North [°]" stroke={colors.blue} dot={false} />

              <Line type="monotone" strokeDasharray="10 3" isAnimationActive={false} dataKey="x" stroke={colors.green} dot={false} />
              <Line type="monotone" strokeDasharray="3 3" isAnimationActive={false} dataKey="y" stroke={colors.green} dot={false} />
              <Line type="monotone" strokeDasharray="5 3" isAnimationActive={false} dataKey="z" stroke={colors.green} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        break;

      case 'motion':
        displayGraph = 
          <ResponsiveContainer>
            <LineChart data={motionLog}>
              
              {basicSetup}

              <YAxis type="number" domain={[-1,1]}>
                {/* 
                  <Label value="μT" offset={0} position={yAxisPosition} angle="-90" />  
                */}
              </YAxis>

              <Line type="monotone" isAnimationActive={false} dataKey="x" stroke={colors.red} dot={false} />
              <Line type="monotone" isAnimationActive={false} dataKey="y" stroke={colors.green} dot={false} />
              <Line type="monotone" isAnimationActive={false} dataKey="z" stroke={colors.blue} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        break;

      case 'pedometer':
        displayGraph = 
          <ResponsiveContainer>
            <ComposedChart data={pedometerLog}>

              {basicSetup}

              <YAxis type="number" domain={[0,2]} allowDecimals={false} allowDataOverflow={true} >
                <Label value="s/m or steps/s" offset={0} position={yAxisPosition} angle="-90" />  
              </YAxis>

              <Line type="monotone" isAnimationActive={false} dataKey="pace" name="Current Pace [s/m]" stroke={colors.red} dot={false} />
              <Line type="monotone" isAnimationActive={false} dataKey="avgPace" name="Average Pace [s/m]" stroke={colors.green} dot={false} />
              <Line type="monotone" isAnimationActive={false} dataKey="cadence" name="Cadence [steps/s]" stroke={colors.blue} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        break;
  }

  return (
    <div className={classes.join(" ")}>


      <div className={styles.graphHeader}>
        <label htmlFor="iphoneLogs" className={styles.dataSelector}>
          Dataset: 
        
          <select name="iphoneLogs" id="iphoneLogs" onChange={(e)=>{setGraphSelection(e.target.value)}}>
            <option value="accelerometer">Accelerometer</option>
            <option value="altimeter">Altimeter</option>
            <option value="audio">Microphone</option>
            <option value="battery">Battery</option>
            <option value="gyro">Gyrosensor</option>
            <option value="magnet">Magnetometer</option>

            <option value="motion">Motion (computed)</option>
            <option value="location">Location (computed)</option>
            <option value="activity">Activity (computed)</option>
            <option value="pedometer">Pedometer (computed)</option>
          </select>
        </label>
      </div>

      
      <div className={styles.logChart}>
        {displayGraph}
      </div>

    </div>
  )
}

export default Data
