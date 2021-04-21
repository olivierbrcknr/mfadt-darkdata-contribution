import React, { useEffect, useState, useRef } from 'react'

import * as THREE from 'three'
import { OBJLoader } from "three-obj-mtl-loader";

import styles from './PhoneObj.module.css';

import movementLog from './iPhoneMovement.json'


const PhoneObj = (props) => {

  const canvasEl = useRef(null);

  let classes = [styles.PhoneObj];
  classes.push(props.className);

  const maxMove = movementLog.length

  const sizes = {
    width: 600,
    height: 400
  }

  // component did mount
  useEffect(()=>{

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera( 45, sizes.width/sizes.height, 0.1, 100 );
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasEl.current,
      antialias: true,
      alpha: true,
    });

    renderer.setSize( sizes.width, sizes.height );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const textureLoader = new THREE.TextureLoader()
    const objLoader = new OBJLoader();

    const matCapTexture = textureLoader.load('matcap/blue.jpg')

    const material = new THREE.MeshMatcapMaterial();
    material.matcap = matCapTexture

    let iphone = null;

    objLoader.load(
      'objects/iPhone12mini.obj',
      ( object ) => {

        iphone = object;
        object.scale.set( 0.05,0.05,0.05 );
        object.rotation.x = Math.PI / 2

        object.traverse( function ( child ) {
          if ( child instanceof THREE.Mesh ) {
            child.material = material;
          }
        });

        scene.add( object );
      },
    );

    const clock = new THREE.Clock()
    let previousTime = 0
    const fps = 30
    let frame = 0

    let prevLogIndex = 0
    let prevLog = {
      w: 0,
      x: 0,
      y: 0,
      z: 0
    }

    let animCount = 0
    const startTime = movementLog[0].ts
    const maxTime = movementLog[movementLog.length-1].ts

    const getAnimation = (elapsedTime) => {
      
      let foundNew = false

      if( elapsedTime > maxTime ){
        animCount++
        prevLogIndex = 0
      }else{
        // only loop if not over time
        if( movementLog && movementLog.length > 0 ){

          for( let i = prevLogIndex; i <= movementLog.length; i++ ){

            if( movementLog[i] && movementLog[i].ts >= elapsedTime && !foundNew ){
              foundNew = true
              prevLogIndex = i
              prevLog = {
                w: movementLog[i].quatW,
                x: movementLog[i].quatX,
                y: movementLog[i].quatY,
                z: movementLog[i].quatZ
              }
              props.updateTime( elapsedTime )
            }
          }
        }
      }
    }

    const updateSizes = () => {

      // Update sizes
      sizes.width = window.innerWidth > 600 ? 600 : window.innerWidth - 20
      sizes.height = window.innerWidth > 600 ? 400 : 300

      // Update camera
      camera.aspect = sizes.width / sizes.height
      camera.updateProjectionMatrix()

      // Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    }

    updateSizes()

    window.addEventListener('resize', () => {
      updateSizes()
    })

    const tick = () => {

      const elapsedTime = clock.getElapsedTime()
      const calcElapsedTime = elapsedTime + startTime - ( animCount * (maxTime - startTime) ) 

      if( iphone ){
        getAnimation( calcElapsedTime )
        iphone.quaternion.copy( prevLog )
        renderer.render( scene, camera );
      }

      setTimeout( ()=>{
        requestAnimationFrame( tick );
      }, 1000 / fps)
    }

    tick()

  }, [])

  return (
    <canvas
      ref={canvasEl}
      width={sizes.width}
      height={sizes.height}
      className={classes.join(" ")}
    ></canvas>
  )
}

export default PhoneObj
