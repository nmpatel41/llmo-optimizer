import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await params

    try {
        const pages = await prisma.page.findMany({
            where: {
                projectId: id,
                project: {
                    userId: session.user.id,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                recommendation: {
                    select: {
                        llmoScore: true,
                    },
                },
            },
        })

        return NextResponse.json(pages)
    } catch (error) {
        console.error("[PAGES_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

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
        const { url, pageType } = body

        const project = await prisma.project.findUnique({
            where: {
                id: id,
                userId: session.user.id,
            },
        })

        if (!project) {
            return new NextResponse("Project not found", { status: 404 })
        }

        const page = await prisma.page.create({
            data: {
                projectId: id,
                url,
                pageType: pageType || "other",
            },
        })

        return NextResponse.json(page)
    } catch (error) {
        console.error("[PAGES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
