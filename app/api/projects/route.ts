import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                updatedAt: "desc",
            },
            include: {
                _count: {
                    select: { pages: true },
                },
            },
        })

        return NextResponse.json(projects)
    } catch (error) {
        console.error("[PROJECTS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    try {
        const body = await req.json()
        const { name, rootUrl, businessName, businessCategory, primaryLocation } = body

        if (!name || !rootUrl) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const project = await prisma.project.create({
            data: {
                userId: session.user.id,
                name,
                rootUrl,
                businessName,
                businessCategory,
                primaryLocation,
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error("[PROJECTS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
