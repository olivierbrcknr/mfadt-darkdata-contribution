import React, {useState, useEffect} from 'react'
import NextHead from 'next/head'
import { string } from 'prop-types'

const Head = props => {

  return (
    <NextHead>

      <link rel="shortcut icon" href="/favicon.ico" />
      <meta charSet="UTF-8" />
      <title>{props.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />

    </NextHead>
  )
}

Head.propTypes = {
  title: string,
  description: string,
  url: string,
  ogImage: string
}

export default Head
