import ReactMarkdown from "react-markdown";

export function Markdown({ texto, className = "prosa" }: { texto: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            const externo = /^https?:\/\//.test(href ?? "");
            return (
              <a href={href} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            );
          },
        }}
      >
        {texto}
      </ReactMarkdown>
    </div>
  );
}
