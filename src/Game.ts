import * as _ from 'lodash'
import get = Reflect.get;

type Point = [number, number]
type column = [number, number, number, number]
type row = column
type Matrix = Array<number[]>

export class GameMatrix {

    arry: Matrix

    constructor() {
        this.arry = Array.from({length: 4}, e => Array(4).fill(0))
    }

    public rotate(degree: number): void {
        degree %= 360
        if (degree !== 270 && degree !== 180 && degree !== 90 && degree !== 0) throw Error("Invalid degree argument")
        if (degree === 0)
            return
        if (degree === 90) {
            this.arry.reverse()
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    [this.arry[i][j], this.arry[j][i]] = [this.arry[j][i], this.arry[i][j]]
                }
            }
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
            this.arry[n][i] = v[i]
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
            vector[i] = this.arry[n][i]
        }
        return vector
    }

    private moveUp(v: column): void {
        for (let i = 0; i < 3; i++) {
            if (v[i])
                continue
            const index = _.findIndex(v, (value) => value, i)
            if (index != -1) {
                v[i] = v[index]
                v[index] = 0
                break
            }
        }
    }

    public mergeColumn(n: number) {
        let v: column = this.getColumnVector(n)
        for (let i = 0; i < 3; i++) {
            if (v[i] == v[i + 1]) {
                v[i] += v[i + 1]
                v[i + 1] = 0
            }
        }
        this.moveUp(v)
        return v
    }
}

export class GameLogic {
    matrix: GameMatrix

    constructor() {
        this.matrix = new GameMatrix()
        let [a, b] = _.sampleSize(this.getNullPosition(), 2)
        this.matrix.setValue(a, 2)
        this.matrix.setValue(b, 2)
    }

    private generateRandomPoints(n: number = 1) {
        let points: Point[] = _.sampleSize<Point>(this.getNullPosition(), n)
        if (points.length == 0) {
            return
        }
        points.forEach((p) => {
            const rand_num = _.sample([2, 4]);
            if (rand_num != null)
                this.matrix.setValue(p, rand_num)
        })
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

    public action(action: 'l' | 'r' | 'u' | 'd'): void {

    }

}