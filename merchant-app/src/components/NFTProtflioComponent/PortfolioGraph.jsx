import React, { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import CustomizedTables from "./PortfolioTable";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

let anchorEl = null;

export default function ProtfolioGraph({ heading, type, chartData }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [alignment, setAlignment] = useState("web");
  const series = [
    {
      data: chartData,
    },
  ];

  const options = {
    chart: {
      id: "area-datetime",
      type: "area",
      height: 450,
      zoom: {
        autoScaleYaxis: true,
      },
    },
    xaxis: {
      type: "datetime",
      tickAmount: 6,
      labels: {
        style: {
          colors: "#fff",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["#fff"],
        },
        formatter: (value) => { return value },
      },
      
    },
    grid: {
      borderColor: "rgba(255, 255, 255, 0.2)",
      row: {
        colors: ["rgba(0, 0, 0, 0.15)", "transparent"],
        opacity: 0.5,
      },
      column: {
        colors: ["#f8f8f8", "transparent"],
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
      style: "hollow",
    },

    tooltip: {
      x: {
        format: "dd MMM yyyy",
        style: {
          fontSize: "12px",
          fontFamily: undefined,
          backgroundColor: "#ccc",
        },
      },

      style: {
        fontSize: "12px",
        fontFamily: undefined,
        backgroundColor: "#ccc",
      },
    },
    fill: {
      colors: ["rgba(0, 227, 135, 0.08)"],
    },
    colors: ["rgba(0, 227, 135)"],
  };

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleMenuClick = (e, item) => {
    anchorEl = e.currentTarget;
    setOpen(true);
  };

  const menuProps = {
    anchorEl,
    onClose: () => setOpen(false),
    open,
    menuItems: [
      {
        label: "Rename",
        onClick: () => {
          setOpen(false);
        },
      },
      {
        label: "Disconnect",
        onClick: () => {
          setOpen(false);
        },
      },
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      ApexCharts.exec(
        "area-datetime",
        "updateOptions",
        {
          yaxis: {
            labels: {
              style: {
                colors: ["#fff"],
              },
            },
            formatter: (value) => { return val },
          },
          tooltip: {
            y: {
              formatter: function (val) {
                return `${val.toFixed(0)}`;
              },
              title: {
                formatter: (seriesName) => "",
              },
            },
          },
        },
        false,
        true
      );
    }, 3000);
  }, []);

  return (
    <>
      {type === "table" ? null : ( // <CustomizedTables />
        <Chart
          options={options}
          type="area"
          series={series}
          width="100%"
          height={"350px"}
          data-testid="chart-show"
        />
      )}
    </>
  );
}
