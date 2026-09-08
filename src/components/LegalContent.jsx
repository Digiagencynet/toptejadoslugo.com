function renderBlocks(blocks) {
  return blocks.map((block, i) => {
    if (block.type === 'paragraph') {
      return (
        <p key={i} className="text-[15px] text-slate-600 leading-relaxed mb-5">
          {(block.children ?? []).map((c, j) => renderInline(c, j))}
        </p>
      )
    }
    if (block.type === 'heading') {
      const Tag = `h${block.level ?? 2}`
      return (
        <Tag key={i} className="text-[24px] font-semibold text-[#0E0C29] mt-10 mb-4">
          {(block.children ?? []).map((c, j) => renderInline(c, j))}
        </Tag>
      )
    }
    if (block.type === 'list') {
      const Tag = block.format === 'ordered' ? 'ol' : 'ul'
      return (
        <Tag key={i} className={`mb-5 pl-6 text-[15px] text-slate-600 leading-relaxed ${block.format === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
          {(block.children ?? []).map((item, j) => (
            <li key={j} className="mb-2">
              {(item.children ?? []).map((c, k) => renderInline(c, k))}
            </li>
          ))}
        </Tag>
      )
    }
    if (block.type === 'quote') {
      return (
        <blockquote key={i} className="border-l-4 border-brand-blue pl-4 italic text-slate-600 my-5">
          {(block.children ?? []).map((c, j) => renderInline(c, j))}
        </blockquote>
      )
    }
    return null
  })
}

function renderInline(node, key) {
  if (node.type === 'link') {
    return (
      <a key={key} href={node.url} className="text-brand-blue underline hover:no-underline">
        {(node.children ?? []).map((c, j) => renderInline(c, j))}
      </a>
    )
  }
  let text = node.text ?? ''
  if (node.bold) text = <strong>{text}</strong>
  if (node.italic) text = <em>{text}</em>
  if (node.underline) text = <u>{text}</u>
  return <span key={key}>{text}</span>
}

export default function LegalContent({ data }) {
  if (!data) {
    return (
      <section className="pt-32 pb-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
          <p className="font-semibold">Error: Legal page data unavailable</p>
          <p className="text-sm mt-1">Entry not found in Strapi. Check `legal-pages` collection and slug filter.</p>
        </div>
      </section>
    )
  }

  const body = data.body
  const isBlocks = Array.isArray(body)
  const isString = typeof body === 'string'

  return (
    <section className="pt-32 pb-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-[36px] md:text-[44px] font-medium text-[#0E0C29] mb-8 leading-tight">
          {data.title}
        </h1>
        {data.updatedAt && (
          <p className="text-[13px] text-slate-400 mb-10">
            Última actualización: {new Date(data.updatedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
        <div className="legal-body">
          {isBlocks && renderBlocks(body)}
          {isString && <div dangerouslySetInnerHTML={{ __html: body }} />}
        </div>
      </div>
    </section>
  )
}
