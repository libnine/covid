import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Bar } from '@vx/shape'
import { Group } from '@vx/group'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { LinearGradient } from '@vx/gradient'
import { scaleBand, scaleLinear } from '@vx/scale'

const Compb = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    (async() => {
      let a = await axios.get('https://raw.githubusercontent.com/nychealth/coronavirus-data/master/boro.csv')
      let res = await a.data

      let 
        dump = [],
        lines = res.replace('The ', '').split('\r'),
        headers = lines[0].split(',')
    
      for (let i = 1; i < lines.length; i++) {
        let 
          obj = {},
          line = lines[i].replace('\n', ''),
          curLine = line.split(',')

        if (curLine[0] === 'Citywide') continue
    
        for (var j = 0; j < headers.length; j++) {
          obj[headers[j].toLowerCase()] = curLine[j]
        }
    
        dump.push(obj)
      }

      setData(dump)
    })()
  }, [])

  const 
    x = d => d.borough_group,
    y = d => d.covid_case_count,
    width = 650,  
    height = 400,
    xMax = width,
    yMax = height - 100

  const xScale = scaleBand({
    rangeRound: [0, xMax],
    domain: data.map(x),
    padding: 0.4
  })

  const yScale = scaleLinear({
    rangeRound: [yMax, 0],
    domain: [0, Math.max(...data.map(y))]
  })

  return (
    <>
      <div className="svgWrapper">
        <svg width={width} height={height}>
        <LinearGradient 
            from="#fbc2eb" 
            to="#ede1ed" 
            id="gradient"/>
        <LinearGradient 
            from="#736ca3" 
            to="#b8c1e3" 
            id="gradient-2"/>
          <rect width={width} height={height} fill="url(#gradient)" rx={14} />
          <Group top={40}>
            {data.map((d) => {
              const 
                boro = x(d),
                barWidth = xScale.bandwidth(),
                barHeight = yMax - yScale(y(d)),
                barX = xScale(boro),
                barY = yMax - barHeight

              return (
                <Group>
                  <Bar
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill="url(#gradient-2)"
                    rx={5}
                  />
                  <text
                    x={xScale(x(d))}
                    y={yMax - barHeight}
                    dx={"5%"}
                    dy={"-2%"}
                    textAnchor="middle"
                    fill="#53486b"
                    fontSize={15}
                    fontFamily={"Snoopy"}
                  >
                    {parseFloat((parseInt(d.covid_case_count) / 1000)).toPrecision(3).toLocaleString()}%
                  </text>
                </Group>
              )
            })}

            <AxisBottom
              hideTicks={true}
              scale={xScale}
              top={yMax}
              stroke={'#ffffff'}
              tickLabelProps={() => ({
                fill: '#000000',
                textAnchor: 'middle',
                fontSize: 18,
                fontFamily: 'Snoopy'
              })}
              tickTextFill={'#ffffff'}
            />
          </Group>
        </svg>
      </div>
      <div className="descDiv">
        <div className="headerWrap">
          <span className="descriptionHeader">Borough Breakdown</span>
        </div>
        <div className="descWrap">
          <span className="description">
            Cumulative since the start of the outbreak<br />
            Age adjusted according to <a href="https://www.cdc.gov/nchs/data/statnt/statnt20.pdf">the US 2000 standard population</a>
          </span>
        </div>
      </div>
    </>
  )
}

export default Compb
