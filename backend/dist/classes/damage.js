"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Damage = void 0;
class Damage {
    static getEffectiveness(attackType, defenseType) {
        var _a, _b;
        return (_b = (_a = this.typeChart[attackType]) === null || _a === void 0 ? void 0 : _a[defenseType]) !== null && _b !== void 0 ? _b : 1;
    }
    static calculateDamage(attacker, defenser, attack) {
        const rand = Math.random() * (1 - 0.85) + 0.85;
        const move = attack === 0 ? attacker.primaryMove : attacker.secondaryMove;
        const stab = (move === null || move === void 0 ? void 0 : move.type) === attacker.type1 || (move === null || move === void 0 ? void 0 : move.type) === attacker.type2 ? 1.5 : 1;
        const level = 50;
        if (move) {
            const effectiveness1 = this.getEffectiveness(move.type, defenser.type1);
            const effectiveness2 = defenser.type1
                ? this.getEffectiveness(move.type, defenser.type2)
                : 0;
            if (move.damageClass == "status")
                return 10;
            const attackn = move.damageClass == "special"
                ? attacker.actualSpecialAttack
                : attacker.actualAttack;
            const defense = move.damageClass == "special"
                ? defenser.actualSpecialDefense
                : attacker.actualDefense;
            const dmg = ((((2 * level) / 5 + 2) * move.power * attackn) / defense / 50) *
                rand *
                effectiveness1 *
                effectiveness2;
            return Math.round(dmg);
        }
        return 0;
    }
}
exports.Damage = Damage;
Damage.typeChart = {
    Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
    Fire: {
        Fire: 0.5,
        Water: 0.5,
        Grass: 2,
        Ice: 2,
        Bug: 2,
        Rock: 0.5,
        Dragon: 0.5,
        Steel: 2,
    },
    Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
    Electric: {
        Water: 2,
        Electric: 0.5,
        Grass: 0.5,
        Ground: 0,
        Flying: 2,
        Dragon: 0.5,
    },
    Grass: {
        Fire: 0.5,
        Water: 2,
        Grass: 0.5,
        Poison: 0.5,
        Ground: 2,
        Flying: 0.5,
        Bug: 0.5,
        Rock: 2,
        Dragon: 0.5,
        Steel: 0.5,
    },
    Ice: {
        Fire: 0.5,
        Water: 0.5,
        Grass: 2,
        Ice: 0.5,
        Ground: 2,
        Flying: 2,
        Dragon: 2,
        Steel: 0.5,
    },
    Fighting: {
        Normal: 2,
        Ice: 2,
        Rock: 2,
        Dark: 2,
        Steel: 2,
        Flying: 0.5,
        Poison: 0.5,
        Psychic: 0.5,
        Bug: 0.5,
        Ghost: 0,
        Fairy: 0.5,
    },
    Poison: {
        Grass: 2,
        Poison: 0.5,
        Ground: 0.5,
        Rock: 0.5,
        Ghost: 0.5,
        Fairy: 2,
        Steel: 0,
    },
    Ground: {
        Fire: 2,
        Electric: 2,
        Grass: 0.5,
        Poison: 2,
        Flying: 0,
        Bug: 0.5,
        Rock: 2,
        Steel: 2,
    },
    Flying: {
        Electric: 0.5,
        Grass: 2,
        Fighting: 2,
        Bug: 2,
        Rock: 0.5,
        Steel: 0.5,
    },
    Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
    Bug: {
        Fire: 0.5,
        Grass: 2,
        Fighting: 0.5,
        Poison: 0.5,
        Flying: 0.5,
        Psychic: 2,
        Ghost: 0.5,
        Dark: 2,
        Steel: 0.5,
        Fairy: 0.5,
    },
    Rock: {
        Fire: 2,
        Ice: 2,
        Fighting: 0.5,
        Ground: 0.5,
        Flying: 2,
        Bug: 2,
        Steel: 0.5,
    },
    Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
    Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
    Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
    Steel: {
        Fire: 0.5,
        Water: 0.5,
        Electric: 0.5,
        Ice: 2,
        Rock: 2,
        Steel: 0.5,
        Fairy: 2,
    },
    Fairy: {
        Fire: 0.5,
        Fighting: 2,
        Poison: 0.5,
        Dragon: 2,
        Dark: 2,
        Steel: 0.5,
    },
};
