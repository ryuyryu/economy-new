// Reactを使ったスタート画面のスクリプト
// 画面のどこをクリックしても game_screen.html へ遷移します

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
    // ゲーム画面へ移動
    window.location.href = 'game_screen.html';
  };

  // JSX で画面の見た目を記述します
  return (
    // divを画面いっぱいに広げ、中央にタイトルを表示します
    React.createElement(
      'div',
      {
        className: 'h-screen w-screen flex items-center justify-center select-none',
        onClick: handleClick,
      },
      React.createElement(
        'h1',
        {
          className:
            'text-6xl font-extrabold tracking-wider text-blue-500 drop-shadow-lg animate-pulse',
        },
        'ECON'
      )
    )
  );
}

// ③ ここで ReactDOM を使って画面に描画します
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(StartScreen));
