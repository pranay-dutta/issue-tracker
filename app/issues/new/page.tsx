"use client";
import { Button, TextField } from "@radix-ui/themes";
import { useForm, Controller } from "react-hook-form";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IssueFrom {
  title: string;
  description: string;
}
const NewIssuePage = () => {
  const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
    ssr: false,
  });
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<IssueFrom>();

  return (
    <form
      className="max-w-xl space-y-3"
      onSubmit={handleSubmit(async (data) => {
        await axios.post("/api/issues/", data);
        router.push("/issues");
      })}
    >
      <TextField.Root placeholder="Title" {...register("title")} />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <SimpleMdeReact placeholder="Description" {...field} />
        )}
      />
      <Button>Submit New Issue</Button>
    </form>
  );
};

export default NewIssuePage;
