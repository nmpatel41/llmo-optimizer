"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Shell from "@/components/layout/Shell"
import DiffView from "@/components/optimization/DiffView"

export default function PageDetailPage() {
    const params = useParams()
    const [page, setPage] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [optimizing, setOptimizing] = useState(false)

    useEffect(() => {
        if (params.id) {
            fetchPageData()
        }
    }, [params.id])

    const fetchPageData = async () => {
        try {
            const res = await fetch(`/api/pages/${params.id}`)
            if (res.ok) {
                const data = await res.json()
                setPage(data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleOptimize = async () => {
        setOptimizing(true)
        try {
            const res = await fetch(`/api/pages/${params.id}/optimize`, {
                method: "POST",
            })
            if (res.ok) {
                await fetchPageData()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setOptimizing(false)
        }
    }

    if (loading) return <Shell><div>Loading...</div></Shell>
    if (!page) return <Shell><div>Page not found</div></Shell>

    return (
        <Shell>
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Page Optimization
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 truncate">{page.url}</p>
                </div>
            </div>

            <DiffView page={page} onRegenerate={handleOptimize} loading={optimizing} />
        </Shell>
    )
}
