"use client"
import React, { useEffect, useRef, useState } from 'react'
import Echarts from 'echarts-for-react'
import { init, getInstanceByDom } from "echarts";
import type { CSSProperties } from "react";
import type { EChartsOption, ECharts, SetOptionOpts } from "echarts";


const DEFAULT_CONFIG: EChartsOption = {
  
  "xAxis": {
    "type": "category"
  },
  "yAxis": {
    "type": "value"
  },
  "series": [
    {
      "type": "bar",
      "name": "Top 10 Products",
      "barCategoryGap": "20%"
    }
  ]
}

export interface ReactEChartsProps {
  data: any;
  fields: any;
  option: EChartsOption;
  style?: CSSProperties;
  settings?: SetOptionOpts;
  loading?: boolean;
  theme?: "light" | "dark";
}

export const ReactEChart = ({
  data,
  fields,
  option,
  style,
  settings,
  loading,
  theme,
}: ReactEChartsProps): JSX.Element => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [opt, setOpt] = useState({
    ...DEFAULT_CONFIG,
    dataset: {
      dimensions: fields?.map(item => item.fid),
      source: data 
    }
  })

  // const opt = {
  //   ...option,
  //   series: {
  //     ...option.series,
  //     data: data
  //   }
  // }

  console.log( opt, fields?.map(item => item.fid), "<< CEK DATAOPTION")

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined;
    if (chartRef.current !== null) {
      chart = init(chartRef.current, theme);
    }
    

    // Add chart resize listener
    // ResizeObserver is leading to a bit janky UX
    function resizeChart() {
      chart?.resize();
    }
    window.addEventListener("resize", resizeChart);

    // Return cleanup function
    return () => {
      chart?.dispose();
      window.removeEventListener("resize", resizeChart);
    };
  }, [theme]);

  useEffect(() => {
    if (option) {
      setOpt({
        ...DEFAULT_CONFIG,
        dataset: {
          dimensions: fields?.map(item => item.fid),
          source: data 
        }
      })
    }
  }, [data, option])

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      chart.setOption(opt, settings);
    }
  }, [opt, settings, theme]); // Whenever theme changes we need to add option and setting due to it being deleted in cleanup function

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      loading === true ? chart.showLoading() : chart.hideLoading();
    }
  }, [loading, theme]);

  return <div ref={chartRef} style={{ width: "400px", height: "100%", minHeight: "40vh", ...style }} className='' />;
}