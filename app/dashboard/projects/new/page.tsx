"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Shell from "@/components/layout/Shell"

export default function NewProjectPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        rootUrl: "",
        businessName: "",
        businessCategory: "",
        primaryLocation: "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                const project = await res.json()
                router.push(`/dashboard/projects/${project.id}`)
            } else {
                console.error("Failed to create project")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Shell>
            <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        New Project
                    </h2>
                </div>
            </div>

            <div className="mt-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-sm rounded-lg border border-gray-200">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                            Project Name
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="My Awesome Website"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="rootUrl" className="block text-sm font-medium leading-6 text-gray-900">
                            Root URL
                        </label>
                        <div className="mt-2">
                            <input
                                type="url"
                                name="rootUrl"
                                id="rootUrl"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="https://example.com"
                                value={formData.rootUrl}
                                onChange={(e) => setFormData({ ...formData, rootUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium leading-6 text-gray-900">
                                Business Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="businessName"
                                    id="businessName"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="businessCategory" className="block text-sm font-medium leading-6 text-gray-900">
                                Category
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="businessCategory"
                                    id="businessCategory"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="e.g. E-commerce"
                                    value={formData.businessCategory}
                                    onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="primaryLocation" className="block text-sm font-medium leading-6 text-gray-900">
                            Primary Location
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="primaryLocation"
                                id="primaryLocation"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="e.g. New York, USA"
                                value={formData.primaryLocation}
                                onChange={(e) => setFormData({ ...formData, primaryLocation: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-x-3">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Project"}
                        </button>
                    </div>
                </form>
            </div>
        </Shell>
    )
}
