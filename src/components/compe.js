import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Compe = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    (async() => {
      let a = await axios.get('https://raw.githubusercontent.com/nychealth/coronavirus-data/master/by-sex.csv')
      let res = await a.data
      
      let
        dump = [],
        lines = res.replace(/"/g, '').split('\n'),
        headers = lines[0].toLowerCase().split(',')

      for (let i = 1; i < lines.length; i++) {
        let
          obj = {},
          curLine = lines[i].split(',')

        if (curLine[0].match(/Citywide\s\S+/gi)) continue

        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = curLine[j]
        }

        dump.push(obj)
      }

      setData(lines)
    })()
  }, [])

  return (
    <>
      nada
    </>
  )
}

export default Compe
