import axios from "axios"
import * as cheerio from "cheerio"

export interface ExtractedData {
    title: string
    metaDesc: string
    canonicalUrl: string
    languageAttr: string
    h1: string
    headings: string[]
    cleanTextShort: string
    cleanTextFull: string
    faqBlocks: { question: string; answer: string }[]
    schemaJsonLd: string
    robotsMeta: string
    internalLinks: { href: string; anchor: string }[]
    outboundLinks: { href: string; anchor: string }[]
    detectedDates: string[]
}

export async function extractPageData(url: string): Promise<ExtractedData> {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "LLMO-Optimizer-Bot/1.0",
            },
            timeout: 10000,
        })

        const html = response.data
        const $ = cheerio.load(html)

        // Basic Metadata
        const title = $("title").text().trim() || ""
        const metaDesc = $('meta[name="description"]').attr("content") || ""
        const canonicalUrl = $('link[rel="canonical"]').attr("href") || ""
        const languageAttr = $("html").attr("lang") || ""
        const robotsMeta = $('meta[name="robots"]').attr("content") || ""

        // Headings
        const h1 = $("h1").first().text().trim() || ""
        const headings: string[] = []
        $("h2, h3").each((_, el) => {
            const text = $(el).text().trim()
            if (text) headings.push(text)
        })

        // Content Cleaning
        $("script, style, nav, footer, iframe, noscript").remove()
        const cleanTextFull = $("body").text().replace(/\s+/g, " ").trim()
        const cleanTextShort = cleanTextFull.split(" ").slice(0, 200).join(" ")

        // FAQ Extraction (Basic Heuristics)
        const faqBlocks: { question: string; answer: string }[] = []
        // Look for common FAQ patterns (e.g., schema or simple Q&A structure)
        // This is a simplified version; real-world extraction is harder.

        // Schema.org JSON-LD
        let schemaJsonLd = ""
        $('script[type="application/ld+json"]').each((_, el) => {
            const content = $(el).html()
            if (content) {
                // Just take the first one or concatenate? Let's take the first valid one for now.
                if (!schemaJsonLd) schemaJsonLd = content
            }
        })

        // Links
        const internalLinks: { href: string; anchor: string }[] = []
        const outboundLinks: { href: string; anchor: string }[] = []
        const domain = new URL(url).hostname

        $("a").each((_, el) => {
            const href = $(el).attr("href")
            const anchor = $(el).text().trim()
            if (href && anchor) {
                try {
                    const linkUrl = new URL(href, url)
                    if (linkUrl.hostname === domain) {
                        internalLinks.push({ href: linkUrl.pathname, anchor })
                    } else {
                        outboundLinks.push({ href: linkUrl.href, anchor })
                    }
                } catch (e) {
                    // Ignore invalid URLs
                }
            }
        })

        // Detected Dates (Simple regex for now)
        const detectedDates: string[] = []
        const dateRegex = /\b\d{4}-\d{2}-\d{2}\b/g
        const matches = html.match(dateRegex)
        if (matches) {
            matches.forEach((date: string) => {
                if (!detectedDates.includes(date)) detectedDates.push(date)
            })
        }

        return {
            title,
            metaDesc,
            canonicalUrl,
            languageAttr,
            h1,
            headings,
            cleanTextShort,
            cleanTextFull: cleanTextFull.slice(0, 5000), // Truncate to avoid DB limits
            faqBlocks,
            schemaJsonLd,
            robotsMeta,
            internalLinks: internalLinks.slice(0, 50), // Limit count
            outboundLinks: outboundLinks.slice(0, 50),
            detectedDates: detectedDates.slice(0, 5),
        }
    } catch (error) {
        console.error(`Error extracting data from ${url}:`, error)
        throw error
    }
}
