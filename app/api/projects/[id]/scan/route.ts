import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { extractPageData } from "@/lib/crawler"

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
        const body = await req.json()
        const { url } = body

        // Verify project ownership
        const project = await prisma.project.findUnique({
            where: {
                id: id,
                userId: session.user.id,
            },
        })

        if (!project) {
            return new NextResponse("Project not found", { status: 404 })
        }

        const targetUrl = url || project.rootUrl

        // 1. Create or Update Page
        const page = await prisma.page.upsert({
            where: {
                projectId_url: {
                    projectId: project.id,
                    url: targetUrl,
                },
            },
            update: {
                lastCrawledAt: new Date(),
            },
            create: {
                projectId: project.id,
                url: targetUrl,
                pageType: targetUrl === project.rootUrl ? "homepage" : "other",
                lastCrawledAt: new Date(),
            },
        })

        // 2. Extract Data
        const data = await extractPageData(targetUrl)

        // 3. Save Raw Data
        await prisma.pageRawData.upsert({
            where: {
                pageId: page.id,
            },
            update: {
                title: data.title,
                metaDesc: data.metaDesc,
                canonicalUrl: data.canonicalUrl,
                languageAttr: data.languageAttr,
                h1: data.h1,
                headings: JSON.stringify(data.headings),
                cleanTextShort: data.cleanTextShort,
                cleanTextFull: data.cleanTextFull,
                faqBlocks: JSON.stringify(data.faqBlocks),
                schemaJsonLd: data.schemaJsonLd,
                robotsMeta: data.robotsMeta,
                internalLinks: JSON.stringify(data.internalLinks),
                outboundLinks: JSON.stringify(data.outboundLinks),
                detectedDates: JSON.stringify(data.detectedDates),
                lastExtractedAt: new Date(),
            },
            create: {
                pageId: page.id,
                title: data.title,
                metaDesc: data.metaDesc,
                canonicalUrl: data.canonicalUrl,
                languageAttr: data.languageAttr,
                h1: data.h1,
                headings: JSON.stringify(data.headings),
                cleanTextShort: data.cleanTextShort,
                cleanTextFull: data.cleanTextFull,
                faqBlocks: JSON.stringify(data.faqBlocks),
                schemaJsonLd: data.schemaJsonLd,
                robotsMeta: data.robotsMeta,
                internalLinks: JSON.stringify(data.internalLinks),
                outboundLinks: JSON.stringify(data.outboundLinks),
                detectedDates: JSON.stringify(data.detectedDates),
            },
        })

        return NextResponse.json({ success: true, pageId: page.id })
    } catch (error) {
        console.error("[SCAN_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
