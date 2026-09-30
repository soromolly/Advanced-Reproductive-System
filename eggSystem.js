export const EGG_SYMPTOMS = {
    ru: {
        egg_heat_female: [
            "Ощутимая тяжесть и тепло внизу живота",
            "Повышенная температура тела, легкие приливы жара",
            "Повышенная чувствительность кожи и слизистых",
            "Естественное усиление смазки в интимной зоне",
            "Обостренное обоняние и вкус",
            "Настойчивое желание близости и телесного тепла"
        ],
        egg_heat_male: [
            "Ощутимая тяжесть и тепло внизу живота",
            "Повышенная температура тела, легкие приливы жара",
            "Повышенная чувствительность кожи и слизистых",
            "Легкое внутреннее напряжение в области таза",
            "Обостренное обоняние и вкус",
            "Настойчивое желание близости и телесного тепла"
        ],
        egg_forming: [
            "Легкое распирание и тяжесть внизу живота",
            "Повышенный аппетит и тяга к теплу",
            "Необычное ощущение «наполнения» изнутри",
            "Повышенная чувствительность кожи живота",
            "Сонливость и желание уединения",
            "Тяга к обустройству уютного места"
        ],
        egg_carrying: [
            "Заметная округлость живота, растущая день ото дня",
            "Ощущение легкого движения внутри (формирование яиц)",
            "Повышенная температура тела и чувствительность к холоду",
            "Инстинктивное желание собрать мягкие вещи в одно место",
            "Раздражительность при приближении к «гнезду» посторонних",
            "Усиление аппетита и потребности в отдыхе"
        ],
        egg_carrying_late: [
            "Тяжелый, плотный живот, давящий вниз",
            "Сильный инстинкт гнездования (не отпускает от обустроенного места)",
            "Ритмичные волны внутреннего давления",
            "Затрудненная подвижность, желание лежать на боку",
            "Обостренная реакция на холод и сквозняки",
            "Постоянное ощущение близкой кладки"
        ],
        egg_laying: [
            "Сильные ритмичные сокращения внизу живота",
            "Волны глубокого давления и жара",
            "Ощущение последовательного выхода яиц",
            "Глубокое физическое облегчение после каждой кладки",
            "Обессиленность и потребность в тепле",
            "Сильная эмоциональная привязанность к отложенным яйцам"
        ],
        egg_recovery: [
            "Усталость и ломота в нижней части живота",
            "Повышенный аппетит (восстановление энергозатрат)",
            "Тяга к постоянному теплу (грелка, объятия, укрытие)",
            "Повышенная эмоциональная уязвимость",
            "Желание не отпускать партнёра от гнезда",
            "Ощущение «пустоты» после кладки"
        ],
        egg_quiescence: [
            "Спокойное, ровное состояние — тело отдыхает между циклами",
            "Отсутствие тяги к близости, стабильный гормональный фон",
            "Обычный аппетит и нормальный уровень энергии",
            "Никаких признаков фертильности или течки",
            "Легкая задумчивость, желание рутины и предсказуемости",
            "Тело копит силы к следующему циклу кладки"
        ]
    },
    en: {
        egg_heat_female: [
            "Noticeable heaviness and warmth in lower abdomen",
            "Elevated body temperature, mild hot flashes",
            "Heightened sensitivity of skin and mucous membranes",
            "Naturally increased lubrication in the intimate area",
            "Sharpened sense of smell and taste",
            "Strong urge for closeness and physical warmth"
        ],
        egg_heat_male: [
            "Noticeable heaviness and warmth in lower abdomen",
            "Elevated body temperature, mild hot flashes",
            "Heightened sensitivity of skin and mucous membranes",
            "Mild internal tension in the pelvic area",
            "Sharpened sense of smell and taste",
            "Strong urge for closeness and physical warmth"
        ],
        egg_forming: [
            "Mild bloating and heaviness in lower abdomen",
            "Increased appetite and craving for warmth",
            "Unusual sense of 'fullness' from within",
            "Heightened sensitivity of abdominal skin",
            "Drowsiness and desire for solitude",
            "Urge to arrange a cozy nesting spot"
        ],
        egg_carrying: [
            "Noticeable belly roundness growing day by day",
            "Subtle sense of movement within (eggs forming)",
            "Elevated body temperature, sensitivity to cold",
            "Instinctive urge to gather soft items in one place",
            "Irritability when strangers approach the 'nest'",
            "Increased appetite and need for rest"
        ],
        egg_carrying_late: [
            "Heavy, dense belly pressing downward",
            "Strong nesting instinct (unwilling to leave nest)",
            "Rhythmic waves of internal pressure",
            "Difficult mobility, prefers lying on side",
            "Acute reaction to cold and drafts",
            "Constant sense that laying is near"
        ],
        egg_laying: [
            "Strong rhythmic contractions in lower abdomen",
            "Waves of deep pressure and heat",
            "Sensation of eggs passing one after another",
            "Deep physical relief after each egg",
            "Exhaustion and craving for warmth",
            "Intense emotional attachment to laid eggs"
        ],
        egg_recovery: [
            "Fatigue and soreness in lower abdomen",
            "Increased appetite (energy restoration)",
            "Constant craving for warmth (heater, embrace, blanket)",
            "Heightened emotional vulnerability",
            "Unwillingness to let partner leave the nest",
            "Feeling of 'emptiness' after laying"
        ],
        egg_quiescence: [
            "Calm, steady state — body resting between cycles",
            "No urge for intimacy, stable hormonal baseline",
            "Normal appetite and ordinary energy levels",
            "No signs of fertility or heat",
            "Mild thoughtfulness, craving routine and predictability",
            "Body gathering strength for the next laying cycle"
        ]
    }
};

// Стадии вынашивания (недели 1-6)
export const EGG_CARRYING_STAGES = {
    ru: {
        1: { size: "Почти незаметно", belly: "Живот плоский", desc: "1-я неделя вынашивания. Внутри только начинают формироваться оболочки будущих яиц. Внешне всё как обычно." },
        2: { size: "Мелкие сгустки", belly: "Едва уловимая округлость", desc: "2-я неделя. Яйца формируют кальциевые оболочки. Появляется тяга к теплу и мягкой еде." },
        3: { size: "Крупные яйца (внутренне)", belly: "Заметная округлость низа живота", desc: "3-я неделя. Скорлупа яиц крепнет. Живот заметно выделяется под одеждой, движения становятся осторожнее." },
        4: { size: "Полностью сформированы", belly: "Округлый плотный живот", desc: "4-я неделя. Яйца достигли финального размера. Ощущение тяжести и распирания. Просыпается инстинкт гнездования." },
        5: { size: "Готовы к кладке", belly: "Тяжелый, низко опущенный живот", desc: "5-я неделя. Яйца заняли всё доступное пространство. Заметна постоянная внутренняя волна давления. Персонаж стремится к уединению." },
        6: { size: "На пределе", belly: "Очень тяжелый живот, движения скованы", desc: "6-я неделя. Пора кладки. Любое резкое движение отзывается глубоким давлением. Требуется тёплое безопасное место." }
    },
    en: {
        1: { size: "Barely noticeable", belly: "Flat belly", desc: "Week 1 of carrying. Egg membranes are only starting to form inside. Externally nothing has changed." },
        2: { size: "Small clusters", belly: "Faint roundness", desc: "Week 2. Eggs form calcium shells. Cravings for warmth and soft food appear." },
        3: { size: "Large eggs (internal)", belly: "Noticeable lower-belly roundness", desc: "Week 3. Egg shells hardening. Belly clearly visible under clothing; movements become careful." },
        4: { size: "Fully formed", belly: "Rounded, dense belly", desc: "Week 4. Eggs have reached final size. Sense of heaviness and pressure. Nesting instinct awakens." },
        5: { size: "Ready to lay", belly: "Heavy, low-hanging belly", desc: "Week 5. Eggs occupy all available space. Constant waves of internal pressure. Character seeks solitude." },
        6: { size: "At the limit", belly: "Very heavy belly, movement restricted", desc: "Week 6. Time to lay. Any sudden motion causes deep pressure. Warm, safe space required." }
    }
};

// Послекладковое восстановление (3-7 дней)
export const EGG_POSTLAY_STAGES = {
    ru: {
        3: { name: "Острая фаза после кладки", desc: "Тело обессилено. Ломота и тяжесть внизу живота, сильная потребность в тепле и покое. Персонаж не отпускает от себя отложенные яйца, реагирует на угрозы резко." },
        5: { name: "Активное восстановление", desc: "Физическая слабость постепенно уходит. Аппетит высокий. Психологическая привязанность к кладке и партнёру сохраняется. Инстинкт насиживания очень силён." },
        7: { name: "Завершение восстановления", desc: "Основные силы вернулись. Тело готово к длительной инкубации яиц. Устанавливается эмоционально ровная связь с кладкой." }
    },
    en: {
        3: { name: "Acute post-lay phase", desc: "Body exhausted. Aching and heaviness in lower abdomen; strong need for warmth and rest. Character won't leave the eggs, reacts sharply to threats." },
        5: { name: "Active recovery", desc: "Physical weakness gradually fading. High appetite. Psychological attachment to the clutch and partner persists. Brooding instinct very strong." },
        7: { name: "Recovery completion", desc: "Core strength returned. Body ready for prolonged external incubation. Emotionally stable bond with the clutch formed." }
    }
};

// Дефекты скорлупы — видны на УЗИ в Современности
export const EGG_SHELL_DEFECTS = {
    ru: [
        { id: 'shell_cracked', name: "Трещина скорлупы", desc: "На скорлупе яйца видна тонкая трещина. Риск инфицирования и слабости эмбриона." },
        { id: 'shell_thin', name: "Истонченная скорлупа", desc: "Скорлупа слишком тонкая и хрупкая. Яйцо требует особенно бережного обращения." },
        { id: 'shell_soft', name: "Мягкая скорлупа", desc: "Скорлупа не затвердела. Высокий риск повреждения при кладке." },
        { id: 'shell_deformed', name: "Деформированная скорлупа", desc: "Неправильная форма яйца. Может указывать на внутренние патологии эмбриона." }
    ],
    en: [
        { id: 'shell_cracked', name: "Cracked shell", desc: "A thin crack is visible on the shell. Risk of infection and weak embryo." },
        { id: 'shell_thin', name: "Thin shell", desc: "The shell is too thin and fragile. Requires extra careful handling." },
        { id: 'shell_soft', name: "Soft shell", desc: "The shell has not hardened. High risk of damage during laying." },
        { id: 'shell_deformed', name: "Deformed shell", desc: "Irregular egg shape. May indicate internal embryo pathologies." }
    ]
};

// Патологии, специфичные для яйца
// Генетические/анатомические аномалии берутся из symptoms.js
export const EGG_EMBRYO_DISEASES = {
    ru: [
        { id: 'embryo_weak', name: "Слабый эмбрион", desc: "Эмбрион развивается медленнее нормы. Возможна слабость после вылупления." },
        { id: 'embryo_dead', name: "Погибший эмбрион", desc: "Развитие остановилось. Яйцо не вылупится." },
        { id: 'embryo_genetic', name: "Генетическая аномалия", desc: "Выраженные наследственные отклонения в развитии." },
        { id: 'embryo_twins', name: "Близнецы в одном яйце", desc: "В одном яйце развиваются два эмбриона." }
    ],
    en: [
        { id: 'embryo_weak', name: "Weak embryo", desc: "Embryo develops slower than normal. Possible weakness after hatching." },
        { id: 'embryo_dead', name: "Dead embryo", desc: "Development has stopped. Egg will not hatch." },
        { id: 'embryo_genetic', name: "Genetic anomaly", desc: "Pronounced hereditary developmental deviations." },
        { id: 'embryo_twins', name: "Twins in one egg", desc: "Two embryos develop inside one egg." }
    ]
};

// Стадии инкубации (внешние, до 120 дней)
export const EGG_INCUBATION_STAGES = {
    ru: {
        1:  { name: "Начало инкубации", desc: "Свежая кладка. Скорлупа теплая, слегка пульсирует слабым внутренним свечением." },
        30: { name: "Раннее развитие", desc: "Внутри яиц формируются основные системы эмбрионов. Свечение становится ровнее и ярче." },
        60: { name: "Средняя инкубация", desc: "Эмбрионы активно растут. Яйца заметно тяжелее, скорлупа уплотнилась." },
        90: { name: "Поздняя инкубация", desc: "Плоды полностью сформированы. Слышны слабые ритмичные постукивания изнутри. Вылупление может начаться в любой день." },
        120:{ name: "Готовы к вылуплению", desc: "Скорлупа начинает трескаться. Птенцы активно двигаются внутри, готовясь выйти." }
    },
    en: {
        1:  { name: "Incubation begins", desc: "Fresh clutch. Shell warm, faintly pulsing with inner glow." },
        30: { name: "Early development", desc: "Core embryo systems forming inside. Glow becomes steadier and brighter." },
        60: { name: "Mid-incubation", desc: "Embryos actively growing. Eggs noticeably heavier, shells hardened." },
        90: { name: "Late incubation", desc: "Fetuses fully formed. Faint rhythmic tapping audible from inside. Hatching may begin any day." },
        120:{ name: "Ready to hatch", desc: "Shells begin to crack. Hatchlings move actively inside, preparing to emerge." }
    }
};

export const EGG_INCUBATION_DISPLAY_MAX = 120;
export const EGG_INCUBATION_HATCHING_PROMPT_DAY = 90;


export function getEggCarryingData(days, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = EGG_CARRYING_STAGES[l] || EGG_CARRYING_STAGES['ru'];
    const weeks = Math.max(1, Math.min(6, Math.floor(days / 7) + 1));
    const milestones = Object.keys(pool).map(Number).sort((a, b) => b - a);
    for (const w of milestones) {
        if (weeks >= w) return pool[w];
    }
    return pool[1];
}

export function getEggPostLayData(days, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = EGG_POSTLAY_STAGES[l] || EGG_POSTLAY_STAGES['ru'];
    const milestones = Object.keys(pool).map(Number).sort((a, b) => a - b);
    for (const d of milestones) {
        if (days <= d) return pool[d];
    }
    return pool[milestones[milestones.length - 1]];
}

export function getEggIncubationData(days, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = EGG_INCUBATION_STAGES[l] || EGG_INCUBATION_STAGES['ru'];
    const milestones = Object.keys(pool).map(Number).sort((a, b) => b - a);
    for (const d of milestones) {
        if (days >= d) return pool[d];
    }
    return pool[1];
}

export function getEggShellDefect(id, lang = 'ru') {
    if (!id) return null;
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = EGG_SHELL_DEFECTS[l] || EGG_SHELL_DEFECTS['ru'];
    return pool.find(d => d.id === id) || null;
}

export function getEggSymptomList(phaseKey, indices, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const list = EGG_SYMPTOMS[l]?.[phaseKey] || EGG_SYMPTOMS['ru']?.[phaseKey] || [];
    if (!indices || indices.length === 0) return [];
    return indices.map(i => list[i]).filter(Boolean);
}

export function getRandomEggSymptomIndices(phase, maxCount = 3) {
    const list = EGG_SYMPTOMS['ru'][phase] || [];
    if (!list || list.length === 0) return [];
    const indices = list.map((_, i) => i).sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * maxCount) + 1;
    return indices.slice(0, count);
}

export function rollEggCount() {
    return Math.floor(Math.random() * 6) + 2; // 2-7 яиц
}

export function rollEggIncubationDays() {
    return EGG_INCUBATION_DISPLAY_MAX;
}

export function getRandomEggShellDefectId() {
    const pool = EGG_SHELL_DEFECTS['ru'];
    return pool[Math.floor(Math.random() * pool.length)].id;
}

export function rollEggShellDefect() {
    return Math.random() * 100 < 15 ? getRandomEggShellDefectId() : null;
}
