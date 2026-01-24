import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '../../lib/sanity/image'

interface ArticleCardProps {
  post: {
    title: string
    slug: { current: string }
    mainImage?: any
    publishedAt: string
    author?: { name: string; image?: any }
    categories?: { title: string }[]
  }
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <Link href={`/blog/${post.slug.current}`} className="group relative flex flex-col space-y-3">
      <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted/50 transition-colors hover:bg-muted">
        {post.mainImage ? (
          <Image
            src={urlForImage(post.mainImage).url()}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {post.categories && post.categories.length > 0 && (
                <span className="font-medium text-foreground">{post.categories[0].title}</span>
            )}
            {post.categories && post.categories.length > 0 && <span>•</span>}
            <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })}
            </time>
        </div>
        <h3 className="text-xl font-bold leading-tight group-hover:underline decoration-primary decoration-2 underline-offset-4">
          {post.title}
        </h3>
        {post.author && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                {post.author.image && (
                     <div className="relative h-6 w-6 overflow-hidden rounded-full">
                        <Image src={urlForImage(post.author.image).url()} alt={post.author.name} fill className="object-cover" />
                     </div>
                )}
                <span>{post.author.name}</span>
            </div>
        )}
      </div>
    </Link>
  )
}
