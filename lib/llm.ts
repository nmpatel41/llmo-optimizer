import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface LLMInput {
    project: {
        business_name: string
        business_category: string
        primary_location: string
        target_language: string
    }
    page: {
        url: string
        page_type: string
        status_code: number
    }
    raw: {
        title: string
        meta_description: string
        canonical_url: string
        language_attr: string
        h1: string
        headings: string[]
        clean_text_first_200_words: string
        clean_text_full: string
        faq_blocks: any[]
        schema_json_ld_raw: string
        robots_meta: string
        internal_links: any[]
        outbound_links: any[]
        detected_dates: string[]
    }
}

export interface LLMOutput {
    llmo_score: number
    llmo_summary: string
    recommended_seo: {
        title: string
        meta_description: string
        h1: string
    }
    hero_section_html: string
    body_sections_html: string[]
    faq_html: string
    json_ld_schema: string
    robots_txt_suggestion: string
    internal_link_suggestions: { anchor: string; href: string }[]
    checklist_items: { label: string; status: "pass" | "warn" | "fail"; explanation: string }[]
}

export async function generateLLMORecommendations(input: LLMInput): Promise<LLMOutput> {
    const systemPrompt = `You are an LLM Citation Expert helping businesses rank #1 in ChatGPT/Claude/Perplexity.

SCORING (0-100):
- Authority (30pts): Clear leader vs unknown
- Completeness (25pts): Answers ALL questions vs partial  
- Structure (20pts): Perfect H2/H3 vs messy
- Specificity (15pts): Exact claims vs vague
- FAQ+Schema (10pts): Comprehensive vs none

CRITICAL: Most pages 15-40. Only cite-worthy pages 80-95.

RETURN THIS EXACT JSON:
{
  "llmo_score": number,
  "llmo_summary": "explanation",
  "recommended_seo": {"title": "text", "meta_description": "text", "h1": "text"},
  "hero_section_html": "<section>actual HTML</section>",
  "body_sections_html": ["<section>HTML</section>"],
  "faq_html": "<section><h2>FAQ</h2><h3>Q?</h3><p>A</p></section>",
  "json_ld_schema": "valid JSON-LD",
  "robots_txt_suggestion": "text",
  "internal_link_suggestions": [{"anchor": "text", "href": "/path"}],
  "checklist_items": [{"label": "issue", "status": "fail", "explanation": "why"}]
}

Generate REAL content, not placeholders!`

    const userPrompt = `Business: ${input.project.business_name}
Category: ${input.project.business_category}
Location: ${input.project.primary_location}

Current: ${input.raw.title} | ${input.raw.clean_text_first_200_words}

Score strictly. Generate complete HTML sections.`

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
        })

        const content = completion.choices[0].message.content
        if (!content) throw new Error("No LLM response")

        console.log("=== LLM ===")
        console.log(content.substring(0, 500))

        const parsed = JSON.parse(content)

        // Handle both llmo_score and total_score
        const score = parsed.llmo_score || parsed.total_score || 50

        const output: LLMOutput = {
            llmo_score: score,
            llmo_summary: parsed.llmo_summary || parsed.final_assessment || "Analysis complete",
            recommended_seo: parsed.recommended_seo || {
                title: `${input.project.business_name} - ${input.project.business_category}`,
                meta_description: `Professional ${input.project.business_category} services`,
                h1: input.project.business_name
            },
            hero_section_html: parsed.hero_section_html || `<section><h2>${input.project.business_name}</h2><p>Professional services.</p></section>`,
            body_sections_html: parsed.body_sections_html || [`<section><h2>Services</h2><p>Details here.</p></section>`],
            faq_html: parsed.faq_html || `<section><h2>FAQ</h2><h3>Question?</h3><p>Answer.</p></section>`,
            json_ld_schema: parsed.json_ld_schema || JSON.stringify({ "@context": "https://schema.org", "@type": "LocalBusiness", "name": input.project.business_name }),
            robots_txt_suggestion: parsed.robots_txt_suggestion || "",
            internal_link_suggestions: parsed.internal_link_suggestions || [],
            checklist_items: parsed.checklist_items || [
                { label: "Add specific claims", status: "fail", explanation: "Include numbers, dates, proof" },
                { label: "Create FAQ section", status: "fail", explanation: "Answer common questions" }
            ]
        }

        console.log(`Score: ${output.llmo_score}`)
        return output
    } catch (error) {
        console.error("LLM Error:", error)
        throw error
    }
}
