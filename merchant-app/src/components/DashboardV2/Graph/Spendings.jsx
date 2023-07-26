import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import dynamic from "next/dynamic";

import { useTheme } from "@mui/styles";
import { useMediaQuery } from "@mui/material";

import moment from "moment";

import { actions } from "src/actions";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function SpendingsGraph({ heading, type }) {
  const dispatch = useDispatch();
  const [seriesData, setSeriesData] = useState([]);
  const [seriesDate, setSeriesDates] = useState([]);
  const [largestValue, setLargestValue] = useState(null);
  const spendingsStats = useSelector(
    (state) =>
      (state && state?.nftPortfolioAnalysisReducer?.spendingsStats) || {}
  );
  const spendingsStatsLoading = useSelector(
    (state) => state?.nftPortfolioAnalysisReducer.spendingsStatsLoading
  );

  useEffect(() => {
    const params = {
      endDate: moment()?.toISOString(),
      startDate: moment().subtract(1, "year")?.toISOString(),
    };

    dispatch(actions.nftPortfolioAnalysisActions.getSpendingStats(params));
  }, []);

  useEffect(() => {
    const counts = spendingsStats?.data?.map((stat) => stat.value) || [];
    const dates = spendingsStats?.data?.map((stat) => stat.date) || [];
    // const maxVal = counts.reduce((acc, val) => (acc += +val), 0);
    let largest = parseInt(counts[0]);
    counts.forEach((val) => {
      if (parseInt(val) > largest) largest = parseInt(val);
    });
    setLargestValue(largest);
    setSeriesData(counts);
    setSeriesDates(dates);
  }, [spendingsStats]);

  const series = [
    {
      name: "Spendings",
      data: seriesData,
    },
  ];

  const chartOptions = {
    chart: {
      type: "area",
      height: 200,
      background: "#2E3340",
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "straight",
    },
    xaxis: {
      categories: seriesDate,
      labels: {
        formatter: function (value, timestamp) {
          const month = moment(value, "YYYY/MM/DD")?.format?.("MMM YYYY");
          return month;
        },
      },
    },

    colors: ["#FFA726"],

    tooltip: {
      enabled: true,
      followCursor: true,
      intersect: false,
      custom: undefined,
      // fillSeriesColor: true,
      theme: "dark",
      style: {
        fontSize: "12px",
      },
      onDatasetHover: {
        highlightDataSeries: false,
      },
      x: {
        show: true,
      },
      y: {
        formatter: function (val) {
          return `${val.toFixed(6)}`;
        },
        title: {
          formatter: (name, param) => {
            // + param.series[param.seriesIndex][param.dataPointIndex]
            return name + ":";
          },
        },
      },
    },
    title: {
      text: (spendingsStats?.value?.toFixed?.(6) || 0) + " ETH",
      align: "left",
      offsetX: 10,
      offsetY: 5,
      style: {
        color: "#fff",
        fontSize: "20px",
        fontWeight: "900",
        fontFamily: "Roboto",
        cssClass: "apexcharts-yssaxis-title",
      },
    },
    subtitle: {
      text: "Spendings",
      offsetX: 10,
      offsetY: 36,
      align: "left",
      style: {
        color: "#fff",
        fontSize: "14px",
        fontFamily: "Roboto",
        cssClass: "apexcharts-yaxis-title",
      },
    },
    noData: {
      text: spendingsStatsLoading ? "Loading..." : "No spendings available",
      align: "left",
      verticalAlign: "bottom",
      offsetX: 12,
      offsetY: 0,
      style: {
        color: "White",
        fontSize: "14px",
        fontFamily: "Roboto",
      },
    },
  };
  // const [options, setOptions] = useState(chartOptions);

  // useEffect(() => {
  //   setOptions(chartOptions);
  // }, [spendingsStatsLoading]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      style={{
        float: "left",
        width: isMobile ? "100%" : "49.5%",
        paddingRigth: "4px",
      }}
    >
      <Chart
        options={chartOptions}
        type="area"
        series={series}
        height="200px"
        width="100%"
      />
    </div>
  );
}
