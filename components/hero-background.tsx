"use client";

import { useEffect, useState } from "react";

const THREAD_DATA = [
	// Groupe 1 - Threads principaux (plus visibles)
	{ id: 1, d: "M50 720 Q200 590 350 540 Q500 490 650 520 Q800 550 950 460 Q1100 370 1200 340", fade: "threadFade1", pulse: "neonPulse1", strokeWidth: 1.2, opacity: 0.9, r: 2.5, dur: 4 },
	{ id: 2, d: "M80 730 Q250 620 400 570 Q550 520 700 550 Q850 580 1000 490 Q1150 400 1300 370", fade: "threadFade2", pulse: "neonPulse2", strokeWidth: 1.8, opacity: 0.85, r: 3.2, dur: 5 },
	{ id: 3, d: "M20 710 Q180 580 320 530 Q460 480 600 510 Q740 540 880 450 Q1020 360 1200 330", fade: "threadFade3", pulse: "neonPulse1", strokeWidth: 1.5, opacity: 0.9, r: 2.8, dur: 4.5 },
	{ id: 4, d: "M120 740 Q280 640 450 590 Q620 540 770 570 Q920 600 1070 510 Q1220 420 1350 390", fade: "threadFade1", pulse: "neonPulse3", strokeWidth: 1.0, opacity: 0.75, r: 2, dur: 5.5 },
	
	// Groupe 2 - Threads moyens
	{ id: 5, d: "M60 725 Q220 600 380 550 Q540 500 680 530 Q820 560 960 470 Q1100 380 1280 350", fade: "threadFade2", pulse: "neonPulse2", strokeWidth: 1.3, opacity: 0.8, r: 2.5, dur: 4.2 },
	{ id: 6, d: "M150 735 Q300 660 480 610 Q660 560 800 590 Q940 620 1080 530 Q1220 440 1400 410", fade: "threadFade3", pulse: "neonPulse1", strokeWidth: 1.6, opacity: 0.75, r: 3, dur: 5.2 },
	{ id: 7, d: "M40 715 Q190 585 340 535 Q490 485 630 515 Q770 545 910 455 Q1050 365 1250 335", fade: "threadFade1", pulse: "neonPulse3", strokeWidth: 1.1, opacity: 0.85, r: 2.2, dur: 4.8 },
	{ id: 8, d: "M100 728 Q260 630 420 580 Q580 530 720 560 Q860 590 1000 500 Q1140 410 1320 380", fade: "threadFade2", pulse: "neonPulse2", strokeWidth: 1.7, opacity: 0.8, r: 3.3, dur: 5.8 },
	
	// Groupe 3 - Threads secondaires (ondulation plus haute)
	{ id: 9, d: "M50 720 Q200 680 350 640 Q500 600 650 620 Q800 640 950 580 Q1100 520 1200 340", fade: "threadFade3", pulse: "neonPulse2", strokeWidth: 1.4, opacity: 0.8, r: 2.8, dur: 4.6 },
	{ id: 10, d: "M50 720 Q190 745 340 705 Q490 665 630 685 Q770 705 910 645 Q1050 585 1200 340", fade: "threadFade1", pulse: "neonPulse3", strokeWidth: 1.3, opacity: 0.75, r: 2.6, dur: 4.8 },
	{ id: 11, d: "M50 720 Q210 755 370 715 Q530 675 670 695 Q810 715 950 655 Q1090 595 1200 340", fade: "threadFade3", pulse: "neonPulse2", strokeWidth: 1.5, opacity: 0.85, r: 3, dur: 4.2 },
	{ id: 12, d: "M50 720 Q195 750 350 710 Q505 670 645 690 Q785 710 925 650 Q1065 590 1200 340", fade: "threadFade1", pulse: "neonPulse3", strokeWidth: 1.8, opacity: 0.9, r: 3.2, dur: 4.3 },
	
	// Groupe 4 - Threads fins pour la densité
	{ id: 13, d: "M30 722 Q170 595 310 545 Q450 495 590 525 Q730 555 870 465 Q1010 375 1180 345", fade: "threadFade3", pulse: "neonPulse1", strokeWidth: 0.6, opacity: 0.6, r: 1.5, dur: 6 },
	{ id: 14, d: "M90 732 Q240 625 390 575 Q540 525 680 555 Q820 585 960 495 Q1100 405 1300 375", fade: "threadFade1", pulse: "neonPulse3", strokeWidth: 0.8, opacity: 0.65, r: 1.8, dur: 4.3 },
	{ id: 15, d: "M70 727 Q210 605 360 555 Q510 505 650 535 Q790 565 930 475 Q1070 385 1260 355", fade: "threadFade2", pulse: "neonPulse2", strokeWidth: 0.5, opacity: 0.55, r: 1.2, dur: 5.7 },
	{ id: 16, d: "M110 738 Q270 645 430 595 Q590 545 730 575 Q870 605 1010 515 Q1150 425 1380 395", fade: "threadFade3", pulse: "neonPulse1", strokeWidth: 0.7, opacity: 0.6, r: 1.6, dur: 4.7 },
	
	// Groupe 5 - Threads supplémentaires pour l'effet "wave"
	{ id: 17, d: "M50 720 Q160 670 280 630 Q400 590 540 610 Q680 630 820 570 Q960 510 1200 340", fade: "threadFade2", pulse: "neonPulse1", strokeWidth: 0.9, opacity: 0.65, r: 1.8, dur: 5.1 },
	{ id: 18, d: "M50 720 Q175 740 310 700 Q445 660 585 680 Q725 700 865 640 Q1005 580 1200 340", fade: "threadFade3", pulse: "neonPulse2", strokeWidth: 0.7, opacity: 0.55, r: 1.4, dur: 5.6 },
	{ id: 19, d: "M50 720 Q230 760 390 720 Q550 680 690 700 Q830 720 970 660 Q1110 600 1200 340", fade: "threadFade2", pulse: "neonPulse1", strokeWidth: 1.2, opacity: 0.75, r: 2.4, dur: 4.7 },
	{ id: 20, d: "M50 720 Q165 730 290 690 Q415 650 555 670 Q695 690 835 630 Q975 570 1200 340", fade: "threadFade1", pulse: "neonPulse3", strokeWidth: 0.8, opacity: 0.6, r: 1.8, dur: 5.6 },
	
	// Groupe 6 - Threads très fins pour la texture
	{ id: 21, d: "M25 713 Q165 583 305 533 Q445 483 585 513 Q725 543 865 453 Q1005 363 1200 333", fade: "threadFade3", pulse: "neonPulse1", strokeWidth: 0.4, opacity: 0.45, r: 1, dur: 6.2 },
	{ id: 22, d: "M85 719 Q235 605 385 555 Q535 505 675 535 Q815 565 955 475 Q1095 385 1320 355", fade: "threadFade1", pulse: "neonPulse2", strokeWidth: 1.6, opacity: 0.9, r: 3.2, dur: 4.1 },
	{ id: 23, d: "M45 718 Q185 588 325 538 Q465 488 605 518 Q745 548 885 458 Q1025 368 1220 338", fade: "threadFade1", pulse: "neonPulse3", strokeWidth: 0.9, opacity: 0.7, r: 2, dur: 5.3 },
	{ id: 24, d: "M130 721 Q290 630 460 580 Q630 530 770 560 Q910 590 1050 500 Q1190 410 1350 380", fade: "threadFade2", pulse: "neonPulse2", strokeWidth: 1.2, opacity: 0.8, r: 2.5, dur: 4.9 },
];

function usePrefersReducedMotion() {
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
		if (typeof window === 'undefined') return false;
		return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	});

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		
		const handleChange = (e: MediaQueryListEvent) => {
			setPrefersReducedMotion(e.matches);
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	return prefersReducedMotion;
}

export function HeroBackground() {
	const prefersReducedMotion = usePrefersReducedMotion();

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
						pointerEvents: "none",
					}}
				/>

				{/* Second halo plus léger et large */}
				<div
					className="absolute"
					style={{
						top: "10%",
						left: "0%",
						width: "70%",
						height: "60%",
						background:
							"radial-gradient(ellipse at 25% 40%, rgba(154,140,255,0.08) 0%, rgba(122,108,255,0.04) 40%, transparent 70%)",
						filter: "blur(80px)",
						pointerEvents: "none",
					}}
				/>

				{/* Halo accent très subtil en haut à gauche */}
				<div
					className="absolute"
					style={{
						top: "0%",
						left: "10%",
						width: "40%",
						height: "35%",
						background:
							"radial-gradient(ellipse at 50% 50%, rgba(122,108,255,0.06) 0%, transparent 70%)",
						filter: "blur(50px)",
						pointerEvents: "none",
					}}
				/>

				{/* Halo accent très subtil en haut à gauche */}
				<div
					className="absolute"
					style={{
						top: "0%",
						left: "10%",
						width: "40%",
						height: "35%",
						background:
							"radial-gradient(ellipse at 50% 50%, rgba(122,108,255,0.06) 0%, transparent 70%)",
						filter: "blur(50px)",
						pointerEvents: "none",
					}}
				/>

				{/* Ellipses de fond (remplace les SVG ellipses avec feGaussianBlur) */}
				<div
					className="absolute"
					style={{
						bottom: "20%",
						left: "50%",
						transform: "translateX(-50%)",
						width: "150%",
						height: "60%",
						background:
							"radial-gradient(ellipse at 50% 80%, rgba(122,108,255,0.12) 0%, rgba(122,108,255,0.06) 30%, rgba(88,71,255,0.03) 50%, transparent 70%)",
						filter: "blur(40px)",
						pointerEvents: "none",
					}}
				/>
				<div
					className="absolute"
					style={{
						bottom: "15%",
						left: "50%",
						transform: "translateX(-50%)",
						width: "170%",
						height: "70%",
						background:
							"radial-gradient(ellipse at 50% 75%, rgba(122,108,255,0.08) 0%, rgba(88,71,255,0.04) 35%, transparent 65%)",
						filter: "blur(50px)",
						pointerEvents: "none",
					}}
				/>
				<div
					className="absolute"
					style={{
						bottom: "10%",
						left: "50%",
						transform: "translateX(-50%)",
						width: "200%",
						height: "80%",
						background:
							"radial-gradient(ellipse at 50% 70%, rgba(122,108,255,0.05) 0%, rgba(88,71,255,0.02) 40%, transparent 60%)",
						filter: "blur(60px)",
						pointerEvents: "none",
					}}
				/>

				<div className="absolute inset-0">
					<svg
						className="absolute inset-0 w-full h-full"
						viewBox="0 0 1200 760"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						preserveAspectRatio="xMinYMax slice"
						style={{
							willChange: "transform",
							contain: "layout style paint",
						}}
					>
						<defs>
							{/* Gradients pour les orbes lumineux */}
							<radialGradient id="neonPulse1" cx="50%" cy="50%" r="50%">
								<stop offset="0%" stopColor="rgba(255,255,255,1)" />
								<stop offset="30%" stopColor="rgba(122,108,255,1)" />
								<stop offset="70%" stopColor="rgba(88,71,255,0.8)" />
								<stop offset="100%" stopColor="rgba(88,71,255,0)" />
							</radialGradient>
							<radialGradient id="neonPulse2" cx="50%" cy="50%" r="50%">
								<stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
								<stop offset="25%" stopColor="rgba(122,108,255,0.9)" />
								<stop offset="60%" stopColor="rgba(154,140,255,0.7)" />
								<stop offset="100%" stopColor="rgba(154,140,255,0)" />
							</radialGradient>
							<radialGradient id="neonPulse3" cx="50%" cy="50%" r="50%">
								<stop offset="0%" stopColor="rgba(255,255,255,1)" />
								<stop offset="35%" stopColor="rgba(122,108,255,1)" />
								<stop offset="75%" stopColor="rgba(88,71,255,0.6)" />
								<stop offset="100%" stopColor="rgba(88,71,255,0)" />
							</radialGradient>



							{/* Thread fades avec meilleure opacité */}
							<linearGradient id="threadFade1" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" stopColor="var(--q-accent)" stopOpacity="0" />
								<stop offset="10%" stopColor="var(--q-accent)" stopOpacity="0.9" />
								<stop offset="90%" stopColor="var(--q-accent)" stopOpacity="0.9" />
								<stop offset="100%" stopColor="var(--q-accent)" stopOpacity="0" />
							</linearGradient>
							<linearGradient id="threadFade2" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" stopColor="var(--q-accent-strong)" stopOpacity="0" />
								<stop
									offset="8%"
									stopColor="var(--q-accent-strong)"
									stopOpacity="0.85"
								/>
								<stop
									offset="92%"
									stopColor="var(--q-accent-strong)"
									stopOpacity="0.85"
								/>
								<stop
									offset="100%"
									stopColor="var(--q-accent-strong)"
									stopOpacity="0"
								/>
							</linearGradient>
							<linearGradient id="threadFade3" x1="0%" y1="0%" x2="100%" y2="0%">
								<stop offset="0%" stopColor="var(--q-accent)" stopOpacity="0" />
								<stop offset="12%" stopColor="var(--q-accent)" stopOpacity="0.9" />
								<stop offset="88%" stopColor="var(--q-accent)" stopOpacity="0.9" />
								<stop offset="100%" stopColor="var(--q-accent)" stopOpacity="0" />
							</linearGradient>

							{/* Glow effect pour les orbes */}
							<filter id="neonGlow" x="-100%" y="-100%" width="300%" height="300%">
								<feGaussianBlur stdDeviation="3" result="coloredBlur" />
								<feMerge>
									<feMergeNode in="coloredBlur" />
									<feMergeNode in="SourceGraphic" />
								</feMerge>
							</filter>
						</defs>

						<g>
							{/* Threads avec animations */}
							{THREAD_DATA.map(
								({ id, d, fade, pulse, strokeWidth, opacity, r, dur }) => (
									<g key={id}>
										<path
											id={`thread${id}`}
											d={d}
											stroke={`url(#${fade})`}
											strokeWidth={strokeWidth}
											fill="none"
											opacity={opacity}
											strokeLinecap="round"
										/>
										<circle
											r={r}
											fill={`url(#${pulse})`}
											opacity="1"
											filter="url(#neonGlow)"
										>
											{!prefersReducedMotion && (
												<animateMotion
													dur={`${dur}s`}
													repeatCount="indefinite"
													calcMode="linear"
												>
													<mpath href={`#thread${id}`} />
												</animateMotion>
											)}
										</circle>
									</g>
								),
							)}
						</g>
					</svg>
				</div>
			</div>
		</div>
	);
}
