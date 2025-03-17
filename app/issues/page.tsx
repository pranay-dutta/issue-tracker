import { Button, Link } from "@radix-ui/themes";

const IssuePage = () => {
  return (
    <div>
      <Link href="/issues/new">
        <Button>New issue</Button>
      </Link>
    </div>
  );
};

export default IssuePage;
