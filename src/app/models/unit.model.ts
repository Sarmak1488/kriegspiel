// 'export' означает, что этот "чертеж" можно будет использовать в других файлах.
// 'class Unit' - мы объявляем, что создаем чертеж для объекта под названием "Юнит".
export class Unit {
    // Здесь мы перечисляем все свойства, которые есть у юнита.

    // --- ИЗМЕНЕНИЕ №1: Добавляем '!' ---
    // Знак '!' после имени свойства - это наше обещание TypeScript'у.
    // Мы говорим: "Я знаю, что здесь нет начального значения, но я клянусь,
    // что я присвою это значение внутри конструктора. Пожалуйста, не ругайся".
    // Это называется "Non-null Assertion Operator".
    id: string;
    hp: number;
    status: string;
    orders: any[];
    remainingMove: number;
    isFortified: boolean;
    ambushState: { isActive: boolean, isAmbusher: boolean, turnsRemaining: number, targetId: string | null };
    
    // Добавляем '!' ко всем свойствам, на которые он ругался:
    position!: { x: number, y: number };
    side!: number;
    displayName!: string;
    color!: string;
    type!: string;
    unitCount!: number;
    hpPerEntity!: number;
    // Сюда можно добавить и остальные свойства из UNIT_STATS, если они понадобятся
    range!: number;
    lineOfSight!: number;
    metersPerTurn!: number;


    // --- ИЗМЕНЕНИЕ №2: Уточняем тип ---
    // Вместо 'any' мы используем 'Partial<Unit>'.
    // Это более точно. Мы говорим: "Сюда придет объект, у которого будут
    // НЕКОТОРЫЕ (частичные) свойства из класса Unit". Это безопаснее, чем "что угодно".
    constructor(initialStats: Partial<Unit>) {
        // Присваиваем все переданные характеристики нашему новому юниту
        Object.assign(this, initialStats);

        // Задаем уникальный ID
        this.id = 'unit_' + Date.now() + Math.random();
        
        // Теперь TypeScript нам верит, что unitCount и hpPerEntity уже существуют,
        // потому что мы дали ему обещание с помощью знака '!'.
        // Эта строка больше не вызовет ошибки.
        this.hp = this.unitCount * this.hpPerEntity;

        // Задаем начальные значения по умолчанию
        this.status = "в обороне";
        this.orders = [];
        this.remainingMove = 0;
        this.isFortified = false;
        this.ambushState = { isActive: false, isAmbusher: false, turnsRemaining: 0, targetId: null };
    }
}