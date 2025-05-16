document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIGURATION & DATA ---
    const INITIAL_NETHERLANDS_CO2_EMISSIONS = APP_CONFIG_DATA.initial_co2_emissions;
    const MAX_INDICATOR_WIDTH = APP_CONFIG_DATA.max_indicator_width;
    const MIN_INDICATOR_WIDTH = APP_CONFIG_DATA.min_indicator_width;
    const INDICATOR_ASPECT_RATIO = APP_CONFIG_DATA.indicator_aspect_ratio || 1; // Bubble is a circle
    const LABEL_OFFSET_FROM_RING = APP_CONFIG_DATA.label_offset_from_ring;
    const SAVINGS_GOALS = APP_CONFIG_DATA.savings_goals;
    const SCALING_EXPONENT = APP_CONFIG_DATA.scaling_exponent || 1;
    // Optional: for bubble clearing up
    // const MAX_BUBBLE_ALPHA = 0.7;
    // const MIN_BUBBLE_ALPHA = 0.3;


    const ITEMS_PER_PAGE = 3;
    let currentPageIndex = 0;

    // --- DOM ELEMENTS ---
    const measuresBoxElement = document.getElementById('measures-box');
    const co2IndicatorElement = document.getElementById('co2-indicator');
    const co2IndicatorTextElement = document.getElementById('co2-indicator-text');
    const goalRingsSvgElement = document.getElementById('goal-rings-svg');
    const totalSavedLabelElement = document.getElementById('total-saved-label');

    const prevButtonElement = document.getElementById('prev-slide-button');
    const nextButtonElement = document.getElementById('next-slide-button');
    const dotsContainerElement = document.querySelector('.pagination__dots-container');

    // --- HELPER FUNCTION: Calculate Indicator Width ---
    function calculateIndicatorWidth(remainingEmissions) {
        if (INITIAL_NETHERLANDS_CO2_EMISSIONS <= 0) return MIN_INDICATOR_WIDTH;
        
        let emissionRatio = Math.max(0, remainingEmissions) / INITIAL_NETHERLANDS_CO2_EMISSIONS;
        emissionRatio = Math.max(0, Math.min(1, emissionRatio));
        
        const scaledEmissionRatio = Math.pow(emissionRatio, SCALING_EXPONENT);
        return MIN_INDICATOR_WIDTH + (MAX_INDICATOR_WIDTH - MIN_INDICATOR_WIDTH) * scaledEmissionRatio;
    }

    // --- INITIALIZATION ---
    function initialize() {
        renderConfigurableGoalRings();
        renderMeasures();
        updateProgressIndicator();
        addEventListeners();
        setupPagination();
    }
    
    function updateProgressIndicator() {
        let totalCO2Saved = 0;
        ALL_MEASURES_DATA_JS.forEach(measure => {
            if (measure.active) totalCO2Saved += measure.co2_impact;
        });
        totalCO2Saved = Math.round(totalCO2Saved * 10) / 10;
        const currentTotalEmissions = INITIAL_NETHERLANDS_CO2_EMISSIONS - totalCO2Saved;
        const displayEmissions = Math.max(0, currentTotalEmissions);
        
        co2IndicatorTextElement.textContent = `${displayEmissions.toFixed(1)} Megaton CO₂`;

        const currentIndicatorWidth = calculateIndicatorWidth(displayEmissions);
        // For a circle (bubble), height is same as width
        const currentIndicatorHeight = currentIndicatorWidth / INDICATOR_ASPECT_RATIO; 

        co2IndicatorElement.style.width = `${currentIndicatorWidth}px`;
        co2IndicatorElement.style.height = `${currentIndicatorHeight}px`;

        // Optional: Change bubble clarity
        // let emissionRatio = Math.max(0, currentTotalEmissions) / INITIAL_NETHERLANDS_CO2_EMISSIONS;
        // emissionRatio = Math.max(0, Math.min(1, emissionRatio));
        // const currentAlpha = MIN_BUBBLE_ALPHA + (MAX_BUBBLE_ALPHA - MIN_BUBBLE_ALPHA) * emissionRatio;
        // co2IndicatorElement.style.backgroundColor = `rgba(128, 128, 128, ${currentAlpha.toFixed(2)})`;


        if (totalSavedLabelElement) {
            totalSavedLabelElement.textContent = totalCO2Saved > 0 
                ? `Totaal bespaard: ${totalCO2Saved.toFixed(1)} Megaton CO₂` 
                : 'Nog niets bespaard';
        }
        
        // Adjust text size
        if (currentIndicatorWidth < MIN_INDICATOR_WIDTH + (MAX_INDICATOR_WIDTH * 0.1) ) {
            co2IndicatorTextElement.style.fontSize = '0.7em';
            co2IndicatorTextElement.style.lineHeight = '1';
            co2IndicatorTextElement.style.padding = '2px';
        } else if (currentIndicatorWidth < MAX_INDICATOR_WIDTH * 0.3) {
            co2IndicatorTextElement.style.fontSize = '0.85em';
        } else if (currentIndicatorWidth >= MAX_INDICATOR_WIDTH * 0.8) {
            co2IndicatorTextElement.style.fontSize = '1.5em';
        } else if (currentIndicatorWidth >= MAX_INDICATOR_WIDTH * 0.5) {
            co2IndicatorTextElement.style.fontSize = '1.2em';
        } else {
            co2IndicatorTextElement.style.fontSize = '1em';
        }
        if (currentIndicatorWidth >= MAX_INDICATOR_WIDTH * 0.3) { 
            co2IndicatorTextElement.style.lineHeight = '1.2';
            co2IndicatorTextElement.style.padding = '10px';
        }
    }
    
    // --- RENDER GOAL RINGS ---
    function renderConfigurableGoalRings() {
        if (!goalRingsSvgElement) return;
        goalRingsSvgElement.innerHTML = '';
        const sortedGoals = [...SAVINGS_GOALS].sort((a, b) => a.value - b.value);
        let lastLabelY = 0;
        const MIN_LABEL_VERTICAL_SPACING = 15;

        sortedGoals.forEach((goal, index) => {
            const emissionsAtGoal = INITIAL_NETHERLANDS_CO2_EMISSIONS - goal.value;
            const diameterAtGoal = calculateIndicatorWidth(emissionsAtGoal);
            const radiusAtGoal = diameterAtGoal / 2;
            
            const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circleElement.setAttribute('id', `ring-${goal.id}`);
            circleElement.setAttribute('class', 'progress-indicator__target-ring');
            circleElement.setAttribute('cx', '150'); 
            circleElement.setAttribute('cy', '150'); 
            circleElement.setAttribute('r', radiusAtGoal.toFixed(1));
            goalRingsSvgElement.appendChild(circleElement);
            
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            textElement.setAttribute('id', `label-${goal.id}`);
            textElement.setAttribute('class', 'progress-indicator__ring-label');
            textElement.setAttribute('x', '150');
            let targetLabelY = 150 - radiusAtGoal - LABEL_OFFSET_FROM_RING;
            if (index > 0 && targetLabelY < lastLabelY + MIN_LABEL_VERTICAL_SPACING) {
                targetLabelY = lastLabelY + MIN_LABEL_VERTICAL_SPACING;
            }
            textElement.setAttribute('y', targetLabelY.toFixed(1));
            lastLabelY = targetLabelY;
            textElement.textContent = goal.label;
            goalRingsSvgElement.appendChild(textElement);
        });
    }

    // --- RENDERING MEASURES ---
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

    // --- EVENT LISTENERS ---
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
    
    // --- LOGIC ---
    function toggleMeasureState(id, isActive) {
        const measure = ALL_MEASURES_DATA_JS.find(m => m.id === id);
        if (measure) measure.active = isActive;
        updateProgressIndicator();
    }

    // --- PAGINATION LOGIC ---
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
    
    // --- START THE APP ---
    initialize();
});
