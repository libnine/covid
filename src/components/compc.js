import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { LinearGradient } from '@vx/gradient'
import { Group } from '@vx/group'
import { Pie } from '@vx/shape'
import { useTooltip, Tooltip } from '@vx/tooltip'

const Compc = () => {
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
      let a = await axios.get('https://raw.githubusercontent.com/nychealth/coronavirus-data/master/by-age.csv')
      let res = await a.data

      let 
        dump = [],
        lines = res.split('\r'),
        headers = lines[0].split(',')

      console.log(lines)
    
      for (let i = 1; i < lines.length; i++) {
        let 
          obj = {},
          line = lines[i].replace('\n', ''),
          curLine = line.split(',')

        if (curLine[0].match(/Citywide\s\S+/gi) || curLine.length < 2) continue
    
        for (var j = 0; j < headers.length; j++) {
          try {
            obj[headers[j].toLowerCase()] = curLine[j].replace(/[\sA-Za-z]/gi, '')
          } catch {
            continue
          }
        }
    
        dump.push(obj)
      }

      setData(dump)
    })()
  }, [])

  const 
    width = 650,
    height = 400,
    radius = Math.min(width, height) - 100

  const Label = ({ x, y, children }) => {
    if (children === "75") { children = "75+" }
    
    return (
      <text
        fontFamily={"Snoopy"}
        fill="white"
        textAnchor="middle"
        x={x * 1.25}
        y={y * 1.25}
        dy="-.25em"
        fontSize={16}
      >
        {Math.abs(x) < 10 ? null : children}
      </text>
    )
  }

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
          <rect width={width} height={height} fill="url('#gradient')" rx={14} />
          <Group top={height / 2} left={width / 2}>
            <Pie
              data={data}
              outerRadius={radius - 115}
              pieValue={d => d.death_rate}
            >
              {({ arcs, path }) => {
                return arcs.map((arc, i) => {
                  const [x, y] = path.centroid(arc);
                  return (
                    <g key={`pie-arc-${i}`}>
                      <path
                        d={path(arc)}
                        fill="url('#gradient-2')"
                        stroke="white"
                        onMouseEnter={() =>
                          showTooltip({
                            tooltipData: arc.data,
                            tooltipLeft: x,
                            tooltipTop: y
                          })
                        }
                        onMouseLeave={hideTooltip}
                      />
                      <Label x={x} y={y}>
                        {arc.data.age_group}
                      </Label>
                    </g>
                  )
                })
              }}
            </Pie>
          </Group>
        </svg>
        {tooltipOpen && (
          <Tooltip left={tooltipLeft * .75 + width} top={tooltipTop * 1.25 + height}>
            <section className="ttStyle">
              <strong>Age Group</strong> {tooltipData.age_group}<br />
              <strong>Case Rate</strong> {(tooltipData.case_rate / 1000).toPrecision(3).toLocaleString()}%<br />
              <strong>Hospitalization Rate</strong> {(tooltipData.hospitalized_rate / 1000).toPrecision(3).toLocaleString()}%<br />
              <strong>Death Rate</strong> {(tooltipData.death_rate / 1000).toPrecision(3).toLocaleString()}%<br />
            </section>
          </Tooltip>
        )}
      </div>
      <div className="descDiv">
        <div className="headerWrap">
          <span className="descriptionHeader">Age Groups</span>
        </div>
        <div className="descWrap">
          <span className="description">
            This contains age-specific rates of confirmed cases, hospitalizations, and deaths.
          </span>
        </div>
      </div>
    </>
  )
}

export default Compc
