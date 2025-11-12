import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface BlogPostContentProps {
  content: string;
}

export default function BlogPostContent({ content }: BlogPostContentProps) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Заголовки
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl font-bold text-white mb-6 mt-8"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl font-bold text-white mb-4 mt-8"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-2xl font-bold text-white mb-3 mt-6"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-xl font-bold text-white mb-3 mt-6" {...props} />
          ),
          // Параграфы
          p: ({ node, ...props }) => (
            <p className="text-secondary leading-relaxed mb-4" {...props} />
          ),
          // Ссылки
          a: ({ node, ...props }) => (
            <a
              className="text-primary hover:text-primary-dark underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // Списки
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside text-secondary mb-4 space-y-2"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside text-secondary mb-4 space-y-2"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="text-secondary" {...props} />
          ),
          // Цитаты
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 py-2 my-6 bg-primary/5 text-secondary italic"
              {...props}
            />
          ),
          // Код
          code: ({ node, inline, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="bg-light text-primary px-2 py-1 rounded text-sm"
                  {...props}
                />
              );
            }
            return (
              <code
                className="block bg-light text-white p-4 rounded-lg overflow-x-auto text-sm my-4"
                {...props}
              />
            );
          },
          // Блоки кода
          pre: ({ node, ...props }) => (
            <pre
              className="bg-light rounded-lg overflow-x-auto my-4"
              {...props}
            />
          ),
          // Изображения
          img: ({ node, ...props }) => (
            <img className="rounded-lg my-6 w-full" {...props} />
          ),
          // Таблицы
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6">
              <table
                className="min-w-full border border-dark rounded-lg"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-light" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-dark px-4 py-2 text-left text-white font-semibold"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="border border-dark px-4 py-2 text-secondary"
              {...props}
            />
          ),
          // Горизонтальная линия
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-dark" {...props} />
          ),
          // Сильный текст
          strong: ({ node, ...props }) => (
            <strong className="text-white font-bold" {...props} />
          ),
          // Курсив
          em: ({ node, ...props }) => (
            <em className="text-white italic" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
