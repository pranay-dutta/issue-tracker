import prisma from "@/prisma/client";
import { Table } from "@radix-ui/themes";
import { IssueStatusBadge, Link } from "@/app/components";
import NextLink from "next/link";
import IssueActions from "./IssueActions";
import { Issue, Status } from "@prisma/client";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import Pagination from "../components/Pagination";

interface Props {
  searchParams: Promise<{
    status: Status;
    orderBy: keyof Issue;
    page: string;
  }>;
}

const IssuePage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);
  const { status, orderBy, page } = await searchParams;
  const columns: { label: string; value: keyof Issue; className?: string }[] = [
    { label: "Issue", value: "title" },
    { label: "Status", value: "status", className: "hidden md:table-cell" },
    { label: "Created", value: "createdAt", className: "hidden md:table-cell" },
  ];

  const statusQuery = statuses.includes(status) ? status : undefined;
  const orderByQuery = columns.map((column) => column.value).includes(orderBy)
    ? { [orderBy]: "asc" }
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
    <div>
      <IssueActions />

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            {columns.map((column) => (
              <Table.ColumnHeaderCell
                className={column.className}
                key={column.value}
              >
                <NextLink
                  href={{
                    query: { status, orderBy: column.value },
                  }}
                >
                  {column.label}
                </NextLink>
                {column.value === orderBy && <ArrowUpIcon className="inline" />}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {issues &&
            issues.map((issue) => (
              <Table.Row key={issue.id}>
                <Table.Cell>
                  <Link href={`/issues/${issue.id}`}>{issue.title}</Link>

                  <div className="block md:hidden">
                    <IssueStatusBadge status={issue.status} />
                  </div>
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  <IssueStatusBadge status={issue.status} />
                </Table.Cell>
                <Table.Cell className="hidden md:table-cell">
                  {issue.createdAt.toDateString()}
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
      <Pagination
        pageSize={pageSize}
        currentPage={pageQuery}
        itemCount={issueCount}
      />
    </div>
  );
};
export const dynamic = "force-dynamic";
export default IssuePage;
