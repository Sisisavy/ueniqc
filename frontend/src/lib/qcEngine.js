import OpenAI from "openai";

// initializing the brain with your environment variable
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

/**
 * runs a quality control review on a single ticket
 * @param {Object} ticket - the ticket object from your database
 * @param {Array} guidelines - the list of active qc guidelines
 */
export async function runQCReview(ticket, guidelines) {
  // 1. prepare the rubric for the ai
  const guidelinesprompt = guidelines.map(g => 
    `- ${g.name} (weight: ${g.weight}/10): ${g.description}`
  ).join("\n");

  // 2. build the prompt
  // replace [your product name] with your actual product name below
  const prompt = `
    you are an expert quality control auditor for UENI.
    your goal is to evaluate customer support interactions for accuracy, tone, and adherence to company standards.
    
    ### your internal knowledge:
    use your existing training data regarding UENI's features, common troubleshooting steps, and brand voice to verify the agent's technical accuracy.

    ### qc guidelines (the rubric):
    ${guidelinesprompt}

    ### ticket data to evaluate:
    subject: ${ticket.subject}
    content: ${ticket.content}

    ### instructions:
    1. analyze the ticket against each guideline.
    2. provide an overall score from 0 to 100.
    3. determine status: "passed" (70 or above) or "failed" (below 70).
    4. write a concise summary explaining the result.

    return strictly a json object with this exact structure:
    {
      "overall_score": 85,
      "status": "passed",
      "summary": "the agent provided correct technical steps for the login issue but forgot to mention the password reset link.",
      "criteria_breakdown": {
        "technical accuracy": "pass",
        "tone": "pass"
      }
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // using the latest model for better reasoning
      messages: [
        { 
          role: "system", 
          content: "you are a helpful qc auditor that output only valid json." 
        },
        { 
          role: "user", 
          content: prompt 
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.2, // kept low for consistent grading
    });

    // parsing the ai response
    const result = JSON.parse(response.choices[0].message.content);
    return result;

  } catch (error) {
    console.error("qc engine error:", error);
    
    // fallback if openai fails or returns bad data
    return {
      overall_score: 0,
      status: "failed",
      summary: "error: the ai review could not be completed at this time.",
      criteria_breakdown: {}
    };
  }
}