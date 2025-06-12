// Reactを使ったスタート画面のスクリプト
// 画面のどこをクリックしても React版のゲーム画面へ遷移します
(function () {
  // ① React のフックを使うために取り出します
  const { useEffect, useState } = React;

  // ② スタート画面を表すコンポーネントを定義します
  function StartScreen() {
  // タイトルと「タップで開始」を表示するタイミングを制御するステート
  const [showTitle, setShowTitle] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // コンポーネントが初めて表示されたときに実行したい処理を useEffect に書きます
  useEffect(() => {
    // body 全体にカーソルを指の形にするクラスを追加
    document.body.classList.add('cursor-pointer');
    // すぐにタイトルを表示
    setShowTitle(true);
    // 少し遅らせて「タップで開始」を表示
    const timer = setTimeout(() => setShowPrompt(true), 1000);

    // クリーンアップ関数でコンポーネントが消えたときに元に戻す
    return () => {
      document.body.classList.remove('cursor-pointer');
      clearTimeout(timer);
    };
  }, []); // 空配列なので最初の1回だけ実行されます

  // 画面全体が押されたら遷移する処理
  const handleClick = () => {
    // React版のゲーム画面へ移動
    window.location.href = 'game_screen_react.html';
  };

  // JSX で画面の見た目を記述します
  return (
    // div を画面いっぱいに広げ、中央にタイトルを表示します
    React.createElement(
      'div',
      {
        className: 'h-screen w-screen flex items-center justify-center select-none relative',
        onClick: handleClick,
      },
      // タイトル文字
      React.createElement(
        'h1',
        {
          className: 'font-extrabold text-[#00fb00] drop-shadow-[0_0_5px_#00fb00] animate-pulse absolute left-0 w-full text-center transition-opacity duration-700',
          style: { fontSize: '25vh', top: '-8px', opacity: showTitle ? 1 : 0 }
        },
        "ecoNova",
      ),
      // 下部に「タップで開始」テキストを表示
      React.createElement(
        'p',
        {
          className: 'absolute bottom-8 left-0 w-full text-center text-white font-bold transition-opacity duration-700',
          style: { fontSize: '4vh', opacity: showPrompt ? 1 : 0 }
        },
        'タップで開始'
      )
    )
  );
  }

  // ③ ここで ReactDOM を使って画面に描画します
  ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(StartScreen));
})();
