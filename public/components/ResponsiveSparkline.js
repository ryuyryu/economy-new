(function () {
  const { useState, useEffect, useRef } = React;
  let d3;
  if (typeof window !== 'undefined' && window.d3) {
    // ブラウザでは外部スクリプトから読み込んだ d3 を使用
    d3 = window.d3;
  } else {
    // テスト環境など d3 が無い場合は簡易的な実装で代用
    d3 = {
      scaleLinear() {
        let d0 = 0,
          d1 = 1,
          r0 = 0,
          r1 = 1;
        const f = x => r0 + ((x - d0) / (d1 - d0)) * (r1 - r0);
        f.domain = arr => {
          d0 = arr[0];
          d1 = arr[1];
          return f;
        };
        f.range = arr => {
          r0 = arr[0];
          r1 = arr[1];
          return f;
        };
        f.invert = y => d0 + ((y - r0) / (r1 - r0)) * (d1 - d0);
        return f;
      },
      min: arr => Math.min(...arr),
      max: arr => Math.max(...arr),
      line() {
        let xf = d => d[0];
        let yf = d => d[1];
        const l = data =>
          data
            .map((d, i) => `${xf(d, i)},${yf(d, i)}`)
            .join(' ');
        l.x = f => {
          xf = f;
          return l;
        };
        l.y = f => {
          yf = f;
          return l;
        };
        return l;
      },
    };
  }

  function ResponsiveSparkline({ data, height = 120, onPointHover }) {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);
    const [tooltip, setTooltip] = useState(null);

    useEffect(() => {
      const update = () => {
        if (containerRef.current) {
          setWidth(containerRef.current.clientWidth);
        }
      };
      update();
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }, []);

    if (!data || data.length === 0) return null;

    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);
    const yScale = d3
      .scaleLinear()
      .domain([d3.min(data), d3.max(data)])
      .range([height, 0]);

    const points = data
      .map((v, i) => `${xScale(i)},${yScale(v)}`)
      .join(' ');

    const handleMove = e => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const idx = Math.round(xScale.invert(x));
      if (idx >= 0 && idx < data.length) {
        const value = data[idx];
        const y = yScale(value);
        const date = idx; // インデックスを簡易的な日付とみなす
        const info = { x, y, value, date };
        setTooltip(info);
        if (onPointHover) onPointHover(info);
      } else {
        setTooltip(null);
      }
    };

    return React.createElement(
      'div',
      {
        ref: containerRef,
        className: 'relative w-full',
        onMouseMove: handleMove,
        onMouseLeave: () => setTooltip(null),
      },
      React.createElement(
        'svg',
        { width: width, height: height, className: 'sparkline w-full h-auto' },
        React.createElement('polyline', {
          points: points,
          fill: 'none',
          stroke: '#3b82f6',
          strokeWidth: 2,
        })
      ),
      tooltip &&
        React.createElement(
          'div',
          {
            className:
              'absolute bg-white shadow-lg rounded text-xs px-2 py-1 pointer-events-none',
            style: { left: `${tooltip.x}px`, top: `${tooltip.y}px` },
          },
          tooltip.value.toFixed(1)
        )
    );
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ResponsiveSparkline };
  }
  if (typeof window !== 'undefined') {
    window.ResponsiveSparkline = ResponsiveSparkline;
  }
})();
