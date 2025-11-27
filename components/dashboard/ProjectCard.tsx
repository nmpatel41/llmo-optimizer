import Link from "next/link"
import { CalendarIcon, GlobeAltIcon } from "@heroicons/react/20/solid"

interface ProjectCardProps {
    project: {
        id: string
        name: string
        rootUrl: string
        updatedAt: string
        _count: {
            pages: number
        }
    }
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                <div className="text-sm font-medium leading-6 text-gray-900">
                    {project.name}
                </div>
                <div className="relative ml-auto">
                    <Link
                        href={`/dashboard/projects/${project.id}`}
                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        View
                    </Link>
                </div>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">URL</dt>
                    <dd className="text-gray-700">
                        <a href={project.rootUrl} target="_blank" rel="noreferrer" className="flex items-center hover:underline">
                            <GlobeAltIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                            {project.rootUrl}
                        </a>
                    </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Pages Analyzed</dt>
                    <dd className="flex items-start gap-x-2">
                        <div className="font-medium text-gray-900">{project._count.pages}</div>
                    </dd>
                </div>
                <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Last Updated</dt>
                    <dd className="text-gray-700 flex items-center">
                        <CalendarIcon className="mr-1.5 h-4 w-4 text-gray-400" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                    </dd>
                </div>
            </dl>
        </div>
    )
}
