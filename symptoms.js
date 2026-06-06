// База данных симптомов цикла
export const SYMPTOMS = {
    menstruation: [
        "Тянущая боль внизу живота",
        "Легкая утомляемость и сонливость",
        "Повышенный аппетит (тяга к сладкому или соленому)",
        "Раздражительность и резкая смена настроения",
        "Легкая головная боль",
        "Повышенная чувствительность груди",
        "Отечность и ощущение тяжести в теле",
        "Апатия и нежелание активно двигаться"
    ],
    ovulation: [
        "Внезапный прилив сил и энергии",
        "Заметное усиление либидо",
        "Легкое покалывание в боку (овуляторный синдром)",
        "Обострение обоняния (чувствительность к запахам)",
        "Улучшение настроения, уверенность в себе",
        "Легкое покалывание в области поясницы"
    ]
};

// Развитие плода по неделям
export const PREGNANCY_STAGES = {
    1: { size: "Размер клетки", weight: "Менее 0.1 г", belly: "Живот незаметен", desc: "Происходит оплодотворение и деление клеток. Тело готовится к имплантации." },
    4: { size: "Маковое зёрнышко", weight: "Менее 1 г", belly: "Живот незаметен", desc: "Эмбрион закрепился в матке. Возможен легкий ранний токсикоз, чувствительность к запахам." },
    8: { size: "Ягода малины", weight: "Около 1 г", belly: "Живот незаметен", desc: "Формируются зачатки конечностей и внутренних органов. Набухает и тяжелеет грудь." },
    12: { size: "Крупная слива", weight: "Около 15 г", belly: "Едва уловимая округлость", desc: "Конец 1-го триместра. Органы сформированы, плод начинает шевелиться, но это еще не чувствуется." },
    16: { size: "Крупный авокадо", weight: "Около 100 г", belly: "Заметный небольшой бугорок", desc: "Активный рост. У повторнородящих возможны первые нежные шевеления («бабочки в животе»)." },
    20: { size: "Большой банан", weight: "Около 300 г", belly: "Округлый, отчетливый живот", desc: "Экватор. Плод отчетливо пихается. Кожа растягивается, матка на уровне пупка." },
    24: { size: "Початок кукурузы", weight: "Около 600 г", belly: "Выпирающий, округлый живот", desc: "Плод слы слышит звуки. Появляется тяжесть в пояснице, легкая одышка при быстрой ходьбе." },
    28: { size: "Крупный баклажан", weight: "Около 1100 г", belly: "Большой, высоко поднятый живот", desc: "Начало 3-го триместра. Толчки сильные, видны снаружи. Труднее спать на спине." },
    32: { size: "Тыква сквош", weight: "Около 1700 г", belly: "Очень большой, стесняет движения", desc: "Организму тяжело. Появляются тренировочные схватки Брэкстона-Хикса, изжога." },
    36: { size: "Крупный кочан капусты", weight: "Около 2500 г", belly: "Огромный, давит на ребра", desc: "Живот постепенно начинает опускаться вниз. Ребенок занимает финальное положение головой вниз." },
    40: { size: "Большой арбуз", weight: "Около 3400 г", belly: "Максимальный размер, опущен вниз", desc: "Срок родов. Матка сильно давит на мочевой пузырь, ходить и дышать тяжело. Готовность к схваткам." }
};

// Физиология послеродового периода
export const POSTPARTUM_STAGES = {
    7: { name: "Раннее восстановление", desc: "Организм истощен после родов. Наблюдаются обильные выделения (лохии), слабость. На 3-5 день приходит грудное молоко, грудь наливается и становится очень чувствительной." },
    20: { name: "Активное заживление", desc: "Матка интенсивно сокращается (особенно при кормлении ребенка). Выделения становятся умеренными. Проявляется сильный инстинкт гнездования и недосып." },
    40: { name: "Завершение восстановления", desc: "Финал послеродового периода. Выделения практически прекратились, лактация полностью стабилизировалась, гормональный фон готовится к возврату менструального цикла." }
};

// Осложнения беременности
export const COMPLICATIONS_POOL = {
    1: [
        { id: "toxicosis_severe", name: "Тяжелый токсикоз", curable: true, desc: "Непрекращающаяся тошнота, рвота от любой пищи, сильная слабость и истощение." },
        { id: "miscarriage_threat_early", name: "Угроза выкидыша (ранний срок)", curable: true, desc: "Тянущие, спазматические боли внизу живота, мажущие кровянистые выделения. Требуется полный покой." },
        { id: "anemia_early", name: "Железодефицитная анемия", curable: true, desc: "Сильная бледность, постоянное головокружение, потемнение в глазах при резком подъеме." }
    ],
    2: [
        { id: "hypertonus", name: "Гипертонус матки", curable: true, desc: "Живот периодически становится каменным на ощупь, сопровождается ноющей болью в пояснице." },
        { id: "gestational_diabetes", name: "Гестационный диабет", curable: false, desc: "Постоянная неутолимая жажда, сухость во рту, быстрая утомляемость. Сохраняется до родов." },
        { id: "polyhydramnios", name: "Многоводие", curable: false, desc: "Размер живота превышает норму для этого срока, ощущение сильного распирания и тяжести." }
    ],
    3: [
        { id: "preeclampsia", name: "Преэклампсия (гестоз)", curable: true, desc: "Сильные отеки ног и лица, головная боль, мушки перед глазами. Опасное состояние." },
        { id: "premature_labor_threat", name: "Угроза преждевременных родов", curable: true, desc: "Регулярные тянущие боли как при месячных, спазмы матки задолго до 40-й недели." },
        { id: "sciatica", name: "Защемление седалищного нерва", curable: false, desc: "Острая простреливающая боль в ягодицу или ногу при ходьбе из-за давления веса матки." }
    ]
};

export function getFetusData(weeks) {
    const milestones = Object.keys(PREGNANCY_STAGES).map(Number).sort((a, b) => b - a);
    for (const week of milestones) {
        if (weeks >= week) return PREGNANCY_STAGES[week];
    }
    return PREGNANCY_STAGES[1];
}

export function getPostpartumData(days) {
    const milestones = Object.keys(POSTPARTUM_STAGES).map(Number).sort((a, b) => a - b);
    for (const day of milestones) {
        if (days <= day) return POSTPARTUM_STAGES[day];
    }
    return POSTPARTUM_STAGES[40];
}

export function getRandomSymptoms(phase, maxCount = 3) {
    const list = SYMPTOMS[phase];
    if (!list || list.length === 0) return [];
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * maxCount) + 1;
    return shuffled.slice(0, count);
}

export function rollComplication(trimester) {
    if (Math.random() * 100 > 20) return null;
    const pool = COMPLICATIONS_POOL[trimester];
    if (!pool || pool.length === 0) return null;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    
    let startWeek = 4;
    if (trimester === 1) startWeek = Math.floor(Math.random() * 9) + 4;
    else if (trimester === 2) startWeek = Math.floor(Math.random() * 14) + 13;
    else if (trimester === 3) startWeek = Math.floor(Math.random() * 13) + 27;

    return { id: selected.id, name: selected.name, desc: selected.desc, curable: selected.curable, triggerWeek: startWeek, isDiscovered: false };
}

function parseFeature(text, type) {
    if (!text) return null;
    const lower = text.toLowerCase();
    
    const keywords = {
        eyes: ["глаза", "глаз", "взгляд", "eyes", "eye", "eyecolor"],
        hair: ["волосы", "волос", "прическа", "шевелюра", "hair", "haircolor"]
    };

    // Красивые словесные описания для вывода в интерфейс
    const colors = {
        "голубые": "голубые", "карие": "карие", "зеленые": "зеленые", "серые": "серые", "черные": "угольно-черные", 
        "светлые": "светлые", "рыжие": "огненно-рыжие", "русые": "русые", "темные": "темные", "белые": "белокурые",
        "blue": "голубые", "brown": "карие", "green": "зеленые", "grey": "серые", "black": "черные", "blond": "светлые", "red": "рыжие"
    };
    
    const words = lower.split(/[\s,.:;()]+/);
    for (let i = 0; i < words.length; i++) {
        if (keywords[type].some(k => words[i].includes(k))) {
            for (let j = Math.max(0, i - 4); j <= Math.min(words.length - 1, i + 4); j++) {
                const cleanWord = words[j].replace(/[^a-zа-яё]/g, '');
                if (colors[cleanWord]) return colors[cleanWord];
            }
        }
    }
    return null;
}

export function generateChildGenetics() {
    // Реальные дефолтные цвета на случай, если карточка пустая или не распарсилась
    const defaultMotherEyes = ["карие", "зеленые", "серые"][Math.floor(Math.random() * 3)];
    const defaultMotherHair = ["темно-русые", "каштановые", "русые"][Math.floor(Math.random() * 3)];
    
    let motherEyes = defaultMotherEyes, motherHair = defaultMotherHair;
    let fatherEyes = "голубые", fatherHair = "светлые";

    if (typeof SillyTavern?.getContext === 'function') {
        const ctx = SillyTavern.getContext();
        const char = ctx.characters?.[ctx.character_id];
        
        if (char) {
            const charText = `${char.description || ''} ${char.personality || ''}`;
            fatherEyes = parseFeature(charText, "eyes") || "темно-карие";
            fatherHair = parseFeature(charText, "hair") || "темные";
        }
    }

    // Наследование
    const babyEyes = Math.random() > 0.5 ? motherEyes : fatherEyes;
    const babyHair = Math.random() > 0.5 ? motherHair : fatherHair;

    return {
        eyes: babyEyes,
        hair: babyHair
    };
}
