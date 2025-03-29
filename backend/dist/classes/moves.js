"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Move = void 0;
class Move {
    constructor(name, despription, power, accuracy, type, damageClass) {
        this.name = name;
        this.description = despription;
        this.power = power;
        this.accuracy = accuracy;
        this.type = type;
        this.damageClass = damageClass;
    }
}
exports.Move = Move;
