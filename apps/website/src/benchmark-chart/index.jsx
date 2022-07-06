import React from "react";
import Chart from "./chart";
import { BarWithErrorBarsController } from "chartjs-chart-error-bars";
import data from "benchmarks/chart-data/text_-_no_styles";

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Text - no styles",
    },
    tooltip: {
      callbacks: {
        label: () => "test",
      },
    },
  },
};

export default function () {
  return (
    <Chart type={BarWithErrorBarsController.id} options={options} data={data} />
  );
}
