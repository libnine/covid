import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { AxisBottom, AxisLeft } from '@vx/axis'
import { curveBasis } from '@vx/curve'
import { localPoint } from '@vx/event';
import { LinearGradient } from '@vx/gradient'
import { Group } from '@vx/group'
import { scaleTime, scaleLinear } from '@vx/scale'
import { Bar, Line, LinePath } from '@vx/shape'
import { useTooltip } from '@vx/tooltip'
import '../styles/comp.css'

const Compa = () => {
  const [data, setData] = useState([])
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip
  } = useTooltip()

  useEffect(() => {
    (async() => {
      let a = await axios.get('https://raw.githubusercontent.com/nychealth/coronavirus-data/master/case-hosp-death.csv')
      let res = await a.data
  
      let 
        dump = [],
        lines = res.replace('DATE_OF_INTEREST', 'date').replace(/^[A-Za-z\s\.]+/g, 'date').split('\r'),
        headers = lines[0].split(',')

      console.log(lines)

      for (let i = 1; i < lines.length; i++) {
        let
          obj = {},
          line = lines[i].replace('\n', ''),
          curLine = line.split(',')
    
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].toLowerCase()] = curLine[j] || 0
        }

        dump.push(obj)
      }

      setData(dump)
    })()
  }, [])
  
  const 
    margin = {
      top: 40,
      bottom: 40,
      left: 0,
      right: 0
    },
    width = 650,
    height = 400,
    xMax = width - 25,
    yMax = height - 100,
    date = d => new Date(d.date),
    yNew = d => d.new_covid_case_count,
    yHosp = d => d.hospitalized_case_count,
    yDc = d => d.death_count,
    x = d => xScale(date(d)),
    y1 = d => yScale(yNew(d)),
    y2 = d => yScale(yHosp(d)),
    y3 = d => yScale(yDc(d))

  const xScale = scaleTime({
    domain: [Math.min(...data.map(date)), Math.max(...data.map(date))],
    range: [0, xMax],
    padding: 0.4
  })

  const yScale = scaleLinear({
    domain: [0, Math.max(...data.map(yNew))],
    range: [yMax, 0]
  })

  return (
    <>
      <div className="svgWrapper">
        <svg width={width} height={height}> 
          <LinearGradient 
              from="#fbc2eb" 
              to="#ede1ed" 
              id="gradient"/>
          <rect x={0} y={0} width={width} height={height} fill={`url('#gradient')`} rx={14} />
            <Group top={margin.top}>
              <LinePath
                data={data}
                x={x}
                y={y1}
                stroke={'#ffffff'}
                strokeLinecap="round"
                strokeWidth={2}
                curve={curveBasis}
              />
              <LinePath
                data={data}
                x={x}
                y={y2}
                stroke={`#736ca3`}
                strokeLinecap="round"
                strokeWidth={1}
                curve={curveBasis}
              />
              <LinePath
                data={data}
                x={x}
                y={y3}
                stroke={'#ff0000'}
                strokeLinecap="round"
                strokeWidth={1}
                curve={curveBasis}
              />
              <AxisBottom
                hideAxisLine
                hideTicks={true}
                scale={xScale}
                top={yMax}
                stroke={'#ffffff'}
                tickLabelProps={() => ({
                  fill: '#000000',
                  textAnchor: 'middle',
                  fontSize: 16,
                  fontFamily: 'Snoopy'
                })}
                tickTextFill={'#ffffff'}
              />
              <AxisLeft
                scale={yScale}
                stroke={'#ffffff'}
                hideTicks={false}
                tickLabelProps={() => ({
                  dx: '1.75em',
                  dy: '-0.75em',
                  fill: '#000000',
                  textAnchor: 'start',
                  fontSize: 14,
                  fontFamily: 'Snoopy'
                })}
                tickTextFill={'#ffffff'}
              />
            </Group>
        </svg>
        {tooltipOpen && (
          <div
            className="tooltip"
            style={{
              position: "absolute",
              top: tooltipTop + height / 2,
              left: tooltipLeft + width / 2,
              pointerEvents: "none",
              background: "rgba(0,0,0,0.3)"
            }}
          >
            {JSON.stringify(tooltipData, undefined, "\n")}
          </div>
        )}
      </div>
      <div className="descDiv">
        <div className="headerWrap">
          <span className="descriptionHeader">Cases, Hospitalizations, Deaths</span>
        </div>
        <div className="descWrap">
          <span className="description">
            Cases are by date of diagnosis<br />
            Hospitalizations are by date of admission<br/>
            Deaths are by date of death<br />
          </span>
        </div>
      </div>
    </>
  )
}

export default Compa
