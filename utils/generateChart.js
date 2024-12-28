// generateChartBuffer.js
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const QuickChart = require('quickchart-js');

export async function generateChartBuffer(notes) {

  // Calcul des fréquences
  const frequencies = new Array(21).fill(0);

  notes = notes.map(note => Math.floor(note * 2) / 2);

  notes.forEach(note => frequencies[note]++);

  const labels = Array.from({ length: 21 }, (_, i) => i.toString());

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '',  
          data: frequencies,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Histogramme des notes',
          font: { size: 18 },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        yAxes: [{
          gridLines: { display: false },
          ticks: {
            beginAtZero: true,
            stepSize: 1, 
          },
        }],
        xAxes: [{
          gridLines: { display: false },
        }],
      },
    },
  };

  const chart = new QuickChart()
    .setConfig(config)
    .setWidth(800)
    .setHeight(400);

  const imageBuffer = await chart.toBinary();
  return imageBuffer;
}
