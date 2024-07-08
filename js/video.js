document.addEventListener('DOMContentLoaded', () => {
    const slideContainer = document.getElementById('slide-container');
    const wordsPerSentence = 5; // Number of words to display at a time
    const timePerWord = 300; // milliseconds per word, adjust this value as needed

    slides.forEach((slide, index) => {
        const slideElement = createSlideElement(slide, index);
        slideContainer.appendChild(slideElement);
    });

    let currentSlide = 0;
    showSlide(currentSlide);

    function showSlide(index) {
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
                const narration = slides[i].dataset.narration;
                highlightNarration(slide, narration);
                setTimeout(() => {
                    speakNarration(narration, () => {
                        if (index < slides.length - 1) {
                            showSlide(index + 1);
                        }
                    });
                }, 500); // Adding a delay before starting the narration
            }
        });
    }

    function highlightNarration(slide, narration) {
        const words = narration.split(' ');
        const subtitleDiv = slide.querySelector('.subtitle');
        subtitleDiv.innerHTML = words.slice(0, wordsPerSentence).map((word, i) => `<span class="word">${word}</span>`).join(' ');
    }

    function speakNarration(narration, callback) {
        const utterance = new SpeechSynthesisUtterance(narration);
        const words = narration.split(' ');
        const subtitleDiv = document.querySelector('.slide.active .subtitle');
        const wordSpans = subtitleDiv.querySelectorAll('.word');

        let wordIndex = 0;
        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                const startWordIndex = wordIndex;
                const endWordIndex = Math.min(wordIndex + wordsPerSentence, words.length);
                const visibleWords = words.slice(startWordIndex, endWordIndex);

                subtitleDiv.innerHTML = visibleWords.map((word, i) => `<span class="word">${word}</span>`).join(' ');

                const newWordSpans = subtitleDiv.querySelectorAll('.word');
                newWordSpans.forEach((span, i) => {
                    if (i === 0) {
                        span.classList.add('highlight');
                    } else {
                        span.classList.remove('highlight');
                    }
                });

                wordIndex += 1;
                if (wordIndex % wordsPerSentence === 0 || wordIndex >= words.length) {
                    wordIndex = startWordIndex + wordsPerSentence;
                }
            }
        };

        utterance.onend = callback;
        window.speechSynthesis.speak(utterance);
    }

    function createSlideElement(slide, index) {
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('slide', 'w-full', 'h-full', 'flex', 'items-center', 'justify-center', slide.backgroundImage.animation);
        slideDiv.style.backgroundImage = `url(${slide.backgroundImage.image})`;
        slideDiv.style.backgroundColor = slide.background;
        slideDiv.dataset.narration = slide.narration;

        switch (slide.type) {
            case 'intro':
                slideDiv.innerHTML = `
                    <div class="text-center">
                        <h1 class="text-4xl font-bold mb-4 slide-from-bottom">${slide.title}</h1>
                        <p class="mb-4 slide-from-left">${slide.text}</p>
                        <img src="${slide.image}" alt="Slide Image" class="mb-4 mx-auto zoom-in">
                        <button class="btn slide-from-right">${slide.cta}</button>
                        <div class="subtitle mt-4 text-xl"></div>
                    </div>
                `;
                break;
            case 'centered_image':
                slideDiv.innerHTML = `
                    <div class="text-center">
                        <img src="${slide.image}" alt="Slide Image" class="mx-auto zoom-in">
                        <div class="subtitle mt-4 text-xl"></div>
                    </div>`;
                break;
            case 'centered_text':
                slideDiv.innerHTML = `
                    <div class="text-center">
                        <p class="text-2xl slide-from-bottom">${slide.text}</p>
                        <div class="subtitle mt-4 text-xl"></div>
                    </div>`;
                break;
            case 'centered_title':
                slideDiv.innerHTML = `
                    <div class="text-center">
                        <h1 class="text-4xl font-bold slide-from-top">${slide.title}</h1>
                        <div class="subtitle mt-4 text-xl"></div>
                    </div>`;
                break;
            case 'centered_title_text':
                slideDiv.innerHTML = `
                    <div class="text-center">
                        <h1 class="text-4xl font-bold mb-4 slide-from-top">${slide.title}</h1>
                        <p class="slide-from-bottom">${slide.text}</p>
                        <div class="subtitle mt-4 text-xl"></div>
                    </div>`;
                break;
            case 'centered_title_text_cta':
                slideDiv.innerHTML = `
                    <div class="text-center">
                        <h1 class="text-4xl font-bold mb-4 slide-from-top">${slide.title}</h1>
                        <p class="mb-4 slide-from-left">${slide.text}</p>
                        <button class="btn slide-from-right">${slide.cta}</button>
                        <div class="subtitle mt-4 text-xl"></div>
                    </div>`;
                break;
            case 'centered_title_text_cta_image':
                slideDiv.innerHTML = `
                    <div class="text-center">
                        <h1 class="text-4xl font-bold mb-4 slide-from-top">${slide.title}</h1>
                        <p class="mb-4 slide-from-left">${slide.text}</p>
                        <img src="${slide.image}" alt="Slide Image" class="mb-4 mx-auto zoom-in">
                        <button class="btn slide-from-right">${slide.cta}</button>
                        <div class="subtitle mt-4 text-xl"></div>
                    </div>`;
                break;
            case 'centered_title_text_cta_image_tags':
                slideDiv.innerHTML = `
                    <div class="text-center">
                        <h1 class="text-4xl font-bold mb-4 slide-from-top">${slide.title}</h1>
                        <p class="mb-4 slide-from-left">${slide.text}</p>
                        <img src="${slide.image}" alt="Slide Image" class="mb-4 mx-auto zoom-in">
                        <button class="btn slide-from-right">${slide.cta}</button>
                        <p class="slide-from-bottom">${slide.tags.join(', ')}</p>
                        <div class="subtitle mt-4 text-xl"></div>
                    </div>`;
                break;
            case 'centered_title_text_image':
                slideDiv.innerHTML = `
                    <div class="text-center">
                        <h1 class="text-4xl font-bold mb-4 slide-from-top">${slide.title}</h1>
                        <p class="mb-4 slide-from-bottom">${slide.text}</p>
                        <img src="${slide.image}" alt="Slide Image" class="mb-4 mx-auto zoom-in">
                        <div class="subtitle mt-4 text-xl"></div>
                    </div>`;
                break;
        }

        return slideDiv;
    }
});
