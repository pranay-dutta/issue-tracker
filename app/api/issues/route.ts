import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { issueSchema } from "../../validationSchemas";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/authOptions";
import { revalidatePath } from "next/cache";

type IssueData = z.infer<typeof issueSchema>;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body: IssueData = await request.json();
  const validation = issueSchema.safeParse(body);

  /* If client sent invalid data */
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const newIssue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });

  revalidatePath("/");
  return NextResponse.json(newIssue, { status: 200 });
}
