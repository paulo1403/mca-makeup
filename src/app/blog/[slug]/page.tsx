import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPostBySlug } from "@/content/blog/posts";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mca-makeup.vercel.app";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {};
  }

  const articleImage = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${siteUrl}${post.coverImage}`
    : undefined;

  return {
    title: `${post.title} | Marcela Cordero`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Marcela Cordero`,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      images: articleImage
        ? [{ url: articleImage, alt: post.title }]
        : [
            {
              url: `${siteUrl}/images/og-image.jpg`,
              alt: post.title,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Marcela Cordero`,
      description: post.description,
      images: articleImage ? [articleImage] : [`${siteUrl}/images/og-image.jpg`],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: "Marcela Cordero",
    },
    publisher: {
      "@type": "Organization",
      name: "Marcela Cordero Makeup",
      url: siteUrl,
    },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  const faqJsonLd = post.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <main className="min-h-screen bg-[color:var(--color-background)] pt-28 pb-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}

        <Link
          href="/blog"
          className="text-sm font-medium text-[color:var(--color-primary)] hover:underline"
        >
          ← Volver al blog
        </Link>

        <header className="mt-4 rounded-3xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/70 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[color:var(--color-muted)]">
            <span className="rounded-full bg-[color:var(--color-surface-secondary)] px-2.5 py-1">
              {post.category}
            </span>
            {post.seoLabel && (
              <span className="rounded-full border border-[color:var(--color-primary)]/20 px-2.5 py-1 text-[color:var(--color-primary)]">
                {post.seoLabel}
              </span>
            )}
            <span>{post.readingTime}</span>
            <span>
              {new Date(post.publishedAt).toLocaleDateString("es-PE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight text-[color:var(--color-heading)]">
            {post.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[color:var(--color-body)]">
            {post.description}
          </p>

          {post.coverImage && (
            <div className="relative mt-5 h-56 w-full overflow-hidden rounded-2xl sm:h-72">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
            </div>
          )}
        </header>

        <div className="mt-8 space-y-6">
          {post.sections.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6"
            >
              <h2 className="text-2xl font-semibold text-[color:var(--color-heading)]">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-[color:var(--color-body)] leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}

          {post.faq && post.faq.length > 0 && (
            <section className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5 sm:p-6">
              <h2 className="text-2xl font-semibold text-[color:var(--color-heading)]">
                Preguntas frecuentes
              </h2>
              <div className="mt-4 space-y-4">
                {post.faq.map((item) => (
                  <div key={item.question}>
                    <h3 className="font-semibold text-[color:var(--color-heading)]">
                      {item.question}
                    </h3>
                    <p className="mt-1 text-[color:var(--color-body)]">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-3xl border border-[color:var(--color-primary)]/20 bg-[color:var(--color-primary)]/5 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-[color:var(--color-heading)]">
              ¿Lista para tu próximo look?
            </h2>
            <p className="mt-2 text-[color:var(--color-body)] leading-relaxed">
              Si quieres un maquillaje profesional para boda, evento social o atención a domicilio en
              Lima, puedes reservar tu cita en línea en pocos minutos.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/booking"
                className="rounded-xl bg-[color:var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Reservar cita
              </Link>
              <Link
                href="/#servicios"
                className="rounded-xl border border-[color:var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-heading)]"
              >
                Ver servicios
              </Link>
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}
