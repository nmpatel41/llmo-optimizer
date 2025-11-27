import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateLLMORecommendations, LLMInput } from "@/lib/llm"

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await params

    try {
        // 1. Fetch Page & Raw Data
        const page = await prisma.page.findUnique({
            where: { id: id },
            include: {
                project: true,
                rawData: true,
            },
        })

        if (!page || !page.rawData) {
            return new NextResponse("Page or Raw Data not found", { status: 404 })
        }

        if (page.project.userId !== session.user.id) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        // 2. Construct Input
        const input: LLMInput = {
            project: {
                business_name: page.project.businessName || "",
                business_category: page.project.businessCategory || "",
                primary_location: page.project.primaryLocation || "",
                target_language: page.project.targetLanguage,
            },
            page: {
                url: page.url,
                page_type: page.pageType,
                status_code: page.statusCode || 200,
            },
            raw: {
                title: page.rawData.title || "",
                meta_description: page.rawData.metaDesc || "",
                canonical_url: page.rawData.canonicalUrl || "",
                language_attr: page.rawData.languageAttr || "",
                h1: page.rawData.h1 || "",
                headings: JSON.parse(page.rawData.headings || "[]"),
                clean_text_first_200_words: page.rawData.cleanTextShort || "",
                clean_text_full: page.rawData.cleanTextFull || "",
                faq_blocks: JSON.parse(page.rawData.faqBlocks || "[]"),
                schema_json_ld_raw: page.rawData.schemaJsonLd || "",
                robots_meta: page.rawData.robotsMeta || "",
                internal_links: JSON.parse(page.rawData.internalLinks || "[]"),
                outbound_links: JSON.parse(page.rawData.outboundLinks || "[]"),
                detected_dates: JSON.parse(page.rawData.detectedDates || "[]"),
            },
        }

        // 3. Call LLM
        const recommendations = await generateLLMORecommendations(input)

        // 4. Save Recommendations
        await prisma.pageLLMORecommendation.upsert({
            where: {
                pageId: page.id,
            },
            update: {
                llmoScore: recommendations.llmo_score,
                llmoSummary: recommendations.llmo_summary,
                recommendedSeo: JSON.stringify(recommendations.recommended_seo),
                heroSectionHtml: recommendations.hero_section_html,
                bodySectionsHtml: JSON.stringify(recommendations.body_sections_html),
                faqHtml: recommendations.faq_html,
                jsonLdSchema: recommendations.json_ld_schema,
                robotsTxtSuggestion: recommendations.robots_txt_suggestion,
                internalLinkSuggestions: JSON.stringify(recommendations.internal_link_suggestions),
                checklistItems: JSON.stringify(recommendations.checklist_items),
                modelName: "gpt-4-turbo-preview",
            },
            create: {
                pageId: page.id,
                llmoScore: recommendations.llmo_score,
                llmoSummary: recommendations.llmo_summary,
                recommendedSeo: JSON.stringify(recommendations.recommended_seo),
                heroSectionHtml: recommendations.hero_section_html,
                bodySectionsHtml: JSON.stringify(recommendations.body_sections_html),
                faqHtml: recommendations.faq_html,
                jsonLdSchema: recommendations.json_ld_schema,
                robotsTxtSuggestion: recommendations.robots_txt_suggestion,
                internalLinkSuggestions: JSON.stringify(recommendations.internal_link_suggestions),
                checklistItems: JSON.stringify(recommendations.checklist_items),
                modelName: "gpt-4-turbo-preview",
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[OPTIMIZE_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
