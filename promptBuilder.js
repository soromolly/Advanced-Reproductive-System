import { 
    getFetusData, 
    getPostpartumData, 
    getSymptomList, 
    getComplication, 
    getFetalDisease,
    getEggCarryingData,
    getEggPostLayData,
    getEggIncubationData,
    getEggSymptomList,
    getEggShellDefect,
    getEggEmbryoDisease
} from './symptoms.js';
import { 
    EGG_INCUBATION_DISPLAY_MAX, 
    EGG_INCUBATION_HATCHING_PROMPT_DAY 
} from './eggSystem.js';
import { translateGender } from './translations.js';
import { getEntityBodyPhase } from './entityController.js';

function getSystemAndPhysiologyLabels(entity, isEn) {
    const mode = entity.mode;
    const gender = entity.gender;

    if (mode === 'realism') {
        return {
            system: isEn ? 'Realism' : 'Реализм',
            physiology: gender === 'female' 
                ? (isEn ? 'Female' : 'Женщина')
                : (isEn ? 'Male' : 'Мужчина')
        };
    }
    if (mode === 'omegaverse') {
        let phys;
        if (gender === 'female_omega') phys = isEn ? 'Female Omega' : 'Женщина-Омега';
        else if (gender === 'male_omega') phys = isEn ? 'Male Omega' : 'Мужчина-Омега';
        else phys = isEn ? 'Unknown' : 'Неизвестно';
        return {
            system: isEn ? 'OmegaVerse' : 'ОмегаВерс',
            physiology: phys
        };
    }
    if (mode === 'oviposition') {
        return {
            system: isEn ? 'Oviposition' : 'Яйцекладка',
            physiology: gender === 'female' 
                ? (isEn ? 'Female' : 'Женщина')
                : (isEn ? 'Male' : 'Мужчина')
        };
    }
    return { system: mode, physiology: gender };
}

function buildFamilyBlock(entity, macroName) {
    if (!entity.childrenList?.length) return '';
    const kidsInfo = entity.childrenList.map((c, i) => {
        const gEn = translateGender(c.gender, 'en');
        const nameStr = (c.name && c.name.trim()) ? `Name: "${c.name.trim()}"` : 'Name: Unnamed';
        let diseaseStr = '';
        if (c.diseaseId) {
            const d = getEggEmbryoDisease(c.diseaseId, 'en') || getFetalDisease(c.diseaseId, 'en');
            if (d) diseaseStr = `, Condition: ${d.name}`;
        }
        return `• Child #${i + 1} (${gEn}, ${nameStr}${diseaseStr})`;
    }).join('\n');

    return `\n[FAMILY TREE & BORN CHILDREN OF ${macroName}]:
${macroName} has ${entity.childrenList.length} born child(ren):
${kidsInfo}
Direct Canon Instruction: Always remember these children in family interactions.\n`;
}

function buildEggEntityPrompt(entity, macroName, aiAwareness) {
    const labels = getSystemAndPhysiologyLabels(entity, true);

    let p = `\n[CRITICAL CANON DIRECTIVE — ${macroName} Physiological & Reproductive Status]\n`;
    p += `[ACTIVE SYSTEM: ${labels.system} | PHYSIOLOGY: ${labels.physiology} | TRACKING: ${macroName}]\n`;

    if (entity.isNestActive) {
        const incub = getEggIncubationData(entity.eggIncubationDays, 'en');
        p += `Status: CLUTCH INCUBATION (external nest) | Day ${entity.eggIncubationDays}/${EGG_INCUBATION_DISPLAY_MAX}\n`;
        p += `Stage: ${incub.name}. ${incub.desc}\n`;
        p += `Laid eggs: ${entity.eggsLaid}. Hatched so far: ${entity.eggsHatched || 0}. ${macroName} is highly protective of the nest and its partner, dislikes strangers near it.\n`;

        if (aiAwareness === 'full' && entity.laidEggs?.length > 0) {
            const known = entity.laidEggs.map((e, i) => {
                let diseaseStr = '';
                if (e.diseaseId) {
                    const d = getEggEmbryoDisease(e.diseaseId, 'en');
                    if (d) diseaseStr = ` (${d.name})`;
                }
                const hatchStr = e.hatched ? ' [hatched]' : '';
                return `#${i+1}: ${translateGender(e.gender, 'en')}${hatchStr}${diseaseStr}`;
            }).join('; ');
            p += `[OMNISCIENCE] Known contents: ${known}.\n`;
        } else if (aiAwareness === 'dynamic') {
            if (entity.laidEggs?.length > 0) {
                // Осмотр яиц: показываем только те патологии, что видны при осмотре (НЕ postnatal).
                const lines = entity.laidEggs.map((e, i) => {
                    const genderStr = translateGender(e.gender, 'en');
                    let diseaseStr = '';
                    if (e.diseaseId) {
                        const d = getEggEmbryoDisease(e.diseaseId, 'en');
                        if (d && d.type !== 'postnatal') {
                            diseaseStr = ` — condition: ${d.name}`;
                        } else if (d && d.type === 'postnatal') {
                            diseaseStr = ` — [postnatal condition, hidden until hatching]`;
                        }
                    }
                    let defectStr = '';
                    if (e.shellDefect) {
                        const sd = getEggShellDefect(e.shellDefect, 'en');
                        if (sd) defectStr = ` [shell: ${sd.name}]`;
                    }
                    const hatchStr = e.hatched ? ' [ALREADY HATCHED]' : '';
                    return `Egg #${i+1}: ${genderStr}${diseaseStr}${defectStr}${hatchStr}`;
                }).join('\n');
                p += `[POST-LAY EXAMINATION] Inspected eggs:\n${lines}\n`;
            }
        } else {
            p += `[SECRET DATA] Count of laid eggs (${entity.eggsLaid}) is physically visible. Egg genders and pathologies remain hidden until hatching. Hatched so far: ${entity.eggsHatched || 0}.\n`;
        }

        const remaining = (entity.laidEggs || []).filter(e => !e.hatched).length;
        if (entity.eggIncubationDays >= EGG_INCUBATION_HATCHING_PROMPT_DAY && remaining > 0) {
            const tagSuffix = entity.key.toUpperCase();
            p += `\n🚨 CRITICAL HATCHING TAG DIRECTIVE FOR ${macroName}:
Incubation is advanced (Day ${entity.eggIncubationDays}/${EGG_INCUBATION_DISPLAY_MAX}). Unhatched eggs remaining: ${remaining}.
Hatching may begin ANY DAY now — the exact timing depends on the warmth of the nest and the narrative pace.

🚫 STRICT RULES:
- Hatch AT MOST 2–3 eggs per response. NEVER the whole clutch at once.
- Hatchings should feel progressive — over hours or even days, not instant.
- Describe each egg individually (shell cracking, membrane tearing, the hatchling emerging, wet and disoriented).

✅ TAG FORMAT — append ONE tag per hatched egg, numbered sequentially WITHIN THIS RESPONSE (starting from 1):
  <!--HATCH_EGG_${tagSuffix}_1-->
  <!--HATCH_EGG_${tagSuffix}_2-->
  <!--HATCH_EGG_${tagSuffix}_3-->

Example (2 eggs hatching now): <!--HATCH_EGG_${tagSuffix}_1--><!--HATCH_EGG_${tagSuffix}_2-->
If no hatching occurs this response — just don't add any tags.
`;
        }

        p += buildFamilyBlock(entity, macroName);
        return p;
    }

    if (entity.postpartumDays > 0) {
        const pl = getEggPostLayData(entity.postpartumDays, 'en');
        p += `Status: POST-LAY RECOVERY (Day ${entity.postpartumDays}/7)\n`;
        p += `Physical Condition: ${pl.desc}\n`;
        p += `Character is weak, needs warmth, food, and closeness to partner. Strong attachment to laid eggs.\n`;
        p += `Laid eggs: ${entity.eggsLaid}.\n`;

        p += buildFamilyBlock(entity, macroName);
        return p;
    }

    const isRevealed = entity.isDiscovered || !entity.isSecretConception;

    if (entity.isPregnant && isRevealed) {
        const carrying = getEggCarryingData(entity.pregnancyDaysTotal, 'en');

        const revealCount = (aiAwareness === 'full') 
            || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 3);

        let statusLine = `Status: EGG CARRYING | Duration: ${entity.pregnancyWeeks} weeks ${entity.pregnancyDays} days.`;
        if (revealCount) {
            statusLine += ` | Eggs laid so far: ${entity.eggsLaid}/${entity.eggCount}.`;
        }
        p += statusLine + '\n';

        p += `Physical state: ${carrying.belly}. ${carrying.desc}\n`;

        const symptoms = getEggSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
        if (symptoms.length > 0) p += `Current Symptoms: ${symptoms.join(', ')}.\n`;

        if (aiAwareness === 'full') {
            p += `[OMNISCIENCE] Egg count: ${entity.eggCount}. Genders: ${entity.eggGenders.map(g => translateGender(g, 'en')).join(', ')}.\n`;
            const defects = (entity.eggShellDefects || []).map((id, i) => id ? `Egg #${i+1}: ${getEggShellDefect(id, 'en')?.name}` : null).filter(Boolean);
            if (defects.length > 0) p += `Shell findings: ${defects.join('; ')}.\n`;
        } else if (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 3) {
            p += `[ULTRASOUND] Scan reveals egg count: ${entity.eggCount}.\n`;
            const defects = (entity.eggShellDefects || []).map((id, i) => id ? `Egg #${i+1}: ${getEggShellDefect(id, 'en')?.name}` : null).filter(Boolean);
            if (defects.length > 0) {
                p += `Shell findings: ${defects.join('; ')}.\n`;
            } else {
                p += `No shell defects detected.\n`;
            }
            p += `Note: Egg sexes and internal pathologies are not visible on ultrasound — they will be determined only after laying.\n`;
        } else if (aiAwareness === 'hidden') {
            p += `[SECRET DATA] Egg count, sexes, and pathologies are hidden until laying. Only symptoms and belly size are observable.\n`;
        }

        const remainingEggs = entity.eggCount - entity.eggsLaid;
        if (entity.pregnancyDaysTotal >= 30 && remainingEggs > 0) {
            const tagSuffix = entity.key.toUpperCase();

            if (revealCount) {
                const startNum = entity.eggsLaid + 1;
                const endNum = entity.eggCount;
                const exampleEnd = Math.min(startNum + 1, endNum);
                let exampleTags = '';
                for (let i = startNum; i <= exampleEnd; i++) {
                    exampleTags += `<!--LAY_EGG_${tagSuffix}_${i}-->`;
                }

                p += `\n🚨 CRITICAL LAYING TAG DIRECTIVE FOR ${macroName}:
${macroName} is carrying ${entity.eggCount} egg(s); already laid: ${entity.eggsLaid}. Remaining: ${remainingEggs}.
When laying occurs in this response, append ONE tag PER EGG laid, in order, at the very end of the response. Do NOT lay all eggs at once unless the narrative explicitly requires it — each contraction/push typically delivers exactly ONE egg.
Tag format (use the correct sequential number for each egg):
  • 1st egg laid this scene: <!--LAY_EGG_${tagSuffix}_${startNum}-->
  • 2nd egg laid this scene: <!--LAY_EGG_${tagSuffix}_${startNum + 1}-->
  • ...and so on up to <!--LAY_EGG_${tagSuffix}_${endNum}-->
Example (if laying ${exampleEnd - startNum + 1} egg(s) in one response): ${exampleTags}
`;
            } else {
                p += `\n🚨 CRITICAL LAYING TAG DIRECTIVE FOR ${macroName}:
When laying occurs in this response, append ONE tag PER EGG laid, at the very end of the response.
Use this exact format for each egg, incrementing N starting from 1: <!--LAY_EGG_${tagSuffix}_N-->
Example (2 eggs in one response): <!--LAY_EGG_${tagSuffix}_1--><!--LAY_EGG_${tagSuffix}_2-->
Do NOT lay all eggs at once unless the narrative explicitly requires it — each contraction/push typically delivers exactly ONE egg.
Do NOT state or assume a specific total egg count — it remains unknown to everyone until laying.
`;
            }
        }

        if (entity.pregnancyDaysTotal >= 42) {
            p += `\n⏰ ${macroName} has reached the full term (42 days). Laying is biologically due — narrate it soon.\n`;
        }

        p += buildFamilyBlock(entity, macroName);
        return p;
    }

    const baseCycle = entity.cycleLength || 28;
    const target = entity.currentCycleTargetLength || baseCycle;
    const periodDays = entity.periodDuration || 5;

    if (entity.cycleDay <= periodDays) {
        p += `Current Status: HEAT / FERTILITY WINDOW ACTIVE (Day ${entity.cycleDay} of ${periodDays}) | Peak conception window.\n`;
    } else if (entity.cycleDay > target) {
        p += `Current Status: CYCLE DELAY (Late by ${entity.cycleDay - target} days). Menstruation/Heat has not arrived yet.\n`;
        p += `Note: Pregnancy/carrying has NOT been verified or confirmed. No visible signs of gravidity.\n`;
    } else {
        p += `Current Status: QUIESCENCE / REST PERIOD (Day ${entity.cycleDay}/${baseCycle}). Not fertile.\n`;
    }

    if (entity.contraception !== 'none') p += `Active Contraception: ${entity.contraception.toUpperCase()}.\n`;

    const isEggPhase = (entity.symptomPhaseKey || '').startsWith('egg_');
    const symptoms = isEggPhase
        ? getEggSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en')
        : getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
    if (symptoms.length > 0) p += `Current Physiological Symptoms: ${symptoms.join(', ')}.\n`;

    p += buildFamilyBlock(entity, macroName);
    return p;
}

function buildSingleEntityPrompt(entity, macroName, aiAwareness) {
    if (entity.mode === 'oviposition') {
        return buildEggEntityPrompt(entity, macroName, aiAwareness);
    }

    const labels = getSystemAndPhysiologyLabels(entity, true);

    let p = `\n[CRITICAL CANON DIRECTIVE — ${macroName} Physiological & Reproductive Status]\n`;
    p += `[ACTIVE SYSTEM: ${labels.system} | PHYSIOLOGY: ${labels.physiology} | TRACKING: ${macroName}]\n`;

    if (entity.postpartumDays > 0) {
        const pData = getPostpartumData(entity.postpartumDays, entity.deliveryMethod, 'en');
        const maxRecDays = (entity.deliveryMethod === 'miscarriage') ? 14 : 40;
        p += `Status: RECOVERY PHASE (Day ${entity.postpartumDays}/${maxRecDays}) | Event Outcome: ${entity.deliveryMethod.toUpperCase()}\n`;
        p += `Physical Condition & Limitations: ${pData.desc}\n`;
    } else {
        const isRevealedPregnancy = entity.isPregnant && (entity.isDiscovered || !entity.isSecretConception);

        if (isRevealedPregnancy) {
            p += `Status: PREGNANT (Obstetric Term) | Duration: ${entity.pregnancyWeeks} weeks ${entity.pregnancyDays} days.\n`;
            const fetus = getFetusData(entity.pregnancyWeeks, 'en');
            p += `Fetus Size: ${fetus.size} | Maternal Body: ${fetus.belly}. ${fetus.desc}\n`;
            
            const symptomsEn = getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
            if (symptomsEn.length > 0) {
                p += `Current Pregnancy Symptoms: ${symptomsEn.join(', ')}.\n`;
            }

            if (entity.activeComplication && entity.activeComplication.isDiscovered) {
                const compEn = getComplication(entity.activeComplication.id, 'en');
                if (compEn) {
                    p += `[ACTIVE MEDICAL COMPLICATION]: ${macroName} is experiencing "${compEn.name}". Symptoms: ${compEn.desc}.\n`;
                }
            }

            if (entity.fetalDemise && entity.fetalDemise.isDead) {
                const dDays = entity.fetalDemise.daysSinceDemise;
                let stageDesc = dDays <= 14 
                    ? `Stage 1 (Silent phase, Day ${dDays}/14): Non-developing pregnancy, sudden drop in symptoms.`
                    : (dDays <= 21 ? `Stage 2 (Expulsion onset, Day ${dDays}/21): Spontaneous spotting, cramping.` : `Stage 3: Active expulsion.`);
                if (entity.fetalDemise.hasInfection) stageDesc += ` [CRITICAL INFECTION PROCESS DETECTED]`;

                p += `\n[SECRET MEDICAL EVENT — MISSED MISCARRIAGE]:
- Secret Status for ${macroName}: ${stageDesc}
- Roleplay subtle symptoms. IF medical check/scan occurs, confirm non-viable pregnancy.
- IF abortion/D&C performed on ${macroName}, append hidden tag: <!--ABORTION_${entity.key.toUpperCase()}-->\n`;
            }

            let revealCount = (aiAwareness === 'full') || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 12);
            let revealGenders = (aiAwareness === 'full') || (aiAwareness === 'dynamic' && entity.pregnancyWeeks >= 20);

            if (revealCount) {
                p += entity.babiesCount === 1 
                    ? `[ULTRASOUND SCAN]: Medical scans confirm ${macroName} is carrying EXACTLY 1 BABY (SINGLETON).\n`
                    : `[ULTRASOUND SCAN]: Medical scans confirm ${macroName} is carrying ${entity.babiesCount} BABIES.\n`;
            }

            if (aiAwareness === 'hidden') {
                p += `[SECRET DATA]: Headcount and features of ${macroName}'s babies hidden until labor.\n`;
            } else {
                if (entity.babiesDiseases?.length > 0) {
                    entity.babiesDiseases.forEach((dId, idx) => {
                        const gEn = revealGenders ? translateGender(entity.babiesGenders[idx], 'en') : 'Unknown Sex';
                        if (dId) {
                            const d = getFetalDisease(dId, 'en');
                            const isDiscovered = (aiAwareness === 'full') || (entity.pregnancyWeeks >= (d.discoveryWeek || 20));
                            if (isDiscovered && d.type === 'prenatal') {
                                p += `[MEDICAL DIAGNOSIS - ${macroName} FETUS #${idx + 1} (${gEn})]: "${d.name}" (${d.desc})\n`;
                            }
                        }
                    });
                }

                if (revealGenders) {
                    p += `[ANATOMY SCAN]: ${macroName}'s baby sex(es): ${entity.babiesGenders.map(g => translateGender(g, 'en')).join(', ')}.\n`;
                }
            }

            if (entity.pregnancyWeeks >= 20) {
                const nextNum = (entity.currentDeliveredCount || 0) + 1;
                const tagSuffix = entity.key.toUpperCase();
                p += `\n🚨 CRITICAL BIRTH TAG DIRECTIVE FOR ${macroName}:
If ${macroName} gives birth in this response, append tag at the very end:
- Natural birth: <!--BIRTH_NATURAL_${tagSuffix}_${nextNum}--> (or <!--BIRTH_NATURAL_${tagSuffix}-->)
- C-Section: <!--BIRTH_C_SECTION_${tagSuffix}_${nextNum}--> (or <!--BIRTH_C_SECTION_${tagSuffix}-->)
One tag per baby, sequentially.
`;
            }
        } else {
            const baseCycle = entity.cycleLength || 28;
            const target = entity.currentCycleTargetLength || baseCycle;
            const periodDays = entity.periodDuration || 5;
            const ovulPeak = Math.max(periodDays + 2, target - 14);
            const ovulStart = Math.max(periodDays + 1, ovulPeak - 3);
            const ovulEnd = ovulPeak + 1;

            if (entity.mode === 'realism') {
                if (entity.cycleDay <= periodDays) {
                    p += `Current Status: MENSTRUATION / NATURAL PERIOD ACTIVE (Day ${entity.cycleDay} of ${periodDays}) | Cycle Duration: ${baseCycle} days.
🛑 ABSOLUTE CANON FACT: ${macroName} is 100% NOT PREGNANT. Conception failed/did not happen. 
⚠️ STRICT FORBIDDEN ACTIONS FOR {{char}}:
- DO NOT roleplay pregnancy, missed periods, late periods, toxicosis, morning sickness, or sudden realization of being pregnant.
- ${macroName} is actively experiencing her normal monthly menstrual bleeding right now. Treat all physical sensations (cramps, breast tenderness) strictly as menstrual symptoms, NOT pregnancy.\n`;
                } else if (entity.cycleDay > target) {
                    p += `Current Status: MENSTRUAL CYCLE DELAY (Late by ${entity.cycleDay - target} days). Menstruation has not arrived yet.
Note: Pregnancy has NOT been verified or confirmed yet.\n`;
                } else if (entity.cycleDay < ovulStart) {
                    p += `Current Status: FOLLICULAR PHASE (Cycle Day ${entity.cycleDay}/${baseCycle}). Not pregnant.\n`;
                } else if (entity.cycleDay >= ovulStart && entity.cycleDay <= ovulEnd) {
                    p += `Current Status: OVULATION WINDOW / FERTILE CONCEPTION PEAK (Cycle Day ${entity.cycleDay}/${baseCycle}).\n`;
                } else {
                    p += `Current Status: LUTEAL PHASE / PMS (Cycle Day ${entity.cycleDay}/${baseCycle}). Not pregnant.\n`;
                }
            } else {
                if (entity.cycleDay <= periodDays) {
                    p += `Current Status: IN HEAT (Day ${entity.cycleDay}/${periodDays}) | Peak Fertility Window.\n`;
                } else if (entity.cycleDay > target) {
                    p += `Current Status: HEAT DELAYED (Late by ${entity.cycleDay - target} days).\n`;
                } else {
                    p += `Current Status: QUIESCENCE / REST PHASE (Day ${entity.cycleDay}/${baseCycle}). Not pregnant.\n`;
                }
            }

            if (entity.contraception !== 'none') {
                p += `Active Contraception: ${entity.contraception.toUpperCase()}.\n`;
            }
            const symptomsEn = getSymptomList(entity.symptomPhaseKey, entity.symptomIndices, 'en');
            if (symptomsEn.length > 0) p += `Current Physiological Symptoms: ${symptomsEn.join(', ')}.\n`;
        }
    }

    if (entity.childrenList?.length > 0) {
        const kidsInfo = entity.childrenList.map((c, i) => {
            const gEn = translateGender(c.gender, 'en');
            const nameStr = (c.name && c.name.trim()) ? `Name: "${c.name.trim()}"` : 'Name: Unnamed';
            let diseaseStr = '';
            if (c.diseaseId) {
                const d = getFetalDisease(c.diseaseId, 'en');
                if (d) diseaseStr = `, Congenital Condition: ${d.name}`;
            }
            return `• Child #${i + 1} (${gEn}, ${nameStr}${diseaseStr})`;
        }).join('\n');

        p += `\n[FAMILY TREE & BORN CHILDREN OF ${macroName}]:
${macroName} has ${entity.childrenList.length} born child(ren) in the family:
${kidsInfo}
Direct Canon Instruction: Always remember and acknowledge these existing children in family interactions, daily life, dialogue, and roleplay context.\n`;
    }

    return p;
}

export function buildMultiEntityPrompt({ targetMode, userEntity, charEntity, aiAwareness }) {
    let fullPrompt = '';

    if (targetMode === 'user' || targetMode === 'both') {
        fullPrompt += buildSingleEntityPrompt(userEntity, '{{user}}', aiAwareness);
    }
    if (targetMode === 'char' || targetMode === 'both') {
        fullPrompt += buildSingleEntityPrompt(charEntity, '{{char}}', aiAwareness);
    }

    fullPrompt += `\n🚨 EJACULATION / CLIMAX LOGGING DIRECTIVE FOR {{char}}:
At the absolute end of the response, append exactly one tag IF climax occurred inside someone:
- Inside {{user}} vagina: <!--CUM_VAGINAL_USER--> | anus: <!--CUM_ANAL_USER-->
- Inside {{char}} vagina: <!--CUM_VAGINAL_CHAR--> | anus: <!--CUM_ANAL_CHAR-->\n`;

    return fullPrompt;
}
