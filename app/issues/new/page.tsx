"use client";

import { Button, TextField } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";

// Dynamically import SimpleMdeReact on client-side only
const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const NewIssuePage = () => {
  return (
    <div className="max-w-xl space-y-3">
      <TextField.Root placeholder="Title" />
      <SimpleMdeReact />
      <Button>Submit New Issue</Button>
    </div>
  );
};

export default NewIssuePage;
