import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/prisma/client";
import { createIssueSchema } from "../../validationSchemas";

type Issue = z.infer<typeof createIssueSchema>;

export async function POST(request: NextRequest) {
  const body: Issue = await request.json();
  const validation = createIssueSchema.safeParse(body);

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
