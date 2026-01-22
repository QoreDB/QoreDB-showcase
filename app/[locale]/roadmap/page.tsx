import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export default function RoadmapPage() {
	return (
		<div className="min-h-screen flex flex-col bg-(--q-bg-0) text-(--q-text-0)">
			<Header />
			<main className="flex-1 pt-32 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full">
				<h1 className="text-4xl font-bold mb-8">Roadmap</h1>
				<p className="text-lg text-(--q-text-1) mb-12">
					Découvrez les prochaines fonctionnalités de QoreDB.
				</p>

				<div className="relative border-l border-(--q-border) ml-4 md:ml-6 space-y-12">
					<div className="relative pl-8 md:pl-12">
						<div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-(--q-accent) ring-4 ring-(--q-bg-0)"></div>
						<h3 className="text-xl font-bold text-(--q-text-0)">
							Q1 2024 - Beta Publique
						</h3>
						<p className="mt-2 text-(--q-text-1)">
							Lancement de la version beta publique avec support complet de PostgreSQL
							et MySQL.
						</p>
					</div>
					<div className="relative pl-8 md:pl-12">
						<div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-(--q-border) ring-4 ring-(--q-bg-0)"></div>
						<h3 className="text-xl font-bold text-(--q-text-0)">
							Q2 2024 - Support MongoDB
						</h3>
						<p className="mt-2 text-(--q-text-1)">
							Intégration native des bases de données NoSQL MongoDB avec éditeur JSON
							avancé.
						</p>
					</div>
					<div className="relative pl-8 md:pl-12">
						<div className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-(--q-border) ring-4 ring-(--q-bg-0)"></div>
						<h3 className="text-xl font-bold text-(--q-text-0)">
							Q3 2024 - Collaboration en temps réel
						</h3>
						<p className="mt-2 text-(--q-text-1)">
							Fonctionnalités d&apos;équipe pour travailler ensemble sur les mêmes
							bases de données.
						</p>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
