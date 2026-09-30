import { 
    saveSettingsDebounced, 
    eventSource, 
    event_types,
    setExtensionPrompt,
    extension_prompt_types
} from '../../../../script.js';
import { extension_settings } from '../../../extensions.js';
import { 
    createDefaultEntityState, 
    updateEntitySymptoms, 
    checkEntityComplications, 
    checkEntityFetalDemise, 
    advanceEntityDays, 
    triggerEntityPregnancy, 
    deliverEntitySingleBaby, 
    processEntityAbortion, 
    getEntityBodyPhase,
    generateBabyGender,
    laySingleEgg,
    layAllEggs,
    hatchSingleEgg,
    hatchEggs
} from './entityController.js';
import { getText } from './translations.js';
import { 
    dateToDays, 
    daysToDateString, 
    normalizeInputDate, 
    parseRpDateFromText, 
    parseRelativeDaysFromText 
} from './dateUtils.js';
import { buildMultiEntityPrompt } from './promptBuilder.js';
import { renderUI, exportReproLogs } from './ui.js';
import { 
    getComplication,
    getRandomEggEmbryoDiseaseId
} from './symptoms.js';
import { 
    rollEggCount, 
    rollEggIncubationDays, 
    getRandomEggShellDefectId,
    EGG_INCUBATION_DISPLAY_MAX
} from './eggSystem.js';

const EXTENSION_NAME = 'st-advanced-reproductive-system';

const DEFAULT_SETTINGS = {
    isEnabled: true,
    isNotificationsEnabled: true,
    language: 'ru',
    aiAwareness: 'dynamic', 
    globalRollsCount: 0,
    chatPregnancyData: {}
};

let settings = Object.assign({}, DEFAULT_SETTINGS);
let isMenuCollapsed = true; 
let activeTab = 'user';
let activeChatId = null;
let pendingUserTimeskipDays = 0;
const processedBirthMessages = new Set();
const processedLayMessages = new Set();
const processedHatchMessages = new Set();
let lastProcessedMessageUid = null;

function getCurrentChatId() {
    return (typeof SillyTavern?.getContext === 'function') ? (SillyTavern.getContext().chatId || window.chat_id || 'default') : (window.chat_id || 'default');
}

function getChatData() {
    const chatId = getCurrentChatId();
    if (!settings.chatPregnancyData[chatId]) {
        settings.chatPregnancyData[chatId] = {
            targetMode: 'user',
            lastRpDate: null,
            activityLogs: [],
            user: createDefaultEntityState('user'),
            char: createDefaultEntityState('char')
        };
    }
    activeChatId = chatId;
    const data = settings.chatPregnancyData[chatId];
    
    if (data.cycleDay !== undefined && !data.user) {
        data.user = Object.assign(createDefaultEntityState('user'), data);
        data.char = createDefaultEntityState('char');
        data.targetMode = 'user';
    }
    if (!data.user) data.user = createDefaultEntityState('user');
    if (!data.char) data.char = createDefaultEntityState('char');
    if (!data.targetMode) data.targetMode = 'user';
    if (!data.activityLogs) data.activityLogs = [];

    ['user', 'char'].forEach(k => {
        if (data[k].eggCount === undefined) data[k].eggCount = 0;
        if (!data[k].eggShellDefects) data[k].eggShellDefects = [];
        if (!data[k].eggGenders) data[k].eggGenders = [];
        if (!data[k].eggDiseases) data[k].eggDiseases = [];
        if (data[k].eggsLaid === undefined) data[k].eggsLaid = 0;
        if (!data[k].laidEggs) data[k].laidEggs = [];
        if (data[k].eggIncubationDays === undefined) data[k].eggIncubationDays = 0;
        if (data[k].eggIncubationTotal === undefined) data[k].eggIncubationTotal = 0;
        if (data[k].eggsHatched === undefined) data[k].eggsHatched = 0;
        if (data[k].isNestActive === undefined) data[k].isNestActive = false;

        if (data[k].isNestActive && data[k].eggIncubationTotal && data[k].eggIncubationTotal !== EGG_INCUBATION_DISPLAY_MAX) {
            data[k].eggIncubationTotal = EGG_INCUBATION_DISPLAY_MAX;
        }
    });

    return data;
}

export function getActiveEntityKey() {
    const data = getChatData();
    if (data.targetMode === 'both') return activeTab;
    return data.targetMode || 'user';
}

function logReproEvent(message) {
    const data = getChatData();
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const rpDateStr = data.lastRpDate ? `[RP Date: ${data.lastRpDate}]` : `[RP Date: N/A]`;
    data.activityLogs.push(`[${timestamp}] ${rpDateStr} ${message}`);
    if (data.activityLogs.length > 300) data.activityLogs.shift();
}

function notify(text, type = 'info') {
    if (settings.isNotificationsEnabled && typeof toastr !== 'undefined') {
        toastr[type]?.(text) || toastr.info(text);
    }
}

function updatePrompt() {
    if (!settings.isEnabled) { 
        setExtensionPrompt(EXTENSION_NAME, '', extension_prompt_types.IN_CHAT, 0); 
        return; 
    }
    const data = getChatData();
    const prompt = buildMultiEntityPrompt({
        targetMode: data.targetMode,
        userEntity: data.user,
        charEntity: data.char,
        aiAwareness: settings.aiAwareness
    });
    setExtensionPrompt(EXTENSION_NAME, prompt, extension_prompt_types.IN_CHAT, 0);
}

function refreshUI() {
    const data = getChatData();
    const lang = settings.language || 'ru';
    updateEntitySymptoms(data.user);
    updateEntitySymptoms(data.char);
    checkEntityComplications(data.user, lang, logReproEvent, notify);
    checkEntityComplications(data.char, lang, logReproEvent, notify);
    checkEntityFetalDemise(data.user, logReproEvent);
    checkEntityFetalDemise(data.char, logReproEvent);
    renderUI({ settings, chatData: data, activeTab, isMenuCollapsed });
}

function advanceTimeAll(days) {
    if (!days || days <= 0) return;
    const data = getChatData();
    const lang = settings.language || 'ru';
    if (data.targetMode === 'user' || data.targetMode === 'both') {
        advanceEntityDays(data.user, days, settings.aiAwareness, lang, logReproEvent, notify);
    }
    if (data.targetMode === 'char' || data.targetMode === 'both') {
        advanceEntityDays(data.char, days, settings.aiAwareness, lang, logReproEvent, notify);
    }
}

function applyDateForwardOnly(data, parsedDate, source) {
    if (!parsedDate) return 'ignored';

    const newTotalDays = dateToDays(parsedDate.year, parsedDate.month, parsedDate.day);
    const newDateStr = daysToDateString(newTotalDays);

    if (!data.lastRpDate) {
        data.lastRpDate = newDateStr;
        logReproEvent(`[${source} DATE INIT] Initial date set to ${newDateStr}.`);
        return 'set-initial';
    }

    if (data.lastRpDate === newDateStr) {
        return 'same';
    }

    const parts = data.lastRpDate.split('-').map(Number);
    const prevTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
    const diff = newTotalDays - prevTotalDays;

    if (diff < 0) {
        logReproEvent(`[${source} DATE IGNORED] Parsed date ${newDateStr} is EARLIER than current ${data.lastRpDate} (${diff} days). Possibly a flashback/mention. Date unchanged.`);
        return 'ignored';
    }

    if (diff > 0) {
        advanceTimeAll(diff);
        data.lastRpDate = newDateStr;
        logReproEvent(`[${source} DATE SYNC] Synced from ${data.lastRpDate} to ${newDateStr} (+${diff} days).`);
        notify(`${getText('toastTimePassed', settings.language || 'ru')}${diff}.`, 'info');
        return 'advanced';
    }

    return 'same';
}

function checkConceptionForEntity(entity, text, isReceivedClimax) {
    if (!isReceivedClimax || entity.isPregnant || entity.postpartumDays > 0 || entity.isNestActive) return;

    settings.globalRollsCount = (settings.globalRollsCount || 0) + 1;
    const phase = getEntityBodyPhase(entity, 'en');
    const isFertile = phase.includes('Ovulation') || phase.includes('Heat');

    let finalChance = 0;
    if (entity.contraception === 'none') {
        finalChance = isFertile ? (entity.mode === 'omegaverse' || entity.mode === 'oviposition' ? 85 : 25) : (entity.mode === 'omegaverse' || entity.mode === 'oviposition' ? 5 : 0.5);
    } else if (entity.contraception === 'condom') finalChance = 2;
    else if (entity.contraception === 'pills') finalChance = 0.1;
    else if (entity.contraception === 'iud') finalChance = 0.2;

    const roll = Math.random() * 100;
    const isSuccess = roll <= finalChance;
    const lang = settings.language || 'ru';

    logReproEvent(`[CONCEPTION ROLL] [${entity.key.toUpperCase()}] Roll: ${roll.toFixed(2)}% <= ${finalChance}% | Outcome: ${isSuccess ? 'SUCCESS' : 'MISSED'}`);

    if (isSuccess) {
        if (!entity.isSecretConception) {
            notify(`🎲 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Conception Roll SUCCESS!' : 'Кубик на зачатие: УСПЕХ!'} (${roll.toFixed(1)}% <= ${finalChance}%)`, 'success');
        }
        triggerEntityPregnancy(entity, lang, logReproEvent, notify);
    } else if (!entity.isSecretConception) {
        notify(`🎲 [${entity.key === 'user' ? '{{user}}' : '{{char}}'}] ${lang === 'en' ? 'Conception Roll Missed.' : 'Кубик на зачатие: Мимо.'} (${roll.toFixed(1)}% > ${finalChance}%)`, 'info');
    }
}

function processMessageInteractions(rawText, isUserMessage, messageIndex) {
    const data = getChatData();
    const chatId = getCurrentChatId();
    const msgKey = `${chatId}_${messageIndex}_birth`;
    const layMsgKey = `${chatId}_${messageIndex}_lay`;
    const hatchMsgKey = `${chatId}_${messageIndex}_hatch`;

    const text = (rawText || '')
        .replace(/<think[\s\S]*?<\/think>/gi, ' ')
        .replace(/<thought[\s\S]*?<\/thought>/gi, ' ');

    const cumVagUser = /<!--\s*CUM_VAGINAL_USER\s*-->/i.test(text) || (!/CHAR/i.test(text) && /<!--\s*CUM_VAGINAL\s*-->/i.test(text));
    const cumAnalUser = /<!--\s*CUM_ANAL_USER\s*-->/i.test(text) || (!/CHAR/i.test(text) && /<!--\s*CUM_ANAL\s*-->/i.test(text));
    const cumVagChar = /<!--\s*CUM_VAGINAL_CHAR\s*-->/i.test(text);
    const cumAnalChar = /<!--\s*CUM_ANAL_CHAR\s*-->/i.test(text);

    if (data.targetMode === 'user' || data.targetMode === 'both') {
        const isTargetClimax = (data.user.gender === 'male_omega' || data.user.gender === 'male') ? cumAnalUser : cumVagUser;
        checkConceptionForEntity(data.user, text, isTargetClimax);
    }
    if (data.targetMode === 'char' || data.targetMode === 'both') {
        const isTargetClimax = (data.char.gender === 'male_omega' || data.char.gender === 'male') ? cumAnalChar : cumVagChar;
        checkConceptionForEntity(data.char, text, isTargetClimax);
    }

    if (/<!--\s*ABORTION_USER\s*-->/i.test(text) || /<!--\s*ABORTION\s*-->/i.test(text)) {
        if (data.user.isPregnant && data.user.mode !== 'oviposition') processEntityAbortion(data.user, settings.language, logReproEvent, notify);
    }
    if (/<!--\s*ABORTION_CHAR\s*-->/i.test(text)) {
        if (data.char.isPregnant && data.char.mode !== 'oviposition') processEntityAbortion(data.char, settings.language, logReproEvent, notify);
    }

    if (!processedLayMessages.has(layMsgKey)) {
        const checkLayFor = (entity, tagKey) => {
            if (entity.mode !== 'oviposition' || !entity.isPregnant) return;
            const regex = new RegExp(`<!--\\s*LAY_EGG(?:S)?_${tagKey}(?:_(\\d+))?\\s*-->`, 'gi');
            let match;
            while ((match = regex.exec(text)) !== null) {
                if (!entity.isPregnant) break;
                laySingleEgg(entity, settings.language, logReproEvent, notify);
            }
        };
        checkLayFor(data.user, 'USER');
        checkLayFor(data.char, 'CHAR');
        processedLayMessages.add(layMsgKey);
    }

    if (!processedHatchMessages.has(hatchMsgKey)) {
        const checkHatchFor = (entity, tagKey) => {
            if (entity.mode !== 'oviposition' || !entity.isNestActive) return;
            const regex = new RegExp(`<!--\\s*HATCH_EGG_${tagKey}(?:_(\\d+))?\\s*-->`, 'gi');
            let match;
            while ((match = regex.exec(text)) !== null) {
                if (!entity.isNestActive) break;
                hatchSingleEgg(entity, settings.language, logReproEvent, notify);
            }
        };
        checkHatchFor(data.user, 'USER');
        checkHatchFor(data.char, 'CHAR');
        processedHatchMessages.add(hatchMsgKey);
    }

    if (!processedBirthMessages.has(msgKey)) {
        const checkBirthFor = (entity, tagKey) => {
            if (!entity.isPregnant || !entity.babiesGenders || entity.babiesGenders.length === 0) return;
            if (entity.mode === 'oviposition') return;
            const regex = new RegExp(`<!--\\s*BIRTH_(NATURAL|C_SECTION)_${tagKey}(?:_(\\d+))?\\s*-->`, 'gi');
            let match;
            while ((match = regex.exec(text)) !== null) {
                if (!entity.isPregnant) break;
                const method = match[1].toLowerCase() === 'c_section' ? 'c_section' : 'natural';
                deliverEntitySingleBaby(entity, method, settings.language, logReproEvent, notify);
            }
        };

        checkBirthFor(data.user, 'USER');
        checkBirthFor(data.char, 'CHAR');
        processedBirthMessages.add(msgKey);
    }
}

function processIncomingMessage(messageIndex, isUser = false) {
    if (!settings.isEnabled) return; 
    const context = typeof SillyTavern?.getContext === 'function' ? SillyTavern.getContext() : null;
    const chat = context ? context.chat : window.chat;
    if (!chat || !Array.isArray(chat) || chat.length === 0) return;

    let text = null;
    let idx = null;
    if (typeof messageIndex === 'number' && chat[messageIndex]) {
        text = chat[messageIndex].mes;
        idx = messageIndex;
    } else if (typeof messageIndex === 'object' && messageIndex?.mes) {
        text = messageIndex.mes;
        idx = messageIndex?.id ?? (chat.length - 1);
    } else {
        idx = chat.length - 1;
        text = chat[idx]?.mes;
    }

    if (!text) return;

    const currentMsgUid = `${idx}_${isUser ? 'user' : 'ai'}_${text.length}`;
    if (lastProcessedMessageUid === currentMsgUid) return;
    lastProcessedMessageUid = currentMsgUid;

    const data = getChatData();

    if (isUser) {
        const relativeDays = parseRelativeDaysFromText(text);
        if (relativeDays > 0) {
            pendingUserTimeskipDays = relativeDays;
            advanceTimeAll(relativeDays);
            if (data.lastRpDate) {
                const parts = data.lastRpDate.split('-').map(Number);
                const currentTotalDays = dateToDays(parts[0], parts[1] - 1, parts[2]);
                data.lastRpDate = daysToDateString(currentTotalDays + relativeDays);
            }
            logReproEvent(`[USER TIMESKIP] Advanced by ${relativeDays} days via user message.`);
        } else {
            const parsedDate = parseRpDateFromText(text);
            applyDateForwardOnly(data, parsedDate, 'USER');
        }
    } else {
        const parsedDate = parseRpDateFromText(text);

        if (pendingUserTimeskipDays > 0 && parsedDate) {
            const newTotalDays = dateToDays(parsedDate.year, parsedDate.month, parsedDate.day);
            const newDateStr = daysToDateString(newTotalDays);
            pendingUserTimeskipDays = 0;
            data.lastRpDate = newDateStr;
            logReproEvent(`[AI DATE ALIGN] Aligned date to ${newDateStr} after user timeskip.`);
        } else {
            applyDateForwardOnly(data, parsedDate, 'AI');
        }
    }

    processMessageInteractions(text, isUser, idx);
    saveSettingsDebounced();
    refreshUI();
    updatePrompt();
}

function bindGlobalEvents() {
    $(document).off('click', '.repro-tooltip-btn, .repro-tooltip-icon').on('click', '.repro-tooltip-btn, .repro-tooltip-icon', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const tip = $(this).attr('data-tip') || $(this).attr('title');
        if (tip) notify(tip, 'info');
    });

    $(document).off('click', '.repro-custom-btn-toggle').on('click', '.repro-custom-btn-toggle', function() {
        isMenuCollapsed = !isMenuCollapsed; 
        $('#repro-content-wrapper').slideToggle(150);
        $('#repro-toggle-arrow').toggleClass('fa-chevron-down fa-chevron-up');
    });

    $(document).off('change', '#repro-target-mode').on('change', '#repro-target-mode', function() {
        const data = getChatData();
        data.targetMode = $(this).val();
        activeTab = (data.targetMode === 'char') ? 'char' : 'user';
        saveSettingsDebounced();
        refreshUI();
        updatePrompt();
    });

    $(document).off('click', '#repro-tab-user').on('click', '#repro-tab-user', function() {
        activeTab = 'user';
        refreshUI();
    });

    $(document).off('click', '#repro-tab-char').on('click', '#repro-tab-char', function() {
        activeTab = 'char';
        refreshUI();
    });

    $(document).off('change', '#repro-lang-select').on('change', '#repro-lang-select', function() {
        settings.language = $(this).val();
        saveSettingsDebounced();
        refreshUI();
        updatePrompt();
    });

    $(document).off('change', '#repro-is-enabled').on('change', '#repro-is-enabled', function() {
        settings.isEnabled = $(this).is(':checked');
        saveSettingsDebounced();
        updatePrompt();
        refreshUI(); 
    });

    $(document).off('change', '#repro-is-notifications-enabled').on('change', '#repro-is-notifications-enabled', function() {
        settings.isNotificationsEnabled = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $(document).off('change', '#repro-is-secret-conception').on('change', '#repro-is-secret-conception', function() {
        const entity = getChatData()[getActiveEntityKey()];
        entity.isSecretConception = $(this).is(':checked');
        if (!entity.isSecretConception && entity.isPregnant) entity.isDiscovered = true;
        saveSettingsDebounced();
        refreshUI();
        updatePrompt();
    });

    $(document).off('change', '#repro-is-irregular-cycle').on('change', '#repro-is-irregular-cycle', function() {
        getChatData()[getActiveEntityKey()].isIrregularCycle = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $(document).off('change', '#repro-mode').on('change', '#repro-mode', function() { 
        const entity = getChatData()[getActiveEntityKey()];
        entity.mode = $(this).val(); 
        if (entity.mode === 'realism') entity.gender = 'female';
        else if (entity.mode === 'omegaverse' && (entity.gender === 'female' || entity.gender === 'male')) entity.gender = 'female_omega';
        else if (entity.mode === 'oviposition' && entity.gender !== 'male' && entity.gender !== 'female') entity.gender = 'female';
        if (entity.mode !== 'oviposition' && entity.isNestActive) {
            entity.isNestActive = false;
            entity.laidEggs = [];
            entity.eggIncubationDays = 0;
            entity.eggIncubationTotal = 0;
        }
        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
    });

    $(document).off('change', '#repro-gender').on('change', '#repro-gender', function() { 
        getChatData()[getActiveEntityKey()].gender = $(this).val(); 
        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
    });

    $(document).off('change', '#repro-awareness').on('change', '#repro-awareness', function() { 
        settings.aiAwareness = $(this).val(); 
        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
    });

    $(document).off('change', '#repro-contraception').on('change', '#repro-contraception', function() {
        getChatData()[getActiveEntityKey()].contraception = $(this).val();
        saveSettingsDebounced();
        updatePrompt();
    });

    $(document).off('change', '#repro-fetal-pathology-enabled').on('change', '#repro-fetal-pathology-enabled', function() {
        getChatData()[getActiveEntityKey()].isFetalPathologyEnabled = $(this).is(':checked');
        saveSettingsDebounced();
    });

    $(document).off('click', '.repro-edit-child-name-btn').on('click', '.repro-edit-child-name-btn', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const childId = $(this).attr('data-child-id');
        const entity = getChatData()[getActiveEntityKey()];
        const child = entity.childrenList?.find(c => String(c.id) === String(childId));
        if (!child) return;

        const lang = settings.language || 'ru';
        const currentName = child.name || '';
        const promptMsg = getText('editChildNamePrompt', lang);
        const newName = window.prompt(promptMsg, currentName);

        if (newName !== null) {
            child.name = newName.trim();
            logReproEvent(`[CHILD RENAMED] [${entity.key.toUpperCase()}] Child ID ${child.id} named: "${child.name || 'unnamed'}"`);
            saveSettingsDebounced();
            refreshUI();
            updatePrompt();
            notify(lang === 'en' ? 'Child name updated!' : 'Имя ребенка обновлено!', 'success');
        }
    });

    $(document).off('click', '#repro-btn-take-test').on('click', '#repro-btn-take-test', function() {
        const entity = getChatData()[getActiveEntityKey()];
        const lang = settings.language || 'ru';
        
        if (entity.isPregnant) {
            entity.isDiscovered = true;
            logReproEvent(`[TEST] [${entity.key.toUpperCase()}] Positive test confirmed.`);
            if (entity.mode === 'oviposition') {
                notify(lang === 'en' 
                    ? `🥚 Egg carrying confirmed (${entity.pregnancyWeeks} wks ${entity.pregnancyDays} d)!`
                    : `🥚 Вынашивание яиц подтверждено (${entity.pregnancyWeeks} нед. ${entity.pregnancyDays} дн.)!`, 'success');
            } else {
                notify(`${getText('toastTestPositive', lang)}${entity.pregnancyWeeks} ${getText('weeksShort', lang)} ${entity.pregnancyDays} ${getText('daysShort', lang)}`, 'success');
            }
        } else {
            logReproEvent(`[TEST] [${entity.key.toUpperCase()}] Negative test (Cycle delay).`);
            notify(getText('toastTestNegative', lang), 'info');
        }

        saveSettingsDebounced();
        refreshUI();
        updatePrompt();
    });

    $(document).off('click', '#repro-btn-birth-trigger').on('click', '#repro-btn-birth-trigger', function() {
        const entity = getChatData()[getActiveEntityKey()];
        if (entity.mode === 'oviposition') return;
        while (entity.babiesCount > 0) {
            deliverEntitySingleBaby(entity, 'natural', settings.language, logReproEvent, notify);
        }
        saveSettingsDebounced();
        refreshUI();
        updatePrompt();
    });

    $(document).off('click', '#repro-btn-lay-eggs').on('click', '#repro-btn-lay-eggs', function() {
        const entity = getChatData()[getActiveEntityKey()];
        if (entity.mode !== 'oviposition' || !entity.isPregnant) return;
        layAllEggs(entity, settings.language, logReproEvent, notify);
        saveSettingsDebounced();
        refreshUI();
        updatePrompt();
    });

    $(document).off('click', '#repro-btn-hatch-eggs').on('click', '#repro-btn-hatch-eggs', function() {
        const entity = getChatData()[getActiveEntityKey()];
        if (!entity.isNestActive) return;
        if (!confirm(settings.language === 'en' ? 'Force hatching ALL remaining eggs now?' : 'Форсировать вылупление ВСЕХ оставшихся яиц сейчас?')) return;
        hatchEggs(entity, settings.language, logReproEvent, notify);
        saveSettingsDebounced();
        refreshUI();
        updatePrompt();
    });

    $(document).off('click', '#repro-cure-complication').on('click', '#repro-cure-complication', function() {
        const entity = getChatData()[getActiveEntityKey()];
        if (entity.activeComplication?.curable) {
            logReproEvent(`[COMPLICATION CURED] [${entity.key.toUpperCase()}] ${entity.activeComplication.id}`);
            entity.activeComplication = null;
            saveSettingsDebounced();
            refreshUI();
            updatePrompt();
            notify(settings.language === 'en' ? 'Complication treated!' : 'Осложнение вылечено!', 'success');
        }
    });

    $(document).off('click', '#repro-btn-abort').on('click', '#repro-btn-abort', function() {
        if (confirm("Подтвердить прерывание беременности? / Confirm abortion?")) {
            processEntityAbortion(getChatData()[getActiveEntityKey()], settings.language, logReproEvent, notify);
            saveSettingsDebounced();
            refreshUI();
            updatePrompt();
        }
    });

    $(document).off('click', '#repro-export-logs').on('click', '#repro-export-logs', function() {
        exportReproLogs({
            data: getChatData(),
            chatId: getCurrentChatId(),
            language: settings.language || 'ru',
            isNotificationsEnabled: settings.isNotificationsEnabled
        });
    });

    $(document).off('click', '#repro-apply-params').on('click', '#repro-apply-params', function() {
        const root = $(this).closest('#repro-content-wrapper');
        const data = getChatData();
        const entity = data[getActiveEntityKey()];
        
        entity.cycleLength = parseInt(root.find('#repro-input-cycle').val(), 10) || 28;
        entity.periodDuration = parseInt(root.find('#repro-input-period').val(), 10) || 5;
        
        const maxWeeksInput = root.find('#repro-input-maxweeks');
        if (maxWeeksInput.length) entity.maxPregnancyWeeks = parseInt(maxWeeksInput.val(), 10) || 40;
        
        const manualDateVal = root.find('#repro-input-rpdate').val();
        const normalized = normalizeInputDate(manualDateVal);
        if (normalized) {
            const manualDays = dateToDays(
                parseInt(normalized.split('-')[0], 10),
                parseInt(normalized.split('-')[1], 10) - 1,
                parseInt(normalized.split('-')[2], 10)
            );
            data.lastRpDate = normalized;
            logReproEvent(`[MANUAL DATE SET] User manually set date to ${normalized} (timestamp ${manualDays}).`);
        }

        if (entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception)) { 
            const weeks = parseInt(root.find('#repro-input-weeks').val(), 10) || 0;
            const days = parseInt(root.find('#repro-input-days').val(), 10) || 0;
            entity.pregnancyWeeks = weeks; 
            entity.pregnancyDays = Math.max(0, Math.min(6, days)); 
            entity.pregnancyDaysTotal = (weeks * 7) + entity.pregnancyDays;
        } else if (entity.postpartumDays === 0 && !entity.isNestActive) { 
            const dayInput = root.find('#repro-input-day');
            if (dayInput.length) entity.cycleDay = parseInt(dayInput.val(), 10) || 1; 
        }

        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
        notify(getText('toastSaved', settings.language), 'success');
    });

    $(document).off('click', '#repro-btn-manual-preg').on('click', '#repro-btn-manual-preg', function() {
        const root = $(this).closest('#repro-content-wrapper');
        const entity = getChatData()[getActiveEntityKey()];
        const lang = settings.language || 'ru';
        const weeks = parseInt(root.find('#repro-manual-weeks').val(), 10) || 0;
        const days = parseInt(root.find('#repro-manual-days').val(), 10) || 0;
        const count = parseInt(root.find('#repro-manual-count').val(), 10) || 1;

        if (entity.mode === 'oviposition') {
            entity.isPregnant = true;
            entity.isDiscovered = true;
            entity.pregnancyWeeks = weeks;
            entity.pregnancyDays = Math.max(0, Math.min(6, days));
            entity.pregnancyDaysTotal = (weeks * 7) + entity.pregnancyDays;
            entity.eggCount = Math.max(2, Math.min(7, count));
            entity.eggsLaid = 0;
            entity.laidEggs = [];
            entity.eggsHatched = 0;
            entity.isNestActive = false;
            entity.eggIncubationDays = 0;
            entity.eggIncubationTotal = 0;
            entity.postpartumDays = 0;
            entity.deliveryMethod = 'none';

            entity.eggShellDefects = [];
            entity.eggGenders = [];
            entity.eggDiseases = [];
            for (let i = 0; i < entity.eggCount; i++) {
                entity.eggShellDefects.push(Math.random() * 100 < 15 ? getRandomEggShellDefectId() : null);
                entity.eggGenders.push(generateBabyGender('realism', 'en'));
                entity.eggDiseases.push(entity.isFetalPathologyEnabled ? (Math.random() * 100 < 3 ? getRandomEggEmbryoDiseaseId() : null) : null);
            }
            notify(`${lang === 'en' ? 'Egg carrying started: ' : 'Вынашивание яиц установлено: '}${weeks}w ${days}d, ${entity.eggCount} eggs`, 'success');
        } else {
            entity.isPregnant = true; 
            entity.isDiscovered = true;
            entity.pregnancyWeeks = weeks; 
            entity.pregnancyDays = Math.max(0, Math.min(6, days)); 
            entity.pregnancyDaysTotal = (weeks * 7) + entity.pregnancyDays;
            entity.babiesCount = count; 
            entity.currentDeliveredCount = 0;
            entity.babiesGenders = Array.from({ length: count }, () => generateBabyGender(entity.mode, 'en'));
            entity.babiesDiseases = Array.from({ length: count }, () => null);
            entity.deliveryMethod = 'none';
            notify(`${getText('toastManualPreg', lang)}${weeks}w ${days}d`, 'success');
        }

        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
    });

    $(document).off('click', '#repro-reset-pregnancy-only').on('click', '#repro-reset-pregnancy-only', function() {
        const entity = getChatData()[getActiveEntityKey()];
        entity.isPregnant = false; 
        entity.isDiscovered = false;
        entity.pregnancyDaysTotal = 0;
        entity.pregnancyWeeks = 0;
        entity.pregnancyDays = 0;
        entity.babiesCount = 0;
        entity.babiesGenders = [];
        entity.babiesDiseases = [];
        entity.postpartumDays = 0;
        entity.eggCount = 0;
        entity.eggsLaid = 0;
        entity.laidEggs = [];
        entity.eggsHatched = 0;
        entity.isNestActive = false;
        entity.eggIncubationDays = 0;
        entity.eggIncubationTotal = 0;
        entity.eggShellDefects = [];
        entity.eggGenders = [];
        entity.eggDiseases = [];
        saveSettingsDebounced(); 
        refreshUI(); 
        updatePrompt(); 
    });

    $(document).off('click', '#repro-reset').on('click', '#repro-reset', function() {
        if (confirm("Полностью сбросить репродуктивные данные этого чата? / Reset all chat data?")) {
            const chatId = getCurrentChatId();
            settings.chatPregnancyData[chatId] = {
                targetMode: 'user',
                lastRpDate: null,
                activityLogs: [],
                user: createDefaultEntityState('user'),
                char: createDefaultEntityState('char')
            };
            saveSettingsDebounced(); 
            refreshUI(); 
            updatePrompt(); 
            notify(getText('toastResetAll', settings.language), 'warning');
        }
    });
}

function loadSettings() {
    if (!extension_settings[EXTENSION_NAME]) {
        extension_settings[EXTENSION_NAME] = Object.assign({}, DEFAULT_SETTINGS);
    }
    settings = extension_settings[EXTENSION_NAME];
    refreshUI();
    updatePrompt();
}

jQuery(async () => {
    bindGlobalEvents();
    loadSettings();

    if (typeof eventSource?.on === 'function') { 
        eventSource.on('i18n_language_changed', () => { refreshUI(); }); 
        eventSource.on(event_types.MESSAGE_SENT, async (i) => processIncomingMessage(i, true));
        eventSource.on(event_types.MESSAGE_RECEIVED, async (i) => processIncomingMessage(i, false));
        if (event_types.MESSAGE_EDITED) eventSource.on(event_types.MESSAGE_EDITED, async (i) => processIncomingMessage(i, false));
        if (event_types.MESSAGE_SWIPED) eventSource.on(event_types.MESSAGE_SWIPED, async (i) => processIncomingMessage(i, false));
        if (event_types.CHAT_CHANGED) {
            eventSource.on(event_types.CHAT_CHANGED, () => { 
                processedBirthMessages.clear();
                processedLayMessages.clear();
                processedHatchMessages.clear();
                lastProcessedMessageUid = null;
                pendingUserTimeskipDays = 0;
                loadSettings(); 
            });
        }
    }
});
