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
        const page = await prisma.page.findUnique({
            where: {
                id: id,
            },
            include: {
                project: true,
                rawData: true,
                recommendation: true,
            },
        })

        if (!page) {
            return new NextResponse("Page not found", { status: 404 })
        }

        if (page.project.userId !== session.user.id) {
            return new NextResponse("Unauthorized", { status: 403 })
        }

        return NextResponse.json(page)
    } catch (error) {
        console.error("[PAGE_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
