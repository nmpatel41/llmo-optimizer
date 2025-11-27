import Link from "next/link"
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/20/solid"

interface PageListProps {
    pages: any[]
}

export default function PageList({ pages }: PageListProps) {
    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        URL
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Type
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        LLMO Score
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Last Crawled
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {pages.map((page) => (
                                    <tr key={page.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {page.url}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{page.pageType}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {page.recommendation?.llmoScore ? (
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${page.recommendation.llmoScore >= 80
                                                        ? "bg-green-50 text-green-700 ring-green-600/20"
                                                        : page.recommendation.llmoScore >= 50
                                                            ? "bg-yellow-50 text-yellow-800 ring-yellow-600/20"
                                                            : "bg-red-50 text-red-700 ring-red-600/20"
                                                    }`}>
                                                    {page.recommendation.llmoScore}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                            {page.lastCrawledAt ? new Date(page.lastCrawledAt).toLocaleDateString() : "-"}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <Link href={`/dashboard/pages/${page.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                Optimize<span className="sr-only">, {page.url}</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
