	document.addEventListener('DOMContentLoaded', async () => {
		const sfcControllerContainer = document.getElementById('sfccontroller');

		const svgUrl = "graphics/smbcdnew/svg/sfccontroller.svg";
		const soundEffects = {
			shoulderL: "graphics/smbcdnew/SFX/pan.mp3",
			shoulderR: "graphics/smbcdnew/SFX/pan.mp3",
			A: "graphics/smbcdnew/SFX/jump.mp3",
			B: "graphics/smbcdnew/SFX/jump.mp3",
			X: "graphics/smbcdnew/SFX/fireball.mp3",
			Y: "graphics/smbcdnew/SFX/fireball.mp3",
			SEL: "graphics/smbcdnew/SFX/1up_smbcd_master.mp3",
			STA: "graphics/smbcdnew/SFX/pause.mp3"
		};

		const soundPlayers = {};

		try {
			preloadSounds(soundEffects, soundPlayers);

			const response = await fetch(svgUrl);
			if (!response.ok) throw new Error("SVG missing");

			const svgText = await response.text();
			sfcControllerContainer.innerHTML = svgText;

			const sfcImage = sfcControllerContainer.querySelector('svg');
			if (!sfcImage) throw new Error("No <svg>");

			setupSvgInteractions(sfcImage, soundPlayers);
		} catch (error) {}
	});

	function preloadSounds(soundEffects, soundPlayers) {
		for (const [id, soundPath] of Object.entries(soundEffects)) {
			const audio = new Audio(soundPath);
			soundPlayers[id] = audio;
		}
	}

	function setupSvgInteractions(sfcImage, soundPlayers) {
		let mouseHeld = false;

		sfcImage.addEventListener('mousedown', (event) => {
			const target = event.target;
			mouseHeld = true;

			if (['shoulderL', 'shoulderR', 'A', 'B', 'X', 'Y', 'SEL', 'STA', 'DPADback'].includes(target.id)) {
				const bbox = target.getBBox();
				const centerX = bbox.x + bbox.width / 2;
				const centerY = bbox.y + bbox.height / 2;

				if (soundPlayers[target.id]) {
					soundPlayers[target.id].currentTime = 0;
					soundPlayers[target.id].play().catch(() => {});
				}

				target.style.transformOrigin = `${centerX}px ${centerY}px`;

				if (['shoulderL', 'shoulderR'].includes(target.id)) {
					target.style.transform = "translateY(2.5px)";
				} else if (['A', 'B', 'X', 'Y'].includes(target.id)) {
					target.style.filter = "brightness(96%) hue-rotate(-4deg)";
					target.style.transform = "scale(0.90)";
				} else if (['SEL', 'STA'].includes(target.id)) {
					target.style.filter = "brightness(96%)";
					target.style.transform = "scale(0.90)";
				} else if (target.id === 'DPADback') {
					handleDpadInteraction(event, target);
				}
			}
		});

		sfcImage.addEventListener('mousemove', (event) => {
			const target = event.target;
			if (mouseHeld && target.id === 'DPADback') {
				handleDpadInteraction(event, target);
			}
		});

		sfcImage.addEventListener('mouseup', () => {
			mouseHeld = false;
			resetAllElements(sfcImage);
		});

		sfcImage.addEventListener('mouseleave', () => {
			if (!mouseHeld) resetAllElements(sfcImage);
		});
	}

	function handleDpadInteraction(event, dpadBackElement) {
		const dpadMiddleElement = document.getElementById('DPADmiddle');

		const bbox = dpadBackElement.getBoundingClientRect();
		const mouseX = event.clientX - bbox.left;
		const mouseY = event.clientY - bbox.top;

		const centerX = bbox.width / 2;
		const centerY = bbox.height / 2;

		const offsetX = mouseX - centerX;
		const offsetY = mouseY - centerY;

		const thresholdX = bbox.width / 4;
		const thresholdY = bbox.height / 4;

		let rotationX = 0;
		let rotationY = 0;
		let translateX = 0;
		let translateY = 0;

		if (Math.abs(offsetX) > Math.abs(offsetY)) {
			if (offsetX < -thresholdX) {
				rotationY = 15;
				translateX = -0.8;
			} else if (offsetX > thresholdX) {
				rotationY = -15;
				translateX = 4;
			}
		} else {
			if (offsetY < -thresholdY) {
				rotationX = 15;
				translateY = -0.4;
			} else if (offsetY > thresholdY) {
				rotationX = -15;
				translateY = 4;
			}
		}

		const dpadTransform = `rotate3d(1, 0, 0, ${rotationX}deg) rotate3d(0, 1, 0, ${rotationY}deg)`;
		dpadBackElement.style.transform = dpadTransform;

		if (dpadMiddleElement) {
			const middleTransform = `${dpadTransform} translate(${translateX}px, ${translateY}px)`;
			dpadMiddleElement.style.transform = middleTransform;
		}
	}

	function resetAllElements(sfcImage) {
		const idsToReset = ['shoulderL', 'shoulderR', 'A', 'B', 'X', 'Y', 'SEL', 'STA', 'DPADback', 'DPADmiddle'];
		idsToReset.forEach((id) => {
			const element = sfcImage.querySelector(`#${id}`);
			if (element) {
				element.style.transform = "";
				element.style.filter = "";
			}
		});
	}