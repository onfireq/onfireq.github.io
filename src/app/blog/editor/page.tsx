import fs from "node:fs";
import path from "node:path";
import BlogEditor from "./BlogEditor";

export default function BlogEditorPage() {
  const humanitiesTemplate = fs.readFileSync(
    path.join(process.cwd(), "content/templates/humanities.md"),
    "utf8",
  );

  return <BlogEditor humanitiesTemplate={humanitiesTemplate} />;
}
