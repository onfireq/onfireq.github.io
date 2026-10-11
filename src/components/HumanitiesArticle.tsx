import BlogContent from "./BlogContent";

interface HumanitiesArticleProps {
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  headingLevel?: 1 | 2;
  format?: "md" | "tex";
}

export default function HumanitiesArticle({
  title,
  description,
  date,
  tags,
  content,
  headingLevel = 1,
  format = "md",
}: HumanitiesArticleProps) {
  const Title = headingLevel === 1 ? "h1" : "h2";

  return (
    <div className="humanities-paper">
      <div className="humanities-inner">
        <header className="humanities-header">
          <p className="humanities-kicker">人文 <span aria-hidden="true">/</span> 阅读与思考</p>
          <Title className="humanities-title">{title}</Title>
          {description && <p className="humanities-abstract">{description}</p>}
          <div className="humanities-meta">
            {date && <time dateTime={date}>{date}</time>}
            {tags.length > 0 && (
              <ul aria-label="文章标签" className="humanities-tags">
                {tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
          </div>
        </header>
        <BlogContent content={content} format={format} variant="humanities" />
      </div>
    </div>
  );
}
