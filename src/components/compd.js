import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Group } from '@vx/group'
import { Circle } from '@vx/shape'
import { LinearGradient } from '@vx/gradient'
import { scaleLinear } from '@vx/scale'
import { useTooltip, Tooltip } from '@vx/tooltip'

const Compd = () => {
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
      let a = await axios.get('https://raw.githubusercontent.com/nychealth/coronavirus-data/master/tests-by-zcta.csv')
      let res = await a.data
  
      let 
        dump = [],
        lines = res.replace(/"/g, '').split('\n'),
        headers = lines[0].replace(/"/g, '').split(',')

      for (let i = 1; i < lines.length; i++) {
        let
          obj = {},
          curLine = lines[i].split(',')

        if (parseInt(curLine[0]) === 99999 || !parseInt(curLine[0])) continue
        
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j].toLowerCase().replace('.', '_')] = curLine[j] || 0
        }

        dump.push(obj)
      }

      setData(dump)
    })()
  }, [])

  let tooltipTimeout

  const 
    total = d => d.total,
    x = d => d.modzcta,
    y = d => d.positive

  const
    width = 650,
    height = 400,
    xMax = width - 40,
    yMax = height - 40

  const xScale = scaleLinear({
    domain: [Math.min(...data.map(x)), Math.max(...data.map(x))],
    range: [0 + 40, xMax],
    padding: 0.4,
    clamp: true
  })

  const yScale = scaleLinear({
    domain: [Math.min(...data.map(y)), Math.max(...data.map(y))],
    range: [yMax, 0],
    clamp: true
  })

  return (
    <>
      <div className="svgWrapper">
        <svg width={width} height={height}>
          <LinearGradient 
              from="#fbc2eb" 
              to="#ede1ed" 
              id="gradient"/>
          <rect width={width} height={height} fill="url('#gradient')" rx={14} />
          <Group top={40}
            onTouchStart={event => {
              if (tooltipTimeout) clearTimeout(tooltipTimeout)
              hideTooltip()
            }}
          >
            {data.map((d, i) => {
              const cx = xScale(x(d))
              const cy = yScale(y(d))
              const r = (total(d) / 250) * .75
              return (
                <Circle
                  className="dot"
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="#ffffff"
                  stroke="#736ca3"
                  strokeWidth={2}
                  onMouseEnter={() => {
                    if (tooltipTimeout) clearTimeout(tooltipTimeout)
                    showTooltip({
                      tooltipLeft: cx + ((window.screen.width) / 6.25) ,
                      tooltipTop: cy + ((window.screen.height) / 3.25),
                      tooltipData: d
                    })
                  }}
                  onMouseLeave={() => {
                    tooltipTimeout = setTimeout(() => {
                      hideTooltip()
                    }, 200)
                  }}
                  onTouchStart={() => {
                    if (tooltipTimeout) clearTimeout(tooltipTimeout)
                    showTooltip({
                      tooltipLeft: cx,
                      tooltipTop: cy,
                      tooltipData: d
                    })
                  }}
                />
              )
            })}
          </Group>
        </svg>
        {tooltipOpen && (
          <Tooltip left={tooltipLeft} top={tooltipTop}>
            <div className="ttStyle">
              <strong>Zip</strong> {x(tooltipData)}<br />
              <strong>Total</strong> {Number(total(tooltipData)).toLocaleString()}<br />
              <strong>Positive</strong> {Number(y(tooltipData)).toLocaleString()}
            </div>
          </Tooltip>
        )}
      </div>
      <div className="descDiv">
        <div className="headerWrap">
          <span className="descriptionHeader">Zip Code Breakdown</span>
        </div>
        <div className="descWrap">
          <span className="description">
            Includes the cumulative count of New York City residents by zip code of residence who were ever tested for COVID-19 (SARS-CoV-2) and tested positive.<br /><br />
            
            The cumulative counts are as of the date of extraction from the NYC Health Department's disease surveillance database.
          </span>
        </div>
      </div>
    </>
  )
}

export default Compd
