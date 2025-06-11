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
        {
          className: 'absolute top-0 left-0 w-full text-center font-bold three-d-text gradient-text',
          // キャッチコピーを画面の4分の1の高さで表示
          style: { fontSize: '25vh' }
        },
        '戦略で導け'
      )
    )
  );
}

// ③ ここで ReactDOM を使って画面に描画します
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(StartScreen));
