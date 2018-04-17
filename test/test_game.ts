import * as game from '../src/Game'
import {expect} from 'chai'


describe('Matrix test', () => {
    it('test rotate', () => {
        const matrix = new game.GameMatrix()
        matrix.setValue([0, 0], 2)
        matrix.rotate(90)
        expect(matrix.getValue([3, 0])).eq(2)
    });
    it('test mergeColumn', () => {
        const matrix = new game.GameMatrix()
        matrix.setColumn(0, [2, 2, 2, 2])
        expect(matrix.mergeColumn(0)).eqls([4, 4, 0, 0])
        matrix.setColumn(1, [2048, 1024, 1024, 2])
        expect(matrix.mergeColumn(1)).eqls([2048, 2048, 2, 0])
    })
})