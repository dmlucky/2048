var data = []; //储存游戏数据
var score = 0; //当前分数
var isMoved = false;
var isEnd = false;
//初始化
function initial() {
  //将胜利与结束图层隐藏
  document.getElementById("gameWinContainer").style.display = "none";
  document.getElementById("gameOverContainer").style.display = "none";
  //初始化游戏数据
  for (var i = 0; i < 4; i++) {
    data[i] = [];
    for (var j = 0; j < 4; j++) {
      data[i][j] = 0;
    }
  }
  isMoved = false;
  isEnd = false;
  score = 0;
  getRandomNumber();
  getRandomNumber();
  //将数组显示在网页上
  updateView();
  //保存历史记录
  //按键绑定以移动
  move();
}
initial();
//在数组中上生成随机数
function getRandomNumber() {
  var di = [];
  var dj = [];
  var index = 0;
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (data[i][j] == 0) {
        di[index] = i;
        dj[index] = j;
        index++;
      }
    }
  }
  if (index == 0) {
    return;
  }
  var rand = Math.floor(Math.random() * index);
  var i = di[rand];
  var j = dj[rand];
  data[i][j] = Math.random() < 0.85 ? 2 : 4;
}

//监测键盘按键并移动元素
function move() {
  console.log(1);
  document.onkeydown = function (event) {
    switch (event.keyCode) {
      case 37:
        moveLeft();
        break;
      case 38:
        moveUp();
        break;
      case 39:
        moveRight();
        break;
      case 40:
        moveDown();
        break;
      default:
        break;
    }
  };
}

//更新界面显示
function updateView() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      var element = document.getElementById("elem_" + i + "_" + j);
      var elemNum = data[i][j];

      // 如果数组中对应的值是0，方块的内容设置为空
      if (elemNum == 0) {
        element.innerHTML = "";
        element.className = "elem_" + i + "_" + j;
      } else {
        element.innerHTML = elemNum;
        element.className = "elem_" + i + "_" + j + " " + "n" + elemNum;
      }
    }
  }
  //更新分数
  var scoreDom = document.getElementById("userScore");
  scoreDom.innerHTML = score;
}

//移动一个元素
function moveSingle(i, j, di, dj) {
  if (isEnd) {
    return;
  }
  if (data[i][j] == 0) {
    return;
  }
  var ti = i + di; //结束位置
  var tj = j + dj; //结束位置
  var ts = data[i][j]; //移动产生的分数
  //没越界且是空格子就可以移动
  while (ti >= 0 && ti < 4 && tj >= 0 && tj < 4 && data[ti][tj] == 0) {
    ti += di;
    tj += dj;
  }
  //如果移动到越界
  if (ti < 0 || ti > 3 || tj < 0 || tj > 3) {
    ti = ti - di;
    tj = tj - dj;
  }
  //遇到其他方块
  else {
    if (data[ti][tj] == data[i][j]) {
      ts = 2 * data[ti][tj];
      score += data[ti][tj];
    } else {
      ti = ti - di;
      tj = tj - dj;
    }
  }

  //能否滑动的关键
  if (ti != i || tj != j) {
    data[ti][tj] = ts;
    data[i][j] = 0;
    isMoved = true;
    //通过修改elem元素的类名，使其定位发生变化，并通过transition属性产生动画
    var elems = document.getElementById("elem_" + i + "_" + j);
    var elemt = document.getElementById("elem_" + ti + "_" + tj);
    elems.id = "elem_" + ti + "_" + tj;
    elems.className = "elem_" + ti + "_" + tj;
    elemt.id = "elem_" + i + "_" + j;
    elemt.classname = "elem_" + i + "_" + j;
    elemt.innerHTML = "";
  }
}

//全部元素向左移
function moveLeft() {
  isMoved = false;
  var di = 0;
  var dj = -1;
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      moveSingle(i, j, di, dj);
    }
  }
  check();
}

//向右移
function moveRight() {
  isMoved = false;
  var di = 0;
  var dj = 1;
  //位移矢量为（0，1）
  for (var i = 0; i <= 3; i++) {
    for (var j = 3; j >= 0; j--) {
      moveSingle(i, j, di, dj);
    }
  }
  check();
}
//向下移
function moveDown() {
  isMoved = false;
  var di = 1;
  var dj = 0;
  for (var j = 0; j < 4; j++) {
    for (var i = 3; i >= 0; i--) {
      moveSingle(i, j, di, dj);
    }
  }
  check();
}
//向上移
function moveUp() {
  isMoved = false;
  var di = -1;
  var dj = 0;
  for (var j = 0; j < 4; j++) {
    for (var i = 0; i < 4; i++) {
      moveSingle(i, j, di, dj);
    }
  }
  check();
}
//检测是否应当生成随机数，游戏是否结束，是否胜利
function check() {
  if (isMoved) {
    getRandomNumber();
    updateView();
  }
  if (isWin()) {
    isEnd = true;
    var elem = document.getElementById("gameWinContainer");
    elem.style.display = "block";
  } else if (isOver()) {
    isEnd = true;
    var elem = document.getElementById("gameOverContainer");
    elem.style.display = "block";
  }
}
//判断游戏是否失败
function isOver() {
  var di = [0, 0, 1, -1];
  var dj = [1, -1, 0, 0];
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      for (var k = 0; k < 4; k++) {
        if (data[i][j] == 0) {
          return false;
        }
        var ti = i + di[k];
        var tj = j + dj[k];
        if (0 <= ti && ti < 4 && 0 <= tj && tj < 4) {
          if (data[ti][tj] == data[i][j]) {
            return false;
          }
        }
      }
    }
  }
  return true;
}
//判断游戏是否胜利
function isWin() {
  for (var i = 0; i < 4; i++) {
    for (var j = 0; j < 4; j++) {
      if (data[i][j] == 2048) {
        return true;
      }
    }
  }
  return false;
}
