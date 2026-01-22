import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function BlogPage() {
	return (
		<div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
			<Header />
			<main className="flex-1 pt-32 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full">
				<h1 className="text-4xl font-bold mb-8">Blog</h1>
				<p className="text-lg text-(--q-text-1)">
					Nos derniers articles et actualités.
				</p>
				<div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					<div className="p-6 rounded-2xl border border-(--q-border) bg-(--q-bg-1)">
						<div className="h-48 rounded-xl bg-(--q-bg-2) mb-4 animate-pulse"></div>
						<div className="h-6 w-3/4 rounded bg-(--q-bg-2) mb-2 animate-pulse"></div>
						<div className="h-4 w-1/2 rounded bg-(--q-bg-2) animate-pulse"></div>
					</div>
					<div className="p-6 rounded-2xl border border-(--q-border) bg-(--q-bg-1)">
						<div className="h-48 rounded-xl bg-(--q-bg-2) mb-4 animate-pulse"></div>
						<div className="h-6 w-3/4 rounded bg-(--q-bg-2) mb-2 animate-pulse"></div>
						<div className="h-4 w-1/2 rounded bg-(--q-bg-2) animate-pulse"></div>
					</div>
					<div className="p-6 rounded-2xl border border-(--q-border) bg-(--q-bg-1)">
						<div className="h-48 rounded-xl bg-(--q-bg-2) mb-4 animate-pulse"></div>
						<div className="h-6 w-3/4 rounded bg-(--q-bg-2) mb-2 animate-pulse"></div>
						<div className="h-4 w-1/2 rounded bg-(--q-bg-2) animate-pulse"></div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
