import { 
    saveSettingsDebounced, 
    eventSource, 
    event_types,
    setExtensionPrompt,
    extension_prompt_types
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { getRandomSymptoms, getFetusData, rollComplication, generateChildGenetics, getPostpartumData } from './symptoms.js';

const EXTENSION_NAME = 'st-advanced-reproductive-system';

const DEFAULT_SETTINGS = {
    isEnabled: true,
    mode: 'realism',       
    gender: 'female',      
    aiAwareness: 'dynamic', 
    cycleLength: 28,
    periodDuration: 5,
    chatPregnancyData: {}  
};

// Функция-генератор ДЛЯ ПОЛНОЙ ИЗОЛЯЦИИ памяти каждого отдельного чата
function createDefaultBodyData() {
    return {
        cycleDay: 1,
        lastRpDate: null,
        isPregnant: false,
        pregnancyWeeks: 0,
        pregnancyDays: 0,
        babiesCount: 0,
        babiesGenders: [],
        currentSymptoms: [],
        rolledTrimesters: { 1: false, 2: false, 3: false },
        activeComplication: null,
        postpartumDays: 0,
        childrenList: [] 
    };
}

let settings = Object.assign({}, DEFAULT_SETTINGS);
let isMenuCollapsed = true; 

const MONTHS = {
    'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
    'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11,
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
    'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
};

const TRANSLATIONS = {
    ru: {
        title: '🧬 Система Репродукции V2',
        system: 'Система:', realism: 'Реализм', omegaverse: 'ОмегаВерс',
        physiology: 'Физиология:', female: 'Женщина', female_omega: 'Ж-Омега', male_omega: 'М-Омега',
        aiLogic: 'Логика ИИ:', ultrasound: 'УЗИ (20 нед)', medieval: 'Средневековье', knowsAll: 'Знает всё',
        phaseRealism: 'Текущая фаза:', phaseOmega: 'Текущее состояние омеги:',
        termInRp: 'Срок в RP:', weeksShort: 'нед.', daysShort: 'дн.',
        wombMap: 'Карта плода:', babiesCount: 'Детей:', babiesSex: 'Пол:',
        sync: 'Синхронизация:', waitingDate: 'Ожидание даты',
        paramsHeader: 'Параметры', rpDateLabel: 'RP Дата:', cycleLengthLabel: 'Цикл (дней):',
        pregnancyWeekLabel: 'Неделя:', cycleDayLabel: 'День цикла:',
        applyBtn: '▶ Применить изменения', initPregnancyHeader: 'Задать беременность',
        manualWeeks: 'Срок (нед):', manualCount: 'Плодов:', startPregnancyBtn: '🤰 Начать беременность',
        resetPregnancyBtn: '🚼 Сбросить беременность', resetAllBtn: 'Полный сброс данных',
        toastSaved: 'Параметры успешно сохранены!', toastManualPreg: 'Беременность установлена вручную: ',
        toastResetPreg: 'Беременность сброшена.', toastResetAll: 'Данные чата полностью очищены.',
        toastTimePassed: 'Репродуктивная система: В РП прошло дней: ',
        toastConception: '🚨 ЗАЧАТИЕ ПРОИЗОШЛО! Успешная имплантация в матке.',
        toastPregEnd: 'Срок беременности подошел к концу! Пора рожать.',
        pregnancy: 'Беременность 🤰', pregnancyOmega: 'Беременность (Омега) 🤰',
        menstruation: 'Менструация 🩸', ovulation: 'Овуляция (Окно зачатия) ✨',
        follicularLuteal: 'Фолликулярная/Лютеиновая фаза', heat: 'Течка (Пик фертильности) 🔥', quiescence: 'Период покоя',
        symptomsTitle: '🎯 Симптомы организма:', fetusTitle: '👶 Развитие плода и тела:',
        complicationTitle: '⚠️ Медицинское осложнение:', cureBtn: '💊 Провести лечение / Облегчить симптом',
        postpartumPhase: 'Восстановление после родов 🩹', newbornTitle: '🍼 Рожденные дети в семье:',
        giveBirthBtn: '🔔 ПРИНЯТЬ РОДЫ (Сюжетный триггер)'
    },
    en: {
        title: '🧬 Reproductive System V2',
        system: 'System:', realism: 'Realism', omegaverse: 'OmegaVerse',
        physiology: 'Physiology:', female: 'Female', female_omega: 'F-Omega', male_omega: 'M-Omega',
        aiLogic: 'AI Awareness:', ultrasound: 'Ultrasound (20 wk)', medieval: 'Medieval (Blind)', knowsAll: 'Knows Everything',
        phaseRealism: 'Current Phase:', phaseOmega: 'Current Omega Status:',
        termInRp: 'Term in RP:', weeksShort: 'wks', daysShort: 'days',
        wombMap: 'Womb Content:', babiesCount: 'Babies:', babiesSex: 'Sex:',
        sync: 'Synchronized:', waitingDate: 'Waiting for date',
        paramsHeader: 'Parameters', rpDateLabel: 'RP Date:', cycleLengthLabel: 'Cycle (days):',
        pregnancyWeekLabel: 'Week:', cycleDayLabel: 'Cycle Day:',
        applyBtn: '▶ Apply Changes', initPregnancyHeader: 'Initialize Pregnancy',
        manualWeeks: 'Term (wks):', manualCount: 'Babies:', startPregnancyBtn: '🤰 Start Pregnancy',
        resetPregnancyBtn: '🚼 Reset Pregnancy Only', resetAllBtn: 'Full Data Reset',
        toastSaved: 'Parameters successfully saved!', toastManualPreg: 'Pregnancy set manually: ',
        toastResetPreg: 'Pregnancy has been reset.', toastResetAll: 'Chat data fully cleared.',
        toastTimePassed: 'Reproductive system: Days passed in RP: ',
        toastConception: '🚨 CONCEPTION OCCURRED! Successful implantation in the womb.',
        toastPregEnd: 'Pregnancy term has ended! Time to give birth.',
        pregnancy: 'Pregnancy 🤰', pregnancyOmega: 'Pregnancy (Omega) 🤰',
        menstruation: 'Menstruation 🩸', ovulation: 'Ovulation (Conception Window) ✨',
        follicularLuteal: 'Follicular/Luteal Phase', heat: 'Heat (Peak Fertility) 🔥', quiescence: 'Quiescence Period',
        symptomsTitle: '🎯 Body Symptoms:', fetusTitle: '👶 Fetus & Body Development:',
        complicationTitle: '⚠️ Medical Complication:', cureBtn: '💊 Treat / Alleviate Complication',
        postpartumPhase: 'Postpartum Recovery 🩹', newbornTitle: '🍼 Children in Family:',
        giveBirthBtn: '🔔 GIVE BIRTH (Story Trigger)'
    }
};

function getLanguage() {
    const currentLang = (typeof window.i18n?.language === 'string') ? window.i18n.language.toLowerCase() : 'ru';
    const sngLanguages = ['ru', 'uk', 'be', 'kk', 'uz', 'az', 'hy', 'tg', 'tk', 'ky'];
    return sngLanguages.includes(currentLang) ? 'ru' : 'en';
}

function getText(key) {
    const lang = getLanguage();
    return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key];
}

function getCurrentChatId() {
    return (typeof SillyTavern?.getContext === 'function') ? (SillyTavern.getContext().chatId || window.chat_id || 'default') : (window.chat_id || 'default');
}

function getChatBodyData() {
    const chatId = getCurrentChatId();
    if (!settings.chatPregnancyData[chatId]) {
        settings.chatPregnancyData[chatId] = createDefaultBodyData();
    }
    const data = settings.chatPregnancyData[chatId];
    if (data.postpartumDays === undefined) data.postpartumDays = 0;
    if (!data.childrenList) data.childrenList = [];
    if (!data.rolledTrimesters) data.rolledTrimesters = { 1: false, 2: false, 3: false };
    return data;
}

function loadSettings() {
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = Object.assign({}, DEFAULT_SETTINGS);
    }
    settings = extension_settings[EXTENSION_NAME];
    
    const data = getChatBodyData();
    updateSymptomsData(data);
    checkPregnancyComplications(data);

    renderUI();
    updatePromptInjection();
}

function getBodyPhase() {
    const data = getChatBodyData();
    if (data.postpartumDays > 0) return getText('postpartumPhase');
    if (data.isPregnant) return settings.mode === 'realism' ? getText('pregnancy') : getText('pregnancyOmega');

    const day = data.cycleDay;
    if (settings.mode === 'realism') {
        if (day <= settings.periodDuration) return getText('menstruation');
        if (day >= 11 && day <= 16) return getText('ovulation');
        return getText('follicularLuteal');
    } else {
        if (day >= 12 && day <= 15) return getText('heat');
        return getText('quiescence');
    }
}

function updateSymptomsData(data) {
    if (data.isPregnant || data.postpartumDays > 0) {
        data.currentSymptoms = [];
        return;
    }
    if (data.currentSymptoms && data.currentSymptoms.length > 0) return;

    const phase = getBodyPhase();
    let phaseKey = null;
    if (phase === getText('menstruation')) phaseKey = 'menstruation';
    else if (phase === getText('ovulation') || phase === getText('heat')) phaseKey = 'ovulation';

    if (phaseKey) data.currentSymptoms = getRandomSymptoms(phaseKey, 3);
    else data.currentSymptoms = [];
}

function checkPregnancyComplications(data) {
    if (!data.isPregnant) return;
    const currentWeek = data.pregnancyWeeks;
    let currentTrimester = 1;
    if (currentWeek >= 13 && currentWeek <= 26) currentTrimester = 2;
    else if (currentWeek >= 27) currentTrimester = 3;

    if (!data.rolledTrimesters[currentTrimester] && !data.activeComplication) {
        data.rolledTrimesters[currentTrimester] = true;
        const rolled = rollComplication(currentTrimester);
        if (rolled) data.activeComplication = rolled;
    }

    if (data.activeComplication && !data.activeComplication.isDiscovered) {
        if (currentWeek >= data.activeComplication.triggerWeek) {
            data.activeComplication.isDiscovered = true;
            toastr.error(`🚨 Осложнение беременности: Обнаружен «${data.activeComplication.name}»!`);
        }
    }
}

function parseRpDateFromText(text) {
    if (!text) return null;
    const textRegex = /(\d{1,2})\s+([a-zA-Zа-яёА-ЯЁ]+)\s+(\d{4})/i;
    const textMatch = text.match(textRegex);
    if (textMatch) {
        const day = parseInt(textMatch[1]), monthStr = textMatch[2].toLowerCase(), year = parseInt(textMatch[3]);
        if (MONTHS[monthStr] !== undefined && day >= 1 && day <= 31) return new Date(year, MONTHS[monthStr], day);
    }
    const numRegex = /(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{4})/;
    const numMatch = text.match(numRegex);
    if (numMatch) {
        const day = parseInt(numMatch[1]), month = parseInt(numMatch[2]) - 1, year = parseInt(numMatch[3]);
        if (month >= 0 && month <= 11 && day >= 1 && day <= 31) return new Date(year, month, day);
    }
    return null;
}

function parseRelativeTimeFromText(text) {
    const ruRegex = /прошло\s+(\d+)\s+(дне[йяа]|недел[ьия]|месяц[аев]|ле[тв]|год[аоу]?)/i;
    const ruMatch = text.match(ruRegex);
    const enRegex = /(?:passed\s+(\d+)\s+(day|week|month|year)s?|(\d+)\s+(day|week|month|year)s?\s+(?:passed|later))/i;
    const enMatch = text.match(enRegex);

    let count = 0, unit = '';
    if (ruMatch) { count = parseInt(ruMatch[1]); unit = ruMatch[2].toLowerCase(); }
    else if (enMatch) { count = parseInt(enMatch[1] || enMatch[3]); unit = (enMatch[2] || enMatch[4]).toLowerCase(); }
    else return null;

    const data = getChatBodyData();
    if (data.lastRpDate) {
        const baseDate = new Date(data.lastRpDate), futureDate = new Date(data.lastRpDate);
        if (unit.startsWith('дн') || unit.startsWith('day')) futureDate.setDate(futureDate.getDate() + count);
        else if (unit.startsWith('нед') || unit.startsWith('week')) futureDate.setDate(futureDate.getDate() + (count * 7));
        else if (unit.startsWith('мес') || unit.startsWith('month')) futureDate.setMonth(futureDate.getMonth() + count);
        else if (unit.startsWith('ле') || unit.startsWith('год') || unit.startsWith('year')) futureDate.setFullYear(futureDate.getFullYear() + count);

        const totalDays = Math.floor((futureDate - baseDate) / (1000 * 60 * 60 * 24));
        data.lastRpDate = futureDate.toISOString().split('T')[0];
        return totalDays;
    }
    if (unit.startsWith('дн') || unit.startsWith('day')) return count;
    if (unit.startsWith('нед') || unit.startsWith('week')) return count * 7;
    if (unit.startsWith('мес') || unit.startsWith('month')) return count * 30;
    return count * 365;
}

function handleTimeProgression(text) {
    const data = getChatBodyData();
    const relativeDays = parseRelativeTimeFromText(text);
    if (relativeDays !== null && relativeDays > 0) {
        advanceBodyTime(relativeDays);
        checkPregnancyComplications(data);
        saveSettingsDebounced(); renderUI(); return; 
    }

    const currentRpDate = parseRpDateFromText(text);
    if (!currentRpDate) return;
    const currentRpDateStr = currentRpDate.toISOString().split('T')[0];

    if (data.lastRpDate && data.lastRpDate !== currentRpDateStr) {
        const daysPassed = Math.floor((currentRpDate - new Date(data.lastRpDate)) / (1000 * 60 * 60 * 24));
        if (daysPassed > 0) {
            advanceBodyTime(daysPassed);
            checkPregnancyComplications(data);
            toastr.info(`${getText('toastTimePassed')}${daysPassed}.`);
        }
    }
    data.lastRpDate = currentRpDateStr;
    saveSettingsDebounced(); renderUI();
}

function advanceBodyTime(days) {
    const data = getChatBodyData();
    
    if (data.postpartumDays > 0) {
        data.postpartumDays += days;
        if (data.postpartumDays > 40) {
            data.postpartumDays = 0;
            data.cycleDay = 1; 
            toastr.success("Послеродовое восстановление завершено. Репродуктивный цикл запущен.");
        }
        return;
    }

    if (data.isPregnant) {
        data.pregnancyDays += days;
        if (data.pregnancyDays >= 7) {
            data.pregnancyWeeks += Math.floor(data.pregnancyDays / 7);
            data.pregnancyDays %= 7;
        }
        const maxWeeks = settings.mode === 'omegaverse' ? 36 : 40;
        if (data.pregnancyWeeks >= maxWeeks) toastr.warning(getText('toastPregEnd'));
    } else {
        data.cycleDay += days;
        if (data.cycleDay > settings.cycleLength) data.cycleDay = ((data.cycleDay - 1) % settings.cycleLength) + 1;
        data.currentSymptoms = [];
    }
}

function checkConceptionTrigger(text) {
    const data = getChatBodyData();
    if (data.isPregnant || data.postpartumDays > 0) return;

    const lowerText = text.toLowerCase();
    const phase = getBodyPhase();
    
    const hasVaginal = /вагинально|в писю|в киску|внутрь влагалища|влагалище|vaginal|pussy/i.test(lowerText);
    const hasAnal = /анально|в анус|в попу|в задницу|прямую кишку|anal|anus|ass|butt/i.test(lowerText);
    const hasEjaculationInside = /кончил внутрь|излил семя внутрь|эякуляция внутрь|залил|узел|сцепка|завязал узел|cum inside|ejaculation inside|creampie|knotting|tied/i.test(lowerText);

    let isFertile = phase.includes('Овуляция') || phase.includes('Течка') || phase.includes('Ovulation') || phase.includes('Heat');
    let canConceive = false;

    if (settings.mode === 'realism' && settings.gender === 'female' && hasVaginal && hasEjaculationInside && isFertile) canConceive = true;
    else if (settings.mode === 'omegaverse' && isFertile && hasEjaculationInside) {
        if (settings.gender === 'female_omega' && hasVaginal) canConceive = true;
        else if (settings.gender === 'male_omega' && hasAnal) canConceive = true;
    }

    if (canConceive && (Math.random() * 100 <= (settings.mode === 'omegaverse' ? 85 : 25))) triggerPregnancy(data);
}

function triggerPregnancy(data) {
    data.isPregnant = true;
    data.pregnancyWeeks = 0; data.pregnancyDays = 0;
    data.currentSymptoms = []; data.rolledTrimesters = { 1: false, 2: false, 3: false }; data.activeComplication = null;

    const roll = Math.random() * 100;
    data.babiesCount = settings.mode === 'omegaverse' ? (roll > 92 ? 3 : roll > 70 ? 2 : 1) : (roll > 98.5 ? 3 : roll > 95 ? 2 : 1);
    data.babiesGenders = [];
    
    const lang = getLanguage();
    for (let i = 0; i < data.babiesCount; i++) {
        data.babiesGenders.push(Math.random() > 0.5 ? (lang === 'ru' ? 'Мальчик ♂' : 'Boy ♂') : (lang === 'ru' ? 'Девочка ♀' : 'Girl ♀'));
    }

    data.hiddenGenetics = Array(data.babiesCount).fill().map(() => generateChildGenetics());

    saveSettingsDebounced(); renderUI(); updatePromptInjection(); toastr.success(getText('toastConception'));
}

function processBirthTrigger() {
    const data = getChatBodyData();
    if (!data.isPregnant) return;

    for (let i = 0; i < data.babiesCount; i++) {
        const gen = (data.hiddenGenetics && data.hiddenGenetics[i]) ? data.hiddenGenetics[i] : generateChildGenetics();
        data.childrenList.push({
            id: Date.now() + i,
            gender: data.babiesGenders[i],
            eyes: gen.eyes,
            hair: gen.hair
        });
    }

    data.isPregnant = false;
    data.pregnancyWeeks = 0; data.pregnancyDays = 0; data.babiesCount = 0; data.babiesGenders = []; data.activeComplication = null;
    data.hiddenGenetics = [];
    data.postpartumDays = 1; 

    updatePromptInjection(true); 
    
    saveSettingsDebounced();
    renderUI();
    toastr.success("Сюжетное событие: Роды начались!");
}

function updatePromptInjection(isImmediateBirth = false) {
    if (!settings.isEnabled) { setExtensionPrompt(EXTENSION_NAME, '', extension_prompt_types.IN_CHAT, 0); return; }
    const data = getChatBodyData();
    const phase = getBodyPhase();
    
    let prompt = `\n[OOC: SYSTEM NOTE — {{user}} Physiological Status]\n`;
    
    if (isImmediateBirth) {
        const lastChildren = data.childrenList.slice(-data.childrenList.length);
        prompt += `🚨 CRITICAL STORY EVENT: {{user}} is GIVING BIRTH right now in this exact scene!
Directive for {{char}}: Describe the intense process of delivery and labor. 
The outcome is already physically fixed by system data: {{user}} successfully delivers exactly ${lastChildren.length} baby(ies).
Baby details to describe: ${lastChildren.map((c, i) => `Child #${i+1}: ${c.gender}, Eyes: ${c.eyes} color, Hair: ${c.hair} color`).join('; ')}.
Acknowledge the baby's exact physical features in your response.\n`;
        setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
        return;
    }

    if (data.postpartumDays > 0) {
        const pData = getPostpartumData(data.postpartumDays);
        prompt += `Status: POSTPARTUM RECOVERY (Day ${data.postpartumDays}/40) | Phase: ${pData.name}\n`;
        prompt += `Physical Condition: ${pData.desc}\n`;
        if (settings.mode === 'omegaverse') {
            prompt += `🚨 OMEGA POSTPARTUM SCENT: The sharp pheromone of heat has completely faded. {{user}}'s body now continuously emits a soft, extremely sweet, warm 'milky' nesting scent. This scent deeply triggers {{char}}'s primal Alpha/Beta paternal instincts, causing heavy overprotectiveness, tenderness, and an urge to guard the nest and infant rather than sexual lust.\n`;
        } else {
            prompt += `Directive for {{char}}: Treat {{user}} as an exhausting, healing mother who requires absolute bedrest, care, and emotional safety. Act as an attentive partner.\n`;
        }
        setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
        return;
    }

    if (data.isPregnant) {
        prompt += `Status: PREGNANT | Duration: ${data.pregnancyWeeks} weeks.\n`;
        const fetus = getFetusData(data.pregnancyWeeks);
        prompt += `Fetus Size: ${fetus.size} | Maternal Body: ${fetus.belly}. ${fetus.desc}\n`;

        if (data.activeComplication && data.activeComplication.isDiscovered) {
            prompt += `🚨 ACTIVE MEDICAL COMPLICATION: ${data.activeComplication.name}. Symptoms: ${data.activeComplication.desc}\n`;
        }
        
        let revealToAI = settings.aiAwareness === 'full' || (settings.aiAwareness === 'dynamic' && data.pregnancyWeeks >= 20);
        if (revealToAI && settings.aiAwareness !== 'hidden') {
            prompt += `Womb Content: ${data.babiesCount} baby(ies), Sex: ${data.babiesGenders.join(', ')}\n`;
        } else {
            prompt += `Womb Content Details: [HIDDEN DATA]. In 'Medieval/Blind' mode, the exact sex, count, or features of the baby are an absolute mystery. {{char}} MUST act completely oblivious to whether it's a boy or girl, or if there are twins. Avoid meta-gaming.\n`;
        }
    } else {
        prompt += `Current Cycle Day: ${data.cycleDay}/${settings.cycleLength} | Phase: ${phase}\n`;
        if (data.currentSymptoms?.length > 0) prompt += `Current Physical Symptoms: ${data.currentSymptoms.join(', ')}.\n`;
        if (phase.includes('Течка') || phase.includes('Heat')) prompt += `🚨 DIRECTIVE: {{user}} is in OMEGA HEAT. Scent is potent and unignorable. Primal Alpha response required.\n`;
        else if (phase.includes('Овуляция') || phase.includes('Ovulation')) prompt += `⚠️ DIRECTIVE: {{user}} is ovulating (hidden internal process). Act completely oblivious.\n`;
    }

    setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
}

function renderUI() {
    const data = getChatBodyData();
    updateSymptomsData(data);
    checkPregnancyComplications(data);

    let displayDate = getText('waitingDate');
    if (data.lastRpDate) { const parts = data.lastRpDate.split('-'); displayDate = `${parts[2]}.${parts[1]}.${parts[0]}`; }

    let symptomsHtml = '';
    if (data.currentSymptoms?.length > 0) {
        symptomsHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(244, 114, 182, 0.12); border-left: 3px solid #f472b6; border-radius: 4px; text-align: left;">
            <strong style="font-size: 0.9em; color: #f472b6; display: block; margin-bottom: 5px;">${getText('symptomsTitle')}</strong>
            <ul style="margin: 0; padding-left: 16px; font-size: 0.85em; line-height: 1.4; opacity: 0.95; color: var(--text-color);">${data.currentSymptoms.map(s => `<li style="margin-bottom: 2px;">• ${s}</li>`).join('')}</ul>
        </div>`;
    }

    let fetusHtml = '';
    if (data.isPregnant) {
        const fetus = getFetusData(data.pregnancyWeeks);
        fetusHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(56, 189, 248, 0.1); border-left: 3px solid #38bdf8; border-radius: 4px; text-align: left; font-size: 0.85em; line-height: 1.4;">
            <strong style="font-size: 1.05em; color: #38bdf8; display: block; margin-bottom: 5px;">${getText('fetusTitle')}</strong>
            • Размер плода: <span style="color: #38bdf8; font-weight: bold;">${fetus.size}</span><br>• Вес: <span>${fetus.weight}</span><br>• Живот: <span>${fetus.belly}</span><br>
            <span style="display: block; margin-top: 4px; opacity: 0.85; font-style: italic;">${fetus.desc}</span>
        </div>`;
    }

    let postpartumHtml = '';
    if (data.postpartumDays > 0) {
        const pData = getPostpartumData(data.postpartumDays);
        postpartumHtml = `<div style="margin: 5px 0 10px 0; padding: 10px; background: rgba(16, 185, 129, 0.1); border-left: 3px solid #10b981; border-radius: 4px; text-align: left; font-size: 0.85em; line-height: 1.4;">
            <strong style="font-size: 1.05em; color: #10b981; display: block; margin-bottom: 4px;">Послеродовое состояние (День ${data.postpartumDays}/40)</strong>
            <b>Стадия:</b> ${pData.name}<br><span style="opacity: 0.85; display: block; margin-top: 2px;">${pData.desc}</span>
        </div>`;
    }

    let complicationHtml = '';
    if (data.isPregnant && data.activeComplication && data.activeComplication.isDiscovered) {
        complicationHtml = `<div style="margin: 8px 0 10px 0; padding: 10px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 6px; text-align: left; font-size: 0.85em; line-height: 1.4;">
            <strong style="color: #f87171; display: block; margin-bottom: 4px;">${getText('complicationTitle')} ${data.activeComplication.name}</strong>
            <span style="opacity: 0.9; display: block; margin-bottom: 6px;">${data.activeComplication.desc}</span>
            ${data.activeComplication.curable ? `<button id="repro-cure-complication" class="menu_button" style="width: 100%; background: #059669; color: white; font-size: 11px; padding: 4px; font-weight: 600; justify-content: center;">${getText('cureBtn')}</button>` : ''}
        </div>`;
    }

    let familyHtml = '';
    if (data.childrenList?.length > 0) {
        familyHtml = `<div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.15); border-radius: 6px; text-align: left; font-size: 0.85em;">
            <strong style="color: #f472b6; display: block; margin-bottom: 6px;">${getText('newbornTitle')}</strong>
            ${data.childrenList.map((c, i) => `<div style="margin-bottom: 4px;">👶 Ребенок ${i+1}: <b>${c.gender}</b> (Глаза: <span style="color: #38bdf8;">${c.eyes}</span>, Hair: <span style="color: #fbbf24;">${c.hair}</span>)</div>`).join('')}
        </div>`;
    }

    const html = `
        <div class="repro-custom-btn-toggle" style="display: flex; justify-content: space-between; align-items: center; background: var(--input-bg, #1e1e2a); border: 1px solid var(--input-border, #334155); padding: 10px 14px; border-radius: ${isMenuCollapsed ? '10px' : '10px 10px 0 0'}; cursor: pointer; user-select: none; font-size: 14px; transition: background 0.15s;">
            <span style="color: #f472b6 !important; font-weight: 600;">${getText('title')}</span>
            <i id="repro-toggle-arrow" class="fa-solid ${isMenuCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="opacity: 0.6; font-size: 12px; margin-right: 4px;"></i>
        </div>
        
        <div id="repro-content-wrapper" style="${isMenuCollapsed ? 'display: none;' : 'display: block;'} background: rgba(0, 0, 0, 0.15); border: 1px solid var(--input-border, #334155); border-top: none; border-radius: 0 0 10px 10px; padding: 14px; box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 0.9em; opacity: 0.85;">${getText('system')}</label>
                <select id="repro-mode" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;">
                    <option value="realism" ${settings.mode === 'realism' ? 'selected' : ''}>${getText('realism')}</option>
                    <option value="omegaverse" ${settings.mode === 'omegaverse' ? 'selected' : ''}>${getText('omegaverse')}</option>
                </select>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 0.9em; opacity: 0.85;">${getText('physiology')}</label>
                <select id="repro-gender" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;">
                    <option value="female" ${settings.gender === 'female' ? 'selected' : ''}>${getText('female')}</option>
                    <option value="female_omega" ${settings.gender === 'female_omega' ? 'selected' : ''}>${getText('female_omega')}</option>
                    <option value="male_omega" ${settings.gender === 'male_omega' ? 'selected' : ''}>${getText('male_omega')}</option>
                </select>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 0.9em; opacity: 0.85;">${getText('aiLogic')}</label>
                <select id="repro-awareness" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;">
                    <option value="dynamic" ${settings.aiAwareness === 'dynamic' ? 'selected' : ''}>${getText('ultrasound')}</option>
                    <option value="hidden" ${settings.aiAwareness === 'hidden' ? 'selected' : ''}>${getText('medieval')}</option>
                    <option value="full" ${settings.aiAwareness === 'full' ? 'selected' : ''}>${getText('knowsAll')}</option>
                </select>
            </div>

            <div style="background: rgba(0, 0, 0, 0.25); border-left: 3px solid #f472b6; border-radius: 4px; padding: 10px; margin: 12px 0; font-size: 0.9em; text-align: left;">
                <div style="margin-bottom: 4px;"><strong>${settings.mode === 'realism' ? getText('phaseRealism') : getText('phaseOmega')}</strong> <span style="color: #4ade80; font-weight: 700;">${getBodyPhase()}</span></div>
                
                ${symptomsHtml}
                ${fetusHtml}
                ${postpartumHtml}
                ${complicationHtml}
                ${familyHtml}

                ${data.isPregnant ? `
                    <div style="margin-bottom: 4px;"><strong>${getText('termInRp')}</strong> ${data.pregnancyWeeks} ${getText('weeksShort')} ${data.pregnancyDays} ${getText('daysShort')}</div>
                    ${(settings.aiAwareness === 'hidden') ? `
                         <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #a1a1aa; font-style: italic;">
                            🔒 Режим Средневековье: пол и генетика младенца скрыты до момента родов.
                         </div>
                    ` : `
                        <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6;">
                            ℹ️ <em>${getText('wombMap')}</em><br>
                            • ${getText('babiesCount')} <b>${data.babiesCount}</b><br>
                            • ${getText('babiesSex')} <b>${data.babiesGenders.join(', ')}</b>
                        </div>
                    `}
                ` : `
                    ${data.postpartumDays === 0 ? `<div style="margin-bottom: 4px;"><strong>${getText('cycleDayLabel')}</strong> ${data.cycleDay} из ${settings.cycleLength}</div>` : ''}
                `}
                <div style="font-size: 0.85em; color: #64748b; margin-top: 6px;">📅 ${getText('sync')} ${displayDate}</div>
            </div>

            ${data.isPregnant ? `
                <button id="repro-btn-birth-trigger" class="menu_button" style="width: 100%; background: #10b981; color: white; font-weight: 700; margin-bottom: 10px; padding: 8px 0; justify-content: center;">${getText('giveBirthBtn')}</button>
            ` : ''}

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 0.9em; opacity: 0.85;">${getText('rpDateLabel')}</label>
                <input type="date" id="repro-input-rpdate" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${data.lastRpDate || ''}"/>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 0.9em; opacity: 0.85;">${getText('cycleLengthLabel')}</label>
                <input type="number" id="repro-input-cycle" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${settings.cycleLength}"/>
            </div>
            
            ${data.isPregnant ? `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">${getText('pregnancyWeekLabel')}</label>
                    <input type="number" id="repro-input-weeks" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${data.pregnancyWeeks}"/>
                </div>
            ` : `
                ${data.postpartumDays === 0 ? `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">${getText('cycleDayLabel')}</label>
                    <input type="number" id="repro-input-day" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${data.cycleDay}"/>
                </div>` : ''}
            `}

            <button id="repro-apply-params" class="menu_button type_primary" style="width: 100%; margin-top: 10px; font-weight: 600;">${getText('applyBtn')}</button>

            ${(!data.isPregnant && data.postpartumDays === 0) ? `
                <div style="background: rgba(244, 114, 182, 0.03); border: 1px dashed rgba(244, 114, 182, 0.2); border-radius: 8px; padding: 12px; margin: 14px 0 10px 0; text-align: left;">
                    <div style="font-size: 0.85em; font-weight: 700; color: #f472b6; margin-bottom: 8px; text-transform: uppercase;">${getText('initPregnancyHeader')}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label style="font-size: 0.9em; opacity: 0.85;">${getText('manualWeeks')}</label>
                        <input type="number" id="repro-manual-weeks" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="4" min="0" max="40"/>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label style="font-size: 0.9em; opacity: 0.85;">${getText('manualCount')}</label>
                        <input type="number" id="repro-manual-count" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="1" min="1" max="3"/>
                    </div>
                    <button id="repro-btn-manual-preg" class="menu_button" style="width: 100%; background: #db2777; color: white; font-weight: 600;">${getText('startPregnancyBtn')}</button>
                </div>
            ` : ''}

            ${data.isPregnant ? `
                <button id="repro-reset-pregnancy-only" class="menu_button type_warning" style="width: 100%; margin-top: 10px; font-weight: 600;">${getText('resetPregnancyBtn')}</button>
            ` : ''}

            <button id="repro-reset" class="menu_button type_danger" style="width: 100%; margin-top: 10px; font-weight: 600;">${getText('resetAllBtn')}</button>
        </div>
    `;

    let container = $('#repro-system-extension-container');
    if (container.length === 0) {
        container = $('<div id="repro-system-extension-container" style="grid-column: auto; margin-bottom: 10px;"></div>');
        $('#extensions_settings').append(container);
    }
    container.html(html);

    $('#repro-btn-birth-trigger').off('click').on('click', function() {
        if (confirm("Вы хотите запустить событие родов прямо сейчас в чате?")) { processBirthTrigger(); }
    });

    $('#repro-cure-complication').off('click').on('click', function() {
        if (data.activeComplication) {
            toastr.success(`Успешно купировано: ${data.activeComplication.name}`);
            data.activeComplication = null; saveSettingsDebounced(); renderUI(); updatePromptInjection();
        }
    });

    $('.repro-custom-btn-toggle').off('click').on('click', function() {
        isMenuCollapsed = !isMenuCollapsed; $('#repro-content-wrapper').slideToggle(150);
        const arrow = $('#repro-toggle-arrow');
        if (isMenuCollapsed) { arrow.removeClass('fa-chevron-up').addClass('fa-chevron-down'); $('.repro-custom-btn-toggle').css('border-radius', '10px'); }
        else { arrow.removeClass('fa-chevron-down').addClass('fa-chevron-up'); $('.repro-custom-btn-toggle').css('border-radius', '10px 10px 0 0'); }
    });

    $('#repro-mode').on('change', function() { settings.mode = $(this).val(); getChatBodyData().currentSymptoms = []; saveSettingsDebounced(); renderUI(); updatePromptInjection(); });
    $('#repro-gender').on('change', function() { settings.gender = $(this).val(); saveSettingsDebounced(); renderUI(); updatePromptInjection(); });
    $('#repro-awareness').on('change', function() { settings.aiAwareness = $(this).val(); saveSettingsDebounced(); renderUI(); updatePromptInjection(); });

    $('#repro-apply-params').on('click', function() {
        const bodyData = getChatBodyData();
        settings.cycleLength = parseInt($('#repro-input-cycle').val()) || 28;
        const manualDateVal = $('#repro-input-rpdate').val();
        if (manualDateVal) bodyData.lastRpDate = manualDateVal;

        if (bodyData.isPregnant) { bodyData.pregnancyWeeks = parseInt($('#repro-input-weeks').val()) || 0; bodyData.pregnancyDays = 0; }
        else if (bodyData.postpartumDays === 0) { bodyData.cycleDay = parseInt($('#repro-input-day').val()) || 1; }

        bodyData.currentSymptoms = []; saveSettingsDebounced(); renderUI(); updatePromptInjection(); toastr.success(getText('toastSaved'));
    });

    $('#repro-btn-manual-preg').on('click', function() {
        const bodyData = getChatBodyData();
        const weeks = parseInt($('#repro-manual-weeks').val()) || 0;
        const count = parseInt($('#repro-manual-count').val()) || 1;

        bodyData.isPregnant = true; bodyData.pregnancyWeeks = weeks; bodyData.pregnancyDays = 0; bodyData.babiesCount = count; bodyData.currentSymptoms = [];
        bodyData.rolledTrimesters = { 1: false, 2: false, 3: false }; bodyData.activeComplication = null;
        bodyData.babiesGenders = [];
        
        const lang = getLanguage();
        for (let i = 0; i < count; i++) {
            bodyData.babiesGenders.push(Math.random() > 0.5 ? (lang === 'ru' ? 'Мальчик ♂' : 'Boy ♂') : (lang === 'ru' ? 'Девочка ♀' : 'Girl ♀'));
        }
        bodyData.hiddenGenetics = Array(count).fill().map(() => generateChildGenetics());

        saveSettingsDebounced(); renderUI(); updatePromptInjection(); toastr.success(`${getText('toastManualPreg')}${weeks}`);
    });

    $('#repro-reset-pregnancy-only').on('click', function() {
        const bodyData = getChatBodyData();
        bodyData.isPregnant = false; bodyData.pregnancyWeeks = 0; bodyData.pregnancyDays = 0; bodyData.babiesCount = 0; bodyData.babiesGenders = []; bodyData.currentSymptoms = [];
        bodyData.rolledTrimesters = { 1: false, 2: false, 3: false }; bodyData.activeComplication = null; bodyData.hiddenGenetics = [];

        saveSettingsDebounced(); renderUI(); updatePromptInjection(); toastr.info(getText('toastResetPreg'));
    });

    $('#repro-reset').on('click', function() {
        if (confirm("Вы уверены, что хотите полностью очистить данные этого чата?")) {
            const chatId = getCurrentChatId();
            settings.chatPregnancyData[chatId] = createDefaultBodyData();
            saveSettingsDebounced(); 
            renderUI(); 
            updatePromptInjection(); 
            toastr.warning(getText('toastResetAll'));
        }
    });
}

jQuery(async () => {
    loadSettings();
    if (typeof eventSource?.on === 'function') { eventSource.on('i18n_language_changed', () => { renderUI(); }); }

    eventSource.on(event_types.MESSAGE_SENT, async (messageIndex) => {
        const context = typeof SillyTavern?.getContext === 'function' ? SillyTavern.getContext() : null;
        const chat = context ? context.chat : window.chat;
        if (!chat || !chat[messageIndex]) return;
        const text = chat[messageIndex].mes; if (!text) return;

        handleTimeProgression(text);
        checkConceptionTrigger(text);
        updatePromptInjection();
    });

    eventSource.on(event_types.MESSAGE_RECEIVED, async (messageIndex) => {
        const context = typeof SillyTavern?.getContext === 'function' ? SillyTavern.getContext() : null;
        const chat = context ? context.chat : window.chat;
        if (!chat || !chat[messageIndex]) return;
        const text = chat[messageIndex].mes; if (!text) return;

        handleTimeProgression(text);
        checkConceptionTrigger(text);
        updatePromptInjection();
    });

    // НАДЕЖНЫЙ ПЕРЕХВАТ СМЕНЫ ПЕРСОНАЖА / ЧАТА
    if (event_types.CHAT_CHANGED) {
        eventSource.on(event_types.CHAT_CHANGED, () => { 
            loadSettings(); // Полностью перезагружаем базу данных под новый Chat ID
        });
    }
});
