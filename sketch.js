let stopSprite; // 宣告待機動畫精靈圖
let walkSprite; // 宣告行走動畫精靈圖
let magicSprite; // 宣告魔法動畫精靈圖
let effectSprite; // 宣告魔法特效精靈圖

const STOP_PATH = "1/stop/stop.png"; // 設定待機圖片路徑
const WALK_PATH = "1/walk/walk.png"; // 設定行走圖片路徑
const MAGIC_PATH = "1/magic1/magic1.png"; // 設定魔法圖片路徑
const EFFECT_PATH = "1/magic1_effect/magic1_effect.png"; // 設定特效圖片路徑

const STOP_FRAME_COUNT = 10; // 設定待機動畫影格數
const STOP_SHEET_WIDTH = 1385; // 設定待機精靈圖總寬度
const STOP_SHEET_HEIGHT = 212; // 設定待機精靈圖總高度

const WALK_FRAME_COUNT = 9; // 設定行走動畫影格數
const WALK_SHEET_WIDTH = 1246; // 設定行走精靈圖總寬度
const WALK_SHEET_HEIGHT = 198; // 設定行走精靈圖總高度

const MAGIC_FRAME_COUNT = 4; // 設定魔法動畫影格數
const MAGIC_SHEET_WIDTH = 1039; // 設定魔法精靈圖總寬度
const MAGIC_SHEET_HEIGHT = 146; // 設定魔法精靈圖總高度

const EFFECT_FRAME_COUNT = 5; // 設定特效動畫影格數
const EFFECT_SHEET_WIDTH = 740; // 設定特效精靈圖總寬度
const EFFECT_SHEET_HEIGHT = 19; // 設定特效精靈圖總高度

const FRAME_INTERVAL = 100; // 設定一般動畫影格切換時間
const MAGIC_FRAME_INTERVAL = 130; // 設定魔法動畫影格切換時間
const EFFECT_FRAME_INTERVAL = 100; // 設定特效動畫影格切換時間

const MOVE_SPEED = 360; // 設定角色每秒移動速度
const EFFECT_SPEED = 600; // 設定特效每秒移動速度

let currentFrame = 0; // 設定目前動畫影格
let animationTimer = 0; // 設定動畫計時器
let characterX; // 設定角色中心 X 座標
let characterY; // 設定角色中心 Y 座標
let characterWidth; // 設定角色顯示寬度
let characterHeight; // 設定角色顯示高度
let facingDirection = 1; // 設定角色面向，1 為右方，-1 為左方
let effectX; // 設定特效中心 X 座標
let effectY; // 設定特效中心 Y 座標
let effectWidth; // 設定特效顯示寬度
let effectHeight; // 設定特效顯示高度
let gameState = "normal"; // 設定目前狀態為一般狀態
let magicFinished = false; // 設定魔法動畫是否播放完成
let spaceKeyLocked = false; // 防止空白鍵長按重複觸發

function preload() { // 在畫布建立前載入所有圖片
  stopSprite = loadImage(STOP_PATH); // 載入待機精靈圖
  walkSprite = loadImage(WALK_PATH); // 載入行走精靈圖
  magicSprite = loadImage(MAGIC_PATH); // 載入魔法精靈圖
  effectSprite = loadImage(EFFECT_PATH); // 載入特效精靈圖
} // 結束 preload 函式

function setup() { // 初始化 p5.js
  createCanvas(windowWidth, windowHeight); // 建立全螢幕畫布
  imageMode(CENTER); // 將圖片繪製模式設定為中心點
  frameRate(60); // 設定畫面更新頻率
  characterX = width * 2 / 3; // 將角色初始位置設定在畫布 X 軸三分之二處
  updateCharacterSize(); // 計算角色尺寸
  updateEffectSize(); // 計算特效尺寸
  updateCharacterY(); // 設定角色底端貼齊畫布底端
  limitCharacterPosition(); // 限制角色不可超出畫布
} // 結束 setup 函式

function draw() { // 每一幀執行一次
  background(135, 206, 235); // 設定天空藍背景

  if (gameState === "normal") { // 判斷目前是否為一般狀態
    handleMovement(); // 處理左右鍵移動
    updateNormalAnimation(); // 更新待機或行走動畫
    drawCharacter(); // 繪製角色
  } else if (gameState === "magic") { // 判斷目前是否為魔法狀態
    updateMagicAnimation(); // 更新魔法動畫
    drawCharacter(); // 繪製角色
  } else if (gameState === "effect") { // 判斷目前是否為特效狀態
    updateEffectAnimation(); // 更新特效位置與影格
    drawCharacter(); // 繪製角色
    drawEffect(); // 繪製魔法特效
  } // 結束狀態判斷
} // 結束 draw 函式

function handleMovement() { // 處理角色移動
  const rightPressed = keyIsDown(RIGHT_ARROW); // 判斷是否按住右方向鍵
  const leftPressed = keyIsDown(LEFT_ARROW); // 判斷是否按住左方向鍵

  if (rightPressed && !leftPressed) { // 判斷是否只按住右鍵
    facingDirection = 1; // 設定角色面向右方
    characterX += MOVE_SPEED * deltaTime / 1000; // 向右移動角色
  } else if (leftPressed && !rightPressed) { // 判斷是否只按住左鍵
    facingDirection = -1; // 設定角色面向左方
    characterX -= MOVE_SPEED * deltaTime / 1000; // 向左移動角色
  } // 結束移動判斷

  limitCharacterPosition(); // 限制角色位置
} // 結束 handleMovement 函式

function updateNormalAnimation() { // 更新待機或行走動畫
  const moving = keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW); // 判斷角色是否正在移動
  const frameCount = moving ? WALK_FRAME_COUNT : STOP_FRAME_COUNT; // 取得目前動畫影格數
  const currentTime = millis(); // 取得目前時間

  if (typeof updateNormalAnimation.lastTime === "undefined") { // 判斷是否第一次執行
    updateNormalAnimation.lastTime = currentTime; // 記錄第一次執行時間
  } // 結束第一次執行判斷

  animationTimer += currentTime - updateNormalAnimation.lastTime; // 累加動畫經過時間
  updateNormalAnimation.lastTime = currentTime; // 更新上一次執行時間

  if (animationTimer >= FRAME_INTERVAL) { // 判斷是否到達換影格時間
    currentFrame = (currentFrame + 1) % frameCount; // 切換至下一張影格
    animationTimer = 0; // 清除動畫計時器
  } // 結束換影格判斷
} // 結束 updateNormalAnimation 函式

function updateMagicAnimation() { // 更新魔法動畫
  const currentTime = millis(); // 取得目前時間

  if (typeof updateMagicAnimation.lastTime === "undefined") { // 判斷是否第一次執行
    updateMagicAnimation.lastTime = currentTime; // 記錄第一次執行時間
  } // 結束第一次執行判斷

  animationTimer += currentTime - updateMagicAnimation.lastTime; // 累加魔法動畫時間
  updateMagicAnimation.lastTime = currentTime; // 更新上一次執行時間

  if (animationTimer >= MAGIC_FRAME_INTERVAL) { // 判斷是否到達魔法換影格時間
    currentFrame++; // 播放下一張魔法影格
    animationTimer = 0; // 清除動畫計時器

    if (currentFrame >= MAGIC_FRAME_COUNT) { // 判斷魔法動畫是否播放完成
      currentFrame = MAGIC_FRAME_COUNT - 1; // 停留在最後一張魔法影格
      magicFinished = true; // 標記魔法動畫已完成
      startEffect(); // 開始播放魔法特效
    } // 結束魔法完成判斷
  } // 結束魔法換影格判斷
} // 結束 updateMagicAnimation 函式

function updateEffectAnimation() { // 更新特效動畫與移動
  const currentTime = millis(); // 取得目前時間

  if (typeof updateEffectAnimation.lastTime === "undefined") { // 判斷是否第一次執行
    updateEffectAnimation.lastTime = currentTime; // 記錄第一次執行時間
  } // 結束第一次執行判斷

  const elapsedTime = currentTime - updateEffectAnimation.lastTime; // 計算經過時間
  updateEffectAnimation.lastTime = currentTime; // 更新時間

  animationTimer += elapsedTime; // 累加特效動畫時間

  if (animationTimer >= EFFECT_FRAME_INTERVAL) { // 判斷是否到達換影格時間
    currentFrame = (currentFrame + 1) % EFFECT_FRAME_COUNT; // 循環播放特效動畫
    animationTimer = 0; // 清除動畫計時器
  } // 結束特效換影格判斷

  effectX += facingDirection * EFFECT_SPEED * deltaTime / 1000; // 讓特效朝角色面向方向移動

  if (facingDirection === 1 && effectX - effectWidth / 2 > width) { // 判斷特效是否超出右側畫布
    finishEffect(); // 結束特效
  } // 結束右側邊界判斷

  if (facingDirection === -1 && effectX + effectWidth / 2 < 0) { // 判斷特效是否超出左側畫布
    finishEffect(); // 結束特效
  } // 結束左側邊界判斷
} // 結束 updateEffectAnimation 函式

function drawCharacter() { // 繪製角色
  let sprite; // 宣告目前使用的精靈圖
  let frameCount; // 宣告目前動畫影格數
  let sheetWidth; // 宣告目前精靈圖寬度
  let sheetHeight; // 宣告目前精靈圖高度

  if (gameState === "magic") { // 判斷是否正在播放魔法
    sprite = magicSprite; // 使用魔法精靈圖
    frameCount = MAGIC_FRAME_COUNT; // 使用魔法影格數量
    sheetWidth = MAGIC_SHEET_WIDTH; // 使用魔法精靈圖寬度
    sheetHeight = MAGIC_SHEET_HEIGHT; // 使用魔法精靈圖高度
  } else if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) { // 判斷是否正在行走
    sprite = walkSprite; // 使用行走精靈圖
    frameCount = WALK_FRAME_COUNT; // 使用行走影格數量
    sheetWidth = WALK_SHEET_WIDTH; // 使用行走精靈圖寬度
    sheetHeight = WALK_SHEET_HEIGHT; // 使用行走精靈圖高度
  } else { // 處理待機狀態
    sprite = stopSprite; // 使用待機精靈圖
    frameCount = STOP_FRAME_COUNT; // 使用待機影格數量
    sheetWidth = STOP_SHEET_WIDTH; // 使用待機精靈圖寬度
    sheetHeight = STOP_SHEET_HEIGHT; // 使用待機精靈圖高度
  } // 結束精靈圖選擇

  if (!sprite || !sprite.width) { // 判斷圖片是否尚未載入
    fill(255); // 設定提示文字顏色
    textAlign(CENTER, CENTER); // 設定文字置中
    textSize(20); // 設定提示文字大小
    text("圖片載入中...", width / 2, height / 2); // 顯示載入提示
    return; // 結束角色繪製
  } // 結束圖片載入判斷

  const frameWidth = sheetWidth / frameCount; // 計算單張影格寬度
  const sourceX = currentFrame * frameWidth; // 計算目前影格 X 座標

  push(); // 儲存目前畫布狀態
  translate(characterX, characterY); // 將原點移動至角色中心
  scale(facingDirection, 1); // 依角色方向水平翻轉圖片
  image(sprite, 0, 0, characterWidth, characterHeight, sourceX, 0, frameWidth, sheetHeight); // 繪製角色影格
  pop(); // 還原畫布狀態
} // 結束 drawCharacter 函式

function drawEffect() { // 繪製魔法特效
  if (!effectSprite || !effectSprite.width) { // 判斷特效圖片是否尚未載入
    return; // 圖片尚未載入時不繪製特效
  } // 結束特效載入判斷

  const frameWidth = EFFECT_SHEET_WIDTH / EFFECT_FRAME_COUNT; // 計算特效單格寬度
  const sourceX = currentFrame * frameWidth; // 計算特效目前影格來源 X 座標

  push(); // 儲存目前畫布狀態
  translate(effectX, effectY); // 將座標移動到特效中心
  scale(facingDirection, 1); // 依方向翻轉特效
  image(effectSprite, 0, 0, effectWidth, effectHeight, sourceX, 0, frameWidth, EFFECT_SHEET_HEIGHT); // 繪製特效影格
  pop(); // 還原畫布狀態
} // 結束 drawEffect 函式

function startMagic() { // 開始播放魔法動畫
  if (gameState !== "normal") { // 判斷目前是否已在其他特殊狀態
    return; // 若不是一般狀態則不重複播放
  } // 結束狀態判斷

  gameState = "magic"; // 切換至魔法狀態
  currentFrame = 0; // 將魔法動畫影格歸零
  animationTimer = 0; // 將動畫計時器歸零
  magicFinished = false; // 設定魔法尚未播放完成
  updateMagicAnimation.lastTime = millis(); // 重設魔法動畫時間
} // 結束 startMagic 函式

function startEffect() { // 開始播放魔法特效
  gameState = "effect"; // 切換至特效狀態
  currentFrame = 0; // 將特效影格歸零
  animationTimer = 0; // 將特效計時器歸零
  effectX = characterX + facingDirection * (characterWidth / 2); // 將特效放在角色面向側
  effectY = characterY; // 將特效垂直位置設定在角色中心
  updateEffectAnimation.lastTime = millis(); // 重設特效動畫時間
} // 結束 startEffect 函式

function finishEffect() { // 結束特效播放
  gameState = "normal"; // 回到一般狀態
  currentFrame = 0; // 將一般動畫影格歸零
  animationTimer = 0; // 將動畫計時器歸零
  updateNormalAnimation.lastTime = millis(); // 重設一般動畫時間
} // 結束 finishEffect 函式

function updateCharacterSize() { // 計算角色顯示尺寸
  characterHeight = height / 3; // 將角色高度設定為畫布高度三分之一

  if (gameState === "magic") { // 判斷目前是否播放魔法動畫
    characterWidth = characterHeight * (MAGIC_SHEET_WIDTH / MAGIC_FRAME_COUNT) / MAGIC_SHEET_HEIGHT; // 依魔法單格比例計算寬度
  } else if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) { // 判斷目前是否正在行走
    characterWidth = characterHeight * (WALK_SHEET_WIDTH / WALK_FRAME_COUNT) / WALK_SHEET_HEIGHT; // 依行走單格比例計算寬度
  } else { // 處理待機狀態
    characterWidth = characterHeight * (STOP_SHEET_WIDTH / STOP_FRAME_COUNT) / STOP_SHEET_HEIGHT; // 依待機單格比例計算寬度
  } // 結束角色寬度計算

  updateCharacterY(); // 更新角色垂直位置
} // 結束 updateCharacterSize 函式

function updateEffectSize() { // 計算特效顯示尺寸
  effectHeight = max(characterHeight * 0.18, 24); // 將特效高度設定為角色高度的百分之十八且至少為24像素
  effectWidth = effectHeight * (EFFECT_SHEET_WIDTH / EFFECT_FRAME_COUNT) / EFFECT_SHEET_HEIGHT; // 依特效單格比例計算寬度
  effectY = characterY; // 將特效垂直位置設定在角色中心
} // 結束 updateEffectSize 函式

function updateCharacterY() { // 更新角色垂直位置
  characterY = height - characterHeight / 2; // 讓角色底端貼齊畫布底端
} // 結束 updateCharacterY 函式

function limitCharacterPosition() { // 限制角色位置不超出畫布
  const halfWidth = characterWidth / 2; // 計算角色寬度的一半
  characterX = constrain(characterX, halfWidth, width - halfWidth); // 限制角色中心位於畫布範圍內
  updateCharacterY(); // 確保角色底端持續貼齊畫布底端
} // 結束 limitCharacterPosition 函式

function keyPressed() { // 處理鍵盤按下事件
  if (key === " " && !spaceKeyLocked) { // 判斷是否按下空白鍵且尚未鎖定
    spaceKeyLocked = true; // 鎖定空白鍵避免重複觸發
    startMagic(); // 啟動魔法動畫
  } // 結束空白鍵判斷
} // 結束 keyPressed 函式

function keyReleased() { // 處理鍵盤放開事件
  if (key === " ") { // 判斷是否放開空白鍵
    spaceKeyLocked = false; // 解除空白鍵鎖定
  } // 結束空白鍵判斷
} // 結束 keyReleased 函式

function windowResized() { // 處理視窗尺寸改變
  const oldWidth = width; // 儲存原本畫布寬度
  const relativeX = oldWidth > 0 ? characterX / oldWidth : 2 / 3; // 計算角色相對水平位置

  resizeCanvas(windowWidth, windowHeight); // 重新調整畫布大小
  updateCharacterSize(); // 重新計算角色尺寸
  updateEffectSize(); // 重新計算特效尺寸

  characterX = relativeX * width; // 依相對位置恢復角色 X 座標
  limitCharacterPosition(); // 限制角色不可超出畫布
} // 結束 windowResized 函式