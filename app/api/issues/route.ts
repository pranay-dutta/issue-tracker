import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { issueSchema } from "../../validationSchemas";
import { z } from "zod";

type IssueData = z.infer<typeof issueSchema>;

export async function POST(request: NextRequest) {
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

  return NextResponse.json(newIssue, { status: 200 });
}
