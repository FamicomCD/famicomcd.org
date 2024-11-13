document.addEventListener('DOMContentLoaded', () => {
    const supportedLanguages = {
		en: 'https://raw.githubusercontent.com/FamicomCD/famicomcd-translators/refs/heads/main/en/en.txt',
		es: 'https://raw.githubusercontent.com/FamicomCD/famicomcd-translators/refs/heads/main/es/es.txt',
		ja: 'https://raw.githubusercontent.com/FamicomCD/famicomcd-translators/refs/heads/main/ja/jp.txt',
		fr: 'https://raw.githubusercontent.com/FamicomCD/famicomcd-translators/refs/heads/main/fr/fr.txt',
		it: 'https://raw.githubusercontent.com/FamicomCD/famicomcd-translators/refs/heads/main/it/it.txt',
		ru: 'https://raw.githubusercontent.com/FamicomCD/famicomcd-translators/refs/heads/main/ru/ru.txt'
    };

    let strings = {};
    let images = {};
    let links = {};

    const browserLanguage = navigator.language || navigator.userLanguage;
    const browserLanguageCode = browserLanguage.split('-')[0];

    const savedLanguage = localStorage.getItem('selectedLanguage');
    const initialLanguage = savedLanguage || getMatchingLanguage(browserLanguageCode, supportedLanguages);

    loadLanguageFile(initialLanguage);

    document.addEventListener('click', event => {
        const langElement = event.target.closest('[data-lang]');
        if (langElement) {
            const selectedLanguage = langElement.getAttribute('data-lang');
            localStorage.setItem('selectedLanguage', selectedLanguage);
            loadLanguageFile(selectedLanguage);
        }
    });
	
	function getCorrectedLanguage(language) {
		if (language === 'jp') {
			return 'ja';
		}
		return language;
	}

    function getMatchingLanguage(languageCode, supportedLanguages) {
        return Object.keys(supportedLanguages).find(lang => lang.startsWith(languageCode)) || Object.keys(supportedLanguages)[0];
    }

    function loadLanguageFile(language) {
        const filePath = supportedLanguages[language];
		language = getCorrectedLanguage(language);
        if (!filePath) {
            console.error(`Language file for '${language}' not found.`);
            return;
        }

        fetch(filePath)
            .then(response => response.text())
            .then(data => parseLanguageFile(data))
            .then(({ strings: loadedStrings, images: loadedImages, links: loadedLinks }) => {
                strings = loadedStrings;
                images = loadedImages;
                links = loadedLinks;

                updateContent(strings);
                updateImages(images);
                updateLinks(links);
                observeContentChanges();
            })
            .catch(error => console.error('Error loading language file:', error));
    }

    function parseLanguageFile(data) {
        const lines = data.split('\n');
        const strings = {};
        const images = {};
        const links = {};
        let currentStrId = '';
        let currentImgId = '';
        let currentLinkId = '';

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('&') && line.endsWith('&')) {
                return;
            }

            if (line.startsWith('strid')) {
                currentStrId = line.split(' ')[1].replace(/"/g, '');
            } else if (line.startsWith('string')) {
                const strValue = line.substring(line.indexOf(' ') + 1).replace(/"/g, '');
                if (currentStrId) {
                    strings[currentStrId] = strValue;
                }
            } else if (line.startsWith('imgid')) {
                currentImgId = line.split(' ')[1].replace(/"/g, '');
            } else if (line.startsWith('imagesrc')) {
                const imgSrc = line.substring(line.indexOf(' ') + 1).replace(/"/g, '');
                if (currentImgId) {
                    images[currentImgId] = imgSrc;
                }
            } else if (line.startsWith('linkid')) {
                currentLinkId = line.split(' ')[1].replace(/"/g, '');
            } else if (line.startsWith('linkurl')) {
                const linkUrl = line.substring(line.indexOf(' ') + 1).replace(/"/g, '');
                if (currentLinkId) {
                    links[currentLinkId] = linkUrl;
                }
            }
        });

        return { strings, images, links };
    }

    function updateContent(strings) {
        const elements = document.querySelectorAll('[data-strid]');
        elements.forEach(element => {
            const strid = element.getAttribute('data-strid');
            if (strings[strid]) {
                element.innerHTML = strings[strid];
            }
        });
    }

    function updateImages(images) {
        const imgElements = document.querySelectorAll('[data-imgid]');
        imgElements.forEach(img => {
            const imgid = img.getAttribute('data-imgid');
            if (images[imgid]) {
                img.src = images[imgid];
            }
        });
    }

    function updateLinks(links) {
        const linkElements = document.querySelectorAll('[data-linkid]');
        linkElements.forEach(link => {
            const linkid = link.getAttribute('data-linkid');
            if (links[linkid]) {
                link.href = links[linkid];
            }
        });
    }

    function observeContentChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-strid') {
                    const target = mutation.target;
                    const strid = target.getAttribute('data-strid');
                    if (strid) {
                        target.innerHTML = strings[strid] || '';
                    }
                }
            });
        });

        document.querySelectorAll('[data-strid]').forEach(element => {
            observer.observe(element, { attributes: true });
        });
    }
});






        document.addEventListener('click', function(event) {
            var langSelect = document.getElementById('langSelect');
            var showLangButton = document.getElementById('showLang');
            
            if (event.target === showLangButton) {
                var rect = showLangButton.getBoundingClientRect();
                langSelect.style.top = rect.bottom + window.scrollY + "px";
                langSelect.style.left = rect.left + window.scrollX + "px";

                if (langSelect.style.display === 'none' || langSelect.style.display === '') {
                    langSelect.style.display = 'block';
                } else {
                    langSelect.style.display = 'none';
                }
                event.stopPropagation();
            } else if (langSelect.style.display === 'block' && !langSelect.contains(event.target)) {
                langSelect.style.display = 'none';
            }

            if (event.target.classList.contains('langtop') || 
                event.target.classList.contains('lang') || 
                event.target.classList.contains('langbot')) {
                langSelect.style.display = 'none';
            }
        });

        // MutationObserver to handle dynamically added elements
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    var langSelect = document.getElementById('langSelect');
                    if (mutation.addedNodes.length > 0 && !langSelect.contains(mutation.addedNodes[0])) {
                        document.addEventListener('click', function(event) {
                            var langSelect = document.getElementById('langSelect');
                            var showLangButton = document.getElementById('showLang');
                            
                            if (event.target === showLangButton) {
                                var rect = showLangButton.getBoundingClientRect();
                                langSelect.style.top = rect.bottom + window.scrollY + "px";
                                langSelect.style.left = rect.left + window.scrollX + "px";

                                if (langSelect.style.display === 'none' || langSelect.style.display === '') {
                                    langSelect.style.display = 'block';
                                } else {
                                    langSelect.style.display = 'none';
                                }
                                event.stopPropagation();
                            } else if (langSelect.style.display === 'block' && !langSelect.contains(event.target)) {
                                langSelect.style.display = 'none';
                            }

                            if (event.target.classList.contains('langtop') || 
                                event.target.classList.contains('lang') || 
                                event.target.classList.contains('langbot')) {
                                langSelect.style.display = 'none';
                            }
                        });
                    }
                }
            });
        });

        observer.observe(document.getElementById('container'), { childList: true, subtree: true });