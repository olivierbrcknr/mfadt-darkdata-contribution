import React, { useEffect, useState, useRef } from 'react'

import * as THREE from 'three'
import { OBJLoader } from "three-obj-mtl-loader";
// import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

// import OBJLoader from "three-obj-loader";
// import * as dat from 'dat.gui'

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

    // const geometry = new THREE.BoxGeometry( 2.82, 5.78, 0.29 );
    // const cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

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
    const maxTime = movementLog[movementLog.length-1].ts

    const getAnimation = (elapsedTime) => {
      
      let foundNew = false

      if( elapsedTime > maxTime ){
        animCount++
      }

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
      const calcElapsedTime = elapsedTime - ( animCount * maxTime * 60000 )

      if( iphone ){

        getAnimation( calcElapsedTime )
        iphone.quaternion.copy( prevLog )

        // cube.rotation.x += 0.01;
        // iphone.quaternion.w = movementLog[frame].quatW;
        // iphone.quaternion.x = movementLog[frame].quatX;
        // iphone.quaternion.y = movementLog[frame].quatY ;
        // iphone.quaternion.z = movementLog[frame].quatZ;
        renderer.render( scene, camera );

        // frame++
        // if( frame >= maxMove ){
        //   frame = 0
        // }
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
