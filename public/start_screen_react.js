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
    // 画面全体をクリックするとゲーム画面へ遷移
    React.createElement(
      'div',
      {
        className: 'h-screen w-screen flex items-center justify-center select-none relative',
        onClick: handleClick,
      },
      // タイトル文字を中央に大きく表示
      React.createElement(
        'h1',
        {
          className: 'text-6xl sm:text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0cb195] to-[#00fb00]'
        },
        'ECON'
      )
    )
  );
}

// ③ ここで ReactDOM を使って画面に描画します
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(StartScreen));
