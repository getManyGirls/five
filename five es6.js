

function value(map, who = "black") {

    let vTable = {
        mian1: 1,
        mian2: 10,
        mian3: 100,
        mian4: 1000,
        mian5: 1000000,
        huo1: 10,
        huo2: 100,
        huo3: 1000,
        huo4: 10000,
        huo5: 1000000
    };

    let scMap = [];
    function col() {
        for (let i = 0; i < map.length; i++) {
            scMap.push(map[i]);
        }
    }

    function row() {
        for (let i = 0; i < map.length; i++) {
            let r = [];
            for (let j = 0; j < map.length; j++) {
                r.push(map[j][i]);
            }
            scMap.push(r);
        }
    }

    function lDiag() {
        for (let i = 0; i < map.length; i++) {
            let ldU = [];
            let ldD = [];
            for (let j = 0; j < map.length - i; j++) {
                ldD.push(map[j][i + j]);
                if (i != 0) {
                    ldU.push(map[i + j][j]);
                }
            }
            scMap.push(ldD);
            if (i != 0)
                scMap.push(ldU);
        }
    }

    function rDiag() {
        for (let i = 0; i < map.length; i++) {
            let rdU = [];
            let rdD = [];
            for (let j = 0; j <= i; j++) {
                rdU.push(map[j][i - j]);
                if (i != map.length - 1) {
                    let axis = map.length - 1;
                    rdD.push(map[axis - i + j][axis - j]);
                }
            }
            scMap.push(rdU);
            if (i != map.length - 1)
                scMap.push(rdD);
        }
    }


    function caluScore(list) {

        let statistics = {}
        statistics.black = {}
        statistics.white = {}
        let pre = list[0];
        let cnt = 0;
        let blk = 1;

        for (let i = 0; i <= list.length; i++) {
            let current = -1 * pre;
            if (i != list.length) current = list[i];
            //console.log(pre, current)
            if (pre == current) {
                cnt++;
            } else {
                let flag = false;
                if (pre == 0) flag = true;
                if (current != 0 && blk == 1) flag = true;
                if (i == list.length && blk == 1) flag = true;
                if (cnt >= 5 && pre != 0) flag = false

                if (!flag) {
                    if (current != 0) blk = 1;
                    let name = (pre == 1 ? "black" : "white");
                    if(cnt>5) cnt=5;
                    let style = (blk == 1 ? "mian" : "huo") + cnt.toString();
                    if (statistics[name][style]) {
                        statistics[name][style]++;
                    } else {
                        statistics[name][style] = 1;
                    }
                    //console.log(name, style)
                }
                blk = pre == 0 ? 0 : 1;
                pre = current;
                cnt = 1;

            }
        }
        let score = 0;
        for (let i in statistics[who]) {
            //  console.log(i)
            score += vTable[i];
        }
        let other = (who == 'black' ? 'white' : 'black');
        for (let i in statistics[other]) {
            score -=2* vTable[i];
        }
        return score;
    }
    col();
    row();
    rDiag();
    lDiag();
    let score = 0;
    for (let i = 0; i < scMap.length; i++) {
        let temp = scMap[i];
        // console.log(temp)
        score += caluScore(temp);
    }
    return score;
}

//let s = value(map);

function createCompare(middle) {
    let centre = parseInt(middle / 2 + 1);
    function abs(a) {
        return Math.abs(a.x - centre) + Math.abs(a.y - centre);
    }
    function compare(a, b) {
        return abs(a) < abs(b);
    }
    return compare;
}

class point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        // this.canPut=true;
    }
    toString() {
        return this.x.toString() + ' ' + this.y.toString()
    }
}
function getAva(map) {
    let arr = []
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            if (map[i][j] == 0) arr.push(new point(i, j))
        }
    }
    arr.sort(createCompare(15));
    return arr;
}

function createDire(affx, affy) {
    function next(x, y, flag) {
        if (flag)
            return { x: x + affx, y: y + affy }
        return { x: x - affx, y: y - affy }
    }
    return next;
}

function isWin(map, pos, state) {

    let direct = [[1, 0], [0, 1], [1, 1], [1, -1]];

    function getCnt(next) {

        function fy(flag) {
            let cnt = 0;
            let { x, y } = pos;
            while (x >= 0 && y >= 0 && x < map.length && y < map.length) {
                // console.log(x,y)
                if (map[x][y] == state)
                    cnt++;
                else
                    break;
                ({ x, y } = next(x, y, flag));
            }
            return cnt;
        }
        let cnt = fy(true) + fy(false) - 1;
        return cnt;
    }

    for (let i = 0; i < direct.length; i++) {
        let cnt = getCnt(createDire(direct[i][0], direct[i][1]));
        if (cnt >= 5)
            return true;
    }
    return false;
}

//console.log(isWin(map, new point(2, 2), 1))
//let arr=getAva(map);
const INF = 100000000
function MaxminS(map, dept, state = 1, arr = getAva(map), pos = new point(-1, -1), preBest = INF * -1) {

    function isSearch(p) {
        let { x, y } = p;
        let direct = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for (let i of direct) {
            let next = createDire(...i);
            let pp = [];
            pp.push(next(x, y, false));
            pp.push(next(x, y, true));

            for (let j = 0; j < 2; j++) {
                if (pp[j].x >= 0 && pp[j].y >=0 && pp[j].x < map.length &&
                    pp[j].y < map.length && map[pp[j].x][pp[j].y] != 0) {
                    return true;
                }
            }
        }
        return false;
    }
   
    function arrCopy(a, omit, start = 0, end = a.length) {
        let arr = []
        for (let i = start; i < end; i++) {
            if (i != omit)
                arr.push(a[i])
        }
        return arr;
    }
    function max(arr) {
        let max_ = -INF;
        let pos_ = new point(0, 0);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].sc > max_) {
                max_ = arr[i].sc;
                pos_ = arr[i].pos;
            }
        }
        return { sc: max_, pos: pos_ };
    }

    function min(arr) {
        let min_ = INF;
        let pos_ = new point(0, 0);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].sc < min_) {
                min_ = arr[i].sc;
                pos_ = arr[i].pos;
            }
        }
        return { sc: min_, pos: pos_ };
    }
    if (pos.x != -1 && !isSearch(pos)) {
        console.log(pos)
        return { sc: INF * -state, pos: pos };
    }
    if (dept <= 0 || isWin(map, pos, -state)) {

        let sc = value(map);
        return { sc: sc, pos: pos }
    }
    let best = -state * INF;
    let stc = [];
    for (let i = 0; i < arr.length; i++) {
        if (!isSearch(arr[i])) {
            continue;
        }
      // console.log(arr[i])
        let { x, y } = arr[i];
        map[x][y] = state;
        let temp = MaxminS(map, dept - 1, -state, arrCopy(arr, i), arr[i], best);
        map[x][y] = 0;
        stc.push(temp);
        if(dept==3){
            console.log(temp)
        }
        if (state == 1) {
            best = stc.length != 0 ? max(stc).sc : best
            if (preBest < best && pos.x != -1) {
                return { sc: best, pos: pos }
            }
        } else {
            best = stc.length != 0 ? min(stc).sc : best
            if (best < preBest) {
                return { sc: best, pos: pos }
            }
        }
    }


    let sc = (state == 1 ? max(stc) : min(stc));
    if (pos.x == -1) {
        pos = sc.pos;
    }
    return { sc: sc.sc, pos: pos };
}


// let map = [
//     [1, 0, 1, -1, 0],
//     [1, 1, 1, 1, 0],
//     [-1, 1, -1, -1, 1],
//     [0, 0, 1, -1, 0],
//     [1, 0, -1, -1,0]
// ]
// let map = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//0
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//1
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//2
// [0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0],//3
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//4
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//5
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//6
// [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],//7
// [0, 0, 0, 0, 0, -1,-1, -1, -1, 0, 0, 0, 0, 0, 0],//8
// [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],//9
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//10
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//11
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//12
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],//13
// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]//14
// let pos = MaxminS(map,3, 1);
// console.log(pos.pos + " ", pos.sc);

// function isSearch(map, p) {
//     let { x, y } = p;
//     let direct = [[1, 0], [0, 1], [1, 1], [1, -1]];
//     for (let i of direct) {
//         let next = createDire(...i);
//         let pp = [];
//         pp.push(next(x, y, false));
//         pp.push(next(x, y, true));
//         console.log(next(x, y, false))
//         console.log(next(x, y, true))
//         for (let j = 0; j < 2; j++) {
//             if (pp[j].x >= 0 && pp[j].y >= 0 && pp[j].x < map.length &&
//                 pp[j].y < map.length && map[pp[j].x][pp[j].y] != 0) {
//                 return true;
//             }
//         }
//     }
//     return false;
// }

//  console.log(isSearch(map,{ x: 0, y: 1 }))
//  console.log(map[0][2])