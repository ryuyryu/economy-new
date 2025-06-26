(function () {
  const TILE_SIZE = 32;
  const mapData = [
    ['grass','grass','grass','grass','grass','grass','grass','grass','grass','grass'],
    ['grass','road_horizontal','road_horizontal','road_horizontal','road_horizontal','road_horizontal','road_horizontal','road_horizontal','road_horizontal','grass'],
    ['grass','road_horizontal','building_wall','building_wall','building_wall','building_wall','building_wall','building_wall','road_horizontal','grass'],
    ['grass','road_horizontal','building_bg','building_bg','building_bg','building_bg','building_bg','building_bg','road_horizontal','grass'],
    ['grass','road_horizontal','building_bg','tree','tree','tree','tree','building_bg','road_horizontal','grass'],
    ['grass','road_horizontal','building_bg','tree','character_01','car_blue','tree','building_bg','road_horizontal','grass'],
    ['grass','road_horizontal','building_bg','tree','tree','tree','tree','building_bg','road_horizontal','grass'],
    ['grass','road_horizontal','building_bg','building_bg','building_bg','building_bg','building_bg','building_bg','road_horizontal','grass'],
    ['grass','road_horizontal','road_horizontal','road_horizontal','pedestrian_crossing','road_horizontal','road_horizontal','road_horizontal','road_horizontal','grass'],
    ['grass','grass','grass','grass','grass','grass','grass','grass','grass','grass'],
  ];

  function loadImages(manifest, callback) {
    const keys = Object.keys(manifest);
    const images = {};
    let loaded = 0;
    keys.forEach(key => {
      const img = new Image();
      img.src = manifest[key];
      img.onload = () => {
        loaded++;
        if (loaded === keys.length) {
          callback(images);
        }
      };
      images[key] = img;
    });
  }

  function drawMap(canvas, ctx, images) {
    for (let y = 0; y < mapData.length; y++) {
      for (let x = 0; x < mapData[y].length; x++) {
        const tile = mapData[y][x];
        const img = images[tile];
        if (img) {
          ctx.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }

  function initMapCanvas() {
    const canvas = document.getElementById('mapCanvas');
    if (!canvas || typeof tileManifest === 'undefined') {
      return;
    }
    const ctx = canvas.getContext('2d');
    canvas.width = mapData[0].length * TILE_SIZE;
    canvas.height = mapData.length * TILE_SIZE;
    const usedKeys = [...new Set(mapData.flat())];
    const manifest = {};
    usedKeys.forEach(k => { if (tileManifest[k]) manifest[k] = tileManifest[k]; });
    loadImages(manifest, (images) => { drawMap(canvas, ctx, images); });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initMapCanvas };
  }
  if (typeof window !== 'undefined') {
    window.initMapCanvas = initMapCanvas;
  }
})();
