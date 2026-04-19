import Image from "next/image";
import Link from "next/link";
import { getFeaturedBlogPosts } from "@/content/blog/posts";
import Typography from "./ui/Typography";

export default function LatestArticlesSection() {
  const posts = getFeaturedBlogPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section
      id="latest-articles"
      className="py-16 sm:py-20 lg:py-24"
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="container mx-auto px-5 sm:px-6 max-w-6xl">
        <div className="text-center mb-10 sm:mb-12">
          <span className="inline-flex rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--color-primary)]">
            Últimos artículos
          </span>
          <Typography as="h2" variant="h2" className="mt-3 text-[color:var(--color-heading)]">
            Consejos y tendencias para novias y eventos en Lima
          </Typography>
          <Typography
            as="p"
            variant="p"
            className="mt-3 mx-auto max-w-2xl text-[color:var(--color-body)] leading-relaxed"
          >
            Cada sección fue creada para ayudarte a decidir con confianza, con contenido claro y
            práctico.
          </Typography>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 shadow-sm"
            >
              {post.coverImage && (
                <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
                <span className="rounded-full bg-[color:var(--color-surface-secondary)] px-2.5 py-1">
                  {post.category}
                </span>
                {post.seoLabel && (
                  <span className="rounded-full border border-[color:var(--color-primary)]/20 px-2.5 py-1 text-[color:var(--color-primary)]">
                    {post.seoLabel}
                  </span>
                )}
              </div>

              <Typography
                as="h3"
                variant="h4"
                className="mt-4 text-[color:var(--color-heading)] leading-snug"
              >
                {post.title}
              </Typography>

              <Typography
                as="p"
                variant="small"
                className="mt-3 text-[color:var(--color-body)] leading-relaxed"
              >
                {post.excerpt}
              </Typography>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-xs text-[color:var(--color-muted)]">{post.readingTime}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-[color:var(--color-primary)] hover:underline"
                >
                  Leer artículo
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex rounded-xl bg-[color:var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Ver todos los artículos
          </Link>
        </div>
      </div>
    </section>
  );
}
