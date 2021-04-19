import React, { useEffect, useState, useRef } from 'react'

import * as THREE from 'three'
import { OBJLoader } from "three-obj-mtl-loader";
// import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'

// import OBJLoader from "three-obj-loader";
// import * as dat from 'dat.gui'

import styles from './PhoneObj.module.css';

// import matCapTextureFile from './textures/4.png'
// import iphoneModel from './object/iPhone12mini.obj'


const PhoneObj = (props) => {

  const canvasEl = useRef(null);

  let classes = [styles.PhoneObj];
  classes.push(props.className);

  const sizes = {
    width: 800,
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
    // console.log(iphoneModel)
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

    const tick = () => {

      if( iphone ){
        // cube.rotation.x += 0.01;
        iphone.rotation.z += 0.01;
        renderer.render( scene, camera );
      }

      requestAnimationFrame( tick );
    };

    tick();

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
