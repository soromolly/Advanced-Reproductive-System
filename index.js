import { 
    saveSettingsDebounced, 
    eventSource, 
    event_types,
    setExtensionPrompt,
    extension_prompt_types
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';

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

const DEFAULT_BODY_DATA = {
    cycleDay: 1,
    lastRpDate: null,
    isPregnant: false,
    pregnancyWeeks: 0,
    pregnancyDays: 0,
    babiesCount: 0,
    babiesGenders: []
};

let settings = Object.assign({}, DEFAULT_SETTINGS);
let isMenuCollapsed = true; 

// Словарь месяцев для парсинга логов (RU / EN)
const MONTHS = {
    'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
    'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11,
    'january': 0, 'february': 1, 'march': 2, 'april': 3, 'may': 4, 'june': 5,
    'july': 6, 'august': 7, 'september': 8, 'october': 9, 'november': 10, 'december': 11,
    'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11
};

// БАЗА ДАННЫХ ЛОКАЛИЗАЦИИ ИНТЕРФЕЙСА (СНГ / МИР)
const TRANSLATIONS = {
    ru: {
        title: '🧬 Система Репродукции V2',
        system: 'Система:',
        realism: 'Реализм',
        omegaverse: 'ОмегаВерс',
        physiology: 'Физиология:',
        female: 'Женщина',
        female_omega: 'Ж-Омега',
        male_omega: 'М-Омега',
        aiLogic: 'Логика ИИ:',
        ultrasound: 'УЗИ (20 нед)',
        medieval: 'Средневековье',
        knowsAll: 'Знает всё',
        phaseRealism: 'Текущая фаза:',
        phaseOmega: 'Текущее состояние омеги:',
        termInRp: 'Срок в RP:',
        weeksShort: 'нед.',
        daysShort: 'дн.',
        wombMap: 'Карта плода:',
        babiesCount: 'Детей:',
        babiesSex: 'Пол:',
        sync: 'Синхронизация:',
        waitingDate: 'Ожидание даты',
        paramsHeader: 'Параметры',
        rpDateLabel: 'RP Дата:',
        cycleLengthLabel: 'Цикл (дней):',
        pregnancyWeekLabel: 'Неделя:',
        cycleDayLabel: 'День цикла:',
        applyBtn: '▶ Применить изменения',
        initPregnancyHeader: 'Задать беременность',
        manualWeeks: 'Срок (нед):',
        manualCount: 'Плодов:',
        startPregnancyBtn: '🤰 Начать беременность',
        resetPregnancyBtn: '🚼 Сбросить беременность',
        resetAllBtn: 'Полный сброс данных',
        toastSaved: 'Параметры успешно сохранены!',
        toastManualPreg: 'Беременность установлена вручную: ',
        toastResetPreg: 'Беременность сброшена.',
        toastResetAll: 'Данные чата полностью очищены.',
        toastTimePassed: 'Репродуктивная система: В РП прошло дней: ',
        toastConception: '🚨 ЗАЧАТИЕ ПРОИЗОШЛО! Успешная имплантация в матке.',
        toastPregEnd: 'Срок беременности подошел к концу! Пора рожать.',
        // Фазы цикла
        pregnancy: 'Беременность 🤰',
        pregnancyOmega: 'Беременность (Омега) 🤰',
        menstruation: 'Менструация 🩸',
        ovulation: 'Овуляция (Окно зачатия) ✨',
        follicularLuteal: 'Фолликулярная/Лютеиновая фаза',
        heat: 'Течка (Пик фертильности) 🔥',
        quiescence: 'Период покоя'
    },
    en: {
        title: '🧬 Reproductive System V2',
        system: 'System:',
        realism: 'Realism',
        omegaverse: 'OmegaVerse',
        physiology: 'Physiology:',
        female: 'Female',
        female_omega: 'F-Omega',
        male_omega: 'M-Omega',
        aiLogic: 'AI Awareness:',
        ultrasound: 'Ultrasound (20 wk)',
        medieval: 'Medieval (Blind)',
        knowsAll: 'Knows Everything',
        phaseRealism: 'Current Phase:',
        phaseOmega: 'Current Omega Status:',
        termInRp: 'Term in RP:',
        weeksShort: 'wks',
        daysShort: 'days',
        wombMap: 'Womb Content:',
        babiesCount: 'Babies:',
        babiesSex: 'Sex:',
        sync: 'Sychronized:',
        waitingDate: 'Waiting for date',
        paramsHeader: 'Parameters',
        rpDateLabel: 'RP Date:',
        cycleLengthLabel: 'Cycle (days):',
        pregnancyWeekLabel: 'Week:',
        cycleDayLabel: 'Cycle Day:',
        applyBtn: '▶ Apply Changes',
        initPregnancyHeader: 'Initialize Pregnancy',
        manualWeeks: 'Term (wks):',
        manualCount: 'Babies:',
        startPregnancyBtn: '🤰 Start Pregnancy',
        resetPregnancyBtn: '🚼 Reset Pregnancy Only',
        resetAllBtn: 'Full Data Reset',
        toastSaved: 'Parameters successfully saved!',
        toastManualPreg: 'Pregnancy set manually: ',
        toastResetPreg: 'Pregnancy has been reset.',
        toastResetAll: 'Chat data fully cleared.',
        toastTimePassed: 'Reproductive system: Days passed in RP: ',
        toastConception: '🚨 CONCEPTION OCCURRED! Successful implantation in the womb.',
        toastPregEnd: 'Pregnancy term has ended! Time to give birth.',
        // Cycle phases
        pregnancy: 'Pregnancy 🤰',
        pregnancyOmega: 'Pregnancy (Omega) 🤰',
        menstruation: 'Menstruation 🩸',
        ovulation: 'Ovulation (Conception Window) ✨',
        follicularLuteal: 'Follicular/Luteal Phase',
        heat: 'Heat (Peak Fertility) 🔥',
        quiescence: 'Quiescence Period'
    }
};

// Функция определения языка СНГ / Мир
function getLanguage() {
    // Считываем язык из глобальных настроек SillyTavern i18n
    const currentLang = (typeof window.i18n?.language === 'string') ? window.i18n.language.toLowerCase() : 'ru';
    
    // Список кодов языков стран СНГ
    const sngLanguages = ['ru', 'uk', 'be', 'kk', 'uz', 'az', 'hy', 'tg', 'tk', 'ky'];
    
    return sngLanguages.includes(currentLang) ? 'ru' : 'en';
}

// Быстрый хелпер для получения строки перевода
function getText(key) {
    const lang = getLanguage();
    return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key];
}

function getCurrentChatId() {
    if (typeof SillyTavern?.getContext === 'function') {
        return SillyTavern.getContext().chatId || window.chat_id || 'default';
    }
    return window.chat_id || 'default';
}

function getChatBodyData() {
    const chatId = getCurrentChatId();
    if (!settings.chatPregnancyData[chatId]) {
        settings.chatPregnancyData[chatId] = Object.assign({}, DEFAULT_BODY_DATA);
    }
    return settings.chatPregnancyData[chatId];
}

function loadSettings() {
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = Object.assign({}, DEFAULT_SETTINGS);
    }
    settings = extension_settings[EXTENSION_NAME];
    renderUI();
    updatePromptInjection();
}

function getBodyPhase() {
    const data = getChatBodyData();
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

function parseRpDateFromText(text) {
    if (!text) return null;

    const textRegex = /(\d{1,2})\s+([a-zA-Zа-яёА-ЯЁ]+)\s+(\d{4})/i;
    const textMatch = text.match(textRegex);
    if (textMatch) {
        const day = parseInt(textMatch[1]);
        const monthStr = textMatch[2].toLowerCase();
        const year = parseInt(textMatch[3]);
        if (MONTHS[monthStr] !== undefined && day >= 1 && day <= 31) {
            return new Date(year, MONTHS[monthStr], day);
        }
    }

    const enTextRegex = /([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})/i;
    const enTextMatch = text.match(enTextRegex);
    if (enTextMatch) {
        const monthStr = enTextMatch[1].toLowerCase();
        const day = parseInt(enTextMatch[2]);
        const year = parseInt(enTextMatch[3]);
        if (MONTHS[monthStr] !== undefined && day >= 1 && day <= 31) {
            return new Date(year, MONTHS[monthStr], day);
        }
    }

    const numRegex = /(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{4})/;
    const numMatch = text.match(numRegex);
    if (numMatch) {
        const day = parseInt(numMatch[1]);
        const month = parseInt(numMatch[2]) - 1; 
        const year = parseInt(numMatch[3]);
        if (month >= 0 && month <= 11 && day >= 1 && day <= 31) {
            return new Date(year, month, day);
        }
    }
    return null;
}

function parseRelativeTimeFromText(text) {
    const ruRegex = /прошло\s+(\d+)\s+(дне[йяа]|недел[ьия]|месяц[аев]|ле[тв]|год[аоу]?)/i;
    const ruMatch = text.match(ruRegex);
    
    const enRegex = /(?:passed\s+(\d+)\s+(day|week|month|year)s?|(\d+)\s+(day|week|month|year)s?\s+(?:passed|later))/i;
    const enMatch = text.match(enRegex);

    let count = 0;
    let unit = '';

    if (ruMatch) {
        count = parseInt(ruMatch[1]);
        unit = ruMatch[2].toLowerCase();
    } else if (enMatch) {
        if (enMatch[1]) {
            count = parseInt(enMatch[1]);
            unit = enMatch[2].toLowerCase();
        } else {
            count = parseInt(enMatch[3]);
            unit = enMatch[4].toLowerCase();
        }
    } else {
        return null; 
    }

    const data = getChatBodyData();
    if (data.lastRpDate) {
        const baseDate = new Date(data.lastRpDate);
        const futureDate = new Date(data.lastRpDate);

        if (unit.startsWith('дн') || unit.startsWith('day')) futureDate.setDate(futureDate.getDate() + count);
        else if (unit.startsWith('нед') || unit.startsWith('week')) futureDate.setDate(futureDate.getDate() + (count * 7));
        else if (unit.startsWith('мес') || unit.startsWith('month')) futureDate.setMonth(futureDate.getMonth() + count);
        else if (unit.startsWith('ле') || unit.startsWith('год') || unit.startsWith('year')) futureDate.setFullYear(futureDate.getFullYear() + count);

        const timeDiff = futureDate - baseDate;
        const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        data.lastRpDate = futureDate.toISOString().split('T')[0];
        return totalDays;
    }

    if (unit.startsWith('дн') || unit.startsWith('day')) return count;
    if (unit.startsWith('нед') || unit.startsWith('week')) return count * 7;
    if (unit.startsWith('мес') || unit.startsWith('month')) return count * 30;
    if (unit.startsWith('ле') || unit.startsWith('год') || unit.startsWith('year')) return count * 365;

    return null;
}

function handleTimeProgression(text) {
    const data = getChatBodyData();

    const relativeDays = parseRelativeTimeFromText(text);
    if (relativeDays !== null && relativeDays > 0) {
        advanceBodyTime(relativeDays);
        saveSettingsDebounced();
        renderUI();
        return; 
    }

    const currentRpDate = parseRpDateFromText(text);
    if (!currentRpDate) return;

    const currentRpDateStr = currentRpDate.toISOString().split('T')[0];

    if (data.lastRpDate && data.lastRpDate !== currentRpDateStr) {
        const previousDate = new Date(data.lastRpDate);
        const timeDiff = currentRpDate - previousDate;
        const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysPassed > 0) {
            advanceBodyTime(daysPassed);
            toastr.info(`${getText('toastTimePassed')}${daysPassed}.`);
        }
    }

    data.lastRpDate = currentRpDateStr;
    saveSettingsDebounced();
    renderUI();
}

function advanceBodyTime(days) {
    const data = getChatBodyData();
    
    if (data.isPregnant) {
        data.pregnancyDays += days;
        if (data.pregnancyDays >= 7) {
            const extraWeeks = Math.floor(data.pregnancyDays / 7);
            data.pregnancyWeeks += extraWeeks;
            data.pregnancyDays %= 7;
        }
        const maxWeeks = settings.mode === 'omegaverse' ? 36 : 40;
        if (data.pregnancyWeeks >= maxWeeks) {
            toastr.warning(getText('toastPregEnd'));
        }
    } else {
        data.cycleDay += days;
        if (data.cycleDay > settings.cycleLength) {
            data.cycleDay = ((data.cycleDay - 1) % settings.cycleLength) + 1;
        }
    }
}

function checkConceptionTrigger(text) {
    const data = getChatBodyData();
    if (data.isPregnant) return;

    const lowerText = text.toLowerCase();
    const phase = getBodyPhase();
    
    const hasVaginal = /вагинально|в писю|в киску|внутрь влагалища|влагалище|vaginal|pussy/i.test(lowerText);
    const hasAnal = /анально|в анус|в попу|в задницу|прямую кишку|anal|anus|ass|butt/i.test(lowerText);
    const hasOral = /орально|в рот|минет|oral|blowjob/i.test(lowerText);
    const hasEjaculationInside = /кончил внутрь|излил семя внутрь|эякуляция внутрь|залил|узел|сцепка|завязал узел|cum inside|ejaculation inside|creampie|knotting|tied/i.test(lowerText);

    let isFertile = phase.includes('Овуляция') || phase.includes('Течка') || phase.includes('Ovulation') || phase.includes('Heat');
    let canConceive = false;

    if (settings.mode === 'realism') {
        if (settings.gender === 'female' && hasVaginal && hasEjaculationInside && !hasAnal && !hasOral && isFertile) {
            canConceive = true;
        }
    } else if (settings.mode === 'omegaverse') {
        if (isFertile && hasEjaculationInside) {
            if (settings.gender === 'female_omega' && hasVaginal) {
                canConceive = true;
            } else if (settings.gender === 'male_omega' && hasAnal) {
                canConceive = true;
            }
        }
    }

    if (canConceive) {
        const baseChance = settings.mode === 'omegaverse' ? 85 : 25;
        if (Math.random() * 100 <= baseChance) {
            triggerPregnancy(data);
        }
    }
}

function triggerPregnancy(data) {
    data.isPregnant = true;
    data.pregnancyWeeks = 0;
    data.pregnancyDays = 0;

    const roll = Math.random() * 100;
    if (settings.mode === 'omegaverse') {
        if (roll > 92) data.babiesCount = 3;      
        else if (roll > 70) data.babiesCount = 2; 
        else data.babiesCount = 1;
    } else {
        if (roll > 98.5) data.babiesCount = 3;
        else if (roll > 95) data.babiesCount = 2;
        else data.babiesCount = 1;
    }

    data.babiesGenders = [];
    const lang = getLanguage();
    for (let i = 0; i < data.babiesCount; i++) {
        const isBoy = Math.random() > 0.5;
        if (lang === 'ru') {
            data.babiesGenders.push(isBoy ? 'Мальчик ♂' : 'Девочка ♀');
        } else {
            data.babiesGenders.push(isBoy ? 'Boy ♂' : 'Girl ♀');
        }
    }

    saveSettingsDebounced();
    renderUI();
    updatePromptInjection();
    
    toastr.success(getText('toastConception'));
}

function updatePromptInjection() {
    if (!settings.isEnabled) {
        setExtensionPrompt(EXTENSION_NAME, '', extension_prompt_types.IN_CHAT, 0);
        return;
    }

    const data = getChatBodyData();
    const phase = getBodyPhase();
    
    let prompt = `\n[OOC: SYSTEM NOTE — {{user}} Physiological Status]\n`;
    prompt += `Reproductive Tracking Mode: ${settings.mode === 'realism' ? 'Anatomical Realism' : 'Omegaverse Universe'}\n`;
    
    if (data.isPregnant) {
        prompt += `Status: PREGNANT | Duration: ${data.pregnancyWeeks} weeks and ${data.pregnancyDays} days.\n`;
        
        let revealToAI = false;
        if (settings.aiAwareness === 'full') {
            revealToAI = true;
        } else if (settings.aiAwareness === 'dynamic' && data.pregnancyWeeks >= 20) {
            revealToAI = true;
        }

        if (revealToAI) {
            prompt += `Womb Content Details (Determined): ${data.babiesCount} baby(ies), Gender/Sex: ${data.babiesGenders.join(', ')}\n`;
        } else {
            prompt += `Womb Content Details: [HIDDEN DATA]. The exact number of fetuses and their biological sex are absolutely UNKNOWN to anyone (No modern ultrasound or magic exists, or the term is too early).\n`;
            prompt += `CRITICAL DIRECTIVE FOR {{char}}: Do NOT mention, assume, guess, or reference the baby's sex or whether there are twins/multiples. Treating the pregnancy as an unpredictable mystery is mandatory. Avoid meta-gaming.\n`;
        }
        
        prompt += `AI Instruction: Focus purely on describing believable physical symptoms matching a ${data.pregnancyWeeks}-week term (e.g., subtle fatigue, morning nausea, sensory sensitivity, changes in appetite, or scent traits if Omegaverse).\n`;
    } else {
        prompt += `Current Cycle Day: ${data.cycleDay}/${settings.cycleLength} | Phase: ${phase}\n`;
        
        if (phase.includes('Течка') || phase.includes('Heat')) {
            prompt += `🚨 CRITICAL MANDATORY DIRECTIVE FOR {{char}}: {{user}} is currently in OMEGA HEAT (течка). Their body is involuntarily emitting an incredibly potent, sweet, sharp, and intoxicating Omega pheromone scent. This state is completely obvious, primal, and unignorable to anyone in the same room. {{char}} (and any surrounding Alphas/Betas) MUST immediately notice this scent, describe their instinctual physical reaction to it (pupil dilation, heavy breathing, sudden possessive/protective attraction, or primitive agitation), and acknowledge the heavy pheromonal atmosphere thick in the air.\n`;
        } else if (phase.includes('Овуляция') || phase.includes('Ovulation')) {
            prompt += `⚠️ STRICT CONTRA-INDICATION: {{user}} is currently ovulating. This is a purely internal, microscopic, scentless, and 100% invisible biological process. No one around them (including {{char}}) can sense, smell, or know this. {{char}} MUST act completely oblivious to {{user}}'s fertility status. Do NOT mention, hint, or react to ovulation in any way.\n`;
        }
    }

    setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
}

function renderUI() {
    const data = getChatBodyData();
    const lang = getLanguage();

    let displayDate = getText('waitingDate');
    if (data.lastRpDate) {
        const parts = data.lastRpDate.split('-');
        displayDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    const html = `
        <div class="repro-custom-btn-toggle" style="display: flex; justify-content: space-between; align-items: center; background: var(--input-bg, #1e1e2a); border: 1px solid var(--input-border, #334155); padding: 10px 14px; border-radius: ${isMenuCollapsed ? '10px' : '10px 10px 0 0'}; cursor: pointer; user-select: none; font-size: 14px; transition: background 0.15s;">
            <span style="color: #f472b6 !important; font-weight: 600;">${getText('title')}</span>
            <div id="repro-toggle-arrow" class="inline-drawer-icon fa-solid ${isMenuCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="opacity: 0.6; font-size: 12px; margin-right: 4px;"></div>
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
                ${data.isPregnant ? `
                    <div style="margin-bottom: 4px;"><strong>${getText('termInRp')}</strong> ${data.pregnancyWeeks} ${getText('weeksShort')} ${data.pregnancyDays} ${getText('daysShort')}</div>
                    <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6;">
                        ℹ️ <em>${getText('wombMap')}</em><br>
                        • ${getText('babiesCount')} <b>${data.babiesCount}</b><br>
                        • ${getText('babiesSex')} <b>${data.babiesGenders.join(', ')}</b>
                    </div>
                ` : `
                    <div style="margin-bottom: 4px;"><strong>${getText('cycleDayLabel')}</strong> ${data.cycleDay} из ${settings.cycleLength}</div>
                `}
                <div style="font-size: 0.85em; color: #64748b; margin-top: 6px;">📅 ${getText('sync')} ${displayDate}</div>
            </div>

            <div style="font-size: 0.85em; font-weight: 700; color: var(--text_accent, #38bdf8); margin: 12px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">${getText('paramsHeader')}</div>
            
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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">${getText('cycleDayLabel')}</label>
                    <input type="number" id="repro-input-day" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${data.cycleDay}"/>
                </div>
            `}

            <button id="repro-apply-params" class="menu_button type_primary" style="width: 100%; margin-top: 10px; font-weight: 600;">${getText('applyBtn')}</button>

            ${!data.isPregnant ? `
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

    $('.repro-custom-btn-toggle').off('click').on('click', function() {
        isMenuCollapsed = !isMenuCollapsed;
        $('#repro-content-wrapper').slideToggle(150);
        
        const arrow = $('#repro-toggle-arrow');
        if (isMenuCollapsed) {
            arrow.removeClass('fa-chevron-up').addClass('fa-chevron-down');
            $('.repro-custom-btn-toggle').css('border-radius', '10px');
        } else {
            arrow.removeClass('fa-chevron-down').addClass('fa-chevron-up');
            $('.repro-custom-btn-toggle').css('border-radius', '10px 10px 0 0');
        }
    });

    $('#repro-mode').on('change', function() {
        settings.mode = $(this).val();
        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
    });

    $('#repro-gender').on('change', function() {
        settings.gender = $(this).val();
        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
    });

    $('#repro-awareness').on('change', function() {
        settings.aiAwareness = $(this).val();
        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
    });

    $('#repro-apply-params').on('click', function() {
        const bodyData = getChatBodyData();
        settings.cycleLength = parseInt($('#repro-input-cycle').val()) || 28;
        
        const manualDateVal = $('#repro-input-rpdate').val();
        if (manualDateVal) {
            bodyData.lastRpDate = manualDateVal;
        }

        if (bodyData.isPregnant) {
            bodyData.pregnancyWeeks = parseInt($('#repro-input-weeks').val()) || 0;
            bodyData.pregnancyDays = 0; 
        } else {
            bodyData.cycleDay = parseInt($('#repro-input-day').val()) || 1;
        }

        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
        toastr.success(getText('toastSaved'));
    });

    $('#repro-btn-manual-preg').on('click', function() {
        const bodyData = getChatBodyData();
        const weeks = parseInt($('#repro-manual-weeks').val()) || 0;
        const count = parseInt($('#repro-manual-count').val()) || 1;

        bodyData.isPregnant = true;
        bodyData.pregnancyWeeks = weeks;
        bodyData.pregnancyDays = 0;
        bodyData.babiesCount = count;

        bodyData.babiesGenders = [];
        const lang = getLanguage();
        for (let i = 0; i < count; i++) {
            const isBoy = Math.random() > 0.5;
            if (lang === 'ru') {
                bodyData.babiesGenders.push(isBoy ? 'Мальчик ♂' : 'Девочка ♀');
            } else {
                bodyData.babiesGenders.push(isBoy ? 'Boy ♂' : 'Girl ♀');
            }
        }

        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
        toastr.success(`${getText('toastManualPreg')}${weeks}`);
    });

    $('#repro-reset-pregnancy-only').on('click', function() {
        const bodyData = getChatBodyData();
        bodyData.isPregnant = false;
        bodyData.pregnancyWeeks = 0;
        bodyData.pregnancyDays = 0;
        bodyData.babiesCount = 0;
        bodyData.babiesGenders = [];

        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
        toastr.info(getText('toastResetPreg'));
    });

    $('#repro-reset').on('click', function() {
        const chatId = getCurrentChatId();
        settings.chatPregnancyData[chatId] = Object.assign({}, DEFAULT_BODY_DATA);
        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
        toastr.info(getText('toastResetAll'));
    });
}

jQuery(async () => {
    loadSettings();

    eventSource.on(event_types.MESSAGE_SENT, async (messageIndex) => {
        const context = typeof SillyTavern?.getContext === 'function' ? SillyTavern.getContext() : null;
        const chat = context ? context.chat : window.chat;
        if (!chat || !chat[messageIndex]) return;

        const text = chat[messageIndex].mes;
        if (!text) return;

        handleTimeProgression(text);
        checkConceptionTrigger(text);
        updatePromptInjection();
    });

    eventSource.on(event_types.MESSAGE_RECEIVED, async (messageIndex) => {
        const context = typeof SillyTavern?.getContext === 'function' ? SillyTavern.getContext() : null;
        const chat = context ? context.chat : window.chat;
        
        if (!chat || !chat[messageIndex]) return;

        const text = chat[messageIndex].mes;
        if (!text) return;

        handleTimeProgression(text);
        checkConceptionTrigger(text);
        updatePromptInjection();
    });

    if (event_types.CHAT_CHANGED) {
        eventSource.on(event_types.CHAT_CHANGED, () => {
            renderUI();
            updatePromptInjection();
        });
    }
});
