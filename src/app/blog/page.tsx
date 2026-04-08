import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPaginatedBlogPosts } from "@/content/blog/posts";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mca-makeup.vercel.app";

type BlogPageProps = {
  searchParams?: Promise<{ page?: string }>;
};

function getPageHref(page: number) {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const rawPage = Number(resolvedSearchParams?.page || "1");
  const currentPage = Number.isFinite(rawPage) && rawPage > 1 ? Math.floor(rawPage) : 1;

  return {
    title:
      currentPage > 1
        ? `Blog de maquillaje en Lima - Página ${currentPage}`
        : "Blog de maquillaje en Lima | Novias, eventos y belleza",
    description:
      "Consejos de maquillaje para novias, eventos sociales y servicios a domicilio en Lima. Inspírate y reserva con Marcela Cordero.",
    alternates: {
      canonical: `${siteUrl}${currentPage > 1 ? `/blog?page=${currentPage}` : "/blog"}`,
    },
    openGraph: {
      title:
        currentPage > 1
          ? `Blog de maquillaje en Lima - Página ${currentPage} | Marcela Cordero`
          : "Blog de maquillaje en Lima | Novias, eventos y belleza | Marcela Cordero",
      description:
        "Ideas, tendencias y consejos útiles para novias, invitadas y eventos en Lima. Descubre el estilo ideal y reserva tu cita.",
      url: `${siteUrl}${currentPage > 1 ? `/blog?page=${currentPage}` : "/blog"}`,
      type: "website",
      images: [
        {
          url: `${siteUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Blog de maquillaje en Lima - Marcela Cordero",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        currentPage > 1
          ? `Blog de maquillaje en Lima - Página ${currentPage}`
          : "Blog de maquillaje en Lima | Novias, eventos y belleza",
      description:
        "Consejos de maquillaje para novias y eventos en Lima. Inspírate con el blog de Marcela Cordero.",
      images: [`${siteUrl}/images/og-image.jpg`],
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const rawPage = Number(resolvedSearchParams?.page || "1");
  const { posts, currentPage, totalPages, totalPosts, pageSize } = getPaginatedBlogPosts(rawPage);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalPosts);

  return (
    <main className="min-h-screen bg-[color:var(--color-background)] pt-28 pb-16">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 p-6 sm:p-8 lg:p-10">
          <span className="inline-flex rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--color-primary)]">
            SEO local + autoridad de marca
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-[color:var(--color-heading)]">
            Blog de maquillaje y tendencias en Lima
          </h1>
          <p className="mt-3 max-w-3xl text-[color:var(--color-body)] leading-relaxed">
            Este blog está pensado para posicionar búsquedas como maquillaje en Lima, San Miguel,
            Pueblo Libre, bodas, graduaciones y eventos especiales.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/booking"
              className="rounded-xl bg-[color:var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Reservar cita
            </Link>
            <Link
              href="/#testimonials"
              className="rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-heading)] hover:border-[color:var(--color-primary)]/40"
            >
              Ver testimonios
            </Link>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 text-sm text-[color:var(--color-body)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Mostrando <strong>{startItem}</strong> a <strong>{endItem}</strong> de <strong>{totalPosts}</strong> artículos
          </span>
          <span>
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                <span className="ml-auto">{post.readingTime}</span>
              </div>

              <h2 className="mt-4 text-xl font-semibold leading-snug text-[color:var(--color-heading)]">
                {post.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-body)]">
                {post.excerpt}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {post.keywords.slice(0, 2).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-[color:var(--color-border)] px-2.5 py-1 text-[11px] text-[color:var(--color-muted)]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-xs text-[color:var(--color-muted)]">
                  {new Date(post.publishedAt).toLocaleDateString("es-PE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
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

        {totalPages > 1 && (
          <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación del blog">
            <Link
              href={getPageHref(currentPage - 1)}
              aria-disabled={currentPage === 1}
              className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                currentPage === 1
                  ? "pointer-events-none opacity-50 border-[color:var(--color-border)] text-[color:var(--color-muted)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-heading)] hover:border-[color:var(--color-primary)]/40"
              }`}
            >
              Anterior
            </Link>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Link
                key={page}
                href={getPageHref(page)}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                  page === currentPage
                    ? "bg-[color:var(--color-primary)] text-white"
                    : "border border-[color:var(--color-border)] text-[color:var(--color-heading)] hover:border-[color:var(--color-primary)]/40"
                }`}
              >
                {page}
              </Link>
            ))}

            <Link
              href={getPageHref(currentPage + 1)}
              aria-disabled={currentPage === totalPages}
              className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50 border-[color:var(--color-border)] text-[color:var(--color-muted)]"
                  : "border-[color:var(--color-border)] text-[color:var(--color-heading)] hover:border-[color:var(--color-primary)]/40"
              }`}
            >
              Siguiente
            </Link>
          </nav>
        )}
      </section>
    </main>
  );
}
