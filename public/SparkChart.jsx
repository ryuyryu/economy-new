import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Chart.jsで必要な要素を登録
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

/**
 * スパークライン風の折れ線グラフを表示するコンポーネント
 * @param {{ data: number[], labels: string[] }} props
 */
const SparkChart = ({ data, labels }) => {
  // グラフに渡すデータ設定
  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: '#0cb195', // 線の色
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        // ドットの見た目を指定
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: '#00fb00',
        pointBorderColor: '#ffffff',
        pointStyle: 'circle',
      },
    ],
  };

  // 軸や凡例を非表示にしたシンプルなオプション
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'x',
    },
    hover: {
      mode: 'nearest',
      intersect: false,
    },
    animation: {
      duration: 300,
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    // 親要素の幅いっぱいに広がり、高さを固定
    <div className="h-24 w-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default SparkChart;
