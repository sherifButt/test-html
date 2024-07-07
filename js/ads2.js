document.addEventListener('DOMContentLoaded', () => {
    const bannersContainer = document.getElementById('banners-container');
    const shuffleImagesButton = document.getElementById('shuffle-images');
    const shuffleCopyButton = document.getElementById('shuffle-copy');
    const saveBannersButton = document.getElementById('save-banners');
    const importJsonButton = document.getElementById('import-json-button');
    const importJsonInput = document.getElementById('import-json');

    let currentAdIndex = 0;
    let currentImageIndex = 0;
    let selectedElements = []; // Change to an array for multiple selection

    const bannerSizes = [
        { id: 'banner-160x600', width: 160, height: 600 },
        { id: 'banner-480x120', width: 480, height: 120 },
        { id: 'banner-300x250-1', width: 300, height: 250 },
        { id: 'banner-300x250-2', width: 300, height: 250 },
        { id: 'banner-728x90', width: 728, height: 90 }
    ];

    function createBanner(id, width, height) {
        const banner = document.createElement('div');
        banner.id = id;
        banner.className = 'banner';
        banner.style.width = `${width}px`;
        banner.style.height = `${height}px`;

        // Adjust element positioning based on banner size
        const image = `
            <img src="${images[currentImageIndex]}" alt="banner image" class="banner-element banner-image w-full h-full">
        `;
        const textElements = `
            
                <div class="flex items-center banner-element logo" style="top: 10px; left: 10px;">
                    <i class="fas ${ads[currentAdIndex].logo.icon}"></i>
                    <span class="ml-5 font-bold banner-element logo-first-word">${ads[currentAdIndex].logo.firstWord}</span>
                    <span class="ml-14 banner-element logo-second-word">${ads[currentAdIndex].logo.secondWord}</span>
                </div>
                <h2 class="banner-title mt-2 font-bold banner-element title" style="top: 40px; left: 10px;">${ads[currentAdIndex].headline}</h2>
                <p class="banner-description mt-1 banner-element body" style="top: 80px; left: 10px;">${ads[currentAdIndex].text}</p>
                <button class="banner-cta bg-blue-500 text-white px-4 py-2 rounded mt-2 banner-element cta" style="top: 120px; left: 10px;">${ads[currentAdIndex].cta}</button>
           
        `;

        // Define the layout based on banner size
        if (id === 'banner-160x600') {
            banner.innerHTML = image + textElements;
        } else if (id === 'banner-480x120') {
            banner.innerHTML = image + textElements;
        } else if (id === 'banner-300x250-1' || id === 'banner-300x250-2') {
            banner.innerHTML = image + textElements;
        } else if (id === 'banner-728x90') {
            banner.innerHTML = image + textElements;
        }

        bannersContainer.appendChild(banner);
        addElementInteractions(banner);
    }

    function shuffleImages() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        document.querySelectorAll('.banner-image').forEach(img => {
            img.src = images[currentImageIndex];
        });
    }

    function shuffleCopy() {
        currentAdIndex = (currentAdIndex + 1) % ads.length;
        document.querySelectorAll('.banner').forEach(banner => {
            const logoIcon = banner.querySelector('.fas');
            const logoFirstWord = banner.querySelector('.banner-element.logo-first-word');
            const logoSecondWord = banner.querySelector('.banner-element.logo-second-word');
            const bannerTitle = banner.querySelector('.banner-element.title');
            const bannerDescription = banner.querySelector('.banner-element.body');
            const bannerCta = banner.querySelector('.banner-element.cta');

            logoIcon.className = `fas ${ads[currentAdIndex].logo.icon}`;
            logoFirstWord.textContent = ads[currentAdIndex].logo.firstWord;
            logoSecondWord.textContent = ads[currentAdIndex].logo.secondWord;
            bannerTitle.textContent = ads[currentAdIndex].headline;
            bannerDescription.textContent = ads[currentAdIndex].text;
            bannerCta.textContent = ads[currentAdIndex].cta;
        });
    }

    function addElementInteractions(banner) {
        banner.querySelectorAll('.banner-element').forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                if (e.shiftKey) {
                    toggleSelectElement(element);
                } else {
                    selectElement(element);
                }
            });

            interact(element)
                .draggable({
                    listeners: {
                        move(event) {
                            const target = event.target;
                            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                            target.style.transform = `translate(${x}px, ${y}px)`;
                            target.setAttribute('data-x', x);
                            target.setAttribute('data-y', y);

                            if (selectedElements.includes(target)) {
                                selectedElements.forEach(elem => {
                                    if (elem !== target) {
                                        const elemX = (parseFloat(elem.getAttribute('data-x')) || 0) + event.dx;
                                        const elemY = (parseFloat(elem.getAttribute('data-y')) || 0) + event.dy;
                                        elem.style.transform = `translate(${elemX}px, ${elemY}px)`;
                                        elem.setAttribute('data-x', elemX);
                                        elem.setAttribute('data-y', elemY);
                                    }
                                });
                            }
                        }
                    }
                })
                .gesturable({
                    listeners: {
                        move(event) {
                            const target = event.target;
                            let angle = (parseFloat(target.getAttribute('data-angle')) || 0) + event.da;
                            let scale = (parseFloat(target.getAttribute('data-scale')) || 1) * (1 + event.ds);

                            target.style.transform = `rotate(${angle}deg) scale(${scale}) translate(${event.dx}px, ${event.dy}px)`;
                            target.setAttribute('data-angle', angle);
                            target.setAttribute('data-scale', scale);
                        }
                    }
                })
                .resizable({
                    edges: { left: true, right: true, bottom: true, top: true },
                    listeners: {
                        move(event) {
                            let { x, y } = event.target.dataset;

                            x = (parseFloat(x) || 0) + event.deltaRect.left;
                            y = (parseFloat(y) || 0) + event.deltaRect.top;

                            Object.assign(event.target.style, {
                                width: `${event.rect.width}px`,
                                height: `${event.rect.height}px`,
                                transform: `translate(${x}px, ${y}px)`
                            });

                            Object.assign(event.target.dataset, { x, y });
                        }
                    }
                });
        });
    }

    function selectElement(element) {
        clearSelection();
        addToSelection(element);
    }

    function toggleSelectElement(element) {
        if (selectedElements.includes(element)) {
            removeFromSelection(element);
        } else {
            addToSelection(element);
        }
    }

    function clearSelection() {
        selectedElements.forEach(elem => {
            elem.classList.remove('selected');
            const controls = elem.querySelector('.controls');
            if (controls) {
                controls.style.display = 'none';
            }
        });
        selectedElements = [];
    }

    function addToSelection(element) {
        selectedElements.push(element);
        element.classList.add('selected');
        showControls(element);
    }

    function removeFromSelection(element) {
        selectedElements = selectedElements.filter(elem => elem !== element);
        element.classList.remove('selected');
        const controls = element.querySelector('.controls');
        if (controls) {
            controls.style.display = 'none';
        }
    }

    function showControls(element) {
        if (!element.querySelector('.controls')) {
            const controls = document.createElement('div');
            controls.className = 'controls';

            const rotateIcon = document.createElement('div');
            rotateIcon.className = 'control-icon rotate-icon';
            rotateIcon.innerHTML = '<i class="fas fa-sync"></i>';
            rotateIcon.addEventListener('click', rotateElement);

            const moveIcon = document.createElement('div');
            moveIcon.className = 'control-icon move-icon';
            moveIcon.innerHTML = '<i class="fas fa-arrows-alt"></i>';
            moveIcon.addEventListener('mousedown', (e) => {
                e.preventDefault();
                interact(element).draggable(true);
            });

            const deleteIcon = document.createElement('div');
            deleteIcon.className = 'control-icon delete-icon';
            deleteIcon.innerHTML = '<i class="fas fa-trash"></i>';
            deleteIcon.addEventListener('click', deleteElement);

            const pinchCorners = ['tl', 'tr', 'bl', 'br'].map(pos => {
                const corner = document.createElement('div');
                corner.className = `pinch-corner pinch-${pos}`;
                return corner;
            });

            controls.appendChild(rotateIcon);
            controls.appendChild(moveIcon);
            controls.appendChild(deleteIcon);
            pinchCorners.forEach(corner => controls.appendChild(corner));
            element.appendChild(controls);
        } else {
            element.querySelector('.controls').style.display = 'block';
        }
    }

    function rotateElement(event) {
        const element = event.target.closest('.banner-element');
        if (element) {
            const angle = (parseFloat(element.getAttribute('data-angle')) || 0) + 10;
            element.style.transform += ` rotate(${angle}deg)`;
            element.setAttribute('data-angle', angle);
        }
    }

    function deleteElement(event) {
        const element = event.target.closest('.banner-element');
        if (element) {
            element.remove();
            removeFromSelection(element);
        }
    }

    function moveSelectedElements(dx, dy) {
        selectedElements.forEach(element => {
            const x = (parseFloat(element.getAttribute('data-x')) || 0) + dx;
            const y = (parseFloat(element.getAttribute('data-y')) || 0) + dy;
            element.style.transform = `translate(${x}px, ${y}px)`;
            element.setAttribute('data-x', x);
            element.setAttribute('data-y', y);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (selectedElements.length > 0) {
            const step = e.shiftKey ? 10 : 1;
            switch (e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    moveSelectedElements(0, -step);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    moveSelectedElements(0, step);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    moveSelectedElements(-step, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    moveSelectedElements(step, 0);
                    break;
            }
        }
    });

    shuffleImagesButton.addEventListener('click', shuffleImages);
    shuffleCopyButton.addEventListener('click', shuffleCopy);

    importJsonButton.addEventListener('click', () => importJsonInput.click());
    importJsonInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const jsonData = JSON.parse(e.target.result);
                // Process the imported JSON data
            };
            reader.readAsText(file);
        }
    });

    // Initialize banners
    bannerSizes.forEach(size => createBanner(size.id, size.width, size.height));
});
