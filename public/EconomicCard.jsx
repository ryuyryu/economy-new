import React from 'react';
import SparkChart from './SparkChart.jsx';

/**
 * 経済指標カードのサンプルコンポーネント
 * SparkChart を使ってグラフを表示します
 */
const EconomicCard = () => {
  // サンプルデータ（月ごとのCPI）
  const values = [100, 103, 101, 104, 107, 110, 108];
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月'];

  const usageHTML = `
    <ul class="list-disc list-inside">
      <li>指数の動きを簡潔に確認できます。</li>
      <li>グラフ上を指でなぞると値が表示されます。</li>
    </ul>`;

  return (
    <div className="p-4 bg-white rounded-xl shadow-md w-full max-w-md">
      {/* タイトル */}
      <p className="text-sm font-bold text-gray-600 mb-2">CPI（消費者物価指数）</p>
      {/* スパークラインと使い方メモ */}
      <div className="flex items-start">
        <div className="w-1/3 pr-2 border-r border-gray-300">
          <SparkChart data={values} labels={labels} />
        </div>
        <div
          className="usage-note ml-2 flex-1 text-sm text-gray-600 p-2 rounded-lg shadow-inner border border-gray-300 bg-gray-50"
          dangerouslySetInnerHTML={{ __html: usageHTML }}
        />
      </div>
      {/* 補足説明 */}
      <p className="text-xs text-gray-500 mt-2">前月比 +2.3%</p>
    </div>
  );
};

export default EconomicCard;
