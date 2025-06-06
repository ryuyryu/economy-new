// シンプルな2Dドット移動ゲーム
// キャンバス上でキャラクターを矢印キーで動かします

// 定数の設定
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = 32; // 1マスの大きさ（ピクセル）
const GRID_SIZE = 10; // 縦横10マスの小さな世界

// プレイヤーの初期位置（中央）
let player = {
    x: Math.floor(GRID_SIZE / 2),
    y: Math.floor(GRID_SIZE / 2)
};

// キャラクターを描画する関数
function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * TILE_SIZE, player.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

// グリッド全体を描画する関数
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#ccc';
    for (let i = 0; i <= GRID_SIZE; i++) {
        // 縦線
        ctx.beginPath();
        ctx.moveTo(i * TILE_SIZE, 0);
        ctx.lineTo(i * TILE_SIZE, GRID_SIZE * TILE_SIZE);
        ctx.stroke();
        // 横線
        ctx.beginPath();
        ctx.moveTo(0, i * TILE_SIZE);
        ctx.lineTo(GRID_SIZE * TILE_SIZE, i * TILE_SIZE);
        ctx.stroke();
    }
    // プレイヤー描画
    drawPlayer();
}

// キー入力処理
function handleKeyDown(e) {
    switch (e.key) {
        case 'ArrowUp':
            if (player.y > 0) player.y--;
            break;
        case 'ArrowDown':
            if (player.y < GRID_SIZE - 1) player.y++;
            break;
        case 'ArrowLeft':
            if (player.x > 0) player.x--;
            break;
        case 'ArrowRight':
            if (player.x < GRID_SIZE - 1) player.x++;
            break;
        default:
            return; // 矢印キー以外は無視
    }
    drawGrid();
}

// 初期化
window.addEventListener('load', () => {
    drawGrid();
    document.addEventListener('keydown', handleKeyDown);
});
