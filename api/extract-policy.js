
// api/extract-policy.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { schedulePolicyText, refundPolicyText } = req.body;

    const systemPrompt = `You are an expert aviation ticketing auditor. Analyze the provided airline text and extract guidelines into a structured JSON object. 
    If a rule cannot be determined, leave the field string empty (""), arrays empty ([]), or booleans as false, and append the exact field title string to the "undeterminedFields" array.
    Calculate an overall "aiConfidenceScore" between 0 and 100 based on documentation completeness.
    
    Return ONLY a raw JSON object matching this exact shape:
    {
        "airlineName": "",
        "airlineCode": "",
        "travelWindow": { "beforeDays": "", "afterDays": "" },
        "scheduleChange": { "thresholdMinutes": 0, "majorDefinition": "", "minorDefinition": "" },
        "classOfService": { "sameCabinRequired": true, "allowedBookingClasses": [] },
        "rebooking": { "atcAutomatedAllowed": true, "oalRebookingAllowed": false, "waiverCodeRequired": true, "waiverTextTemplate": "" },
        "refund": { "fullyEligible": true, "minimumDelayForRefundMinutes": 0, "restrictions": [] },
        "nameCorrectionRules": "",
        "notes": { "admRiskWarnings": "", "additionalRestrictions": "", "internalNotes": "" },
        "aiConfidenceScore": 0,
        "undeterminedFields": []
    }`;

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
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Schedule policy context text:\n${schedulePolicyText}\n\nRefund policy context text:\n${refundPolicyText}` }
                ]
            })
        });

        const apiData = await response.json();
        const extractedData = JSON.parse(apiData.choices[0].message.content);
        
        return res.status(200).json(extractedData);
    } catch (error) {
        return res.status(500).json({ error: 'Failed parsing textual configuration layout.' });
    }
}
