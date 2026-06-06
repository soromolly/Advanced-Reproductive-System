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
    mode: 'realism',       // 'realism' или 'omegaverse'
    gender: 'female',      // 'female', 'female_omega', 'male_omega'
    aiAwareness: 'dynamic', // 'dynamic' (УЗИ на 20 нед), 'hidden' (Слепой/Средневековье), 'full' (Знает всё)
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
let isMenuCollapsed = false; // Глобальный триггер для сворачивания меню

const MONTHS_RU = {
    'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
    'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
};

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
    if (data.isPregnant) return settings.mode === 'realism' ? 'Беременность 🤰' : 'Беременность (Омега) 🤰';

    const day = data.cycleDay;
    if (settings.mode === 'realism') {
        if (day <= settings.periodDuration) return 'Менструация 🩸';
        if (day >= 11 && day <= 16) return 'Овуляция (Окно зачатия) ✨';
        return 'Фолликулярная/Лютеиновая фаза';
    } else {
        if (day >= 12 && day <= 15) return 'Течка (Пик фертильности) 🔥';
        return 'Период покоя';
    }
}

function parseRpDateFromText(text) {
    if (!text) return null;
    const regex = /(\d{1,2})\s+([а-яёА-ЯЁ]+)\s+(\d{4})\s+года/i;
    const match = text.match(regex);
    
    if (match) {
        const day = parseInt(match[1]);
        const monthStr = match[2].toLowerCase();
        const year = parseInt(match[3]);
        
        if (MONTHS_RU[monthStr] !== undefined && day >= 1 && day <= 31) {
            return new Date(year, MONTHS_RU[monthStr], day);
        }
    }
    return null;
}

function handleTimeProgression(text) {
    const currentRpDate = parseRpDateFromText(text);
    if (!currentRpDate) return;

    const data = getChatBodyData();
    const currentRpDateStr = currentRpDate.toISOString().split('T')[0];

    if (data.lastRpDate && data.lastRpDate !== currentRpDateStr) {
        const previousDate = new Date(data.lastRpDate);
        const timeDiff = currentRpDate - previousDate;
        const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysPassed > 0) {
            advanceBodyTime(daysPassed);
            toastr.info(`Репродуктивная система: В РП прошло дней: ${daysPassed}. Статус обновлен.`);
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
            toastr.warning('Срок беременности подошел к концу! Пора рожать.');
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
    
    const hasVaginal = /вагинально|в писю|в киску|внутрь влагалища|влагалище/i.test(lowerText);
    const hasAnal = /анально|в анус|в попу|в задницу|прямую кишку/i.test(lowerText);
    const hasOral = /орально|в рот|минет/i.test(lowerText);
    const hasEjaculationInside = /кончил внутрь|излил семя внутрь|эякуляция внутрь|залил|узел|сцепка|завязал узел/i.test(lowerText);

    let isFertile = phase.includes('Овуляция') || phase.includes('Течка');
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
    for (let i = 0; i < data.babiesCount; i++) {
        data.babiesGenders.push(Math.random() > 0.5 ? 'Мальчик ♂' : 'Девочка ♀');
    }

    saveSettingsDebounced();
    renderUI();
    updatePromptInjection();
    
    toastr.success(`🚨 ЗАЧАТИЕ ПРОИЗОШЛО! Успешная имплантация в матке.`);
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
        if (phase.includes('Овуляция') || phase.includes('Течка')) {
            prompt += `Alert: {{user}} is currently highly fertile (ovulation/heat). Act accordingly to the context.\n`;
        }
    }

    setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
}

function renderUI() {
    const data = getChatBodyData();
    const isRealism = settings.mode === 'realism';
    const statusLabel = isRealism ? 'Текущая фаза:' : 'Текущее состояние омеги:';

    const html = `
        <div class="repro-tracker-v2">
            <!-- КЛИКАБЕЛЬНЫЙ ХЕДЕР ДЛЯ СВОРАЧИВАНИЯ -->
            <div class="repro-header">
                <span>🧬 Система Репродукции V2</span>
                <span id="repro-toggle-arrow" class="repro-arrow">${isMenuCollapsed ? '▼' : '▲'}</span>
            </div>
            
            <!-- ОБЕРТКА ВСЕГО ТЕЛА НАСТРОЕК -->
            <div id="repro-content-wrapper" style="${isMenuCollapsed ? 'display: none;' : ''}">
                <div class="repro-row">
                    <label>Режим симуляции:</label>
                    <select id="repro-mode" class="repro-dropdown">
                        <option value="realism" ${settings.mode === 'realism' ? 'selected' : ''}>Реализм (Анатомия)</option>
                        <option value="omegaverse" ${settings.mode === 'omegaverse' ? 'selected' : ''}>ОмегаВерс</option>
                    </select>
                </div>

                <div class="repro-row">
                    <label>Биология {{user}}:</label>
                    <select id="repro-gender" class="repro-dropdown">
                        <option value="female" ${settings.gender === 'female' ? 'selected' : ''}>Женщина (Стандарт)</option>
                        <option value="female_omega" ${settings.gender === 'female_omega' ? 'selected' : ''}>Женщина-Омега</option>
                        <option value="male_omega" ${settings.gender === 'male_omega' ? 'selected' : ''}>Мужчина-Омега</option>
                    </select>
                </div>

                <div class="repro-row">
                    <label>Осведомлённость ИИ:</label>
                    <select id="repro-awareness" class="repro-dropdown">
                        <option value="dynamic" ${settings.aiAwareness === 'dynamic' ? 'selected' : ''}>Реалистично (УЗИ на 20 нед.)</option>
                        <option value="hidden" ${settings.aiAwareness === 'hidden' ? 'selected' : ''}>Слепой режим (Средневековье)</option>
                        <option value="full" ${settings.aiAwareness === 'full' ? 'selected' : ''}>ИИ знает всё сразу</option>
                    </select>
                </div>

                <div class="repro-card-status">
                    <div class="repro-status-item"><strong>${statusLabel}</strong> <span class="badge-phase">${getBodyPhase()}</span></div>
                    ${data.isPregnant ? `
                        <div class="repro-status-item"><strong>Срок в RP:</strong> ${data.pregnancyWeeks} нед. ${data.pregnancyDays} дн.</div>
                        <div class="repro-status-item" style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6;">
                            ℹ️ <em>Тебе видно (ИИ скрыто):</em><br>
                            • Количество: <b>${data.babiesCount}</b><br>
                            • Пол: <b>${data.babiesGenders.join(', ')}</b>
                        </div>
                    ` : `
                        <div class="repro-status-item"><strong>Текущий день:</strong> ${data.cycleDay} из ${settings.cycleLength} дней</div>
                    `}
                    <div class="repro-sync-date">📅 Последняя RP дата: ${data.lastRpDate ? data.lastRpDate : 'Не синхронизировано'}</div>
                </div>

                <div class="repro-sub-header">Настройки параметров</div>
                <div class="repro-row">
                    <label>Длина всего цикла:</label>
                    <input type="number" id="repro-input-cycle" class="repro-input" value="${settings.cycleLength}"/>
                </div>
                ${data.isPregnant ? `
                    <div class="repro-row">
                        <label>Изменить неделю:</label>
                        <input type="number" id="repro-input-weeks" class="repro-input" value="${data.pregnancyWeeks}"/>
                    </div>
                ` : `
                    <div class="repro-row">
                        <label>Изменить текущий день:</label>
                        <input type="number" id="repro-input-day" class="repro-input" value="${data.cycleDay}"/>
                    </div>
                `}

                <button id="repro-apply-params" class="repro-btn-primary">▶ Применить изменения</button>

                ${!data.isPregnant ? `
                    <div class="repro-manual-box">
                        <div class="repro-sub-header" style="color: #f472b6; margin-top: 0;">Инициализировать беременность</div>
                        <div class="repro-row">
                            <label>Срок (в неделях):</label>
                            <input type="number" id="repro-manual-weeks" class="repro-input" value="4" min="0" max="40"/>
                        </div>
                        <div class="repro-row">
                            <label>Количество детей:</label>
                            <input type="number" id="repro-manual-count" class="repro-input" value="1" min="1" max="3"/>
                        </div>
                        <button id="repro-btn-manual-preg" class="repro-btn-pink">🤰 Установить беременность</button>
                    </div>
                ` : ''}

                <!-- НОВАЯ КНОПКА: СБРОСИТЬ ТОЛЬКО БЕРЕМЕННОСТЬ -->
                ${data.isPregnant ? `
                    <button id="repro-reset-pregnancy-only" class="repro-btn-warning">🚼 Сбросить только беременность</button>
                ` : ''}

                <button id="repro-reset" class="repro-btn-danger">Полный сброс трекера чата</button>
            </div>
        </div>
    `;

    let container = $('#repro-system-extension-container');
    if (container.length === 0) {
        container = $('<div id="repro-system-extension-container"></div>');
        $('#extensions_settings').append(container);
    }
    container.html(html);

    // Логика переключения состояния сворачивания по клику на заголовок
    $('.repro-header').off('click').on('click', function() {
        isMenuCollapsed = !isMenuCollapsed;
        $('#repro-content-wrapper').slideToggle(200);
        $('#repro-toggle-arrow').text(isMenuCollapsed ? '▼' : '▲');
    });

    // Слушатели изменений параметров
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
        
        if (bodyData.isPregnant) {
            bodyData.pregnancyWeeks = parseInt($('#repro-input-weeks').val()) || 0;
            bodyData.pregnancyDays = 0; 
        } else {
            bodyData.cycleDay = parseInt($('#repro-input-day').val()) || 1;
        }

        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
        toastr.success('Параметры репродуктивной системы успешно обновлены!');
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
        for (let i = 0; i < count; i++) {
            bodyData.babiesGenders.push(Math.random() > 0.5 ? 'Мальчик ♂' : 'Девочка ♀');
        }

        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
        toastr.success(`Беременность успешно задана вручную! Срок: ${weeks} недель.`);
    });

    // Обработчик точечного сброса беременности
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
        toastr.info('Беременность сброшена. Цикл восстановлен, остальные логи сохранены[cite: 1, 9]!');
    });

    $('#repro-reset').on('click', function() {
        const chatId = getCurrentChatId();
        settings.chatPregnancyData[chatId] = Object.assign({}, DEFAULT_BODY_DATA);
        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
        toastr.info('Все физиологические данные текущего чата были очищены.');
    });
}

window.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});

jQuery(async () => {
    loadSettings();

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
