import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface ProductUsageInstructionsProps {
  content: string;
}

export default function ProductUsageInstructions({
  content,
}: ProductUsageInstructionsProps) {
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Заголовки
          h1: ({ node, ...props }) => (
            <h1
              className="text-2xl font-bold text-white mb-3 mt-4 first:mt-0"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-xl font-bold text-white mb-3 mt-4 first:mt-0"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-lg font-bold text-white mb-2 mt-3 first:mt-0"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-base font-bold text-white mb-2 mt-3 first:mt-0"
              {...props}
            />
          ),
          // Параграфы
          p: ({ node, ...props }) => (
            <p
              className="text-secondary leading-relaxed mb-3 first:mt-0"
              {...props}
            />
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
          // Списки - нумерованные особенно важны для инструкций
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside text-secondary mb-3 space-y-2 ml-4 first:mt-0"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside text-secondary mb-3 space-y-2 ml-4 first:mt-0"
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li className="text-secondary leading-relaxed" {...props} />
          ),
          // Цитаты
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 py-2 my-3 bg-primary/5 text-secondary italic"
              {...props}
            />
          ),
          // Код (inline) - полезно для дозировок
          code: ({ node, inline, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="bg-light text-primary px-2 py-1 rounded text-sm font-semibold"
                  {...props}
                />
              );
            }
            return (
              <code
                className="block bg-light text-white p-3 rounded-lg overflow-x-auto text-sm my-3"
                {...props}
              />
            );
          },
          // Блоки кода
          pre: ({ node, ...props }) => (
            <pre
              className="bg-light rounded-lg overflow-x-auto my-3"
              {...props}
            />
          ),
          // Таблицы - полезны для графиков приема
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-3">
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
              className="border border-dark px-3 py-2 text-left text-white font-semibold text-sm"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="border border-dark px-3 py-2 text-secondary text-sm"
              {...props}
            />
          ),
          // Горизонтальная линия
          hr: ({ node, ...props }) => (
            <hr className="my-4 border-dark" {...props} />
          ),
          // Сильный текст - важно для предупреждений
          strong: ({ node, ...props }) => (
            <strong className="text-white font-bold" {...props} />
          ),
          // Курсив
          em: ({ node, ...props }) => (
            <em className="text-primary/90 italic" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
