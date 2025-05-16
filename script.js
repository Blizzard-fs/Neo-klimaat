document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIGURATION & DATA ---
    const INITIAL_NETHERLANDS_CO2_EMISSIONS = APP_CONFIG_DATA.initial_co2_emissions;
    const SAVINGS_GOALS = APP_CONFIG_DATA.savings_goals || []; 
    
    const MAJOR_GOAL_SAVED_MT = SAVINGS_GOALS.reduce((max, goal) => Math.max(max, goal.value), 0);
    const MAJOR_GOAL_MET_EMISSIONS_THRESHOLD = INITIAL_NETHERLANDS_CO2_EMISSIONS - MAJOR_GOAL_SAVED_MT;

    const ITEMS_PER_PAGE = 3;
    let currentPageIndex = 0;

    // --- DOM ELEMENTS ---
    const measuresBoxElement = document.getElementById('measures-box');
    const co2IndicatorTextElement = document.getElementById('co2-indicator-text');
    const totalSavedLabelElement = document.getElementById('total-saved-label');

    // 3D Cube Elements
    const co2CubeElement = document.getElementById('co2-3d-cube'); // The main 3D cube
    const cubeBottomFaceElement = co2CubeElement?.querySelector('.cube-faces-container > .cube-face:nth-child(4)');


    const prevButtonElement = document.getElementById('prev-slide-button');
    const nextButtonElement = document.getElementById('next-slide-button');
    const dotsContainerElement = document.querySelector('.pagination__dots-container');
    
    // --- INITIALIZATION ---
    function initialize() {
        if (!cubeBottomFaceElement) {
            console.error("3D Cube bottom face element not found. Puddle effect will not work.");
        }
        renderMeasures();
        updateProgressIndicator(); 
        addEventListeners();
        setupPagination();
    }
    
    function updateProgressIndicator() {
        let totalCO2Saved = 0;
        ALL_MEASURES_DATA_JS.forEach(measure => {
            if (measure.active) {
                totalCO2Saved += measure.co2_impact;
            }
        });
        totalCO2Saved = Math.round(totalCO2Saved * 10) / 10;
        const currentTotalEmissions = INITIAL_NETHERLANDS_CO2_EMISSIONS - totalCO2Saved;
        const displayEmissions = Math.max(0, currentTotalEmissions);
        
        co2IndicatorTextElement.textContent = `${displayEmissions.toFixed(1)} Megaton CO₂`;

        const initialEmissions = INITIAL_NETHERLANDS_CO2_EMISSIONS;

        let co2SavedRatio = 0;
        if (initialEmissions > 0) {
            co2SavedRatio = 1 - (displayEmissions / initialEmissions);
        }
        co2SavedRatio = Math.max(0, Math.min(1, co2SavedRatio)); // Ensure it's between 0 and 1

        APP_CONFIG_DATA.savings_goals.forEach(goal => {
            if (MAJOR_GOAL_SAVED_MT > 0 && totalCO2Saved >= MAJOR_GOAL_SAVED_MT) {
                document.querySelector('.cube-container').classList.add('cube-stop-melting');
            } else {
                document.querySelector('.cube-container').classList.remove('cube-stop-melting');
            }
        });

        if (totalSavedLabelElement) {
            totalSavedLabelElement.textContent = totalCO2Saved > 0 
                ? `Totaal bespaard: ${totalCO2Saved.toFixed(1)} Megaton CO₂` 
                : 'Nog niets bespaard';
        }
    }
    
    // --- (renderMeasures, addEventListeners, toggleMeasureState, setupPagination, updatePaginationDots, updatePaginationNavButtons functions remain the same as previous versions) ---
    function renderMeasures() {
        if (!measuresBoxElement) return;
        measuresBoxElement.innerHTML = '';
        const startIndex = currentPageIndex * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentPageData = ALL_MEASURES_DATA_JS.slice(startIndex, endIndex);
        currentPageData.forEach(measure => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'measures-display__item';
            const labelElement = document.createElement('label');
            labelElement.className = 'measures-display__toggle';
            const inputElement = document.createElement('input');
            inputElement.type = 'checkbox';
            inputElement.dataset.id = measure.id;
            inputElement.checked = measure.active;
            inputElement.setAttribute('aria-labelledby', `measure-name-${measure.id}`);
            const sliderSpan = document.createElement('span');
            sliderSpan.className = 'measures-display__slider';
            sliderSpan.setAttribute('aria-hidden', 'true');
            labelElement.appendChild(inputElement);
            labelElement.appendChild(sliderSpan);
            const nameSpan = document.createElement('span');
            nameSpan.className = 'measures-display__name';
            nameSpan.textContent = measure.name;
            nameSpan.id = `measure-name-${measure.id}`;
            itemDiv.appendChild(labelElement);
            itemDiv.appendChild(nameSpan);
            measuresBoxElement.appendChild(itemDiv);
        });
        updatePaginationDots(); 
    }

    function addEventListeners() {
        measuresBoxElement.addEventListener('change', function(event) {
            const targetInput = event.target.closest('.measures-display__toggle input[type="checkbox"]');
            if (targetInput && measuresBoxElement.contains(targetInput.closest('.measures-display__item'))) {
                const measureId = targetInput.dataset.id;
                const isActive = targetInput.checked;
                toggleMeasureState(measureId, isActive);
            }
        });
        if (prevButtonElement) {
            prevButtonElement.addEventListener('click', () => {
                if (currentPageIndex > 0) {
                    currentPageIndex--;
                    renderMeasures();
                }
            });
        }
        if (nextButtonElement) {
            nextButtonElement.addEventListener('click', () => {
                const maxPage = Math.ceil(ALL_MEASURES_DATA_JS.length / ITEMS_PER_PAGE) - 1;
                if (currentPageIndex < maxPage) {
                    currentPageIndex++;
                    renderMeasures();
                }
            });
        }
    }
    
    function toggleMeasureState(id, isActive) {
        const measure = ALL_MEASURES_DATA_JS.find(m => m.id === id);
        if (measure) measure.active = isActive;
        updateProgressIndicator();
    }

    function setupPagination() {
        if (!dotsContainerElement) return;
        const numPages = Math.ceil(ALL_MEASURES_DATA_JS.length / ITEMS_PER_PAGE);
        dotsContainerElement.innerHTML = ''; 
        const paginationNav = dotsContainerElement.closest('.pagination');
        if (numPages <= 1) {
            if(paginationNav) paginationNav.style.display = 'none';
            return;
        }
        if(paginationNav) paginationNav.style.display = 'flex';
        for (let i = 0; i < numPages; i++) {
            const dotButton = document.createElement('button');
            dotButton.className = 'pagination__dot';
            dotButton.dataset.page = i;
            dotButton.setAttribute('aria-label', `Ga naar pagina ${i + 1}`);
            dotButton.setAttribute('role', 'tab');
            dotButton.setAttribute('aria-selected', 'false');
            if (i === currentPageIndex) {
                dotButton.classList.add('pagination__dot--active');
                dotButton.setAttribute('aria-selected', 'true');
            }
            dotButton.addEventListener('click', () => {
                currentPageIndex = parseInt(dotButton.dataset.page);
                renderMeasures();
            });
            dotsContainerElement.appendChild(dotButton);
        }
        updatePaginationNavButtons(); 
    }

    function updatePaginationDots() {
        if (!dotsContainerElement) return;
        const dots = dotsContainerElement.querySelectorAll('.pagination__dot');
        dots.forEach((dot, index) => {
            const isActive = (index === currentPageIndex);
            dot.classList.toggle('pagination__dot--active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        updatePaginationNavButtons();
    }

    function updatePaginationNavButtons() {
        const numPages = Math.ceil(ALL_MEASURES_DATA_JS.length / ITEMS_PER_PAGE);
        if (prevButtonElement) prevButtonElement.disabled = currentPageIndex === 0;
        if (nextButtonElement) nextButtonElement.disabled = currentPageIndex >= numPages - 1;
    }
    
    initialize();
});
