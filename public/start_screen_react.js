// Reactを使ったスタート画面のスクリプト
// 画面のどこをクリックしても React版のゲーム画面へ遷移します

// ① Reactの機能を使うために変数に取り出します
const { useEffect } = React;

// ② スタート画面を表すコンポーネントを定義します
function StartScreen() {
  // コンポーネントが初めて表示されたときに実行したい処理を useEffect に書きます
  useEffect(() => {
    // body 全体にカーソルを指の形にするクラスを追加
    document.body.classList.add('cursor-pointer');
    // クリーンアップ関数でコンポーネントが消えたときに元に戻す
    return () => {
      document.body.classList.remove('cursor-pointer');
    };
  }, []); // 空配列なので最初の1回だけ実行されます

  // 画面全体が押されたら遷移する処理
  const handleClick = () => {
    // React版のゲーム画面へ移動
    window.location.href = 'game_screen_react.html';
  };

  // JSX で画面の見た目を記述します
  return (
    // divを画面いっぱいに広げ、画面上部にキャッチコピーを表示します
    React.createElement(
      'div',
      {
        className: 'h-screen w-screen flex items-center justify-center select-none relative',
        onClick: handleClick,
      },
      React.createElement(
        'div',
        { className: 'text-center' },
        // タイトル文字
        React.createElement(
          'h1',
          {
            className:
              'text-6xl font-extrabold text-[#00fb00] animate-pulse drop-shadow-[0_0_5px_#00fb00] absolute left-0 w-full text-center',
            style: { top: '-8px' }
          },
          "Let's Go"
        ),
        // 画面タップを促す説明文
        React.createElement(
          'p',
          {
            className: 'relative mt-16 text-white text-lg'
          },
          '画面をタップしてスタート'
        ),
        // 明確な開始ボタン
        React.createElement(
          'button',
          {
            onClick: handleClick,
            className: 'mt-4 px-6 py-2 bg-[#00fb00] text-black font-bold rounded shadow'
          },
          '開始'
        )
      )
    )
  );
}

// ③ ここで ReactDOM を使って画面に描画します
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(StartScreen));
