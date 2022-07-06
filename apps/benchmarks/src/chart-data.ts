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

  const chartData: Record<string, ChartData<"bar", IErrorBarXDataPoint[]>> = {};

  for (const entry of entries) {
    chartData[entry.group] ??= {
      labels: [],
      datasets: [{ data: [] }],
    };

    chartData[entry.group].labels?.push(entry.name);

    chartData[entry.group].datasets[0].data.push({
      x: entry.meanDuration,
      xMin: [],
      // eslint-disable-next-line @cspell/spellchecker
      xMax: entry.meanDuration + entry.stdevDuration,
    });

    chartData[entry.group].datasets[0].borderColor = "rgb(53, 162, 235)";
    chartData[entry.group].datasets[0].backgroundColor =
      "rgba(53, 162, 235, 0.5)";
  }

  for (const group of Object.keys(chartData)) {
    const slug = group.toLowerCase().replace(/\s+/g, "_");
    const fileName = join(__dirname, "../chart-data/", `${slug}.js`);
    const data = `module.exports = ${JSON.stringify(chartData[group])}`;

    await writeFile(fileName, data);
  }
})();
