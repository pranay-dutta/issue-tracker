import { patchIssueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";
import { authOptions } from "@/app/auth/authOptions";

interface Props {
  params: Promise<{ id: string }>;
}

// type IssueData = z.infer<typeof issueSchema>;
export async function PATCH(request: NextRequest, { params }: Props) {
  //If there is no user don't update the issue
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = patchIssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });

  const { assignedToUserId, title, description } = body;
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: { id: assignedToUserId },
    });

    if (!user)
      return NextResponse.json({ error: "Invalid user." }, { status: 400 });
  }

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
      title,
      description,
      assignedToUserId,
    },
  });

  return NextResponse.json(updatedIssue, { status: 200 });
}

export async function DELETE(request: NextRequest, { params }: Props) {
  //If there is no user don't delete the issue
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const { id } = await params;
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(id) },
  });

  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  await prisma.issue.delete({ where: { id: issue.id } });
  return NextResponse.json({});
}
