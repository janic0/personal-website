const HEADING_ICON_SIZE = 70; /* px */
const HEADING_ICON_PADDING = 30; /* px */

/*
 * @author Janic Bosshard <git@janic.io>
 * @repo https://github.com/janic0/me
 */

// ----------------- UTILITIES ----------------------

const px = (value) => `${value}px`;

// --------------------------------------------------

const renderHome = () => {
	const icons = [
		"figma.svg",
		"s3.svg",
		"mongo.svg",
		"route53.svg",
		"javascript.svg",
		"flask.svg",
		"vue.svg",
		"aws.svg",
		"sass.svg",
		"firebase.svg",
		"ec2.svg",
		"bash.svg",
		"postgres.svg",
		"cloudfront.svg",
		"flutter.svg",
		"python.svg",
		"letsencrypt.svg",
		"docker.svg",
		"nodejs.svg",
		"dokku.svg",
		"svelte.svg",
		"fastify.svg",
		"css.svg",
		"typescript.svg",
		"next.svg",
		"tailwindcss.svg",
		"redis.svg",
		"react.svg",
		"html.svg",
		"cloud.svg",
		"graphql.svg",
		"nginx.svg",
		"prisma.svg",
	].map((icon) => ({ path: icon, ref: null }));
	icons.sort(() => Math.random() - 0.5);

	const heading = document.querySelector(".home");
	const placedIconElements = [];
	const positionIcons = () => {
		const screenWidth = window.innerWidth;

		if (screenWidth < 768) {
			if (placedIconElements.some((a) => a.ref !== null))
				placedIconElements = placedIconElements.map((icon) => {
					if (!icon.ref) return;
					icon.ref.remove();
					icon.ref.remove();
				});
			return;
		}

		const screenHeight = window.innerHeight;

		const horizontalAvailableWidth = screenWidth - HEADING_ICON_PADDING * 2;
		const horizontalSectionHeight = screenHeight / 2 - 200;
		const verticalSectionWidth = screenWidth / 2 - 450;
		const verticalSectionHeight = screenHeight - HEADING_ICON_PADDING * 2;

		const sections = [
			{
				top: HEADING_ICON_PADDING,
				left: HEADING_ICON_PADDING,
				width: horizontalAvailableWidth,
				height: horizontalSectionHeight,
				type: "horizontal",
				/*
				╔═══════════════════╗
				┃					┃
				┗━━━━━━━━━━━━━━━━━━━┛
				*/
			},
			{
				top: HEADING_ICON_PADDING,
				right: HEADING_ICON_PADDING,
				width: verticalSectionWidth,
				height: verticalSectionHeight,
				type: "vertical",
				/*
				┏━━━━━━━━━━━━━━━━━━━╗
				┃					║
				┗━━━━━━━━━━━━━━━━━━━╝
				*/
			},
			{
				bottom: HEADING_ICON_PADDING,
				right: HEADING_ICON_PADDING,
				width: horizontalAvailableWidth,
				height: horizontalSectionHeight,
				type: "horizontal",
				/*
				┏━━━━━━━━━━━━━━━━━━━┓
				┃					┃
				╚═══════════════════╝
				*/
			},
			{
				bottom: HEADING_ICON_PADDING,
				left: HEADING_ICON_PADDING,
				width: verticalSectionWidth,
				height: verticalSectionHeight,
				type: "vertical",
				/*
				╔━━━━━━━━━━━━━━━━━━━┓
				║					┃
				╚━━━━━━━━━━━━━━━━━━━┛
				*/
			},
		];

		// DRAWING ICONS
		let iconsAdded = 0;
		const hasVerticalSection = verticalSectionWidth > HEADING_ICON_SIZE;
		sections.forEach((section, i) => {
			if (!hasVerticalSection && section.type === "vertical") return;

			const sectionOffset =
				section.type === "horizontal"
					? verticalSectionWidth
					: horizontalSectionHeight;

			const availableIcons = Math[i % 2 === 0 ? "floor" : "ceil"](
				hasVerticalSection
					? (icons.length / (2 * 2 + 2 * 1)) *
							(section.type === "horizontal" ? 2 : 1)
					: icons.length / 2
			);

			const sectionSpace =
				(section.type === "horizontal" ? section.width : section.height) -
				sectionOffset -
				HEADING_ICON_SIZE;

			const oppSectionSpace =
				section.type === "vertical" ? section.width : section.height;

			const iconGap =
				(sectionSpace - availableIcons * HEADING_ICON_SIZE) / availableIcons;

			for (let i = 0; i < availableIcons; i++) {
				const randomOffset =
					(oppSectionSpace - HEADING_ICON_SIZE) * Math.random();

				const currentIcon = icons[iconsAdded];
				if (!currentIcon) return;
				iconsAdded++;
				const e = currentIcon.ref || document.createElement("img");

				const iconOffset = (i + 1) * iconGap + HEADING_ICON_SIZE * i;

				e.src = `/img/icons/${currentIcon.path}`;
				e.style.position = "absolute";
				e.style.transition = "top 0.1s, bottom 0.1s";

				const dimensions = {
					top: section.top
						? section.top +
						  (section.type === "vertical"
								? sectionOffset + iconOffset
								: randomOffset)
						: null,
					left: section.left
						? section.left +
						  (section.type === "horizontal"
								? sectionOffset + iconOffset
								: randomOffset)
						: null,
					right: section.right
						? section.right +
						  (section.type === "horizontal"
								? sectionOffset + iconOffset
								: randomOffset)
						: null,
					bottom: section.bottom
						? section.bottom +
						  (section.type === "vertical"
								? sectionOffset + iconOffset
								: randomOffset)
						: null,
				};

				Object.keys(dimensions).forEach((key) => {
					if (dimensions[key]) e.style[key] = px(dimensions[key]);
				});

				e.style.width = HEADING_ICON_SIZE + "px";
				e.style.height = HEADING_ICON_SIZE + "px";

				if (currentIcon.ref)
					placedIconElements[
						placedIconElements.findIndex((e) => e.iconName === currentIcon.path)
					].dimensions = dimensions;
				else {
					placedIconElements.push({
						element: e,
						iconName: currentIcon.path,
						currentBuffer: 0,
						dimensions,
					});
					currentIcon.ref = e;
					heading.appendChild(e);
				}
			}
		});
	};

	positionIcons();

	window.addEventListener("wheel", ({ deltaY }) => {
		placedIconElements.forEach((icon) => {
			const target = deltaY / 3;
			if (icon.currentBuffer > window.innerHeight) return;
			if (icon.currentBuffer < 0 && deltaY < 0) return;
			const hasTop = icon.dimensions.top !== null;
			icon.element.style[hasTop ? "top" : "bottom"] =
				(hasTop ? icon.dimensions.top : icon.dimensions.bottom) +
				(hasTop ? -1 : 1) * (icon.currentBuffer + target) +
				"px";
			icon.currentBuffer += target;
		});
	});
	window.addEventListener("resize", positionIcons);
};

const renderProjects = () => {
	const items = Array.from(document.querySelectorAll(".content__project"));

	items.forEach((item) => item.classList.remove("content__project--visible"));

	const iso = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting)
				entry.target.classList.add("content__project--visible");
			else entry.target.classList.remove("content__project--visible");
		});
	});

	items.forEach((element) => iso.observe(element));
};

const renderSkills = () => {
	const skillSections = Array.from(
		document.querySelectorAll(".content__skill")
	);
	skillSections.forEach((section) => {
		section.querySelector(".skill__title").addEventListener("click", () => {
			section.classList.toggle("content__skill--visible");
		});
	});
};

renderHome();
renderProjects();
renderSkills();
