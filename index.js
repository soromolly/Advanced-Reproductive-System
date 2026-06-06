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

// 1. АБСОЛЮТНЫЙ ПАРСЕР ДАТ (06.06.2026)
function parseRpDateFromText(text) {
    if (!text) return null;

    const textRegex = /(\d{1,2})\s+([а-яёА-ЯЁ]+)\s+(\d{4})/i;
    const textMatch = text.match(textRegex);
    if (textMatch) {
        const day = parseInt(textMatch[1]);
        const monthStr = textMatch[2].toLowerCase();
        const year = parseInt(textMatch[3]);
        if (MONTHS_RU[monthStr] !== undefined && day >= 1 && day <= 31) {
            return new Date(year, MONTHS_RU[monthStr], day);
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

// 2. ОТНОСИТЕЛЬНЫЙ ПАРСЕР ТАЙМСКИПОВ ("Прошло 2 месяца")
function parseRelativeTimeFromText(text) {
    const regex = /прошло\s+(\d+)\s+(дне[йяа]|недел[ьия]|месяц[аев]|ле[тв]|год[аоу]?)/i;
    const match = text.match(regex);
    if (!match) return null;

    const count = parseInt(match[1]);
    const unit = match[2].toLowerCase();
    const data = getChatBodyData();

    // Если в системе уже зафиксирована дата, считаем дельту дней абсолютно точно по календарю
    if (data.lastRpDate) {
        const baseDate = new Date(data.lastRpDate);
        const futureDate = new Date(data.lastRpDate);

        if (unit.startsWith('дн')) futureDate.setDate(futureDate.getDate() + count);
        else if (unit.startsWith('нед')) futureDate.setDate(futureDate.getDate() + (count * 7));
        else if (unit.startsWith('мес')) futureDate.setMonth(futureDate.getMonth() + count);
        else if (unit.startsWith('лет') || unit.startsWith('год')) futureDate.setFullYear(futureDate.getFullYear() + count);

        const timeDiff = futureDate - baseDate;
        const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        
        // Переписываем текущую дату на новую будущую
        data.lastRpDate = futureDate.toISOString().split('T')[0];
        return totalDays;
    }

    // Если базовой даты в системе не было, используем среднее математическое приближение
    if (unit.startsWith('дн')) return count;
    if (unit.startsWith('нед')) return count * 7;
    if (unit.startsWith('мес')) return count * 30;
    if (unit.startsWith('лет') || unit.startsWith('год')) return count * 365;

    return null;
}

function handleTimeProgression(text) {
    const data = getChatBodyData();

    // А. Сначала проверяем, не написал ли пользователь относительный таймскип ("Прошло 2 месяца")
    const relativeDays = parseRelativeTimeFromText(text);
    if (relativeDays !== null && relativeDays > 0) {
        advanceBodyTime(relativeDays);
        saveSettingsDebounced();
        renderUI();
        return; // Выходим, чтобы не конфликтовать с поиском абсолютных дат
    }

    // Б. Если таймскипа нет, ищем классическую абсолютную дату шаблона (06.06.2026)
    const currentRpDate = parseRpDateFromText(text);
    if (!currentRpDate) return;

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
        
        if (phase.includes('Течка')) {
            prompt += `🚨 CRITICAL MANDATORY DIRECTIVE FOR {{char}}: {{user}} is currently in OMEGA HEAT (течка). Their body is involuntarily emitting an incredibly potent, sweet, sharp, and intoxicating Omega pheromone scent. This state is completely obvious, primal, and unignorable to anyone in the same room. {{char}} (and any surrounding Alphas/Betas) MUST immediately notice this scent, describe their instinctual physical reaction to it (pupil dilation, heavy breathing, sudden possessive/protective attraction, or primitive agitation), and acknowledge the heavy pheromonal atmosphere thick in the air.\n`;
        } else if (phase.includes('Овуляция')) {
            prompt += `⚠️ STRICT CONTRA-INDICATION: {{user}} is currently ovulating. This is a purely internal, microscopic, scentless, and 100% invisible biological process. No one around them (including {{char}}) can sense, smell, or know this. {{char}} MUST act completely oblivious to {{user}}'s fertility status. Do NOT mention, hint, or react to ovulation in any way.\n`;
        }
    }

    setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
}

function renderUI() {
    const data = getChatBodyData();
    const isRealism = settings.mode === 'realism';
    const statusLabel = isRealism ? 'Текущая фаза:' : 'Текущее состояние омеги:';

    let displayDate = 'Ожидание даты';
    if (data.lastRpDate) {
        const parts = data.lastRpDate.split('-');
        displayDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    const html = `
        <div class="repro-custom-btn-toggle" style="display: flex; justify-content: space-between; align-items: center; background: var(--input-bg, #1e1e2a); border: 1px solid var(--input-border, #334155); padding: 10px 14px; border-radius: ${isMenuCollapsed ? '10px' : '10px 10px 0 0'}; cursor: pointer; user-select: none; font-size: 14px; transition: background 0.15s;">
            <span style="color: #f472b6 !important; font-weight: 600;">🧬 Система Репродукции V2</span>
            <i id="repro-toggle-arrow" class="fa-solid ${isMenuCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}" style="opacity: 0.6; font-size: 12px; margin-right: 4px;"></i>
        </div>
        
        <div id="repro-content-wrapper" style="${isMenuCollapsed ? 'display: none;' : 'display: block;'} background: rgba(0, 0, 0, 0.15); border: 1px solid var(--input-border, #334155); border-top: none; border-radius: 0 0 10px 10px; padding: 14px; box-sizing: border-box;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 0.9em; opacity: 0.85;">Система:</label>
                <select id="repro-mode" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;">
                    <option value="realism" ${settings.mode === 'realism' ? 'selected' : ''}>Реализм</option>
                    <option value="omegaverse" ${settings.mode === 'omegaverse' ? 'selected' : ''}>ОмегаВерс</option>
                </select>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 0.9em; opacity: 0.85;">Физиология:</label>
                <select id="repro-gender" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;">
                    <option value="female" ${settings.gender === 'female' ? 'selected' : ''}>Женщина</option>
                    <option value="female_omega" ${settings.gender === 'female_omega' ? 'selected' : ''}>Ж-Омега</option>
                    <option value="male_omega" ${settings.gender === 'male_omega' ? 'selected' : ''}>М-Омега</option>
                </select>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 0.9em; opacity: 0.85;">Логика ИИ:</label>
                <select id="repro-awareness" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;">
                    <option value="dynamic" ${settings.aiAwareness === 'dynamic' ? 'selected' : ''}>УЗИ (20 нед)</option>
                    <option value="hidden" ${settings.aiAwareness === 'hidden' ? 'selected' : ''}>Средневековье</option>
                    <option value="full" ${settings.aiAwareness === 'full' ? 'selected' : ''}>Знает всё</option>
                </select>
            </div>

            <div style="background: rgba(0, 0, 0, 0.25); border-left: 3px solid #f472b6; border-radius: 4px; padding: 10px; margin: 12px 0; font-size: 0.9em; text-align: left;">
                <div style="margin-bottom: 4px;"><strong>${statusLabel}</strong> <span style="color: #4ade80; font-weight: 700;">${getBodyPhase()}</span></div>
                ${data.isPregnant ? `
                    <div style="margin-bottom: 4px;"><strong>Срок в RP:</strong> ${data.pregnancyWeeks} нед. ${data.pregnancyDays} дн.</div>
                    <div style="border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px; padding-top: 5px; color: #f472b6;">
                        ℹ️ <em>Карта плода:</em><br>
                        • Детей: <b>${data.babiesCount}</b><br>
                        • Пол: <b>${data.babiesGenders.join(', ')}</b>
                    </div>
                ` : `
                    <div style="margin-bottom: 4px;"><strong>Текущий день:</strong> ${data.cycleDay} из ${settings.cycleLength} дней</div>
                `}
                <div style="font-size: 0.85em; color: #64748b; margin-top: 6px;">📅 Синхронизация: ${displayDate}</div>
            </div>

            <div style="font-size: 0.85em; font-weight: 700; color: var(--text_accent, #38bdf8); margin: 12px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px; text-align: left;">Параметры</div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 0.9em; opacity: 0.85;">RP Дата:</label>
                <input type="date" id="repro-input-rpdate" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${data.lastRpDate || ''}"/>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <label style="font-size: 0.9em; opacity: 0.85;">Цикл (дней):</label>
                <input type="number" id="repro-input-cycle" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${settings.cycleLength}"/>
            </div>
            ${data.isPregnant ? `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">Неделя:</label>
                    <input type="number" id="repro-input-weeks" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${data.pregnancyWeeks}"/>
                </div>
            ` : `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="font-size: 0.9em; opacity: 0.85;">День цикла:</label>
                    <input type="number" id="repro-input-day" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="${data.cycleDay}"/>
                </div>
            `}

            <button id="repro-apply-params" class="menu_button type_primary" style="width: 100%; margin-top: 10px; font-weight: 600;">▶ Применить изменения</button>

            ${!data.isPregnant ? `
                <div style="background: rgba(244, 114, 182, 0.03); border: 1px dashed rgba(244, 114, 182, 0.2); border-radius: 8px; padding: 12px; margin: 14px 0 10px 0; text-align: left;">
                    <div style="font-size: 0.85em; font-weight: 700; color: #f472b6; margin-bottom: 8px; text-transform: uppercase;">Задать беременность</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label style="font-size: 0.9em; opacity: 0.85;">Срок (нед):</label>
                        <input type="number" id="repro-manual-weeks" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="4" min="0" max="40"/>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <label style="font-size: 0.9em; opacity: 0.85;">Плодов:</label>
                        <input type="number" id="repro-manual-count" style="background: var(--input-bg, #0f172a); border: 1px solid var(--input-border, #334155); color: var(--text-color, #f8fafc); padding: 6px 10px; border-radius: 6px; width: 55%; font-family: inherit; outline: none;" value="1" min="1" max="3"/>
                    </div>
                    <button id="repro-btn-manual-preg" class="menu_button" style="width: 100%; background: #db2777; color: white; font-weight: 600;"> Начать беременность</button>
                </div>
            ` : ''}

            ${data.isPregnant ? `
                <button id="repro-reset-pregnancy-only" class="menu_button type_warning" style="width: 100%; margin-top: 10px; font-weight: 600;">🚼 Сбросить беременность</button>
            ` : ''}

            <button id="repro-reset" class="menu_button type_danger" style="width: 100%; margin-top: 10px; font-weight: 600;">Полный сброс данных</button>
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
        toastr.success('Параметры успешно сохранены!');
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
        toastr.success(`Беременность установлена вручную: ${weeks} нед.`);
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
        toastr.info('Беременность сброшена.');
    });

    $('#repro-reset').on('click', function() {
        const chatId = getCurrentChatId();
        settings.chatPregnancyData[chatId] = Object.assign({}, DEFAULT_BODY_DATA);
        saveSettingsDebounced();
        renderUI();
        updatePromptInjection();
        toastr.info('Данные чата полностью очищены.');
    });
}

jQuery(async () => {
    loadSettings();

    // МГНОВЕННЫЙ ПЕРЕХВАТ ПРИ ОТПРАВКЕ ТВОЕГО СООБЩЕНИЯ
    eventSource.on(event_types.MESSAGE_SENT, async (messageIndex) => {
        const context = typeof SillyTavern?.getContext === 'function' ? SillyTavern.getContext() : null;
        const chat = context ? context.chat : window.chat;
        if (!chat || !chat[messageIndex]) return;

        const text = chat[messageIndex].mes;
        if (!text) return;

        // Сканируем текст пользователя на таймскип ЕЩЁ ДО ТОГО, как запрос улетит ИИ
        handleTimeProgression(text);
        checkConceptionTrigger(text);
        
        // В ту же миллисекунду зашиваем обновлённый промпт
        updatePromptInjection();
    });

    // ПЕРЕХВАТ ПРИ ПОЛУЧЕНИИ ОТВЕТА БОТА (на случай, если бот сам сделал таймскип)
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
