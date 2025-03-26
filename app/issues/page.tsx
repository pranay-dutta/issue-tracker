import prisma from "@/prisma/client";
import { Status } from "@prisma/client";
import Pagination from "../components/Pagination";
import IssueActions from "./IssueActions";
import IssueTable, { columnNames, IssueQuery } from "./IssueTable";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

interface Props {
  searchParams: Promise<IssueQuery>;
}

const IssuePage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);
  const { status, orderBy, page, sort } = await searchParams;

  const statusQuery = statuses.includes(status) ? status : undefined;
  const orderByQuery = columnNames.includes(orderBy)
    ? { [orderBy]: sort }
    : undefined;
  const pageQuery = parseInt(page) || 1;
  const pageSize = 10;

  const where = { status: statusQuery };
  const issues = await prisma.issue.findMany({
    where,
    orderBy: orderByQuery,
    skip: (pageQuery - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  return (
    <Flex direction="column" gap="4">
      <IssueActions />
      <IssueTable searchParams={searchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={pageQuery}
        itemCount={issueCount}
      />
    </Flex>
  );
};
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Issue Tracker - Issues",
  description: "View all project issues",
};

export default IssuePage;
