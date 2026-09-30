// База данных симптомов цикла и беременности (RU / EN)
import { EGG_EMBRYO_DISEASES } from './eggSystem.js';

export const SYMPTOMS = {
    ru: {
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
        follicular: [
            "Ощутимый прилив бодрости и физической энергии",
            "Улучшение состояния кожи, свежий цвет лица",
            "Легкость во всем теле и высокая выносливость",
            "Стабильно позитивное и ровное настроение",
            "Повышение социальной активности и общительности",
            "Ускорение обмена веществ, легкий аппетит"
        ],
        ovulation: [
            "Внезапный прилив сил и энергии",
            "Заметное усиление либидо",
            "Легкое покалывание в боку (овуляторный синдром)",
            "Обострение обоняния (чувствительность к запахам)",
            "Улучшение настроения, уверенность в себе",
            "Легкое покалывание в области поясницы"
        ],
        luteal: [
            "Умеренное нагрубание и чувствительность молочных желез",
            "Тяга к сладкому и углеводам (проявления ПМС)",
            "Легкая отечность тканей и задержка жидкости",
            "Повышенная эмоциональная чувствительность и плаксивость",
            "Снижение общего тонуса, желание больше спать",
            "Внезапная быстрая утомляемость к концу дня"
        ],
        heat_female: [
            "Тянущая боль внизу живота и пояснице",
            "Повышенная температура тела (ощущение внутреннего жара)",
            "Обильное выделение естественной смазки на половых губах",
            "Острая восприимчивость к запахам (поиск феромонов Альфы)",
            "Приливы жара и повышенная чувствительность кожи",
            "Сильное, непреодолимое желание телесного контакта"
        ],
        heat_male: [
            "Тянущая боль внизу живота и пояснице",
            "Повышенная температура тела (ощущение внутреннего жара)",
            "Обильное выделение смазки (самосмазывание ануса)",
            "Острая восприимчивость к запахам (поиск феромонов Альфы)",
            "Приливы жара и повышенная чувствительность кожи",
            "Сильное, непреодолимое желание телесного контакта"
        ],
        quiescence: [
            "Спокойное, стабильное состояние между течками",
            "Отсутствие жара и тяги к близости",
            "Обычная температура тела и нормальный аппетит",
            "Никаких признаков фертильности",
            "Ровное настроение, тяга к привычному распорядку",
            "Тело восстанавливается после цикла"
        ],
        preg_trimester_1: [
            "Утренняя тошнота (ранний токсикоз)",
            "Повышенная сонливость и быстрая утомляемость",
            "Острая чувствительность к резким запахам и духам",
            "Внезапная плаксивость и резкие перепады настроения",
            "Повышенная чувствительность и покалывание в груди",
            "Специфические вкусовые капризы (хочется странных сочетаний пищи)"
        ],
        preg_trimester_2: [
            "Внезапный прилив сил и энергии после раннего токсикоза",
            "Повышенный аппетит («надо есть за двоих»)",
            "Легкие, едва уловимые шевеления плода внутри живота",
            "Быстрое потемнение ареол сосков и линии на животе",
            "Периодические судороги в икроножных мышцах по ночам",
            "Легкая заложенность носа без простуды (ринит беременных)"
        ],
        preg_trimester_3: [
            "Тяжесть и ноющая боль в пояснице при долгой ходьбе",
            "Изжога после еды (плод сильно давит на желудок)",
            "Частые позывы к мочеиспусканию из-за давления матки",
            "Легкая одышка даже при медленном подъеме по лестнице",
            "Периодические тренировочные схватки (живот каменеет на пару секунд)",
            "Отечность лодыжек и стоп ближе к вечеру",
            "Трудности с поиском удобной позы для сна из-за размеров живота"
        ]
    },
    en: {
        menstruation: [
            "Dull pulling ache in lower abdomen",
            "Mild fatigue and sleepiness",
            "Increased appetite (cravings for sweet or salty foods)",
            "Irritability and sudden mood swings",
            "Mild headache",
            "Tender, sensitive breasts",
            "Bloating and heaviness in the body",
            "Lethargy and reluctance to engage in physical activity"
        ],
        follicular: [
            "Noticeable surge of vitality and physical energy",
            "Clearer skin and a fresh complexion",
            "Feeling of lightness and high stamina",
            "Consistently positive, balanced mood",
            "Increased sociability and openness",
            "Faster metabolism and moderate appetite"
        ],
        ovulation: [
            "Sudden burst of energy and strength",
            "Heightened libido and sexual drive",
            "Mild twinges in the lower side (mittelschmerz)",
            "Heightened sense of smell",
            "Elevated mood and self-confidence",
            "Slight tingling in the lower back"
        ],
        luteal: [
            "Moderate breast tenderness and swelling",
            "Cravings for sweets and carbs (PMS symptoms)",
            "Mild fluid retention and puffiness",
            "Heightened emotional sensitivity and tearfulness",
            "Lower energy levels and increased need for sleep",
            "Sudden fatigue towards the end of the day"
        ],
        heat_female: [
            "Dull aching in lower abdomen and lower back",
            "Elevated body temperature (intense internal heat)",
            "Profuse natural lubrication on labia",
            "Hyper-sensitive scent perception (seeking Alpha pheromones)",
            "Hot flashes and hyper-sensitive skin",
            "Intense, overwhelming craving for physical intimacy"
        ],
        heat_male: [
            "Dull aching in lower abdomen and lower back",
            "Elevated body temperature (intense internal heat)",
            "Profuse self-lubrication (anal self-lubrication)",
            "Hyper-sensitive scent perception (seeking Alpha pheromones)",
            "Hot flashes and hyper-sensitive skin",
            "Intense, overwhelming craving for physical intimacy"
        ],
        quiescence: [
            "Calm, stable state between heats",
            "No heat flashes or urge for intimacy",
            "Normal body temperature and ordinary appetite",
            "No signs of fertility",
            "Steady mood, preference for familiar routines",
            "Body recovering from the cycle"
        ],
        preg_trimester_1: [
            "Morning sickness (early nausea)",
            "Excessive sleepiness and rapid fatigue",
            "Sharp sensitivity to strong smells and perfumes",
            "Sudden tearfulness and mood swings",
            "Breast tenderness and tingling sensations",
            "Unusual food cravings and strange taste preferences"
        ],
        preg_trimester_2: [
            "Burst of energy following relief of early nausea",
            "Increased appetite ('eating for two')",
            "Gentle, fluttering fetal movements (quickening)",
            "Darkening of areolas and appearance of linea nigra",
            "Occasional nighttime calf cramps",
            "Mild nasal congestion without a cold (pregnancy rhinitis)"
        ],
        preg_trimester_3: [
            "Heaviness and aching in lower back during long walks",
            "Heartburn after meals (fetal pressure on stomach)",
            "Frequent urination due to bladder pressure",
            "Shortness of breath even during slow stair climbing",
            "Occasional Braxton Hicks contractions (belly tightening briefly)",
            "Swelling in ankles and feet towards the evening",
            "Difficulty finding a comfortable sleeping position due to belly size"
        ]
    }
};

export const PREGNANCY_STAGES = {
    ru: {
        1: { size: "Размер клетки", weight: "Менее 0.01 г", belly: "Живот незаметен", desc: "1-я акушерская неделя. Фактической беременности еще нет." },
        2: { size: "Размер клетки", weight: "Менее 0.01 г", belly: "Живот незаметен", desc: "2-я акушерская неделя. Фактической беременности еще нет." },
        3: { size: "Крошечная песчинка", weight: "Менее 0.05 г", belly: "Живот незаметен", desc: "3-я акушерская неделя. Активная фаза имплантации. Бластоциста внедряется в эндометрий матки. Возможны покалывания или розовые капли крови." },
        4: { size: "Маковое зёрнышко", weight: "Менее 0.1 г", belly: "Живот незаметен", desc: "Эмбрион надежно закрепился в маточной полости. Закладываются три зародышевых листка для будущих органов. Появляется обостренное обоняние." },
        5: { size: "Кунжутное семечко", weight: "Около 0.2 г", belly: "Живот незаметен", desc: "Начинает формироваться нервная трубка плода. Его крошечное сердце делает самые первые, едва заметные сокращения. Накатывает утренняя тошнота." },
        6: { size: "Чечевичное зёрнышко", weight: "Около 0.5 г", belly: "Живот незаметен", desc: "Сердцебиение плода уже можно четко зафиксировать при ультразвуковом сканировании. Формируются зачатки будущих ручек, ножек и глазных впадин." },
        7: { size: "Ягода черники", weight: "Около 0.8 г", belly: "Живот незаметен", desc: "Стремительно развиваются полушария головного мозга. На зачатках конечностей начинают намечаться микроскопические пальчики. Грудь сильно наливается." },
        8: { size: "Ягода малины", weight: "Около 1 г", belly: "Живот незаметен", desc: "Закладываются основные суставы и внутренние органы. Эмбрион начинает совершать первые хаотичные движения, неощутимые снаружи. Токсикоз на пике." },
        9: { size: "Ягода винограда", weight: "Около 2 г", belly: "Живот незаметен", desc: "Эмбриональный хвостик полностью исчезает. Лицо приобретает человеческие черты, формируются вкусовые сосочки на языке. Укрепляется костная ткань." },
        10: { size: "Ягода клубники", weight: "Около 4 г", belly: "Живот незаметен", desc: "Официальный конец эмбрионального периода — теперь это плод. Все базовые системы органов успешно заложены. Гормональный фон вызывает резкую плаксивость." },
        11: { size: "Брюссельская капуста", weight: "Около 7 г", belly: "Живот незаметен", desc: "Плод активно глотает околоплодные воды, тренируя пищеварительную систему. Начинают формироваться ногтевые пластины и глубокие зачатки зубов." },
        12: { size: "Крупная слива", weight: "Около 15 г", belly: "Едва уловимая округлость", desc: "Конец 1-го триместра. Органы сформированы, плод начинает шевелиться, но это еще не чувствуется." },
        13: { size: "Королевский инжир", weight: "Около 23 г", belly: "Мягкий округлый низ живота", desc: "Начало 2-го триместра. Формируются уникальные отпечатки пальцев и голосовые связки. Плацента полностью берет на себя питание и защиту малыша." },
        14: { size: "Спелый лимон", weight: "Около 43 г", belly: "Небольшой аккуратный бугорок", desc: "Почки плода начинают функционировать, выделяя мочу в амниотическую жидкость. Тело покрывается защитным пушком — лануго. Настроение стабилизируется." },
        15: { size: "Крупное яблоко", weight: "Около 70 г", belly: "Заметный бугорок над лобком", desc: "Кожа плода всё еще тонкая и прозрачная, сквозь неё видны сосуды. Крошечное сердце перекачивает до 23 литров крови в сутки. Растет аппетит." },
        16: { size: "Крупный авокадо", weight: "Около 100 г", belly: "Заметный округлый животик", desc: "Мышцы лица развиты: плод может зажмуриваться и открывать рот. У повторнородящих женщин возможны первые нежные шевеления плода («эффект бабочек»)." },
        17: { size: "Сладкая репа", weight: "Около 140 г", belly: "Живот приподнимается к пупку", desc: "Начинает откладываться подкожная жировая клетчатка плода. Слуховой аппарат развит — малыш вздрагивает внутри матки от резких и громких внешних звуков." },
        18: { size: "Болгарский перец", weight: "Около 190 г", belly: "Отчетливо виден под одеждой", desc: "Шевеления плода становятся регулярными и отчетливыми для всех. Сформировались фаланги пальцев. Матка продолжает активно увеличиваться в размерах." },
        19: { size: "Крупный манго", weight: "Около 240 г", belly: "Живот округляется вперед", desc: "Тело плода покрывается первородной жировой смазкой, защищающей кожу. Развиваются зоны головного мозга, отвечающие за осязание, вкус и зрение." },
        20: { size: "Большой банан", weight: "Около 300 г", belly: "Округлый, выразительный живот", desc: "Экватор (20 недель). Матка находится ровно на уровне пупка. Пинки становятся сильными. Проводится важное скрининговое УЗИ анатомии плода." },
        21: { size: "Крупный грейпфрут", weight: "Около 360 г", belly: "Матка поднимается выше пупка", desc: "Пищеварительная система плода активно усваивает питательные вещества из заглатываемых вод. Кожа живота сильно растягивается, вызывая легкий зуд." },
        22: { size: "Молодой кабачок", weight: "Около 430 г", belly: "Выпирает вперед при наклонах", desc: "Плод активно исследует маточное пространство руками, дергает за пуповину и упирается ножками. На его лице полностью сформировались брови." },
        23: { size: "Крупный баклажан", weight: "Около 500 г", belly: "Заметно стесняет движения", desc: "В легких плода начинает вырабатываться сурфактант для будущего дыхания. Плод может периодически икать, что ощущается как мерные ритмичные толчки." },
        24: { size: "Початок кукурузы", weight: "Около 600 г", belly: "Округлый выпирающий живот", desc: "У плода формируется индивидуальный режим сна и бодрствования. Вес матки начинает вызывать ноющую тяжесть в пояснице при долгой ходьбе." },
        25: { size: "Средняя дыня", weight: "Около 700 г", belly: "Большой, высоко поднятый живот", desc: "Укрепляются кости и суставы плода, расправляются альвеолы в легких. Из-за высокого положения матки у мамы может появляться изжога после еды." },
        26: { size: "Краснокочанная капуста", weight: "Около 800 г", belly: "Тяжелый плотный живот", desc: "Плод впервые приоткрывает веки, глаза полностью сформированы. Его толчки становятся настолько сильными, что могут доставлять дискомфорт ребрам." },
        27: { size: "Головка цветной капусты", weight: "Около 900 г", belly: "Сильно сковывает наклоны", desc: "Начало 3-го триместра. Малыш весит почти килограмм. Активно развивается сетчатка глаз. Появляется одышка при быстром подъеме по лестнице." },
        28: { size: "Мускатная тыква", weight: "Около 1100 г", belly: "Огромный высоко поднятый живот", desc: "Кожа плода постепенно разглаживается, теряя ярко-красный оттенок. Толчки и перемещения малыша видны снаружи невооруженным глазом сквозь одежду." },
        29: { size: "Бутылочная тыква", weight: "Около 1250 г", belly: "Живот подпирает грудную клетку", desc: "Плод учится самостоятельно регулировать температуру своего тела. Матка сильно давит на диафрагму, спать на спине становится тяжело и вредно." },
        30: { size: "Крупный кочан капусты", weight: "Около 1400 г", belly: "Тяжелый, давит на тазовое ложе", desc: "Мозг плода стремительно развивается, покрываясь характерными извилинами. К вечеру в ногах может появляться ощутимая отечность и тяжесть." },
        31: { size: "Свежий кокос", weight: "Около 1600 г", belly: "Максимально натянутая кожа", desc: "Зрачки плода чутко реагируют на свет и темноту сквозь брюшную стенку. Из груди мамы может начать выделяться первые капли густого молозива." },
        32: { size: "Тыква сквош", weight: "Около 1800 г", belly: "Очень большой, мешает обуваться", desc: "Плод занимает финальное положение головой вниз. Периодически возникают безболезненные тренировочные схватки Брэкстона-Хикса (живот каменеет)." },
        33: { size: "Спелый ананас", weight: "Около 2000 г", belly: "Живот мешает спать на боку", desc: "Иммунная система плода активно насыщается антителами от материнского организма. Становится трудно подолгу сидеть или стоять в одной позе." },
        34: { size: "Мускусная дыня", weight: "Около 2200 г", belly: "Живот сильно выпирает вперед", desc: "Защитный пушок лануго начинает постепенно исчезать с тела плода. Кости его черепа остаются мягкими и подвижными для безопасных родов." },
        35: { size: "Дыня канталупа", weight: "Около 2400 г", belly: "Живот натянут до предела", desc: "Малыш занял почти всё свободное место в матке. Вместо резких пинков теперь ощущаются сильные медленные перекаты коленей и локтей под кожей." },
        36: { size: "Большой кочан капусты", weight: "Около 2600 г", belly: "Огромный, упирается в ребра", desc: "Организм плода полностью созрел. Малыш готов к жизни вне матки. Живот может начать понемногу опускаться вниз, облегчая маме дыхание." },
        37: { size: "Зимняя дыня", weight: "Около 2900 г", belly: "Опущен немного вниз", desc: "Беременность считается официально доношенной. Плод делает регулярные тренировочные дыхательные движения грудной клеткой внутри матки." },
        38: { size: "Стебель порея", weight: "Около 3100 г", belly: "Опущен, давит на кости таза", desc: "Завершилось финальное созревание легких и печени плода. Тренировочные схватки становятся более частыми и ощутимыми. Шейка матки готовится." },
        39: { size: "Небольшой арбуз", weight: "Около 3300 г", belly: "Низкий тяжелый живот", desc: "Кишечник плода полностью заполнен первородным калом (меконием). Плод затих и копит силы. Ткани шейки матки интенсивно размягчаются перед родами." },
        40: { size: "Большой арбуз", weight: "Около 3500 г", belly: "Максимальный размер, опущен вниз", desc: "Срок родов подошел к концу (40 недель). Матка колоссально давит на мочевой пузырь, ходить тяжело. Организм находится в полной готовности к схваткам." }
    },
    en: {
        1: { size: "Cell size", weight: "Under 0.01 g", belly: "No visible belly", desc: "1st gestational week. Conception has not yet occurred." },
        2: { size: "Cell size", weight: "Under 0.01 g", belly: "No visible belly", desc: "2nd gestational week. Conception has not yet occurred." },
        3: { size: "Tiny sand grain", weight: "Under 0.05 g", belly: "No visible belly", desc: "3rd gestational week. Active implantation phase. Blastocyst embeds into the uterine lining. Light spotting possible." },
        4: { size: "Poppy seed", weight: "Under 0.1 g", belly: "No visible belly", desc: "Embryo securely attached to uterine wall. Germ layers developing. Olfactory sensitivity begins." },
        5: { size: "Sesame seed", weight: "About 0.2 g", belly: "No visible belly", desc: "Neural tube begins developing. Tiny heart starts its first subtle contractions. Early morning nausea emerges." },
        6: { size: "Lentil grain", weight: "About 0.5 g", belly: "No visible belly", desc: "Heartbeat detectable via ultrasound. Primitive limb buds and eye sockets begin to form." },
        7: { size: "Blueberry", weight: "About 0.8 g", belly: "No visible belly", desc: "Brain hemispheres developing rapidly. Microscopic fingers emerge on limb buds. Breasts swell." },
        8: { size: "Raspberry", weight: "About 1 g", belly: "No visible belly", desc: "Major joints and internal organs forming. Spontaneous, imperceptible movements begin. Morning sickness peaks." },
        9: { size: "Grape", weight: "About 2 g", belly: "No visible belly", desc: "Embryonic tail disappears. Facial features become distinctly human; taste buds start forming." },
        10: { size: "Strawberry", weight: "About 4 g", belly: "No visible belly", desc: "End of embryonic stage; officially a fetus now. All vital organs formed. Hormonal shifts cause mood swings." },
        11: { size: "Brussels sprout", weight: "About 7 g", belly: "No visible belly", desc: "Fetus swallows amniotic fluid, practicing digestion. Tooth buds and tiny nails start developing." },
        12: { size: "Plum", weight: "About 15 g", belly: "Subtle slight roundness", desc: "End of 1st trimester. All systems functioning. Movements remain imperceptible externally." },
        13: { size: "Fig", weight: "About 23 g", belly: "Soft lower belly curve", desc: "Start of 2nd trimester. Unique fingerprints and vocal cords form. Placenta takes over full nourishment." },
        14: { size: "Lemon", weight: "About 43 g", belly: "Small neat bump", desc: "Kidneys produce urine into amniotic sac. Body covered in fine lanugo hair. Mood stabilizes." },
        15: { size: "Apple", weight: "About 70 g", belly: "Noticeable low bump", desc: "Skin remains translucent. Heart pumps up to 23 liters of blood daily. Appetite increases." },
        16: { size: "Avocado", weight: "About 100 g", belly: "Distinct rounded belly", desc: "Facial muscles developed. First gentle flutters (quickening) may be felt. Fetus can squint and frown." },
        17: { size: "Turnip", weight: "About 140 g", belly: "Belly rises towards navel", desc: "Adipose tissue forms. Hearing is developed; fetus can startle at loud, sudden external noises." },
        18: { size: "Bell pepper", weight: "About 190 g", belly: "Clearly visible under clothes", desc: "Kicks and movements become distinct and regular. Uterus expands rapidly." },
        19: { size: "Mango", weight: "About 240 g", belly: "Belly rounds forward", desc: "Vernix caseosa coats skin for protection. Brain areas for senses develop rapidly." },
        20: { size: "Banana", weight: "About 300 g", belly: "Pronounced, round belly", desc: "Halfway mark (20 weeks). Top of uterus reaches navel. Anatomy ultrasound reveals anatomy & sex." },
        21: { size: "Grapefruit", weight: "About 360 g", belly: "Uterus rises above navel", desc: "Digestive system absorbs nutrients from amniotic fluid. Abdominal skin stretches, causing mild itchiness." },
        22: { size: "Zucchini", weight: "About 430 g", belly: "Protrudes noticeably", desc: "Fetus explores the womb, gripping the umbilical cord. Eyebrows and eyelids are fully formed." },
        23: { size: "Eggplant", weight: "About 500 g", belly: "Restricts agile movement", desc: "Surfactant production begins in lungs. Rhythmic hiccups can be felt as repetitive light pulses." },
        24: { size: "Ear of corn", weight: "About 600 g", belly: "Prominent rounded bump", desc: "Sleep-wake cycles emerge. Uterine weight starts causing lower back strain on long walks." },
        25: { size: "Cantaloupe melon", weight: "About 700 g", belly: "High, prominent abdomen", desc: "Bones harden and spine strengthens. Upward pressure causes occasional post-meal heartburn." },
        26: { size: "Red cabbage", weight: "About 800 g", belly: "Heavy, firm abdomen", desc: "Fetal eyes open for the first time. Strong kicks can reach the maternal ribcage." },
        27: { size: "Cauliflower head", weight: "About 900 g", belly: "Significantly limits bending", desc: "Start of 3rd trimester. Fetus reaches ~1kg. Breathlessness occurs on light exertion." },
        28: { size: "Butternut squash", weight: "About 1100 g", belly: "Large, high-riding bump", desc: "Fetal skin smooths out. Movements and rolling limbs are clearly visible through clothing." },
        29: { size: "Acorn squash", weight: "About 1250 g", belly: "Presses against ribcage", desc: "Fetal thermoregulation begins. Diaphragm pressure makes sleeping on back uncomfortable." },
        30: { size: "Head of cabbage", weight: "About 1400 g", belly: "Heavy, low pelvic pressure", desc: "Brain surface furrows into complex folds. Mild swelling and fatigue appear in legs." },
        31: { size: "Coconut", weight: "About 1600 g", belly: "Taut, stretched skin", desc: "Pupils react to external light through the belly wall. First drops of colostrum may leak." },
        32: { size: "Hubbard squash", weight: "About 1800 g", belly: "Very large, hinders shoes", desc: "Fetus usually settles into cephalic (head-down) position. Braxton Hicks tightenings increase." },
        33: { size: "Pineapple", weight: "About 2000 g", belly: "Crowds comfortable sleep", desc: "Maternal antibodies transfer steadily to fetal bloodstream. Prolonged sitting is tiring." },
        34: { size: "Honeydew melon", weight: "About 2200 g", belly: "Protrudes heavily forward", desc: "Lanugo hair sheds into amniotic fluid. Cranial bones remain pliable for birth." },
        35: { size: "Large melon", weight: "About 2400 g", belly: "Tightly stretched to limit", desc: "Space in womb is tight; kicks turn into slow, powerful rolling movements under the skin." },
        36: { size: "Large cabbage", weight: "About 2600 g", belly: "Huge, presses on ribs", desc: "Fetus is nearly mature. Belly may begin lightening (dropping), making breathing easier." },
        37: { size: "Winter melon", weight: "About 2900 g", belly: "Noticeably lower/dropped", desc: "Pregnancy reaches early term. Fetus practices rhythmic chest breathing motions in womb." },
        38: { size: "Leek stalk", weight: "About 3100 g", belly: "Low, heavy pelvic pressure", desc: "Full lung and organ maturity achieved. Pelvic pressure increases as cervix readies for labor." },
        39: { size: "Small watermelon", weight: "About 3300 g", belly: "Low, heavy belly", desc: "Meconium accumulates in bowel. Fetus rests and gathers strength. Cervix softens." },
        40: { size: "Large watermelon", weight: "About 3500 g", belly: "Maximum size, fully dropped", desc: "Full term (40 weeks). Intense pressure on pelvis and bladder. Body is primed for active labor." }
    }
};

export const POSTPARTUM_STAGES = {
    ru: {
        natural: {
            7: { name: "Раннее восстановление (ЕР)", desc: "Тело ломит после колоссальной физической нагрузки. Наблюдаются обильные кровянистые выделения (лохии). Мышцы тазового дна истощены, сидеть и ходить может быть некомфортно из-за микротравм. На 3-5 день активно приходит молоко — грудь сильно наливается, становится горячей и крайне чувствительной." },
            20: { name: "Активное заживление тканей (ЕР)", desc: "Матка интенсивно уменьшается в размерах, вызывая тянущие спазмы (особенно во время кормления ребенка). Лохии становятся светлыми или серозными. Внутренние ткани и возможные швы активно стягиваются. Ощущается сильный дефицит сна и яркое проявление материнского инстинкта." },
            40: { name: "Завершение послеродового периода (ЕР)", desc: "Финал базовой реабилитации. Лохии полностью прекратились, матка вернулась к добеременным размерам. Гормональный фон стабилизировался в режиме лактации. Организм полностью готов к постепенному возвращению к физической активности." }
        },
        c_section: {
            7: { name: "Послеоперационный период (КС)", desc: "Острая боль в области нижней части живота. Каждое движение, кашель или попытка перевернуться задействуют разрезанные мышцы и вызывают резкие спазмы шва. Выделения (лохии) умеренные. Приход молока из-за оперативного вмешательства может задерживаться на 1-2 дня, сопровождаясь гормональным ознобом." },
            20: { name: "Формирование мышечного рубца (КС)", desc: "Внешний шов на коже затянулся, но глубокие слои брюшной стенки и матки все еще уязвимы. Возможен зуд или, наоборот, временное онемение кожи вокруг рубца. Матка сокращается медленнее, сохраняется общая слабость и повышенная утомляемость." },
            40: { name: "Консолидация внутренних швов (КС)", desc: "Рубец окреп и стабилизировался, но внутренние мышечные слои продолжают регенерацию. Острая боль ушла, уступая место редкому покалыванию при перемене погоды или нагрузках. Организм адаптировался, но подъем тяжестей всё еще под строгим ограничением." }
        },
        miscarriage: {
            7: { name: "Реабилитация после прерывания / замирания", desc: "Организм переживает резкий гормональный спад и физический шок. Наблюдаются сильные тянущие спазмы матки и умеренные кровянистые выделения. Ощущается общая слабость, озноб и эмоциональное опустошение. Требуется строгий покой." },
            14: { name: "Постгравидарное восстановление", desc: "Физическое заживление эндометрия завершается. Гормональный фон возвращается к базовому уровню, матка сократилась до нормы. Репродуктивная система готова к перезапуску цикла." },
            40: { name: "Полное очищение и восстановление", desc: "Репродуктивная система полностью завершила цикл очищения и реабилитации. Организм готов к новому циклу." }
        }
    },
    en: {
        natural: {
            7: { name: "Early Recovery (Vaginal)", desc: "Aching body from intense physical labor. Heavy lochia (postpartum bleeding). Pelvic floor muscles tender and fatigued. Milk comes in around days 3-5, causing hot, sensitive, engorged breasts." },
            20: { name: "Active Tissue Healing (Vaginal)", desc: "Uterus contracts back to normal size with afterpains (especially during nursing). Lochia turns pinkish/white. Maternal bonding deepens despite sleep deprivation." },
            40: { name: "Recovery Completion (Vaginal)", desc: "End of initial recovery phase. Bleeding stopped, uterus back to pre-pregnancy size. Hormones balanced into steady lactation mode. Ready for gentle physical activity." }
        },
        c_section: {
            7: { name: "Postoperative Period (C-Section)", desc: "Sharp incision pain in lower abdomen. Moving, coughing, or rolling over triggers abdominal spasms. Moderate lochia. Milk onset may take 1-2 extra days." },
            20: { name: "Scar Tissue Remodeling (C-Section)", desc: "Outer skin incision healed; deep abdominal layers still recovering. Numbness or tingling around scar. Fatigue remains high." },
            40: { name: "Internal Stitch Consolidation (C-Section)", desc: "Incision stable and firm. Acute pain gone, occasional aching with strain. Heavy lifting still strictly prohibited." }
        },
        miscarriage: {
            7: { name: "Early Loss Recovery", desc: "Body experiences sudden hormonal crash and shock. Uterine cramping as it shrinks, moderate bleeding. Strict rest and gentle emotional care needed." },
            14: { name: "Postgravid Restoration", desc: "Endometrial physical healing nearly complete. Hormonal levels stabilizing, reproductive system ready to restart cycle." },
            40: { name: "Full Reproductive Reset", desc: "Reproductive system fully recovered and cleansed. Uterus healthy. Ready to restart natural menstrual cycle." }
        }
    }
};

export const COMPLICATIONS_POOL = {
    ru: [
        { id: "toxicosis_severe", trimester: 1, name: "Тяжелый токсикоз", curable: true, desc: "Непрекращающаяся тошнота, рвота от любой пищи, сильная слабость и истощение." },
        { id: "miscarriage_threat_early", trimester: 1, name: "Угроза выкидыша (ранний срок)", curable: true, desc: "Тянущие, спазматические боли внизу живота, мажущие кровянистые выделения. Требуется полный покой." },
        { id: "anemia_early", trimester: 1, name: "Железодефицитная анемия", curable: true, desc: "Сильная бледность, постоянное головокружение, потемнение в глазах при резком подъеме." },
        { id: "retrochorial_hematoma", trimester: 1, name: "Ретрохориальная гематома", curable: true, desc: "Частичная отслойка плодного яйца от стенки матки с образованием кровяного сгустка. Требует строгого постельного режима." },
        { id: "hyperemesis_gravidarum", trimester: 1, name: "Чрезмерная рвота беременных", curable: true, desc: "Тяжелая форма интоксикации, приводящая к сильному обезвоживанию организма, потере веса и ацетону в моче. Необходимы капельницы." },
        { id: "low_placentation_early", trimester: 1, name: "Низкое прикрепление хориона", curable: false, desc: "Будущая плацента формируется слишком близко к внутреннему зеву матки. Противопоказаны любые физические нагрузки и близость." },
        { id: "hypertonus", trimester: 2, name: "Гипертонус матки", curable: true, desc: "Живот периодически становится каменным на ощупь, сопровождается ноющей болью в пояснице." },
        { id: "gestational_diabetes", trimester: 2, name: "Гестационный диабет", curable: false, desc: "Постоянная неутолимая жажда, сухость во рту, быстрая утомляемость. Сохраняется до родов." },
        { id: "polyhydramnios", trimester: 2, name: "Многоводие", curable: false, desc: "Размер живота превышает норму для этого срока, ощущение сильного распирания и тяжести." },
        { id: "istmic_cervical_insufficiency", trimester: 2, name: "Истмико-цервикальная недостаточность (ИЦН)", curable: true, desc: "Преждевременное слабое раскрытие шейки матки под весом плода. Требует срочного медицинского наложения швов или установки пессария." },
        { id: "oligohydramnios", trimester: 2, name: "Маловодие", curable: false, desc: "Критический дефицит околоплодных вод. Движения и пинки плода становятся скованными и весьма болезненными для матери." },
        { id: "rh_conflict", trimester: 2, name: "Резус-конфликт плаценты", curable: true, desc: "Иммунологический конфликт между отрицательным резус-фактором матери и положительным резусом плода. Требует инъекции антирезусного иммуноглобулина." },
        { id: "preeclampsia", trimester: 3, name: "Преэклампсия (гестоз)", curable: true, desc: "Сильные отеки ног и лица, головная боль, мушки перед глазами. Опасное состояние." },
        { id: "premature_labor_threat", trimester: 3, name: "Угроза преждевременных родов", curable: true, desc: "Регулярные тянущие боли как при месячных, спазмы матки задолго до 40-й недели." },
        { id: "sciatica", trimester: 3, name: "Защемление седалищного нерва", curable: false, desc: "Острая простреливающая боль в ягодицу или ногу при ходьбе из-за давления веса матки." },
        { id: "symphysitis", trimester: 3, name: "Симфизит (расхождение лона)", curable: false, desc: "Сильное воспаление и расхождение лонного сочленения под влиянием гормона релаксина. Рождает резкую «утиную» походку и боль при подъеме ног." },
        { id: "gestational_pyelonephritis", trimester: 3, name: "Гестационный пиелонефрит", curable: true, desc: "Инфекционное воспаление почек из-за застоя мочи, вызванного сильным давлением тяжелой матки на мочеточники. Сопровождается высокой температурой." },
        { id: "placental_insufficiency", trimester: 3, name: "Фетоплацентарная недостаточность", curable: true, desc: "Нарушение маточно-плацентарного кровотока. Малышу временно не хватает кислорода (гипоксия), из-за чего его шевеления становятся хаотичными или затихают." }
    ],
    en: [
        { id: "toxicosis_severe", trimester: 1, name: "Severe Morning Sickness", curable: true, desc: "Persistent nausea and vomiting, severe fatigue and exhaustion." },
        { id: "miscarriage_threat_early", trimester: 1, name: "Threatened Miscarriage (Early)", curable: true, desc: "Lower abdominal cramping, light spotting. Strict bed rest required." },
        { id: "anemia_early", trimester: 1, name: "Iron Deficiency Anemia", curable: true, desc: "Pale skin, dizziness, dark spots in vision upon sudden standing." },
        { id: "retrochorial_hematoma", trimester: 1, name: "Retrochorial Hematoma", curable: true, desc: "Partial detachment of gestational sac with blood clot. Strict rest needed." },
        { id: "hyperemesis_gravidarum", trimester: 1, name: "Hyperemesis Gravidarum", curable: true, desc: "Severe intractable vomiting leading to dehydration and weight loss. Requires IV therapy." },
        { id: "low_placentation_early", trimester: 1, name: "Low-Lying Chorion", curable: false, desc: "Placenta developing too close to internal os. Physical strain and intimacy restricted." },
        { id: "hypertonus", trimester: 2, name: "Uterine Hypertonus", curable: true, desc: "Belly tightens into a hard knot, accompanied by lower back aches." },
        { id: "gestational_diabetes", trimester: 2, name: "Gestational Diabetes", curable: false, desc: "Constant unquenchable thirst, dry mouth, rapid fatigue until delivery." },
        { id: "polyhydramnios", trimester: 2, name: "Polyhydramnios (Excess Fluid)", curable: false, desc: "Abdomen larger than expected for gestational age, feeling of heavy distension." },
        { id: "istmic_cervical_insufficiency", trimester: 2, name: "Cervical Insufficiency (ICN)", curable: true, desc: "Premature weak opening of cervix under fetal weight. Requires emergency cerclage/pessary." },
        { id: "oligohydramnios", trimester: 2, name: "Oligohydramnios (Low Fluid)", curable: false, desc: "Critical deficit of amniotic fluid. Fetal kicks become stiff and painful." },
        { id: "rh_conflict", trimester: 2, name: "Rh Factor Incompatibility", curable: true, desc: "Immune conflict between Rh-negative mother and Rh-positive fetus. Requires anti-D immunoglobulin." },
        { id: "preeclampsia", trimester: 3, name: "Preeclampsia", curable: true, desc: "Severe swelling of feet and face, high blood pressure, headaches, blurred vision." },
        { id: "premature_labor_threat", trimester: 3, name: "Threatened Preterm Labor", curable: true, desc: "Regular menstrual-like cramps, uterine contractions well before week 40." },
        { id: "sciatica", trimester: 3, name: "Sciatica Nerve Compression", curable: false, desc: "Shooting sharp pain in buttock or leg when walking due to heavy uterine pressure." },
        { id: "symphysitis", trimester: 3, name: "Symphysis Pubis Dysfunction", curable: false, desc: "Painful inflammation and laxity of pubic joint under relaxin. Causes waddling gait." },
        { id: "gestational_pyelonephritis", trimester: 3, name: "Gestational Pyelonephritis", curable: true, desc: "Kidney infection due to urine stagnation from uterine compression. Causes fever and flank pain." },
        { id: "placental_insufficiency", trimester: 3, name: "Placental Insufficiency", curable: true, desc: "Impaired maternal-fetal blood flow. Fetal movements become frantic or quiet down." }
    ]
};

// Полная база патологий плода и новорожденных
export const FETAL_DISEASES = {
    ru: [
        { id: "down_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Синдром Дауна (Трисомия 21)", desc: "Генетическая особенность (маркеры ТВП 11–13 нед). Врачебный консилиум предоставляет семье информированный выбор." },
        { id: "edwards_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Синдром Эдвардса (Трисомия 18)", desc: "Тяжелая хромосомная патология (ЗВУР, пороки сердца и черепа). Абсолютное медицинское показание к прерыванию." },
        { id: "patau_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Синдром Патау (Трисомия 13)", desc: "Крайне тяжелые пороки ЦНС и лица. Абсолютное медицинское показание к прерыванию беременности." },
        { id: "turner_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Синдром Шерешевского — Тёрнера", desc: "Моносомия X (выраженная шейная гигрома/отёк на 1-м скрининге). Консилиум предлагает прерывание при тяжелом гидропсе." },
        { id: "anencephaly", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Анэнцефалия", desc: "Отсутствие свода черепа и полушарий мозга (11–13 нед). Порок 100% несовместим с жизнью, строгое показание к прерыванию." },
        { id: "spina_bifida", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Спина бифида (расщепление позвоночника)", desc: "Дефект позвоночного канала (12–13 нед). Настойчиво предлагается прерывание из-за риска паралича и гидроцефалии." },
        { id: "omphalocele", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Омпфалоцеле", desc: "Выход органов брюшной полости в грыжевой мешок пуповины (12–13 нед). При крупных сочетанных формах предлагается прерывание." },
        { id: "gastroschisis", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Гастрошизис", desc: "Выпадение петель кишечника вне брюшной полости (12–13 нед). Консилиум оценивает сочетанные риски." },
        { id: "hydrocephalus", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Врожденная гидроцефалия", desc: "Избыток ликвора в желудочках мозга (18–20 нед). Подлежит плановому неонатальному шунтированию." },
        { id: "phocomelia", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Фокомелия", desc: "Грубое недоразвитие/отсутствие сегментов конечностей (12–13 нед). Ведет к тяжелой инвалидности, консилиум предлагает выбор." },
        { id: "cleft_lip", type: "prenatal", discoveryWeek: 13, abortionIndicated: false, name: "Заячья губа (Хейлосхизис)", desc: "Несращение верхней губы (13–14 нед). Успешно и бесследно оперируется в первые месяцы. Прерывание НЕ показано." },
        { id: "polydactyly", type: "prenatal", discoveryWeek: 14, abortionIndicated: false, name: "Полидактилия (шестипалость)", desc: "Дополнительный пальчик (14–16 нед). Легко удаляется хирургически. Прерывание НЕ показано." },
        { id: "clubfoot", type: "prenatal", discoveryWeek: 16, abortionIndicated: false, name: "Косолапость", desc: "Подворот стопы (16–18 нед). Успешно выправляется массажем и фиксацией. Прерывание НЕ показано." },
        { id: "cleft_palate", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Волчья пасть (Палатосхизис)", desc: "Расщепление нёба (18–20 нед). Полностью восстанавливается реконструктивной хирургией. Прерывание НЕ показано." },
        { id: "syndactyly", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Синдактилия", desc: "Сращение пальчиков (18–20 нед). Планово разделяется хирургами. Прерывание НЕ показано." },
        { id: "achondroplasia", type: "prenatal", discoveryWeek: 20, abortionIndicated: false, name: "Ахондроплазия (карликовость)", desc: "Особенность роста трубчатых костей (20–24 нед). Не угрожает жизни, интеллект сохранен. Прерывание НЕ показано." },
        { id: "tetralogy_of_fallot", type: "prenatal", discoveryWeek: 13, abortionIndicated: true, name: "Тетрада Фалло", desc: "Сложный порок сердца (13–14 нед). Требует открытой кардиохирургии; консилиум обсуждает хирургический прогноз." },
        { id: "hlhs", type: "prenatal", discoveryWeek: 13, abortionIndicated: true, name: "Синдром гипоплазии левых отделов сердца (СГЛОС)", desc: "Недоразвитие левого желудочка (13–14 нед). Без этапных операций летальность 100%, врачи всегда предлагают аборт." },
        { id: "vsd", type: "prenatal", discoveryWeek: 16, abortionIndicated: false, name: "Дефект межжелудочковой перегородки (ДМЖП)", desc: "Окно в перегородке сердца (16–18 нед). Часто закрывается само или легко оперируется. Прерывание НЕ показано." },
        { id: "tga", type: "prenatal", discoveryWeek: 18, abortionIndicated: true, name: "Транспозиция магистральных артерий (ТМА)", desc: "Анатомическое переключение сосудов сердца (18–20 нед). Критический ВПС, требует сложнейшей неонатальной операции." },
        { id: "aortic_coarctation", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Коарктация аорты", desc: "Сужение аорты (18–21 нед). Устраняется малоинвазивным вмешательством. Прерывание НЕ показано." },
        { id: "asd", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Дефект межпредсердной перегородки (ДМПП)", desc: "Окно между предсердиями (18–20 нед). Благоприятный порок. Прерывание НЕ показано." },
        { id: "ebstein_anomaly", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Аномалия Эбштейна", desc: "Смещение трехстворчатого клапана (18–20 нед). Плановое кардионаблюдение. Прерывание НЕ показано." },
        { id: "renal_agenesis", type: "prenatal", discoveryWeek: 13, abortionIndicated: true, name: "Агенезия почек (Синдром Поттера)", desc: "Отсутствие почек и выраженное маловодие (13–14 нед). Плод нежизнеспособен, строгое показание к прерыванию." },
        { id: "diaphragmatic_hernia", type: "prenatal", discoveryWeek: 14, abortionIndicated: false, name: "Диафрагмальная грыжа", desc: "Смещение органов ЖКТ в грудную клетку (14–16 нед). Планово вправляется детскими хирургами после родов." },
        { id: "hydronephrosis", type: "prenatal", discoveryWeek: 16, abortionIndicated: false, name: "Врожденный гидронефроз", desc: "Расширение почечных лоханок (16–18 нед). Благоприятный прогноз, лечится после родов." },
        { id: "polycystic_kidneys", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Поликистоз почек", desc: "Кистозные изменения паренхимы (18–20 нед). Плановое наблюдение детских нефрологов." },
        { id: "esophageal_atresia", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Атрезия пищевода", desc: "Непроходимость пищевода и многоводие (18–20 нед). Успешно восстанавливается хирургами в первые сутки." },
        { id: "cpam", type: "prenatal", discoveryWeek: 18, abortionIndicated: true, name: "Кистозно-аденоматозный порок легких (КАМЛ)", desc: "Кистозное поражение доли легкого (18–20 нед). При крупных формах консилиум оценивает прогноз." },
        { id: "pulmonary_hypoplasia", type: "prenatal", discoveryWeek: 20, abortionIndicated: true, name: "Гипоплазия легких", desc: "Критический дефицит объема легочной ткани (20–22 нед). Высокий риск дыхательной недостаточности." },
        { id: "pda", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Открытый артериальный проток (ОАП)", desc: "Сосуд не закрылся после рождения. Корректируется медикаментозно в роддоме." },
        { id: "hearing_loss", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Врожденная тугоухость / Глухота", desc: "Диагностируется неонатальным аудиоскринингом. Компенсируется аппаратами/имплантами." },
        { id: "congenital_cataract", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Врожденная катаракта / Анофтальмия", desc: "Помутнение хрусталика. Подлежит ранней микрохирургической коррекции." },
        { id: "anal_atresia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Атрезия ануса", desc: "Отсутствие анального отверстия. Восстанавливается хирургами в первые дни жизни." },
        { id: "albinism", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Альбинизм (Глазо-кожный)", desc: "Отсутствие меланина: белоснежные волосы и светлые глаза. Безвредная особенность." },
        { id: "vitiligo", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Врождённое витилиго", desc: "Молочно-белые пятнышки на коже. Полностью безвредно для здоровья." },
        { id: "heterochromia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Врождённая гетерохромия", desc: "Разный цвет радужки глаз. Безвредная эстетическая изюминка." },
        { id: "waardenburg", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Синдром Ваарденбурга", desc: "Белая прядка надо лбом и ярко-синие глаза." },
        { id: "marfan", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Синдром Марфана (ранние признаки)", desc: "Высокий рост, удлиненные пальчики («паучьи пальцы»)." },
        { id: "pku", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Фенилкетонурия (ФКУ)", desc: "Выявляется пяточным тестом в роддоме. Требует специальной диеты." },
        { id: "cystic_fibrosis", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Муковисцидоз", desc: "Генетическая особенность желез. Требует ферментной терапии." },
        { id: "galactosemia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Галактоземия", desc: "Непереносимость лактозы. Требует безлактозного питания." }
    ],
    en: [
        { id: "down_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Down Syndrome (Trisomy 21)", desc: "Genetic condition (NT scan 11–13 wks). Medical board provides informed parental choice." },
        { id: "edwards_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Edwards Syndrome (Trisomy 18)", desc: "Severe chromosomal disorder (growth restriction, heart/cranial defects). Absolute indication for termination." },
        { id: "patau_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Patau Syndrome (Trisomy 13)", desc: "Severe CNS and craniofacial malformations. Absolute indication for medical termination." },
        { id: "turner_syndrome", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Turner Syndrome (Monosomy X)", desc: "Cystic hygroma on 1st trimester scan. Termination offered in severe hydrops cases." },
        { id: "anencephaly", type: "prenatal", discoveryWeek: 11, abortionIndicated: true, name: "Anencephaly", desc: "Absence of major portion of brain/skull (11–13 wks). 100% fatal, strict medical indication for abortion." },
        { id: "spina_bifida", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Spina Bifida", desc: "Neural tube defect (12–13 wks). Termination strongly offered due to severe paralysis risk." },
        { id: "omphalocele", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Omphalocele", desc: "Herniation of abdominal organs into umbilical cord (12–13 wks). Termination offered for complex forms." },
        { id: "gastroschisis", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Gastroschisis", desc: "Extrusion of intestines outside abdomen (12–13 wks). Surgical prognosis evaluated." },
        { id: "hydrocephalus", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Congenital Hydrocephalus", desc: "Excess CSF in brain ventricles (18–20 wks). Managed via postnatal neurosurgical shunting." },
        { id: "phocomelia", type: "prenatal", discoveryWeek: 12, abortionIndicated: true, name: "Phocomelia", desc: "Severe limb reduction (12–13 wks). Severe disability; termination offered to parents." },
        { id: "cleft_lip", type: "prenatal", discoveryWeek: 13, abortionIndicated: false, name: "Cleft Lip (Cheiloschisis)", desc: "Upper lip defect (13–14 wks). Easily repaired in infancy. Abortion NOT indicated." },
        { id: "polydactyly", type: "prenatal", discoveryWeek: 14, abortionIndicated: false, name: "Polydactyly (Extra Digits)", desc: "Extra finger/toe (14–16 wks). Minor cosmetic surgery. Abortion NOT indicated." },
        { id: "clubfoot", type: "prenatal", discoveryWeek: 16, abortionIndicated: false, name: "Clubfoot (Talipes equinovarus)", desc: "Inward turned foot (16–18 wks). Corrected via casting and physiotherapy. Abortion NOT indicated." },
        { id: "cleft_palate", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Cleft Palate (Palatoschisis)", desc: "Roof of mouth opening (18–20 wks). Restored with pediatric surgery. Abortion NOT indicated." },
        { id: "syndactyly", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Syndactyly (Webbed Digits)", desc: "Webbed fingers/toes (18–20 wks). Elective separation surgery. Abortion NOT indicated." },
        { id: "achondroplasia", type: "prenatal", discoveryWeek: 20, abortionIndicated: false, name: "Achondroplasia (Dwarfism)", desc: "Short-limb disproportion (20–24 wks). Normal lifespan and cognition. Abortion NOT indicated." },
        { id: "tetralogy_of_fallot", type: "prenatal", discoveryWeek: 13, abortionIndicated: true, name: "Tetralogy of Fallot", desc: "Complex heart defect (13–14 wks). Requires open-heart surgery; termination offered if prognosis is guarded." },
        { id: "hlhs", type: "prenatal", discoveryWeek: 13, abortionIndicated: true, name: "Hypoplastic Left Heart Syndrome (HLHS)", desc: "Underdeveloped left heart (13–14 wks). Highly lethal without staged surgeries; termination recommended." },
        { id: "vsd", type: "prenatal", discoveryWeek: 16, abortionIndicated: false, name: "Ventricular Septal Defect (VSD)", desc: "Opening between ventricles (16–18 wks). Frequently resolves spontaneously. Abortion NOT indicated." },
        { id: "tga", type: "prenatal", discoveryWeek: 18, abortionIndicated: true, name: "Transposition of the Great Arteries (TGA)", desc: "Reversed great vessels (18–20 wks). Critical cardiac defect; termination offered if surgery is high-risk." },
        { id: "aortic_coarctation", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Coarctation of the Aorta", desc: "Aortic narrowing (18–21 wks). Corrected via minor intervention. Abortion NOT indicated." },
        { id: "asd", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Atrial Septal Defect (ASD)", desc: "Benign upper chamber opening (18–20 wks). Abortion NOT indicated." },
        { id: "ebstein_anomaly", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Ebstein's Anomaly", desc: "Tricuspid valve displacement (18–20 wks). Monitored postnatally. Abortion NOT indicated." },
        { id: "renal_agenesis", type: "prenatal", discoveryWeek: 13, abortionIndicated: true, name: "Renal Agenesis (Potter Syndrome)", desc: "Bilateral absent kidneys with anuria (13–14 wks). Incompatible with life; strict indication for abortion." },
        { id: "diaphragmatic_hernia", type: "prenatal", discoveryWeek: 14, abortionIndicated: false, name: "Diaphragmatic Hernia", desc: "Diaphragm opening (14–16 wks). Repaired surgically after birth. Abortion NOT indicated." },
        { id: "hydronephrosis", type: "prenatal", discoveryWeek: 16, abortionIndicated: false, name: "Congenital Hydronephrosis", desc: "Enlarged renal pelvis (16–18 wks). Resolves naturally or treated postnatally. Abortion NOT indicated." },
        { id: "polycystic_kidneys", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Polycystic Kidney Disease", desc: "Renal tissue cysts (18–20 wks). Monitored by nephrologists. Abortion NOT indicated." },
        { id: "esophageal_atresia", type: "prenatal", discoveryWeek: 18, abortionIndicated: false, name: "Esophageal Atresia", desc: "GI discontinuity (18–20 wks). Repaired immediately after delivery. Abortion NOT indicated." },
        { id: "cpam", type: "prenatal", discoveryWeek: 18, abortionIndicated: true, name: "Congenital Pulmonary Airway Malformation (CPAM)", desc: "Cystic lung mass (18–20 wks). Termination offered for extensive bilateral lesions." },
        { id: "pulmonary_hypoplasia", type: "prenatal", discoveryWeek: 20, abortionIndicated: true, name: "Pulmonary Hypoplasia", desc: "Underdeveloped lung volume (20–22 wks). High risk of neonatal respiratory failure." },
        { id: "pda", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Patent Ductus Arteriosus (PDA)", desc: "Persistent fetal vessel. Easily closed with medication in the nursery." },
        { id: "hearing_loss", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Congenital Hearing Loss / Deafness", desc: "Diagnosed on newborn auditory test. Managed with hearing aids or implants." },
        { id: "congenital_cataract", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Congenital Cataract / Anophthalmia", desc: "Ocular lens clouding. Managed with early pediatric ophthalmology." },
        { id: "anal_atresia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Imperforate Anus (Anal Atresia)", desc: "Absence of anal opening. Restored surgically in first days." },
        { id: "albinism", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Albinism (Oculocutaneous)", desc: "Melanin absence: snow-white hair and light eyes. Harmless genetic trait." },
        { id: "vitiligo", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Congenital Vitiligo", desc: "Focal pigmentation loss in patches. Harmless cosmetic feature." },
        { id: "heterochromia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Congenital Heterochromia", desc: "Different iris colors in each eye. Harmless striking feature." },
        { id: "waardenburg", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Waardenburg Syndrome", desc: "White forelock of hair and ice-blue eyes." },
        { id: "marfan", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Marfan Syndrome (Early Signs)", desc: "Tall stature and elongated slender fingers." },
        { id: "pku", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Phenylketonuria (PKU)", desc: "Diagnosed on newborn heel-prick test. Managed with diet." },
        { id: "cystic_fibrosis", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Cystic Fibrosis", desc: "Secretory gland condition managed with enzymes." },
        { id: "galactosemia", type: "postnatal", discoveryWeek: 0, abortionIndicated: false, name: "Galactosemia", desc: "Galactose intolerance managed with special formula." }
    ]
};

function getAllEggEmbryoDiseases(lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const fetalPool = FETAL_DISEASES[l] || FETAL_DISEASES['ru'];
    const eggPool = EGG_EMBRYO_DISEASES[l] || EGG_EMBRYO_DISEASES['ru'];
    return [...fetalPool, ...eggPool];
}

export function getEggEmbryoDisease(id, lang = 'ru') {
    if (!id) return null;
    const pool = getAllEggEmbryoDiseases(lang);
    return pool.find(d => d.id === id) || null;
}

export function getRandomEggEmbryoDiseaseId() {
    const pool = getAllEggEmbryoDiseases('ru');
    return pool[Math.floor(Math.random() * pool.length)].id;
}

export function rollEggEmbryoDisease() {
    return Math.random() * 100 < 10 ? getRandomEggEmbryoDiseaseId() : null;
}


export function getFetusData(weeks, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = PREGNANCY_STAGES[l] || PREGNANCY_STAGES['ru'];
    const milestones = Object.keys(pool).map(Number).sort((a, b) => b - a);
    for (const week of milestones) {
        if (weeks >= week) return pool[week];
    }
    return pool[1];
}

export function getPostpartumData(days, method = 'natural', lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const langPool = POSTPARTUM_STAGES[l] || POSTPARTUM_STAGES['ru'];
    const pool = langPool[method] || langPool['natural'];
    const milestones = Object.keys(pool).map(Number).sort((a, b) => a - b);
    for (const day of milestones) {
        if (days <= day) return pool[day];
    }
    return pool[40] || pool[Object.keys(pool)[Object.keys(pool).length - 1]];
}

export function getRandomSymptomIndices(phase, maxCount = 3) {
    const list = SYMPTOMS['en'][phase] || SYMPTOMS['ru'][phase];
    if (!list || list.length === 0) return [];
    const indices = list.map((_, i) => i).sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * maxCount) + 1;
    return indices.slice(0, count);
}

export function getSymptomList(phase, indices, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const list = SYMPTOMS[l]?.[phase] || SYMPTOMS['ru']?.[phase] || [];
    if (!indices || indices.length === 0) return [];
    return indices.map(i => list[i]).filter(Boolean);
}

export function rollComplication(trimester) {
    if (Math.random() * 100 > 20) return null;
    const pool = COMPLICATIONS_POOL['ru'].filter(c => c.trimester === trimester);
    if (!pool || pool.length === 0) return null;
    const selected = pool[Math.floor(Math.random() * pool.length)];
    
    let startWeek = 4;
    if (trimester === 1) startWeek = Math.floor(Math.random() * 9) + 4;
    else if (trimester === 2) startWeek = Math.floor(Math.random() * 14) + 13;
    else if (trimester === 3) startWeek = Math.floor(Math.random() * 13) + 27;

    return { id: selected.id, curable: selected.curable, triggerWeek: startWeek, isDiscovered: false };
}

export function getComplication(id, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = COMPLICATIONS_POOL[l] || COMPLICATIONS_POOL['ru'];
    return pool.find(c => c.id === id) || COMPLICATIONS_POOL['ru'].find(c => c.id === id);
}

export function getRandomFetalDiseaseId() {
    const pool = FETAL_DISEASES['ru'];
    const selected = pool[Math.floor(Math.random() * pool.length)];
    return selected.id;
}

export function getFetalDisease(id, lang = 'ru') {
    if (!id) return null;
    const l = (lang === 'en') ? 'en' : 'ru';
    const pool = FETAL_DISEASES[l] || FETAL_DISEASES['ru'];
    return pool.find(d => d.id === id) || pool[0];
}

export {
    getEggCarryingData,
    getEggPostLayData,
    getEggIncubationData,
    getEggSymptomList,
    getRandomEggSymptomIndices,
    getEggShellDefect,
    EGG_SHELL_DEFECTS,
    EGG_EMBRYO_DISEASES,
    EGG_SYMPTOMS,
    EGG_CARRYING_STAGES,
    EGG_POSTLAY_STAGES,
    EGG_INCUBATION_STAGES
} from './eggSystem.js';
