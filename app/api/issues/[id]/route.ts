import { NextRequest, NextResponse } from "next/server";
import { issueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { z } from "zod";

interface Props {
  params: Promise<{ id: string }>;
}

type IssueData = z.infer<typeof issueSchema>;
export async function PATCH(request: NextRequest, { params }: Props) {
  const body: IssueData = await request.json();
  const validation = issueSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  //Find the issue in the database which need to be updated
  const { id } = await params;
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  const updatedIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(updatedIssue, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  await prisma.issue.delete({ where: { id: issue.id } });
  return NextResponse.json({});
}
