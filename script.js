document.addEventListener('DOMContentLoaded', function() {
    // --- CONFIGURATION & DATA ---
    const INITIAL_NETHERLANDS_CO2_EMISSIONS = APP_CONFIG_DATA.initial_co2_emissions;
    const MAX_BALL_DIAMETER = APP_CONFIG_DATA.max_ball_diameter;
    const MIN_BALL_DIAMETER = APP_CONFIG_DATA.min_ball_diameter;
    const LABEL_OFFSET_FROM_RING = APP_CONFIG_DATA.label_offset_from_ring;
    const SAVINGS_GOALS = APP_CONFIG_DATA.savings_goals;
    const SCALING_EXPONENT = APP_CONFIG_DATA.scaling_exponent || 1;

    const ITEMS_PER_PAGE = 3;
    let currentPageIndex = 0;

    // --- DOM ELEMENTS ---
    const measuresBoxElement = document.getElementById('measures-box');
    const co2BallElement = document.querySelector('.progress-indicator__co2-ball');
    const co2BallTextElement = document.querySelector('.progress-indicator__co2-ball-text');
    const goalRingsSvgElement = document.getElementById('goal-rings-svg');
    const totalSavedLabelElement = document.getElementById('total-saved-label');

    // Pagination Elements (custom)
    const prevButtonElement = document.getElementById('prev-slide-button');
    const nextButtonElement = document.getElementById('next-slide-button');
    const dotsContainerElement = document.querySelector('.pagination__dots-container');


    // --- HELPER FUNCTION: Calculate Ball Diameter (Keeps scaling exponent) ---
    function calculateBallDiameter(remainingEmissions) {
        if (INITIAL_NETHERLANDS_CO2_EMISSIONS <= 0) {
            return MIN_BALL_DIAMETER;
        }
        let emissionRatio = Math.max(0, remainingEmissions) / INITIAL_NETHERLANDS_CO2_EMISSIONS;
        emissionRatio = Math.max(0, Math.min(1, emissionRatio));
        const scaledEmissionRatio = Math.pow(emissionRatio, SCALING_EXPONENT);
        return MIN_BALL_DIAMETER + (MAX_BALL_DIAMETER - MIN_BALL_DIAMETER) * scaledEmissionRatio;
    }

    // --- INITIALIZATION ---
    function initialize() {
        renderConfigurableGoalRings();
        renderMeasures();
        updateProgressAndBall();
        addEventListeners();
        setupPagination(); // Reverted to custom pagination
    }

    // --- SETUP CONFIGURABLE GOAL RINGS (Keeps label separation logic) ---
    function renderConfigurableGoalRings() {
        if (!goalRingsSvgElement) return;
        goalRingsSvgElement.innerHTML = '';
        const sortedGoals = [...SAVINGS_GOALS].sort((a, b) => a.value - b.value);
        let lastLabelY = 0;
        const MIN_LABEL_VERTICAL_SPACING = 15; // Can be made configurable too if desired

        sortedGoals.forEach((goal, index) => {
            const emissionsAtGoal = INITIAL_NETHERLANDS_CO2_EMISSIONS - goal.value;
            const diameterAtGoal = calculateBallDiameter(emissionsAtGoal);
            const radiusAtGoal = diameterAtGoal / 2;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('id', `ring-${goal.id}`);
            circle.setAttribute('class', 'progress-indicator__target-ring');
            circle.setAttribute('cx', '150');
            circle.setAttribute('cy', '150');
            circle.setAttribute('r', radiusAtGoal.toFixed(1));
            goalRingsSvgElement.appendChild(circle);
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('id', `label-${goal.id}`);
            text.setAttribute('class', 'progress-indicator__ring-label');
            text.setAttribute('x', '150');
            let targetLabelY = 150 - radiusAtGoal - LABEL_OFFSET_FROM_RING;
            if (index > 0) {
                if (targetLabelY < lastLabelY + MIN_LABEL_VERTICAL_SPACING) {
                    targetLabelY = lastLabelY + MIN_LABEL_VERTICAL_SPACING;
                }
            }
            text.setAttribute('y', targetLabelY.toFixed(1));
            lastLabelY = targetLabelY;
            text.textContent = goal.label;
            goalRingsSvgElement.appendChild(text);
        });
    }

    // --- RENDERING MEASURES (Reverted to custom HTML structure) ---
    function renderMeasures() {
        if (!measuresBoxElement) return;
        measuresBoxElement.innerHTML = '';

        const startIndex = currentPageIndex * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentPageData = ALL_MEASURES_DATA_JS.slice(startIndex, endIndex);

        currentPageData.forEach(measure => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'measures-display__item'; // Original class

            const labelElement = document.createElement('label');
            labelElement.className = 'measures-display__toggle'; // Original class

            const inputElement = document.createElement('input');
            inputElement.type = 'checkbox';
            inputElement.dataset.id = measure.id;
            inputElement.checked = measure.active;
            inputElement.setAttribute('aria-labelledby', `measure-name-${measure.id}`);

            const sliderSpan = document.createElement('span');
            sliderSpan.className = 'measures-display__slider'; // Original class
            sliderSpan.setAttribute('aria-hidden', 'true');

            labelElement.appendChild(inputElement);
            labelElement.appendChild(sliderSpan);

            const nameSpan = document.createElement('span');
            nameSpan.className = 'measures-display__name'; // Original class
            nameSpan.textContent = measure.name;
            nameSpan.id = `measure-name-${measure.id}`;

            itemDiv.appendChild(labelElement);
            itemDiv.appendChild(nameSpan);
            measuresBoxElement.appendChild(itemDiv);
        });
        updatePaginationDots(); // Call this to update custom dots
    }

    // --- EVENT LISTENERS (Targeting custom toggle) ---
    function addEventListeners() {
        measuresBoxElement.addEventListener('change', function(event) {
            // Ensure we target the checkbox within our custom toggle structure
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

    // --- LOGIC (toggleMeasureState, updateProgressAndBall - No changes needed here from before DaisyUI) ---
    function toggleMeasureState(id, isActive) {
        const measure = ALL_MEASURES_DATA_JS.find(m => m.id === id);
        if (measure) {
            measure.active = isActive;
        }
        updateProgressAndBall();
    }

    function updateProgressAndBall() {
        let totalCO2Saved = 0;
        ALL_MEASURES_DATA_JS.forEach(measure => {
            if (measure.active) {
                totalCO2Saved += measure.co2_impact;
            }
        });
        totalCO2Saved = Math.round(totalCO2Saved * 10) / 10;
        const currentTotalEmissions = INITIAL_NETHERLANDS_CO2_EMISSIONS - totalCO2Saved;
        const displayEmissions = Math.max(0, currentTotalEmissions);
        co2BallTextElement.textContent = `${displayEmissions.toFixed(1)} Megaton CO₂`;
        const currentDiameter = calculateBallDiameter(displayEmissions);
        co2BallElement.style.width = `${currentDiameter}px`;
        co2BallElement.style.height = `${currentDiameter}px`;
        if (totalSavedLabelElement) {
            if (totalCO2Saved > 0) {
                totalSavedLabelElement.textContent = `Totaal bespaard: ${totalCO2Saved.toFixed(1)} Megaton CO₂`;
            } else {
                totalSavedLabelElement.textContent = 'Nog niets bespaard';
            }
        }
        if (currentDiameter <= MIN_BALL_DIAMETER * 1.5) {
            co2BallTextElement.style.fontSize = '0.85em';
        } else if (currentDiameter >= MAX_BALL_DIAMETER * 0.8) {
            co2BallTextElement.style.fontSize = '1.5em';
        } else if (currentDiameter >= MAX_BALL_DIAMETER * 0.5) {
            co2BallTextElement.style.fontSize = '1.2em';
        } else {
            co2BallTextElement.style.fontSize = '1em';
        }
    }

    // --- PAGINATION LOGIC (Reverted to custom dots) ---
    function setupPagination() {
        if (!dotsContainerElement) return;
        const numPages = Math.ceil(ALL_MEASURES_DATA_JS.length / ITEMS_PER_PAGE);
        dotsContainerElement.innerHTML = ''; // Clear existing dots

        const paginationNav = dotsContainerElement.closest('.pagination');
        if (numPages <= 1) {
            if(paginationNav) paginationNav.style.display = 'none';
            return;
        }
        if(paginationNav) paginationNav.style.display = 'flex';


        for (let i = 0; i < numPages; i++) {
            const dotButton = document.createElement('button');
            dotButton.className = 'pagination__dot'; // Original class
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
