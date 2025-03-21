import bcrypt from "bcrypt";
import { options } from "@/lib/options";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

const hashedEmail = process.env.ADMIN;

export async function POST(req: NextRequest) {
    try {
        const user = await getServerSession(options);
        if (!user || !user.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!hashedEmail) {
            return NextResponse.json({ error: "Server misconfiguration: ADMIN email is missing" }, { status: 500 });
        }

        const isMatch = await bcrypt.compare(user.user.email, hashedEmail);

        return NextResponse.json({ match: isMatch });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
