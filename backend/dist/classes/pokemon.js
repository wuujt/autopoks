"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pokemon = void 0;
class Pokemon {
    constructor(name, hp, attack, level, defense, specialAttack, specialDefense, speed, iconSelect, type1, type2, primaryMove, secondaryMove) {
        this.moves = [];
        this.primaryMove = null; // Set default to null
        this.secondaryMove = null; // Set default to null
        this.name = name;
        this.hp = hp;
        this.attack = attack;
        this.level = level;
        this.defense = defense;
        this.specialAttack = specialAttack;
        this.specialDefense = specialDefense;
        this.speed = speed;
        this.iconSelect = iconSelect;
        this.primaryMove = primaryMove || null;
        this.secondaryMove = secondaryMove || null;
        this.type1 = type1;
        this.type2 = type2;
        this.level = 50;
        this.actualHp =
            Math.floor((2 * this.hp * this.level) / 100) + this.level + 10;
        this.actualAttack = Pokemon.calculateOtherStats(this.attack, this.level);
        this.actualDefense = Pokemon.calculateOtherStats(this.defense, this.level);
        this.actualSpecialAttack = Pokemon.calculateOtherStats(this.specialAttack, this.level);
        this.actualSpecialDefense = Pokemon.calculateOtherStats(this.specialDefense, this.level);
        this.actualSpeed = Pokemon.calculateOtherStats(this.speed, this.level);
    }
    static calculateOtherStats(base, level) {
        const stat = Math.floor((2 * base * level) / 100) + 5;
        return stat;
    }
    //0 if primary 1 if secondary
    static drawAttack() {
        return Math.random() < 0.8 ? 0 : 1;
    }
}
exports.Pokemon = Pokemon;
