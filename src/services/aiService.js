const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const generateResponse = async (message, tasks = []) => {
    if (!message || !message.trim()) {
        throw new Error("Message is required");
    }

    const taskContext = tasks.length > 0
        ? tasks.map(task => `
Task: ${task.title}
Description: ${task.description || "No description"}
Priority: ${task.priority}
Status: ${task.status}
Due Date: ${task.due_date || "No due date"}
`).join("\n")
        : "The user currently has no tasks.";

    const completion = await groq.chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",

        messages: [
            {
                role: "system",
                content: `
You are CampusOS AI, an intelligent college productivity assistant.

You have access to the student's current tasks.

Use the task information to give personalized and practical answers.

You can help with:
- Study planning
- Task prioritization
- Time management
- Assignment planning
- Exam preparation
- Programming and technical questions
- College productivity

Important rules:
- Prioritize HIGH priority tasks.
- Consider due dates when recommending what to do first.
- Do not invent tasks that are not provided.
- If the user asks something unrelated to their tasks, answer normally.
- Keep responses clear and useful.
- Use bullet points when helpful.
`
            },
            {
                role: "user",
                content: `
Student's current tasks:

${taskContext}

Student's question:

${message}
`
            }
        ],

        temperature: 0.7,
        max_tokens: 800
    });

    return completion.choices[0].message.content;
};

module.exports = {
    generateResponse
};