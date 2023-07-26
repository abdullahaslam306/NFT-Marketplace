import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import dynamic from "next/dynamic";

import moment from "moment";

import { actions } from "src/actions";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function TransactionsGraph({ heading, type }) {
  const dispatch = useDispatch();
  const [seriesData, setSeriesData] = useState([]);
  const [seriesDate, setSeriesDates] = useState([]);
  const [largestValue, setLargestValue] = useState(null);
  const transactionStats = useSelector(
    (state) =>
      (state && state?.nftPortfolioAnalysisReducer?.transactionStats) || {}
  );
  const transactionStatsLoading = useSelector(
    (state) => state?.nftPortfolioAnalysisReducer.transactionStatsLoading
  );

  useEffect(() => {
    const params = {
      endDate: moment()?.toISOString(),
      startDate: moment().subtract(1, "year")?.toISOString(),
    };

    dispatch(actions.nftPortfolioAnalysisActions.getTransactionStats(params));
  }, []);

  useEffect(() => {
    const counts = transactionStats?.data?.map((stat) => stat.count) || [];
    const dates = transactionStats?.data?.map((stat) => stat.date) || [];
    // const maxVal = counts.reduce((acc, val) => (acc += +val), 0);
    let largest = parseInt(counts[0]);
    counts.forEach((val) => {
      if (parseInt(val) > largest) largest = parseInt(val);
    });
    setLargestValue(largest);
    setSeriesData(counts);
    setSeriesDates(dates);
  }, [transactionStats]);

  const series = [
    {
      name: "Transactions",
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
    yaxis: {
      min: 0,
      max: largestValue,
    },
    colors: ["#B6AEF6"],

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
          return parseInt(val);
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
      text: transactionStats?.count || 0,
      align: "left",
      offsetX: 10,
      offsetY: 5,
      style: {
        color: "#fff",
        fontSize: "20px",
        fontWeight: "900",
        fontFamily: "Roboto",
        cssClass: "apexcharts-yaxis-title",
      },
    },
    subtitle: {
      text: "Transactions",
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
      text: transactionStatsLoading
        ? "Loading..."
        : "No transactions available",
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
  // }, [transactionStatsLoading]);

  return (
    <div>
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
