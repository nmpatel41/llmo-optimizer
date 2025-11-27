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
        const project = await prisma.project.findUnique({
            where: {
                id: id,
                userId: session.user.id,
            },
        })

        if (!project) {
            return new NextResponse("Not Found", { status: 404 })
        }

        return NextResponse.json(project)
    } catch (error) {
        console.error("[PROJECT_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PUT(
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
        const { name, rootUrl, businessName, businessCategory, primaryLocation } = body

        const project = await prisma.project.update({
            where: {
                id: id,
                userId: session.user.id,
            },
            data: {
                name,
                rootUrl,
                businessName,
                businessCategory,
                primaryLocation,
            },
        })

        return NextResponse.json(project)
    } catch (error) {
        console.error("[PROJECT_PUT]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await params

    try {
        await prisma.project.delete({
            where: {
                id: id,
                userId: session.user.id,
            },
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error("[PROJECT_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
