import { 
    saveSettingsDebounced, 
    eventSource, 
    event_types,
    setExtensionPrompt,
    extension_prompt_types
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
// Импортируем генератор симптомов из соседнего файла
import { getRandomSymptoms } from './symptoms.js';

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
    babiesGenders: [],
    currentSymptoms: [] // Храним выпавшие на сегодня симптомы здесь
};

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
        toastConception: '🚨 ЗАЧАТИЕ ПРОИЗОШЛО!', toastPregEnd: 'Срок беременности подошел к концу!',
        pregnancy: 'Беременность 🤰', pregnancyOmega: 'Беременность (Омега) 🤰',
        menstruation: 'Менструация 🩸', ovulation: 'Овуляция (Окно зачатия) ✨',
        follicularLuteal: 'Фолликулярная/Лютеиновая фаза', heat: 'Течка (Пик фертильности) 🔥', quiescence: 'Период покоя',
        symptomsTitle: '🎯 Симптомы организма:'
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
        toastConception: '🚨 CONCEPTION OCCURRED!', toastPregEnd: 'Pregnancy term has ended!',
        pregnancy: 'Pregnancy 🤰', pregnancyOmega: 'Pregnancy (Omega) 🤰',
        menstruation: 'Menstruation 🩸', ovulation: 'Ovulation (Conception Window) ✨',
        follicularLuteal: 'Follicular/Luteal Phase', heat: 'Heat (Peak Fertility) 🔥', quiescence: 'Quiescence Period',
        symptomsTitle: '🎯 Body Symptoms:'
    }
};

function getLanguage() {
    const lang = (window.i18next?.language || window.i18n?.language || 'ru').toLowerCase().split('-')[0];
    const sngLanguages = ['ru', 'uk', 'be', 'kk', 'uz', 'az', 'hy', 'tg', 'tk', 'ky'];
    return sngLanguages.includes(lang) ? 'ru' : 'en';
}

function getText(key) {
    const lang = getLanguage();
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en'][key];
}

function getCurrentChatId() {
    return (typeof SillyTavern?.getContext === 'function') ? (SillyTavern.getContext().chatId || window.chat_id || 'default') : (window.chat_id || 'default');
}

function getChatBodyData() {
    const chatId = getCurrentChatId();
    if (!settings.chatPregnancyData[chatId]) settings.chatPregnancyData[chatId] = Object.assign({}, DEFAULT_BODY_DATA);
    return settings.chatPregnancyData[chatId];
}

function loadSettings() {
    if (!extension_settings[EXTENSION_NAME]) extension_settings[EXTENSION_NAME] = Object.assign({}, DEFAULT_SETTINGS);
    settings = extension_settings[EXTENSION_NAME];
    
    // Генерируем симптомы при первичной загрузке, если их ещё нет
    const data = getChatBodyData();
    updateSymptomsData(data);

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

/**
 * Проверяет текущую фазу и наполняет массив случайными симптомами
 */
function updateSymptomsData(data) {
    if (data.isPregnant) {
        data.currentSymptoms = [];
        return;
    }

    // Если симптомы на этот день уже сгенерированы — ничего не делаем
    if (data.currentSymptoms && data.currentSymptoms.length > 0) return;

    const phase = getBodyPhase();
    let phaseKey = null;

    if (phase === getText('menstruation')) {
        phaseKey = 'menstruation';
    } else if (phase === getText('ovulation') || phase === getText('heat')) {
        phaseKey = 'ovulation';
    }

    if (phaseKey) {
        // Запрашиваем максимум 3 штуки из symptoms.js
        data.currentSymptoms = getRandomSymptoms(phaseKey, 3);
    } else {
        data.currentSymptoms = []; // В нейтральные фазы симптомов нет
    }
}

function parseRpDateFromText(text) {
    if (!text) return null;
    const textRegex = /(\d{1,2})\s+([a-zA-Zа-яёА-ЯЁ]+)\s+(\d{4})/i;
    const match = text.match(textRegex);
    if (match) {
        const d = parseInt(match[1]), m = match[2].toLowerCase(), y = parseInt(match[3]);
        if (MONTHS[m] !== undefined && d >= 1 && d <= 31) return new Date(y, MONTHS[m], d);
    }
    const numRegex = /(\d{1,2})[\.\/](\d{1,2})[\.\/](\d{4})/;
    const nMatch = text.match(numRegex);
    if (nMatch) {
        const d = parseInt(nMatch[1]), m = parseInt(nMatch[2]) - 1, y = parseInt(nMatch[3]);
        if (m >= 0 && m <= 11 && d >= 1 && d <= 31) return new Date(y, m, d);
    }
    return null;
}

function parseRelativeTimeFromText(text) {
    const ruRegex = /прошло\s+(\d+)\s+(дне[йяа]|недел[ьия]|месяц[аев]|ле[тв]|год[аоу]?)/i;
    const enRegex = /(?:passed\s+(\d+)\s+(day|week|month|year)s?|(\d+)\s+(day|week|month|year)s?\s+(?:passed|later))/i;
    const match = text.match(ruRegex) || text.match(enRegex);
    if (!match) return null;

    let count = parseInt(match[1] || match[3]);
    let unit = (match[2] || match[4] || '').toLowerCase();
    const data = getChatBodyData();
    
    let days = 0;
    if (unit.startsWith('дн') || unit.startsWith('day')) days = count;
    else if (unit.startsWith('нед') || unit.startsWith('week')) days = count * 7;
    else if (unit.startsWith('мес') || unit.startsWith('month')) days = count * 30;
    else if (unit.startsWith('ле') || unit.startsWith('год') || unit.startsWith('year')) days = count * 365;

    if (data.lastRpDate) {
        const d = new Date(data.lastRpDate);
        d.setDate(d.getDate() + days);
        data.lastRpDate = d.toISOString().split('T')[0];
    }
    return days;
}

function handleTimeProgression(text) {
    const data = getChatBodyData();
    const rel = parseRelativeTimeFromText(text);
    if (rel !== null && rel > 0) { advanceBodyTime(rel); saveSettingsDebounced(); renderUI(); return; }

    const date = parseRpDateFromText(text);
    if (!date) return;
    const str = date.toISOString().split('T')[0];
    if (data.lastRpDate && data.lastRpDate !== str) {
        const diff = Math.floor((date - new Date(data.lastRpDate)) / (86400000));
        if (diff > 0) { advanceBodyTime(diff); toastr.info(`${getText('toastTimePassed')}${diff}.`); }
    }
    data.lastRpDate = str;
    saveSettingsDebounced();
    renderUI();
}

function advanceBodyTime(days) {
    const data = getChatBodyData();
    if (data.isPregnant) {
        data.pregnancyDays += days;
        if (data.pregnancyDays >= 7) { data.pregnancyWeeks += Math.floor(data.pregnancyDays / 7); data.pregnancyDays %= 7; }
    } else {
        data.cycleDay += days;
        if (data.cycleDay > settings.cycleLength) data.cycleDay = ((data.cycleDay - 1) % settings.cycleLength) + 1;
        
        // Время ушло вперед — сбрасываем старые симптомы, чтобы сгенерировались новые!
        data.currentSymptoms = [];
    }
}

function checkConceptionTrigger(text) {
    const data = getChatBodyData();
    if (data.isPregnant) return;
    const lower = text.toLowerCase();
    const phase = getBodyPhase();
    const isFertile = phase.includes('Овуляция') || phase.includes('Течка') || phase.includes('Ovulation') || phase.includes('Heat');
    const hasEjaculation = /кончил внутрь|излил семя внутрь|эякуляция внутрь|залил|узел|сцепка|завязал узел|cum inside|ejaculation inside|creampie|knotting|tied/i.test(lower);
    if (isFertile && hasEjaculation && Math.random() * 100 <= (settings.mode === 'omegaverse' ? 85 : 25)) triggerPregnancy(data);
}

function triggerPregnancy(data) {
    data.isPregnant = true;
    data.pregnancyWeeks = 0; data.pregnancyDays = 0;
    data.currentSymptoms = []; // Сбрасываем симптомы обычного цикла
    data.babiesCount = (Math.random() > (settings.mode === 'omegaverse' ? 0.3 : 0.95)) ? (Math.random() > 0.9 ? 3 : 2) : 1;
    data.babiesGenders = Array(data.babiesCount).fill().map(() => (Math.random() > 0.5 ? (getLanguage() === 'ru' ? 'Мальчик ♂' : 'Boy ♂') : (getLanguage() === 'ru' ? 'Девочка ♀' : 'Girl ♀')));
    saveSettingsDebounced(); renderUI(); updatePromptInjection(); toastr.success(getText('toastConception'));
}

function updatePromptInjection() {
    if (!settings.isEnabled) { setExtensionPrompt(EXTENSION_NAME, '', extension_prompt_types.IN_CHAT, 0); return; }
    const data = getChatBodyData();
    let prompt = `\n[OOC: SYSTEM NOTE — {{user}} Physiological Status]\nReproductive Tracking Mode: ${settings.mode}\n`;
    if (data.isPregnant) {
        prompt += `Status: PREGNANT | Duration: ${data.pregnancyWeeks} weeks and ${data.pregnancyDays} days.\n`;
        prompt += (settings.aiAwareness === 'full' || (settings.aiAwareness === 'dynamic' && data.pregnancyWeeks >= 20)) ? `Womb: ${data.babiesCount} baby(ies), Gender: ${data.babiesGenders.join(', ')}.\n` : `Womb: [HIDDEN]. Directive: Treating pregnancy as an unpredictable mystery is mandatory.\n`;
        prompt += `Instruction: Describe physical symptoms for ${data.pregnancyWeeks}-week term.\n`;
    } else {
        prompt += `Current Cycle Day: ${data.cycleDay}/${settings.cycleLength} | Phase: ${getBodyPhase()}\n`;
        
        // Передаем текущие случайные симптомы в промпт ИИ, чтобы он о них знал!
        if (data.currentSymptoms && data.currentSymptoms.length > 0) {
            prompt += `Current Physical Symptoms: ${data.currentSymptoms.join(', ')}.\n`;
        }

        if (getBodyPhase().includes('Течка') || getBodyPhase().includes('Heat')) prompt += `🚨 DIRECTIVE: {{user}} is in HEAT. Scent is potent, sweet, sharp. Immediate instinctual reaction mandatory.\n`;
        else if (getBodyPhase().includes('Овуляция') || getBodyPhase().includes('Ovulation')) prompt += `⚠️ DIRECTIVE: {{user}} is ovulating (hidden). Act oblivious.\n`;
    }
    setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
}

function renderUI() {
    const data = getChatBodyData();
    
    // Пересчитываем/генерируем симптомы перед рендером
    updateSymptomsData(data);

    // Строим HTML-блок для списка симптомов
    let symptomsHtml = '';
    if (data.currentSymptoms && data.currentSymptoms.length > 0) {
        symptomsHtml = `
            <div style="margin: 12px 0; padding: 10px; background: rgba(244, 114, 182, 0.12); border-left: 4px solid #f472b6; border-radius: 4px;">
                <strong style="font-size: 13px; color: #f472b6; display: block; margin-bottom: 6px;">${getText('symptomsTitle')}</strong>
                <ul style="margin: 0; padding-left: 18px; font-size: 12px; line-height: 1.4; opacity: 0.95; color: var(--text-color);">
                    ${data.currentSymptoms.map(s => `<li style="margin-bottom: 2px;">${s}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    const container = document.getElementById('st-reproductive-system-menu');
    if (!container) return;

    container.innerHTML = `
        <div class="repro-custom-btn-toggle" style="display: flex; justify-content: space-between; align-items: center; background: var(--input-bg, #1e1e2a); border: 1px solid var(--input-border, #334155); padding: 10px 14px; border-radius: ${isMenuCollapsed ? '10px' : '10px 10px 0 0'}; cursor: pointer; user-select: none; font-size: 14px; transition: background 0.15s;">
            <span style="color: #f472b6 !important; font-weight: 600;">${getText('title')}</span>
            <i id="repro-toggle-arrow" class="fa-solid ${isMenuCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="opacity: 0.6; font-size: 12px; margin-right: 4px;"></i>
        </div>
        <div id="repro-content-wrapper" style="${isMenuCollapsed ? 'display: none;' : 'display: block;'} background: rgba(0, 0, 0, 0.15); border: 1px solid var(--input-border, #334155); border-top: none; border-radius: 0 0 10px 10px; padding: 14px;">
            
            <div style="font-size: 13px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                <span style="opacity: 0.7;">${settings.mode === 'realism' ? getText('phaseRealism') : getText('phaseOmega')}</span> 
                <strong style="color: #f472b6; margin-left: 5px;">${getBodyPhase()}</strong>
            </div>

            <!-- ВСТАВКА БЛОКА СИМПТОМОВ -->
            ${symptomsHtml}

            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center;">
                <label style="font-size: 12px;">${getText('system')}</label>
                <select id="repro-mode" class="text_box" style="width: 130px; font-size: 12px; padding: 3px 6px;"><option value="realism" ${settings.mode==='realism'?'selected':''}>${getText('realism')}</option><option value="omegaverse" ${settings.mode==='omegaverse'?'selected':''}>${getText('omegaverse')}</option></select>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; align-items: center;">
                <label style="font-size: 12px;">${getText('cycleDayLabel')}</label>
                <input id="repro-cycle-day" type="number" class="text_box" style="width: 60px; font-size: 12px; padding: 3px; text-align: center;" value="${data.cycleDay}" min="1" max="${settings.cycleLength}">
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 14px; align-items: center;">
                <label style="font-size: 12px;">${getText('cycleLengthLabel')}</label>
                <input id="repro-cycle-len" type="number" class="text_box" style="width: 60px; font-size: 12px; padding: 3px; text-align: center;" value="${settings.cycleLength}" min="15" max="60">
            </div>

            <button id="repro-apply-params" class="menu_button type_primary" style="width: 100%; margin-bottom: 8px; justify-content: center; font-size: 12px; padding: 6px 0;">${getText('applyBtn')}</button>
            <button id="repro-reset" class="menu_button type_danger" style="width: 100%; justify-content: center; font-size: 11px; padding: 4px 0; opacity: 0.8;">${getText('resetAllBtn')}</button>
        </div>
    `;

    setupUIEventListeners();
}

function setupUIEventListeners() {
    const toggleBtn = document.querySelector('.repro-custom-btn-toggle');
    if (toggleBtn) {
        toggleBtn.onclick = () => {
            isMenuCollapsed = !isMenuCollapsed;
            const content = document.getElementById('repro-content-wrapper');
            const arrow = document.getElementById('repro-toggle-arrow');
            if (content) content.style.display = isMenuCollapsed ? 'none' : 'block';
            if (arrow) { arrow.className = `fa-solid ${isMenuCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`; }
            if (toggleBtn) toggleBtn.style.borderRadius = isMenuCollapsed ? '10px' : '10px 10px 0 0';
        };
    }

    const applyBtn = document.getElementById('repro-apply-params');
    if (applyBtn) {
        applyBtn.onclick = () => {
            const data = getChatBodyData();
            settings.mode = document.getElementById('repro-mode').value;
            settings.cycleLength = parseInt(document.getElementById('repro-cycle-len').value) || 28;
            data.cycleDay = parseInt(document.getElementById('repro-cycle-day').value) || 1;
            
            // Сбрасываем старые симптомы при ручном изменении параметров, чтобы они пересчитались под новую фазу
            data.currentSymptoms = [];
            
            saveSettingsDebounced();
            renderUI();
            updatePromptInjection();
            toastr.success(getText('toastSaved'));
        };
    }

    const resetBtn = document.getElementById('repro-reset');
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (confirm('Вы уверены, что хотите полностью сбросить данные репродуктивной системы для этого чата?')) {
                const chatId = getCurrentChatId();
                settings.chatPregnancyData[chatId] = Object.assign({}, DEFAULT_BODY_DATA);
                saveSettingsDebounced();
                renderUI();
                updatePromptInjection();
                toastr.warning(getText('toastResetAll'));
            }
        };
    }
}

// Регистрация эвентов SillyTavern
eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, (messageId) => {
    const chatId = getCurrentChatId();
    const context = SillyTavern.getContext();
    const msg = context.chat[messageId];
    if (msg && msg.mes) {
        handleTimeProgression(msg.mes);
        checkConceptionTrigger(msg.mes);
    }
});

eventSource.on(event_types.USER_MESSAGE_RENDERED, (messageId) => {
    const chatId = getCurrentChatId();
    const context = SillyTavern.getContext();
    const msg = context.chat[messageId];
    if (msg && msg.mes) {
        checkConceptionTrigger(msg.mes);
    }
});

eventSource.on(event_types.CHAT_CHANGED, () => {
    loadSettings();
});

// Инициализация расширения при старте
jQuery(document).ready(function () {
    const parent = document.getElementById('extensions_settings');
    if (parent) {
        const extDiv = document.createElement('div');
        extDiv.id = 'st-reproductive-system-menu';
        extDiv.style.marginBottom = '12px';
        parent.appendChild(extDiv);
    }
    loadSettings();
});
