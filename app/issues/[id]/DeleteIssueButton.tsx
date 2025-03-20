import { TrashIcon } from "@radix-ui/react-icons";
import { Button, Link } from "@radix-ui/themes";
import React from "react";

const DeleteIssueButton = ({ issueId }: { issueId: string }) => {
  return (
    <Link href={`/issues/${issueId}/delete`}>
      <Button color="red" style={{ width: "100%" }}>
        <TrashIcon />
        Delete Issue
      </Button>
    </Link>
  );
};

export default DeleteIssueButton;
