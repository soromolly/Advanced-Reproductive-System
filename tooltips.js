// База данных всплывающих подсказок и руководств (RU / EN)
export const TOOLTIPS = {
    ru: {
        secretConception: "При включении зачатие происходит тайно: кубик бросается скрыто без спойлерных уведомлений. В первые недели цикл отображается как обычно, симптомы и плод скрыты в UI и промпте. Беременность раскрывается при проведении теста/проверки на задержке или автоматически со временем.",
        irregularCycle: "Включает естественные колебания цикла (от -1 до +12 дней). Создает реалистичные задержки без беременности, имитируя гормональные сбои и стресс.",
        mode: "«Реализм» — стандартный женский цикл (40 акушерских недель, овуляция за 14 дней до месячных). «ОмегаВерс» — течка с 1-го дня цикла, пик фертильности, срок 36 недель и возможность мужской беременности. «Яйцекладка» — цикл 28 дней с окном фертильности в начале, вынашивание 2–7 яиц в течение 6 недель, затем кладка и внешняя инкубация 60–120 дней.",
        physiology: "Биологическое строение персонажа. В Реализме доступна только Женщина. В Омегаверсе — Женщина-Омега (вагинальное зачатие) и Мужчина-Омега (анальное зачатие со смазкой). В Яйцекладке — Мужчина и Женщина.",
        aiAwareness: "Режим раскрытия информации — определяет, что видят игрок и ИИ. «Современность» — поэтапное раскрытие по клиническим скринингам: двойня/тройня на 12 нед., пол на 20 нед., а патологии — по индивидуальным срокам их выявления (11–21 нед.). Для яйцекладки: УЗИ показывает только количество яиц и дефекты скорлупы; пол и патологии эмбрионов — только после кладки при осмотре. «Средневековье» — пол, число детей/яиц и пороки скрыты до родов/вылупления, а аборт невозможен после 12 нед. «Всеведение» — боту сразу открыты все параметры с момента зачатия.",
        contraception: "Метод защиты от беременности. «Презерватив» снижает шанс до ~2%, «КОК (таблетки)» — до 0.1%, «ВМС (спираль)» — до 0.2%. Без защиты в фертильное окно шанс максимален.",
        fetalPathology: "Шанс возникновения врожденных патологий или замирания беременности (1-й трим: ~10%, 2-й: ~1.5%, 3-й: <0.5%). Данные скрыты от игрока и ИИ до момента их выявления на скрининге или выкидыша. Для яйцекладки — патологии эмбрионов внутри яиц и дефекты скорлупы.",
        rpDate: "Текущая дата в сюжете ролевой игры. Поддерживает форматы ДД.ММ.ГГГГ, ISO и текстовые даты любого века.",
        cycleLength: "Базовая длительность цикла в днях (по умолчанию 28). Овуляция автоматически рассчитывается как (Длина цикла - 14). В Омегаверсе и Яйцекладке окно фертильности приходится на начало цикла.",
        periodDuration: "Количество дней кровотечения при менструации (или длительность течки у омег, или окно фертильности в яйцекладке).",
        maxWeeks: "Максимальный акушерский срок вынашивания плода (40 недель для Реализма, 36 для Омегаверса), по достижении которого наступают роды. Для яйцекладки срок фиксирован — 6 недель (42 дня).",
        oviposition: "Режим яйцекладки: цикл 28 дней, окно фертильности в начале цикла (дни 1–5). После зачатия персонаж вынашивает 2–7 яиц в течение 42 дней (6 недель). Затем кладка, восстановление 3–7 дней и внешняя инкубация 60–120 дней до вылупления. УЗИ (Современность) показывает только количество яиц и дефекты скорлупы; пол и патологии эмбрионов видны только после кладки при осмотре. В Средневековье всё скрыто до вылупления."
    },
    en: {
        secretConception: "When enabled, conception occurs secretly: dice rolls are hidden without spoiler notifications. Early weeks show regular cycle, hiding symptoms and fetus from UI and AI prompt. Discovered via test/check or automatically over time.",
        irregularCycle: "Enables natural cycle fluctuations (-1 to +12 days). Simulates realistic pregnancy scares, hormonal delays, and stress.",
        mode: "«Realism» — human female cycle (40 obstetric weeks, ovulation 14 days before menses). «OmegaVerse» — Heat begins on Day 1, 36-week gestation, and male pregnancy support. «Oviposition» — 28-day cycle with fertility window at the start, 2–7 eggs carried for 6 weeks, then laying and 60–120 days of external incubation.",
        physiology: "Biological reproductive anatomy. In Realism, only Female is available. In Omegaverse, choose between Female Omega (vaginal) and Male Omega (anal self-lubricating). In Oviposition — Male and Female.",
        aiAwareness: "Reveal Mode — controls what the player and the AI can see. «Modernity» — phased clinical discovery: multiples at 12 wks, fetal sex at 20 wks, and anomalies at their clinical detection milestones (11–21 wks). For Oviposition: ultrasound reveals only egg count and shell defects; sexes and embryo pathologies only after laying during inspection. «Medieval (Blind)» — sex, headcount, and pathologies hidden until delivery/hatching; abortion strictly locked after 12 wks. «Omniscience» — AI is aware of all parameters from conception.",
        contraception: "Birth control method. «Condom» reduces chance to ~2%, «Oral Pills» to 0.1%, «IUD» to 0.2%. Unprotected intercourse during fertility peak carries the highest conception chance.",
        fetalPathology: "Enables congenital anomalies and missed miscarriages (1st tri: ~10%, 2nd: ~1.5%, 3rd: <0.5%). Kept completely secret from UI and AI until screening discovery or miscarriage. For Oviposition — embryo pathologies inside eggs and shell defects.",
        rpDate: "In-character roleplay date. Supports DD.MM.YYYY, ISO, and natural textual dates across any era.",
        cycleLength: "Base menstrual cycle duration in days (default 28). Ovulation is automatically calculated as (Cycle Length - 14). In OmegaVerse and Oviposition, the fertility window falls at the start of the cycle.",
        periodDuration: "Duration of menstrual bleeding in days (or heat duration for Omegas, or fertility window for Oviposition).",
        maxWeeks: "Total obstetric gestational duration (40 weeks for Realism, 36 for Omegaverse) before full-term labor begins. For Oviposition the term is fixed — 6 weeks (42 days).",
        oviposition: "Oviposition mode: 28-day cycle, fertility window at the start (days 1–5). After conception, the character carries 2–7 eggs for 42 days (6 weeks). Then laying, 3–7 days recovery, and 60–120 days of external incubation before hatching. Ultrasound (Modernity) reveals only egg count and shell defects; genders and embryo pathologies are visible only after laying during inspection. In Medieval mode, everything stays hidden until hatching."
    }
};

export function getTooltipHtml(key, lang = 'ru') {
    const l = (lang === 'en') ? 'en' : 'ru';
    const text = TOOLTIPS[l]?.[key] || TOOLTIPS['ru']?.[key] || '';
    return `<span class="repro-tooltip-btn repro-tooltip-icon" data-tip="${text.replace(/"/g, '&quot;')}" title="${text.replace(/"/g, '&quot;')}" style="display: inline-flex; align-items: center; justify-content: center; padding: 4px 7px; margin-left: 6px; cursor: pointer; color: #f472b6; opacity: 0.85; z-index: 5; position: relative; font-size: 0.9em; touch-action: manipulation; user-select: none;"><i class="fa-solid fa-circle-info" style="pointer-events: none;"></i></span>`;
}
