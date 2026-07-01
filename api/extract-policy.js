// api/extract-policy.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { schedulePolicyText, refundPolicyText } = req.body;

    // Combined context profile for deep AI processing
    const comprehensiveTextContext = `
    SCHEDULE CHANGE CONTRACT RULES:
    ${schedulePolicyText || 'None provided'}

    REFUND PROTOCOL CONTRACT RULES:
    ${refundPolicyText || 'None provided'}
    `;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                response_format: { type: "json_object" },
                messages: [
                    {
                        role: 'system',
                        content: `You are an elite international airline ticketing auditor. Analyze the provided policy documents and extract all parameters into a strict JSON payload matrix wrapper. 
                        
                        CRITICAL SAFETY CONSTRAINT: If a parameter is not explicitly found, mentioned, or if there is insufficient evidence in the text, you MUST populate its field value with the string "Needs Review". Do not leave strings empty, do not guess, and do not invent data.

                        Your response must be a single raw JSON object matching this exact structural interface scheme shape:
                        {
                            "airlineName": "String or 'Needs Review'",
                            "airlineCode": "2-letter IATA string or 'ZZ'",
                            "country": "String or 'Needs Review'",
                            "alliance": "SkyTeam/Star Alliance/Oneworld or 'Needs Review'",
                            "scheduleChange": {
                                "thresholdMinutes": "Integer value string or 'Needs Review'",
                                "majorDefinition": "Detailed text or 'Needs Review'",
                                "minorDefinition": "Detailed text or 'Needs Review'",
                                "cancellationRules": "Text summary or 'Needs Review'",
                                "reprotectedRules": "Text summary or 'Needs Review'",
                                "noChangeRules": "Text summary or 'Needs Review'",
                                "flightNumChanges": "Text details or 'Needs Review'",
                                "equipmentChanges": "Text details or 'Needs Review'",
                                "mctRules": "Text details or 'Needs Review'",
                                "sameDayRules": "Text details or 'Needs Review'",
                                "dateChangeRules": "Text details or 'Needs Review'",
                                "timeChangeRules": "Text details or 'Needs Review'"
                            },
                            "travelWindow": {
                                "beforeDays": "String integer number or 'Needs Review'",
                                "afterDays": "String integer number or 'Needs Review'",
                                "validTravelPeriod": "Text window constraint details or 'Needs Review'"
                            },
                            "rebooking": {
                                "atcAutomatedAllowed": true/false,
                                "oalRebookingAllowed": true/false,
                                "waiverCodeRequired": true/false,
                                "waiverTextTemplate": "Text or 'Needs Review'"
                            },
                            "refund": {
                                "fullyEligible": true/false,
                                "involuntaryRefund": "Text or 'Needs Review'",
                                "voluntaryRefund": "Text or 'Needs Review'",
                                "medicalRefund": "Text or 'Needs Review'",
                                "skchgRefund": "Text or 'Needs Review'",
                                "refundableFare": "Text or 'Needs Review'",
                                "refundableTaxes": "Text or 'Needs Review'",
                                "penalties": "Text or 'Needs Review'",
                                "serviceFees": "Text or 'Needs Review'",
                                "requiredDocumentsRefund": "Text tracking criteria or 'Needs Review'"
                            },
                            "namePolicy": {
                                "nameCorrection": "Text or 'Needs Review'",
                                "nameChange": "Text or 'Needs Review'",
                                "marriage": "Text or 'Needs Review'",
                                "divorce": "Text or 'Needs Review'",
                                "passportUpdate": "Text or 'Needs Review'"
                            },
                            "baggage": {
                                "carryOn": "Text or 'Needs Review'",
                                "checkedBaggage": "Text or 'Needs Review'",
                                "extraBaggage": "Text or 'Needs Review'",
                                "sportingEquipment": "Text or 'Needs Review'"
                            },
                            "medical": {
                                "medicalWaiver": "Text or 'Needs Review'",
                                "requiredDocuments": "Text or 'Needs Review'"
                            },
                            "notes": {
                                "admRiskWarnings": "Text or 'Needs Review'",
                                "additionalRestrictions": "Text or 'Needs Review'",
                                "internalNotes": "Text or 'Needs Review'"
                            },
                            "aiConfidenceScore": 85,
                            "undeterminedFields": ["Array of string field labels that are flagged as 'Needs Review'"]
                        }`
                    },
                    { role: 'user', content: comprehensiveTextContext }
                ]
            })
        });

        const apiResponsePayload = await response.json();
        const processedPayloadMatrix = JSON.parse(apiResponsePayload.choices[0].message.content);
        return res.status(200).json(processedPayloadMatrix);
    } catch (err) {
        return res.status(500).json({ error: "AI Parsing execution runtime context failed." });
    }
}
