"use client";

export function HeroBackground() {
	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			<div className="absolute inset-0 bg-(--q-bg-0)">
				<div
					className="absolute inset-0 opacity-[0.03]"
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
						backgroundRepeat: "repeat",
						backgroundSize: "128px 128px",
					}}
				/>

				{/* Primary accent glow */}
				<div
					className="absolute"
					style={{
						top: "15%",
						left: "5%",
						width: "60%",
						height: "50%",
						background:
							"radial-gradient(ellipse at 30% 50%, rgba(122,108,255,0.12) 0%, rgba(122,108,255,0.06) 35%, rgba(88,71,255,0.02) 60%, transparent 80%)",
						filter: "blur(60px)",
					}}
				/>

				{/* Secondary wide glow */}
				<div
					className="absolute"
					style={{
						top: "0%",
						left: "0%",
						width: "70%",
						height: "60%",
						background:
							"radial-gradient(ellipse at 25% 40%, rgba(154,140,255,0.08) 0%, rgba(122,108,255,0.04) 40%, transparent 70%)",
						filter: "blur(60px)",
					}}
				/>

				{/* Bottom accent glow */}
				<div
					className="absolute"
					style={{
						bottom: "20%",
						left: "50%",
						transform: "translateX(-50%)",
						width: "150%",
						height: "60%",
						background:
							"radial-gradient(ellipse at 50% 80%, rgba(122,108,255,0.10) 0%, rgba(88,71,255,0.04) 40%, transparent 70%)",
						filter: "blur(40px)",
					}}
				/>
			</div>
		</div>
	);
}
