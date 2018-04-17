"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var GameMatrix = (function (_super) {
    __extends(GameMatrix, _super);
    function GameMatrix() {
        var _this = _super.call(this, 4) || this;
        for (var i = 0; i < _this.length; i++) {
            _this[i] = new Array(4).fill(0);
        }
        return _this;
    }
    GameMatrix.prototype.rotate = function (degree) {
        degree %= 360;
        if (degree !== 270 && degree !== 180 && degree !== 90 && degree !== 0)
            throw Error("Invalid degree argument");
        if (degree === 90) {
            this.reverse();
            for (var i = 0; i < this.length; i++) {
                for (var j = 0; j < this.length; j++) {
                    _a = [this[j][i], this[i][j]], this[i][j] = _a[0], this[j][i] = _a[1];
                }
            }
        }
        var _a;
    };
    return GameMatrix;
}(Array));
exports.GameMatrix = GameMatrix;
var GameLogic = (function () {
    function GameLogic() {
        this.matrix = new GameMatrix();
        var _a = _.sampleSize(this.getNullPosition(), 2), a = _a[0], b = _a[1];
        this.matrix[a[0]][a[1]] = 2;
        this.matrix[b[0]][b[1]] = 2;
    }
    GameLogic.prototype.generateRandomPoints = function (n) {
        var _this = this;
        if (n === void 0) { n = 1; }
        var points = _.sampleSize(this.getNullPosition(), n);
        if (points.length == 0) {
            return;
        }
        points.forEach(function (p) {
            var rand_num = _.sample([2, 4]);
            if (rand_num != null)
                _this.matrix[p[0]][p[1]] = rand_num;
        });
    };
    GameLogic.prototype.getNullPosition = function () {
        var res = [];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (!this.matrix[i][j]) {
                    res.push([i, j]);
                }
            }
        }
        return res;
    };
    return GameLogic;
}());
exports.GameLogic = GameLogic;
