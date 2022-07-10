/* eslint-disable unicorn/prefer-module */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { PerformanceEntry } from "@reassure/reassure-compare/lib/typescript/types";
import type { ChartData } from "chart.js";
import type { IErrorBarXDataPoint } from "chartjs-chart-error-bars";

// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  const path = join(__dirname, "../.reassure/current.perf");

  const data = await readFile(path, "utf8");

  const lines = data.split(/\r?\n/);

  interface ReassureEntry extends PerformanceEntry {
    group: string;
  }

  const entries: ReassureEntry[] = lines
    .filter((line) => !!line.trim())
    .map((line) => {
      const entry = JSON.parse(line);
      const [group, name] = entry.name.split(": ");

      return {
        ...entry,
        name,
        group,
      };
    });

  const preChartData: Record<
    string,
    Array<{ label: string; data: IErrorBarXDataPoint }>
  > = {};

  const chartData: Record<string, ChartData<"bar", IErrorBarXDataPoint[]>> = {};

  for (const entry of entries) {
    preChartData[entry.group] ??= [];
    preChartData[entry.group].push({
      label: entry.name,
      data: {
        x: entry.meanDuration,
        xMin: [],
        // eslint-disable-next-line @cspell/spellchecker
        xMax: entry.meanDuration + entry.stdevDuration,
      },
    });
  }

  const order = ["StyleSheet", "NativeWind"];

  for (const [key, value] of Object.entries(preChartData)) {
    chartData[key] = {
      labels: [],
      datasets: [
        {
          data: value
            .sort((a, b) => {
              const aOrder = order.includes(a.label)
                ? order.indexOf(a.label)
                : 99;

              const bOrder = order.includes(b.label)
                ? order.indexOf(b.label)
                : 99;
              return aOrder - bOrder;
            })
            .map((a) => a.data),
        },
      ],
    };
  }

  for (const group of Object.keys(chartData)) {
    const slug = group.toLowerCase().replace(/\s+/g, "_");
    const fileName = join(__dirname, "../chart-data/", `${slug}.js`);
    const data = `module.exports = ${JSON.stringify(chartData[group])}`;

    await writeFile(fileName, data);
  }
})();
