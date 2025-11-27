import { useState } from "react"
import { ArrowPathIcon, ClipboardDocumentIcon } from "@heroicons/react/20/solid"

interface DiffViewProps {
    page: any
    onRegenerate: () => void
    loading: boolean
}

export default function DiffView({ page, onRegenerate, loading }: DiffViewProps) {
    const [activeTab, setActiveTab] = useState<"hero" | "body" | "faq" | "schema">("hero")
    const { rawData, recommendation } = page

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        // Could add toast notification here
    }

    if (!recommendation) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No recommendations yet</h3>
                <p className="mt-1 text-sm text-gray-500">Run the optimization to see improvements.</p>
                <div className="mt-6">
                    <button
                        onClick={onRegenerate}
                        disabled={loading}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                    >
                        {loading ? "Optimizing..." : "Generate Recommendations"}
                    </button>
                </div>
            </div>
        )
    }

    const recSeo = JSON.parse(recommendation.recommendedSeo || "{}")
    const recBody = JSON.parse(recommendation.bodySectionsHtml || "[]")

    return (
        <div className="mt-6">
            {/* Score Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">LLMO Score</h3>
                    <p className="text-sm text-gray-500">{recommendation.llmoSummary}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`text-4xl font-bold ${recommendation.llmoScore >= 80 ? "text-green-600" :
                            recommendation.llmoScore >= 50 ? "text-yellow-600" : "text-red-600"
                        }`}>
                        {recommendation.llmoScore}
                    </div>
                    <button
                        onClick={onRegenerate}
                        disabled={loading}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ArrowPathIcon className={`-ml-0.5 mr-1.5 h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                        Regenerate
                    </button>
                </div>
            </div>

            {/* Metadata Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Current Metadata</h4>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Title</dt>
                            <dd className="mt-1 text-sm text-gray-900">{rawData.title}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">Description</dt>
                            <dd className="mt-1 text-sm text-gray-900">{rawData.metaDesc}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-gray-500 uppercase">H1</dt>
                            <dd className="mt-1 text-sm text-gray-900">{rawData.h1}</dd>
                        </div>
                    </dl>
                </div>

                <div className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-100">
                    <h4 className="font-semibold text-indigo-900 mb-4">Recommended Metadata</h4>
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-xs font-medium text-indigo-500 uppercase">Title</dt>
                            <dd className="mt-1 text-sm text-indigo-900">{recSeo.title}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-indigo-500 uppercase">Description</dt>
                            <dd className="mt-1 text-sm text-indigo-900">{recSeo.meta_description}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-indigo-500 uppercase">H1</dt>
                            <dd className="mt-1 text-sm text-indigo-900">{recSeo.h1}</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex" aria-label="Tabs">
                        {["hero", "body", "faq", "schema"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`${activeTab === tab
                                        ? "border-indigo-500 text-indigo-600"
                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                    } w-1/4 border-b-2 py-4 px-1 text-center text-sm font-medium capitalize`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => {
                                let content = ""
                                if (activeTab === "hero") content = recommendation.heroSectionHtml
                                if (activeTab === "body") content = recBody.join("\n")
                                if (activeTab === "faq") content = recommendation.faqHtml
                                if (activeTab === "schema") content = recommendation.jsonLdSchema
                                copyToClipboard(content)
                            }}
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                        >
                            <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                            Copy HTML/JSON
                        </button>
                    </div>

                    <div className="prose max-w-none bg-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                        {activeTab === "hero" && <pre>{recommendation.heroSectionHtml}</pre>}
                        {activeTab === "body" && <pre>{recBody.join("\n\n")}</pre>}
                        {activeTab === "faq" && <pre>{recommendation.faqHtml}</pre>}
                        {activeTab === "schema" && <pre>{recommendation.jsonLdSchema}</pre>}
                    </div>

                    {/* Preview (Optional - could render HTML safely) */}
                    <div className="mt-8 border-t pt-8">
                        <h4 className="text-sm font-medium text-gray-500 mb-4">Preview</h4>
                        <div className="prose max-w-none">
                            {activeTab === "hero" && <div dangerouslySetInnerHTML={{ __html: recommendation.heroSectionHtml }} />}
                            {activeTab === "body" && recBody.map((html: string, i: number) => <div key={i} dangerouslySetInnerHTML={{ __html: html }} />)}
                            {activeTab === "faq" && <div dangerouslySetInnerHTML={{ __html: recommendation.faqHtml }} />}
                            {activeTab === "schema" && <pre className="bg-gray-100 p-2 text-xs">{recommendation.jsonLdSchema}</pre>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
