"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Shell from "@/components/layout/Shell"
import PageList from "@/components/project/PageList"
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/20/solid"

export default function ProjectDetailPage() {
    const params = useParams()
    const [project, setProject] = useState<any>(null)
    const [pages, setPages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [scanning, setScanning] = useState(false)

    useEffect(() => {
        if (params.id) {
            fetchProjectData()
        }
    }, [params.id])

    const fetchProjectData = async () => {
        try {
            const [projectRes, pagesRes] = await Promise.all([
                fetch(`/api/projects/${params.id}`),
                fetch(`/api/projects/${params.id}/pages`),
            ])

            if (projectRes.ok && pagesRes.ok) {
                const projectData = await projectRes.json()
                const pagesData = await pagesRes.json()
                setProject(projectData)
                setPages(pagesData)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleScan = async () => {
        setScanning(true)
        try {
            const res = await fetch(`/api/projects/${params.id}/scan`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}), // Scan root URL by default
            })
            if (res.ok) {
                await fetchProjectData() // Refresh data
                alert("Scan completed successfully!")
            } else {
                const error = await res.text()
                console.error("Scan failed:", error)
                alert("Scan failed. Please check the console for details.")
            }
        } catch (error) {
            console.error(error)
            alert("Scan failed: " + error)
        } finally {
            setScanning(false)
        }
    }

    if (loading) return <Shell><div>Loading...</div></Shell>
    if (!project) return <Shell><div>Project not found</div></Shell>

    return (
        <Shell>
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {project.name}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 truncate">{project.rootUrl}</p>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
                    <button
                        onClick={handleScan}
                        disabled={scanning}
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ArrowPathIcon className={`-ml-0.5 mr-1.5 h-5 w-5 ${scanning ? "animate-spin" : ""}`} aria-hidden="true" />
                        {scanning ? "Scanning..." : "Scan Website"}
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Add Page
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Pages</h3>
                <PageList pages={pages} />
            </div>
        </Shell>
    )
}
