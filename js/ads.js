let currentIndex = 0;
let currentImageIndex = 0;

function getSelectedBanner() {
    return document.getElementById('bannerSelect').value;
}

function updateCheckboxStates(size) {
    const elements = ['logo-icon', 'image', 'headline', 'text', 'tags', 'cta', 'svg'];
    elements.forEach(element => {
        const el = document.getElementById(`${element}-${size}`);
        const checkbox = document.getElementById(`toggle-${element}`);
        checkbox.checked = el && el.style.display !== 'none';
    });

    const backgroundCheckbox = document.getElementById('toggle-background');
    const container = document.getElementById(`ad-container-${size}`);
    const image = document.getElementById(`image-${size}`);
    backgroundCheckbox.checked = container.style.backgroundImage.includes(image.src);
}

function selectBanner(size) {
    const selectedBanner = document.getElementById(`ad-container-${size}`);
    if (selectedBanner.classList.contains('border-blue-500')) {
        selectedBanner.classList.remove('border-blue-500', 'shadow-xl');
        document.getElementById('bannerSelect').value = '';
    } else {
        document.getElementById('bannerSelect').value = size;
        document.querySelectorAll('.border-blue-500').forEach(el => el.classList.remove('border-blue-500', 'shadow-xl'));
        selectedBanner.classList.add('border-blue-500', 'shadow-xl');
        updateSliderValues(size); 
        updateCheckboxStates(size);
    }
}

function updateSliderValues(size) {
    const pathOne = document.getElementById(`path-one-${size}`);
    const pathTwo = document.getElementById(`path-two-${size}`);

    if (pathOne) {
        document.getElementById('svg-one-opacity').value = pathOne.style.fillOpacity || 1;
    }
    if (pathTwo) {
        document.getElementById('svg-two-opacity').value = pathTwo.style.fillOpacity || 1;
    }
}

function toggleLogoLayout() {
    const size = getSelectedBanner();
    const logoIcon = document.getElementById(`logo-icon-${size}`);
    if (logoIcon.classList.contains('flex-row')) {
        logoIcon.classList.remove('flex-row');
        logoIcon.classList.add('flex-col');
    } else {
        logoIcon.classList.remove('flex-col');
        logoIcon.classList.add('flex-row');
    }
}

function rotateLogo() {
    const size = getSelectedBanner();
    const container = document.getElementById(`logo-icon-${size}`);
    const currentRotation = container.style.transform || 'rotate(0deg)';
    const newRotation = currentRotation === 'rotate(0deg)' ? 'rotate(90deg)' : 'rotate(0deg)';
    container.style.transform = newRotation;
    
    // Swap width and height and rotate 90 degrees and height to auto
    const width = container.style.width;
    container.style.width = container.style.height;
    container.style.height = width;

    
    // swap width to original value when rotating back
    if (newRotation === 'rotate(0deg)') {
        container.style.height = width;
        container.style.width = '84px';
        container.style.marginTop = '0px';
        
    } else {
        container.style.height = '32px';
        container.style.width = '20px';
        container.style.marginTop = size ==' 160x600' || size=='480x120' || size=='300x250-text' || size=='300x250' || size=='728x90'
        ?'-93px':'0px';
    }

}

function updateLogo(size) {
    const logoIcon = document.getElementById(`logo-icon-${size}`);
    const logo = ads[currentIndex].logo;
    let iconHtml = '';
    if (logo.icon.startsWith('img/')) {
        iconHtml = `<img src="${logo.icon}" alt="Logo" style="width: 24px; height: 24px;">`;
    } else {
        iconHtml = `<i class="fa ${logo.icon} mr-1" aria-hidden="true"></i>`;
    }
    logoIcon.innerHTML = `
        <div class="flex  items-center scale-95 ${logoIcon.classList.contains('flex-col') ? 'flex-col' : 'flex-row'}">
            ${iconHtml}
            <a href="https://octopus.energy" class="${logoIcon.classList.contains('flex-col') ? 'text-center' : ''}">
                <span style="font-weight:700;">${logo.firstWord}</span>${logo.secondWord}
            </a>
           
        </div>
        
    `;
}

function updateAds() {
    const sizes = [ "480x120", "300x250","160x600", "300x250-text", "728x90", "1200x628", "1200x628-2"];
    sizes.forEach(size => {
        const pathOne = document.getElementById(`path-one-${size}`);
        const pathTwo = document.getElementById(`path-two-${size}`);
        const headline = document.getElementById(`headline-${size}`);
        const text = document.getElementById(`text-${size}`);
        const tags = document.getElementById(`tags-${size}`);
        const cta = document.getElementById(`cta-${size}`);
        const image = document.getElementById(`image-${size}`);
        const logoIcon = document.getElementById(`logo-icon-${size}`);
        

        if (headline) headline.innerText = ads[currentIndex].headline;
        const currentText = text ? text.innerText : '';
        const adTextArray = ads[currentIndex].text;
        if (text && !adTextArray.includes(currentText)) {
            text.innerText = adTextArray[0];
        }
        if (tags) tags.innerText = ads[currentIndex].tags;
        if (cta && cta.innerText !== '>') {
            cta.innerText = ads[currentIndex].cta;
        }
        updateLogo(size);

        // Initially hide all elements
        if (pathOne) pathOne.classList.add('hidden-element');
        if (pathTwo) pathTwo.classList.add('hidden-element');
        if (headline) headline.classList.add('hidden-element');
        if (text) text.classList.add('hidden-element');
        if (tags) tags.classList.add('hidden-element');
        if (cta) cta.classList.add('hidden-element');
        if (image) image.classList.add('hidden-element');
        if (logoIcon) logoIcon.classList.add('hidden-element');
        

        // Determine if the banner is horizontal
        const isHorizontal = size === '480x120' || size === '728x90' || size === '1200x628'|| size === '1200x628-2';

        // Apply animations
        if (isHorizontal) {
            setTimeout(() => pathOne?.classList.replace('hidden-element', 'slide-from-bottom'), 0);
            setTimeout(() => pathTwo?.classList.replace('hidden-element', 'slide-from-bottom'), 250);
            setTimeout(() => logoIcon?.classList.replace('hidden-element', 'slide-from-left'), 500);
            setTimeout(() => headline?.classList.replace('hidden-element', 'slide-from-top'), 500);
            setTimeout(() => text?.classList.replace('hidden-element', 'slide-from-right'), 1000);
            setTimeout(() => tags?.classList.replace('hidden-element', 'slide-from-right'), 1250);
            setTimeout(() => cta?.classList.replace('hidden-element', 'slide-from-bottom'), 1500);
            setTimeout(() => image?.classList.replace('hidden-element', 'slide-from-top'), 1750);
            
        } else {
            setTimeout(() => pathOne?.classList.replace('hidden-element', 'slide-from-bottom'), 0);
            setTimeout(() => pathTwo?.classList.replace('hidden-element', 'slide-from-bottom'), 250);
            setTimeout(() => logoIcon?.classList.replace('hidden-element', 'slide-from-left'), 500);
            setTimeout(() => headline?.classList.replace('hidden-element', 'slide-from-left'), 500);
            setTimeout(() => text?.classList.replace('hidden-element', 'slide-from-left'), 750);
            setTimeout(() => tags?.classList.replace('hidden-element', 'slide-from-left'), 1000);
            setTimeout(() => cta?.classList.replace('hidden-element', 'slide-from-bottom'), 1250);
            setTimeout(() => image?.classList.replace('hidden-element', 'slide-from-bottom'), 1500);
        }

        if(size === '160x600' || size === '728x90' || size ==='300x250' || size === '480x120') {
            cta.innerText = '>';
            cta.style.padding = '5px 12px';
            cta.style.borderRadius = '100%';
        }
            
        

        // Remove animation classes after animation ends to enable re-animation if needed
        setTimeout(() => {
            pathOne?.classList.remove('slide-from-bottom');
            pathTwo?.classList.remove('slide-from-bottom');
            headline?.classList.remove(isHorizontal ? 'slide-from-top' : 'slide-from-left');
            text?.classList.remove('slide-from-left');
            tags?.classList.remove('slide-from-right');
            cta?.classList.remove('slide-from-bottom');
            image?.classList.remove('slide-from-top');
            logoIcon?.classList.remove(isHorizontal ? 'slide-from-left' : 'slide-from-left');
            
        }, 1750);
    });
}


function updateImages() {
    const sizes = ["160x600", "480x120", "300x250", "300x250-text", "728x90", "1200x628", "1200x628-2"];
    sizes.forEach(size => {
        document.getElementById(`image-${size}`).src = images[currentImageIndex];
    });
}


function previousAd() {
    if (currentIndex > 0) {
        currentIndex--;
        updateAds();
    }
}

function nextAd() {
    if (currentIndex < ads.length - 1) {
        currentIndex++;
        updateAds();
    }
}

function previousImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateImages();
    }
}

function nextImage() {
    if (currentImageIndex < images.length - 1) {
        currentImageIndex++;
        updateImages();
    }
}

function resizeImage(action) {
    const size = getSelectedBanner();
    const image = document.getElementById(`image-${size}`);
    let width = image.clientWidth;
    if (action === 'increase') {
        width += 10;
    } else {
        width -= 10;
    }
    image.style.width = `${width}px`;
}

function resizeTitle(action) {
    const size = getSelectedBanner();
    const title = document.getElementById(`headline-${size}`);
    let fontSize = parseFloat(window.getComputedStyle(title, null).getPropertyValue('font-size'));
    if (action === 'increase') {
        fontSize += 2;
    } else {
        fontSize -= 2;
    }
    title.style.fontSize = `${fontSize}px`;
}

function resizeBody(action) {
    const size = getSelectedBanner();
    const body = document.getElementById(`text-${size}`);
    let fontSize = parseFloat(window.getComputedStyle(body, null).getPropertyValue('font-size'));
    if (action === 'increase') {
        fontSize += 2;
    } else {
        fontSize -= 2;
    }
    body.style.fontSize = `${fontSize}px`;
}

function toggleElement(element) {
    const size = getSelectedBanner();
    const el = document.getElementById(`${element}-${size}`);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function toggleBackground() {
    const size = getSelectedBanner();
    const container = document.getElementById(`ad-container-${size}`);
    const image = document.getElementById(`image-${size}`);
    if (document.getElementById('toggle-background').checked) {
        container.style.backgroundImage = `url(${image.src})`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
        image.style.display = 'none';
    } else {
        container.style.backgroundImage = '';
        image.style.display = 'block';
    }
    setOpacity();
}

function switchPosition() {
    const size = getSelectedBanner();
    const container = document.getElementById(`ad-container-${size}`);
    const logoIcon = document.getElementById(`logo-icon-${size}`);
    const logoTitle = document.getElementById(`logo-title-${size}`);
    const image = document.getElementById(`image-${size}`);

    if (size === '300x250') {
        if (logoTitle && container.contains(logoTitle) && container.contains(image)) {
            const parentDiv = logoTitle.parentElement;
            if (parentDiv.nextElementSibling === image) {
                container.insertBefore(image, parentDiv);
            } else {
                container.insertBefore(parentDiv, image);
            }
        }
    } else {
        if (logoIcon && container.contains(logoIcon) && container.contains(image)) {
            if (logoIcon.nextElementSibling === image) {
                container.insertBefore(image, logoIcon);
            } else {
                container.insertBefore(logoIcon, image);
            }
        }
    }
}



function setOpacity() {
    const size = getSelectedBanner();
    const image = document.getElementById(`image-${size}`);
    const container = document.getElementById(`ad-container-${size}`);
    const opacity = document.getElementById('opacity').value;
    if (document.getElementById('toggle-background').checked) {
        container.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, ${1 - opacity}), rgba(255, 255, 255, ${1 - opacity})), url(${image.src})`;
    } else {
        image.style.opacity = opacity;
    }
}

function toggleCtaStyle() {
    const size = getSelectedBanner();
    const cta = document.getElementById(`cta-${size}`);
    if (cta.innerText === '>') {
        cta.innerText = ads[currentIndex].cta;
        cta.style.padding = '5px 12px';
        cta.style.borderRadius = '4px';
    } else {
        cta.innerText = '>';
        cta.style.padding = '5px 12px';
        cta.style.borderRadius = '100%';
    }
}

function toggleTextLength() {
    const size = getSelectedBanner();
    const textElement = document.getElementById(`text-${size}`);
    const currentText = textElement.innerText;
    const adTextArray = ads[currentIndex].text;
    if (adTextArray.length > 1) {
        const currentIndex = adTextArray.indexOf(currentText);
        const nextIndex = currentIndex === adTextArray.length - 1 ? 0 : currentIndex + 1;
        textElement.innerText = adTextArray[nextIndex];
    }
}


function highlightSelectedBanner() {
    const size = getSelectedBanner();
    document.querySelectorAll('.border-blue-500').forEach(el => el.classList.remove('border-blue-500', 'shadow-xl'));
    const selectedBanner = document.getElementById(`ad-container-${size}`);
    if (selectedBanner) {
        selectedBanner.classList.add('border-blue-500', 'shadow-xl');
        updateSliderValues(size); 
        updateCheckboxStates(size);
    }
}

function downloadAllBannersAsZip() {
    const sizes = [
        { size: '160x600', dimensions: '160x600' },
        { size: '480x120', dimensions: '480x120' },
        { size: '300x250', dimensions: '300x250' },
        { size: '300x250-text', dimensions: '300x250' },
        { size: '728x90', dimensions: '728x90' },
        { size: '1200x628', dimensions: '1200x628' },
        { size: '1200x628-2', dimensions: '1200x628' }
    ];
    
    const zip = new JSZip();
    const imgFolder = zip.folder("images");

    const promises = sizes.map(({ size }) => {
        const container = document.getElementById(`ad-container-${size}`);
        if (container) {
            return html2canvas(container, {
                backgroundColor: null,
                useCORS: true, 
                allowTaint: true 
            }).then(canvas => {
                return new Promise((resolve) => {
                    canvas.toBlob(blob => {
                        imgFolder.file(`banner_${size}.jpg`, blob);
                        resolve();
                    }, 'image/jpeg');
                });
            });
        }
        return Promise.resolve();
    });

    Promise.all(promises).then(() => {
        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, "banners.zip");
        });
    });
}

// Initialize ads and images
document.addEventListener('DOMContentLoaded', () => {
    updateAds();
    updateImages();
    const initialBanner = getSelectedBanner();
    if (initialBanner) {
        updateSliderValues(initialBanner);
        updateCheckboxStates(initialBanner);
    }
    highlightSelectedBanner(); 
    setOpacity();
    setSvgOpacity('one');
    setSvgOpacity('two');
});


function setSvgOpacity(item) {
    const size = getSelectedBanner();
    const opacityOne = document.getElementById('svg-one-opacity').value;
    const opacityTwo = document.getElementById('svg-two-opacity').value;

    const pathOne = document.getElementById(`path-one-${size}`);
    const pathTwo = document.getElementById(`path-two-${size}`);

    if (item === 'one' && pathOne) pathOne.style.fillOpacity = opacityOne;
    if (item === 'two' && pathTwo) pathTwo.style.fillOpacity = opacityTwo;
}

// Initialize ads and images
document.addEventListener('DOMContentLoaded', () => {
    updateAds();
    updateImages();
    const initialBanner = getSelectedBanner();
    if (initialBanner) {
        updateSliderValues(initialBanner);
        updateCheckboxStates(initialBanner);
    }
    highlightSelectedBanner(); 
    setOpacity();
    setSvgOpacity('one');
    setSvgOpacity('two');
});




// Initialize ads and images
document.addEventListener('DOMContentLoaded', () => {
    updateAds();
    updateImages();
});


// Initialize ads and images
updateAds();
updateImages();
