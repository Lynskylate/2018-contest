import * as _ from 'lodash'
import get = Reflect.get;
import enumerate = Reflect.enumerate;

type Point = [number, number]
type column = [number, number, number, number]
type row = column
type Matrix = Array<number[]>
type MoveVec_2d = [number, number]
type MoveVec_3d = [Point, Point]

export class GameMatrix {

    arry: Matrix

    constructor() {
        this.arry = Array.from({length: 4}, e => Array(4).fill(0))
    }

    public rotate(degree: number): void {
        degree %= 360
        if (degree !== 270 && degree !== 180 && degree !== 90 && degree !== 0) throw Error("Invalid degree argument")
        if (degree === 0) {
            return
        }
        if (degree === 90) {
            let tmp: Matrix = Array.from({length: 4}, e => Array(4).fill(0))
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    tmp[i][j] = this.arry[4 - j - 1][i]
                }
            }
            this.arry = tmp
            return
        }
        if (degree === 180) {
            this.rotate(90)
            this.rotate(90)
        }
        if (degree === 270) {
            this.rotate(90)
            this.rotate(90)
            this.rotate(90)
        }
    }

    public setColumn(n: number, v: column) {
        for (let i = 0; i < 4; i++) {
            this.arry[i][n] = v[i]
        }
    }

    public setMatrix(mat: Matrix) {
        for (let i = 0; i < 4; i++) {
            this.arry[i] = mat[i]
        }
    }

    public setRow(n: number, v: row) {
        this.arry[n] = v
    }

    public setValue(p: Point, v: number) {
        this.arry[p[0]][p[1]] = v;
    }

    public getValue(p: Point) {
        return this.arry[p[0]][p[1]]
    }

    public getColumnVector(n: number): column {
        let vector: column = [0, 0, 0, 0]
        for (let i = 0; i < 4; i++) {
            vector[i] = this.arry[i][n]
        }
        return vector
    }

    public moveUp(v: column): void {
        for (let i = 0; i <= 3; i++) {
            if (v[i])
                continue
            const index = _.findIndex(v, (value) => value, i)
            if (index != -1) {
                v[i] = v[index]
                v[index] = 0
                continue
            }
        }
    }

    public mergeColumn(n: number | column) {
        let v: column
        let score = 0
        if (typeof n === 'number') {
            v = this.getColumnVector(n)
        }
        else {
            v = n
        }
        for (let i = 0; i < 3; i++) {
            if (v[i] == v[i + 1]) {
                v[i] += v[i + 1]
                v[i + 1] = 0
                score += v[i]
            }
        }
        return score
    }
}


export class GameManager {
    matrix: GameMatrix
    eles: Element[]
    score: number

    constructor(dom: Element) {
        this.eles = Array.from(dom.querySelectorAll('.grid-cell'))
        this.matrix = new GameMatrix()
        let [a, b] = _.sampleSize(this.getNullPosition(), 2)
        this.matrix.setValue(a, 2)
        this.matrix.setValue(b, 2)
        this.score = 0
    }

    restart() {
        this.matrix = new GameMatrix()
        let [a, b] = _.sampleSize(this.getNullPosition(), 2)
        this.matrix.setValue(a, 2)
        this.matrix.setValue(b, 2)
        this.score = 0
    }

    moveUp(): void {
        const last_mat = _.cloneDeep(this.matrix)
        for (let i = 0; i < 4; i++) {
            let v = this.matrix.getColumnVector(i)
            this.matrix.moveUp(v)
            this.score += this.matrix.mergeColumn(v)
            this.matrix.moveUp(v)
            this.matrix.setColumn(i, v)
        }
        if (JSON.stringify(last_mat.arry) !== JSON.stringify(this.matrix.arry)) {
            const points: null | Point[] = this.generateRandomPoints()
            if (points !== null) {
                points.forEach((p) => {
                    const rand_num = _.sample([2, 4]);
                    if (rand_num != null)
                        this.matrix.setValue(p, rand_num)
                })
            }
        }
    }

    render() {
        for (let i = 0; i < 16; i++) {
            let data = this.matrix.getValue([Math.floor(i / 4), i % 4])
            if (!data) {
                continue;
            }
            let number_div = document.createElement('div')
            number_div.classList.add("grid-number")
            number_div.classList.add("number-cell-" + data.toString())
            const number_span = document.createElement('span')
            number_span.innerText = data.toString()
            number_div.appendChild(number_span)
            this.eles[i].appendChild(number_div)
        }
        const ele = document.getElementById("score")
        ele && (ele.innerText = this.score.toString())
    }

    clean() {
        this.eles.forEach((e) => {
            e.innerHTML = ""
        })
    }


    private generateRandomPoints(n: number = 1): Point[] | null {
        let points: Point[] = _.sampleSize<Point>(this.getNullPosition(), n)
        if (points.length == 0) {
            return null
        }
        return points
    }

    private getNullPosition(): Point[] {
        let res: Array<Point> = []
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (!this.matrix.getValue([i, j])) {
                    res.push([i, j])
                }
            }
        }
        return res
    }

    private checkfail(origin_mat: GameMatrix) {
        const mat_arry = _.cloneDeep(origin_mat.arry)
        const compare_mat = JSON.stringify(origin_mat)
        this.moveDown()
        if (JSON.stringify(this.matrix) !== compare_mat) {
            this.matrix.setMatrix(mat_arry)
            return
        }
        this.moveLeft()
        if (JSON.stringify(this.matrix) !== compare_mat) {
            this.matrix.setMatrix(mat_arry)
            return
        }
        this.moveRight()
        if (JSON.stringify(this.matrix) !== compare_mat) {
            this.matrix.setMatrix(mat_arry)
            return
        }
        alert("您已经输了,点击重新开始再来一把吧")
    }

    private moveDown() {
        this.matrix.rotate(180)
        this.moveUp()
        this.matrix.rotate(180)
    }

    private moveRight() {
        this.matrix.rotate(270)
        this.moveUp()
        this.matrix.rotate(90)
    }

    private moveLeft() {
        this.matrix.rotate(90)
        this.moveUp()
        this.matrix.rotate(270)
    }

    public action(action: 'l' | 'r' | 'u' | 'd'): void {
        const origin_mat = _.cloneDeep(this.matrix)
        if (action === 'u') {
            this.moveUp()
        } else if (action === 'l') {
            this.moveLeft()
        } else if (action === 'd') {
            this.moveDown()
        } else if (action === 'r') {
            this.moveRight()
        }
        this.clean()
        this.render()
        this.checkfail(this.matrix)
    }

}