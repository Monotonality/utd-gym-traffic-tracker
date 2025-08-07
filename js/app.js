// UTD Gym Traffic Tracker - Main Application
class GymTrafficTracker {
    constructor() {
        this.currentGym = 'activity-center';
        
        // Get today's date in local timezone
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        this.currentDate = `${year}-${month}-${day}`;
        console.log(`Initialized current date: ${this.currentDate}`);
        
        this.currentTime = new Date().toTimeString().slice(0, 5);
        this.chart = null;
        this.updateInterval = null;
        this.currentView = 'day'; // 'day' or 'week'
        this.lastDayViewDate = this.currentDate; // Track the last selected date in day view
        this.lastWeekViewDate = this.currentDate; // Track the last selected week (stored as Sunday date)

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.updateDisplay();
        this.startLiveUpdates();
    }

    setupEventListeners() {
        // Gym selection
        document.getElementById('gym-select').addEventListener('change', (e) => {
            this.currentGym = e.target.value;
            this.updateDisplay();
        });

        // Date selection
        document.getElementById('date-select').addEventListener('change', (e) => {
            this.currentDate = e.target.value;
            
            // Track state changes based on current view
            if (this.currentView === 'day') {
                this.lastDayViewDate = this.currentDate;
                this.updateDisplay();
            } else if (this.currentView === 'week') {
                // Snap to Sunday of the selected week
                this.updateDateToSundayOfWeek();
                this.lastWeekViewDate = this.currentDate;
                // Force update the chart and status for week view
                this.updateChart();
                this.updateStatusCards();
            }
        });

        // Time selection
        document.getElementById('time-select').addEventListener('change', (e) => {
            this.currentTime = e.target.value;
            this.updateDisplay();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.target.id === 'gym-select' || e.target.id === 'date-select' || e.target.id === 'time-select')) {
                this.updateDisplay();
            }
        });

        // View toggle buttons
        document.getElementById('day-view-btn').addEventListener('click', () => {
            this.switchToView('day');
        });

        document.getElementById('week-view-btn').addEventListener('click', () => {
            this.switchToView('week');
        });

        // Week navigation buttons
        document.getElementById('prev-week-btn').addEventListener('click', () => {
            this.navigateWeek(-1);
        });

        document.getElementById('next-week-btn').addEventListener('click', () => {
            this.navigateWeek(1);
        });
    }

    loadInitialData() {
        // Set default values
        console.log(`Setting date input to: ${this.currentDate}`);
        const dateInput = document.getElementById('date-select');
        dateInput.value = this.currentDate;
        
        document.getElementById('time-select').value = this.currentTime;
        document.getElementById('gym-select').value = this.currentGym;
        
        // Verify what was actually set
        console.log(`Date input actual value: ${dateInput.value}`);
        console.log(`Date input valueAsDate: ${dateInput.valueAsDate}`);
        
        // Force refresh to ensure the input shows the correct value
        setTimeout(() => {
            console.log(`Date input value after timeout: ${dateInput.value}`);
        }, 100);
    }

    startLiveUpdates() {
        // Clear existing interval
        this.stopLiveUpdates();

        // Update every 30 seconds
        this.updateInterval = setInterval(() => {
                this.updateCurrentData();
        }, 30000);

        // Initial update
        this.updateCurrentData();
    }

    stopLiveUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    updateCurrentData() {
        const data = this.getSimulatedData();
        this.updateStatusCards(data);
        this.updateChart();
    }

        updateStatusCards(data = null) {
        // Check if we're in Week View and handle differently
        if (this.currentView === 'week') {
            this.updateWeeklyStatusCards();
            return;
        }

        // Day View logic (existing)
        if (window.dataManager && window.dataManager.getTrafficForDateTime) {
            // Get the current time input value and format it
            const timeInput = document.getElementById('time-select').value;
            const timeFormatted = this.formatTimeInput(timeInput);
            
            const statusData = window.dataManager.getTrafficForDateTime(
                this.currentGym, 
                this.currentDate, 
                timeFormatted
            );
            
            if (statusData) {
                // Update occupancy
                document.getElementById('current-occupancy').textContent = statusData.currentOccupancy;

        // Update capacity percentage
                document.getElementById('capacity-percentage').textContent = `${statusData.capacityPercentage}%`;
                
                // Update busy status and colors
                this.updateBusyStatus(statusData.capacityPercentage);
                this.updateCapacityColors(statusData.capacityPercentage);
                
                if (!statusData.isOpen) {
                    document.getElementById('current-occupancy').textContent = '0';
                    document.getElementById('capacity-percentage').textContent = '0%';
                    document.getElementById('busy-status').textContent = 'Closed';
                }
            }
        } else if (data) {
            // Fallback to old method if new method not available
            if (data.isOpen === false) {
                document.getElementById('current-occupancy').textContent = 'CLOSED';
                document.getElementById('capacity-percentage').textContent = 'CLOSED';
                return;
            }

            document.getElementById('current-occupancy').textContent = data.currentOccupancy;
            const capacityPercentage = data.capacityPercentage || Math.round((data.currentOccupancy / data.maxCapacity) * 100);
        document.getElementById('capacity-percentage').textContent = `${capacityPercentage}%`;
        }
    }

    updateWeeklyStatusCards() {
        if (window.dataManager && window.dataManager.getWeeklySummary) {
            const weeklySummary = window.dataManager.getWeeklySummary(this.currentGym, this.currentDate);
            
            if (weeklySummary) {
                // Update the three status cards for weekly view
                document.getElementById('current-occupancy').textContent = weeklySummary.averageOccupancy;
                document.getElementById('capacity-percentage').textContent = `${weeklySummary.capacityPercentage}%`;
                document.getElementById('busy-status').textContent = weeklySummary.busiestDay;
                
                // Update labels to reflect weekly context
                const occupancyLabel = document.querySelector('#current-occupancy').nextElementSibling;
                const capacityLabel = document.querySelector('#capacity-percentage').nextElementSibling;
                const statusLabel = document.querySelector('#busy-status').nextElementSibling;
                
                if (occupancyLabel) occupancyLabel.textContent = 'Average Occupancy';
                if (capacityLabel) capacityLabel.textContent = 'Average Capacity %';
                if (statusLabel) statusLabel.textContent = 'Busiest Day';
                
                // Update colors based on weekly summary
                this.updateWeeklyColors(weeklySummary);
            }
        }
    }

    updateWeeklyColors(weeklySummary) {
        const occupancyElement = document.getElementById('current-occupancy');
        const capacityElement = document.getElementById('capacity-percentage');
        const busyStatusElement = document.getElementById('busy-status');
        
        // Color based on weekly summary
        if (weeklySummary.weeklySummary === 'Light Week') {
            occupancyElement.className = 'text-3xl font-bold text-green-600';
            capacityElement.className = 'text-3xl font-bold text-green-600';
            busyStatusElement.className = 'text-3xl font-bold text-green-600';
        } else if (weeklySummary.weeklySummary === 'Normal Week') {
            occupancyElement.className = 'text-3xl font-bold text-orange-600';
            capacityElement.className = 'text-3xl font-bold text-orange-600';
            busyStatusElement.className = 'text-3xl font-bold text-orange-600';
        } else { // Busy Week
            occupancyElement.className = 'text-3xl font-bold text-red-600';
            capacityElement.className = 'text-3xl font-bold text-red-600';
            busyStatusElement.className = 'text-3xl font-bold text-red-600';
        }
    }

    resetStatusLabelsToDaily() {
        // Reset labels back to daily context
        const occupancyLabel = document.querySelector('#current-occupancy').nextElementSibling;
        const capacityLabel = document.querySelector('#capacity-percentage').nextElementSibling;
        const statusLabel = document.querySelector('#busy-status').nextElementSibling;
        
        if (occupancyLabel) occupancyLabel.textContent = 'Current Occupancy';
        if (capacityLabel) capacityLabel.textContent = 'Capacity %';
        if (statusLabel) statusLabel.textContent = 'Status';
    }

    // Helper function to format time input (HH:MM) to 12-hour format
    formatTimeInput(timeInput) {
        if (!timeInput) {
            const now = new Date();
            return now.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        }
        
        const [hours, minutes] = timeInput.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    // Update busy status based on capacity percentage
    updateBusyStatus(capacityPercentage) {
        const busyStatusElement = document.getElementById('busy-status');
        
        if (capacityPercentage < 40) {
            busyStatusElement.textContent = 'Not Busy';
            busyStatusElement.className = 'text-3xl font-bold text-green-600';
        } else if (capacityPercentage <= 80) {
            busyStatusElement.textContent = 'Busy';
            busyStatusElement.className = 'text-3xl font-bold text-orange-600';
        } else {
            busyStatusElement.textContent = 'Very Busy';
            busyStatusElement.className = 'text-3xl font-bold text-red-600';
        }
    }

    // Update capacity card colors based on percentage
    updateCapacityColors(capacityPercentage) {
        const capacityElement = document.getElementById('capacity-percentage');
        
        if (capacityPercentage < 40) {
            capacityElement.className = 'text-3xl font-bold text-green-600';
        } else if (capacityPercentage <= 80) {
            capacityElement.className = 'text-3xl font-bold text-orange-600';
        } else {
            capacityElement.className = 'text-3xl font-bold text-red-600';
        }
    }

    updateDisplay() {
        const data = this.getSimulatedData();
        this.updateStatusCards(data);
        this.updateChart();
    }

    switchToView(viewType) {
        const previousView = this.currentView;
        this.currentView = viewType;
        
        // Handle view transition logic
        if (viewType === 'day' && previousView === 'week') {
            // Switching from week to day view
            this.handleWeekToDayTransition();
        } else if (viewType === 'week' && previousView === 'day') {
            // Switching from day to week view
            this.handleDayToWeekTransition();
        }
        
        // Update button styles
        const dayBtn = document.getElementById('day-view-btn');
        const weekBtn = document.getElementById('week-view-btn');
        
        if (viewType === 'day') {
            dayBtn.className = 'px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white transition-colors';
            weekBtn.className = 'px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 transition-colors';
        } else {
            dayBtn.className = 'px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 transition-colors';
            weekBtn.className = 'px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white transition-colors';
        }
        
        // Update navigation based on view type
        this.updateNavigationForView(viewType);
        
        // Update the chart
        this.updateChart();
        // Refresh status cards for the new view
        this.updateStatusCards();
    }

    handleDayToWeekTransition() {
        // Save the current day as last day view date
        this.lastDayViewDate = this.currentDate;
        
        // Find the Sunday of the week containing the current day
        const currentDay = new Date(this.currentDate);
        const dayOfWeek = currentDay.getDay();
        const sundayOfWeek = new Date(currentDay);
        sundayOfWeek.setDate(currentDay.getDate() - dayOfWeek);
        
        // Set the week view to show the week containing the current day
        const sundayDateString = sundayOfWeek.toISOString().split('T')[0];
        this.currentDate = sundayDateString;
        this.lastWeekViewDate = sundayDateString;
        
        // Update the date input
        document.getElementById('date-select').value = this.currentDate;
        this.updateDateInputForWeekView();
    }

    handleWeekToDayTransition() {
        // Save the current week as last week view date
        this.lastWeekViewDate = this.currentDate;
        
        // Check if the last day view date is within the currently selected week
        const currentWeekSunday = new Date(this.currentDate);
        const currentWeekSaturday = new Date(currentWeekSunday);
        currentWeekSaturday.setDate(currentWeekSunday.getDate() + 6);
        
        const lastDayDate = new Date(this.lastDayViewDate);
        
        // Check if last day is within current week
        if (lastDayDate >= currentWeekSunday && lastDayDate <= currentWeekSaturday) {
            // Last day is in current week, use it
            this.currentDate = this.lastDayViewDate;
        } else {
            // Last day is not in current week, default to Sunday (first day of current week)
            this.currentDate = currentWeekSunday.toISOString().split('T')[0];
            this.lastDayViewDate = this.currentDate; // Update the tracker
        }
        
        // Update the date input
        document.getElementById('date-select').value = this.currentDate;
    }

    updateNavigationForView(viewType) {
        const timeContainer = document.getElementById('time-selection-container');
        const dateContainer = document.getElementById('date-selection-container');
        const weekContainer = document.getElementById('week-navigation-container');
        
        if (viewType === 'week') {
            // Hide time selection and date selection for Week View
            timeContainer.style.display = 'none';
            dateContainer.style.display = 'none';
            
            // Show week navigation
            weekContainer.style.display = 'block';
            
            // Update the date to the Sunday of the current week if needed
            this.updateDateToSundayOfWeek();
            // Update the week display
            this.updateWeekDisplay();
        } else {
            // Show time selection and date selection for Day View
            timeContainer.style.display = 'block';
            dateContainer.style.display = 'block';
            
            // Hide week navigation
            weekContainer.style.display = 'none';
            
            // Reset status card labels to daily context
            this.resetStatusLabelsToDaily();
        }
    }

    navigateWeek(direction) {
        // direction: -1 for previous week, +1 for next week
        const currentSunday = new Date(this.currentDate);
        currentSunday.setDate(currentSunday.getDate() + (direction * 7));
        
        // Update the current date to the new Sunday
        const year = currentSunday.getFullYear();
        const month = String(currentSunday.getMonth() + 1).padStart(2, '0');
        const day = String(currentSunday.getDate()).padStart(2, '0');
        this.currentDate = `${year}-${month}-${day}`;
        
        // Update state tracking
        this.lastWeekViewDate = this.currentDate;
        
        // Update the display
        this.updateWeekDisplay();
        
        // Update chart and status
        this.updateChart();
        this.updateStatusCards();
    }

    updateWeekDisplay() {
        const currentWeekDisplay = document.getElementById('current-week-display');
        if (!currentWeekDisplay) return;
        
        // Calculate Saturday date (6 days after Sunday)
        const sundayDate = new Date(this.currentDate);
        const saturdayDate = new Date(sundayDate);
        saturdayDate.setDate(sundayDate.getDate() + 6);
        
        // Format as MM/DD range
        const sundayFormatted = this.formatDateForDisplay(sundayDate);
        const saturdayFormatted = this.formatDateForDisplay(saturdayDate);
        const weekRange = `${sundayFormatted} - ${saturdayFormatted}`;
        
        currentWeekDisplay.textContent = weekRange;
    }

    updateDateToSundayOfWeek() {
        const currentDate = new Date(this.currentDate);
        const dayOfWeek = currentDate.getDay();
        const daysToSunday = dayOfWeek; // Sunday (0) is the start, so subtract current day
        
        const sundayOfWeek = new Date(currentDate);
        sundayOfWeek.setDate(currentDate.getDate() - daysToSunday);
        
        const year = sundayOfWeek.getFullYear();
        const month = String(sundayOfWeek.getMonth() + 1).padStart(2, '0');
        const day = String(sundayOfWeek.getDate()).padStart(2, '0');
        const sundayDateString = `${year}-${month}-${day}`;
        
        // Update the date if it's different
        if (this.currentDate !== sundayDateString) {
            this.currentDate = sundayDateString;
            document.getElementById('date-select').value = sundayDateString;
        }
        
        // Always update the week display in week view
        if (this.currentView === 'week') {
            this.updateDateInputForWeekView();
        }
    }

    updateDateInputForWeekView() {
        const dateInput = document.getElementById('date-select');
        
        if (this.currentView === 'week') {
            // Calculate Saturday date (6 days after Sunday)
            const sundayDate = new Date(this.currentDate);
            const saturdayDate = new Date(sundayDate);
            saturdayDate.setDate(sundayDate.getDate() + 6);
            
            // Format as MM/DD/YYYY range
            const sundayFormatted = this.formatDateForDisplay(sundayDate);
            const saturdayFormatted = this.formatDateForDisplay(saturdayDate);
            const weekRange = `${sundayFormatted} - ${saturdayFormatted}`;
            
            // Set the date input to show the range (but keep the actual value as Sunday for backend)
            dateInput.setAttribute('data-week-range', weekRange);
            dateInput.value = this.currentDate; // Keep Sunday date as the actual value
            
            // Update the visual display
            this.updateDateInputDisplay(weekRange);
        } else {
            // Reset to normal single date display for Day View
            dateInput.removeAttribute('data-week-range');
            dateInput.value = this.currentDate;
            this.resetDateInputDisplay();
        }
    }

    formatDateForDisplay(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    updateDateInputDisplay(weekRange) {
        const dateInput = document.getElementById('date-select');
        
        // Remove any existing overlay
        const existingOverlay = dateInput.nextElementSibling;
        if (existingOverlay && existingOverlay.classList.contains('week-range-display')) {
            existingOverlay.remove();
        }
        
        // Create week range display overlay
        const rangeDisplay = document.createElement('div');
        rangeDisplay.className = 'week-range-display absolute inset-0 flex items-center px-3 bg-white border border-gray-300 rounded-md text-sm text-gray-900 cursor-pointer';
        rangeDisplay.textContent = weekRange;
        
        // Make the overlay clickable to trigger the date input
        rangeDisplay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Temporarily show the date input
            dateInput.style.opacity = '1';
            dateInput.style.zIndex = '30';
            dateInput.focus();
            dateInput.click();
            
            // Hide it again after a short delay
            setTimeout(() => {
                if (this.currentView === 'week') {
                    dateInput.style.opacity = '0';
                    dateInput.style.zIndex = '10';
                }
            }, 100);
        });
        
        // Create wrapper if it doesn't exist
        if (!dateInput.parentElement.classList.contains('relative')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'relative';
            dateInput.parentElement.insertBefore(wrapper, dateInput);
            wrapper.appendChild(dateInput);
        }
        
        // Style the input for week view
        dateInput.parentElement.appendChild(rangeDisplay);
        dateInput.style.opacity = '0';
        dateInput.style.position = 'absolute';
        dateInput.style.zIndex = '10';
        dateInput.style.width = '100%';
        dateInput.style.height = '100%';
        dateInput.style.cursor = 'pointer';
    }

    resetDateInputDisplay() {
        const dateInput = document.getElementById('date-select');
        const rangeDisplay = dateInput.nextElementSibling;
        if (rangeDisplay && rangeDisplay.classList.contains('week-range-display')) {
            rangeDisplay.remove();
        }
        
        // Reset all styling to normal
        dateInput.style.opacity = '1';
        dateInput.style.position = '';
        dateInput.style.zIndex = '';
        dateInput.style.width = '';
        dateInput.style.height = '';
        dateInput.style.cursor = '';
        
        // Unwrap from relative wrapper if it exists
        const wrapper = dateInput.parentElement;
        if (wrapper && wrapper.classList.contains('relative') && wrapper !== dateInput.parentElement.parentElement) {
            const grandParent = wrapper.parentElement;
            grandParent.insertBefore(dateInput, wrapper);
            wrapper.remove();
        }
    }

    ensureCurrentWeekSelection() {
        // This method is called when initially switching to week view
        // It should use the last week view date if available, otherwise default to current week
        
        if (this.lastWeekViewDate && this.lastWeekViewDate !== this.currentDate) {
            // Use the last viewed week
            this.currentDate = this.lastWeekViewDate;
            document.getElementById('date-select').value = this.currentDate;
        } else {
            // Default to current week if no last week or already on it
            const today = new Date();
            const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            
            // Check if current date is in the same week as today
            const currentDate = new Date(this.currentDate);
            const currentSunday = new Date(currentDate);
            const currentDayOfWeek = currentDate.getDay();
            currentSunday.setDate(currentDate.getDate() - currentDayOfWeek);
            
            const todaySunday = new Date(today);
            const todayDayOfWeek = today.getDay();
            todaySunday.setDate(today.getDate() - todayDayOfWeek);
            
            // If not in current week, switch to current week
            if (currentSunday.getTime() !== todaySunday.getTime()) {
                this.currentDate = todayString;
                this.updateDateToSundayOfWeek();
            }
        }
        
        // Always update the date input display for week view
        this.updateDateInputForWeekView();
    }

    updateChart() {
        let chartData;
        
        if (this.currentView === 'week') {
            chartData = this.getWeeklyChartData();
        } else {
            chartData = this.getChartData();
        }

        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = document.getElementById('traffic-chart').getContext('2d');

        // Get the current gym's capacity for setting y-axis max
        const gymInfo = window.dataManager ? window.dataManager.getGymInfo(this.currentGym) : null;
        const maxCapacity = gymInfo ? gymInfo.maxCapacity : 200; // fallback to 200 if no gym info
        const yAxisMax = Math.ceil(maxCapacity * 1.1); // Add 10% padding above max capacity
        
        // Check if we need to split data into historical and predicted
        const datasets = this.createDatasets(chartData);

        const chartType = this.currentView === 'week' ? 'bar' : 'line';

                // Add bar chart specific options
        const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: datasets.length > 1,
                        position: 'top',
                        labels: {
                            color: '#6b7280',
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 12
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: yAxisMax,
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 12
                            },
                            stepSize: Math.ceil(yAxisMax / 10) // Create ~10 tick marks
                        },
                        title: {
                            display: true,
                            text: `Occupancy (Max: ${maxCapacity})`,
                            color: '#6b7280',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            };

                   // Add bar chart specific options for Week View
           if (this.currentView === 'week') {
               chartOptions.scales.x.categoryPercentage = 0.9; // More space for categories
               chartOptions.scales.x.barPercentage = 0.7; // Narrower bars for better centering
               chartOptions.scales.x.offset = true; // Better spacing and centering
               
               // Configure ticks for multi-line labels
               chartOptions.scales.x.ticks = {
                   ...chartOptions.scales.x.ticks,
                   maxRotation: 0, // Keep labels horizontal
                   minRotation: 0,
                   font: {
                       size: 11
                   },
                   callback: function(value, index) {
                       // Split multi-line labels for display
                       const label = this.getLabelForValue(value);
                       return label.split('\n');
                   }
               };
               
               // Ensure proper handling of null values in datasets
               chartOptions.plugins.tooltip.filter = function(tooltipItem) {
                   return tooltipItem.parsed.y !== null;
               };
               
               // Stack bars so historical and predicted don't overlap
               chartOptions.scales.x.stacked = false; // We want them side by side, not stacked
               chartOptions.scales.y.stacked = false;
           }

        this.chart = new Chart(ctx, {
            type: chartType,
            data: {
                labels: chartData.labels,
                datasets: datasets
            },
            options: chartOptions
        });
    }

    getChartData() {
        // Check if viewing today and use mixed data method
        const today = new Date();
        const selectedDate = new Date(this.currentDate);
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const [year, month, day] = this.currentDate.split('-').map(Number);
        const selectedDateOnly = new Date(year, month - 1, day);
        const isToday = selectedDateOnly.getTime() === todayOnly.getTime();

        if (window.dataManager) {
            if (isToday && window.dataManager.getTodayTrafficData) {
                // For today, use the mixed data method
                return window.dataManager.getTodayTrafficData(this.currentGym);
        } else {
                // For past/future dates, use regular historical data (static)
                return window.dataManager.getHistoricalTraffic(this.currentGym, this.currentDate);
        }
    }

        // Fallback if data manager is not available
        const hours = [];
        const values = [];
        const now = new Date();
        const dayOfWeek = now.getDay();
        
        // Get gym hours for current day
        let openHour = 7, closeHour = 24;
        if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Mon-Thu
            openHour = 7; closeHour = 24;
        } else if (dayOfWeek === 5) { // Friday
            openHour = 7; closeHour = 22;
        } else if (dayOfWeek === 6) { // Saturday
            openHour = 8; closeHour = 22;
        } else { // Sunday
            openHour = 12; closeHour = 24;
        }

        for (let i = openHour; i < closeHour; i++) {
            // Convert to 12-hour format
            let displayHour;
            if (i === 0) displayHour = '12:00 AM';
            else if (i === 12) displayHour = '12:00 PM';
            else if (i < 12) displayHour = `${i}:00 AM`;
            else displayHour = `${i - 12}:00 PM`;
            
            hours.push(displayHour);
            
            // Simulate realistic gym traffic patterns
            let baseTraffic = 20;
            if (i >= 7 && i <= 9) baseTraffic = 60; // Morning rush
            if (i >= 12 && i <= 14) baseTraffic = 80; // Lunch time
            if (i >= 17 && i <= 21) baseTraffic = 120; // Evening peak
            if (i >= 22) baseTraffic = 30; // Late night

            values.push(baseTraffic + Math.random() * 20);
        }

        return { labels: hours, values: values };
    }

    getWeeklyChartData() {
        if (window.dataManager && window.dataManager.getWeeklyTrafficData) {
            return window.dataManager.getWeeklyTrafficData(this.currentGym, this.currentDate);
        }
        
        // Fallback data if data manager is not available
        return {
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            historicalValues: [50, 60, 65, 70, null, null, null],
            predictedValues: [null, null, null, null, 75, 80, 45],
            dataType: 'weekly'
        };
    }

    createDatasets(chartData) {
        if (!chartData || !chartData.labels) {
            return [{
                label: 'Gym Traffic',
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }];
        }

        // Check if this is the new mixed data format (has historicalValues and predictedValues)
        if (chartData.historicalValues && chartData.predictedValues) {
            // Using mixed data format with separated historical/predicted values
            
            // Use different styling for Week View vs Day View
            const isWeekView = this.currentView === 'week';
            
            const historicalDataset = {
                label: 'Historical Data',
                data: chartData.historicalValues,
                borderColor: isWeekView ? '#2563eb' : '#3b82f6', // Match button blue for week view
                backgroundColor: isWeekView ? '#2563eb' : 'rgba(59, 130, 246, 0.1)', // Match button blue for week view
                tension: 0.4,
                fill: !isWeekView, // No fill for bar charts
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            };

            const predictedDataset = {
                label: 'Predicted Data',
                data: chartData.predictedValues,
                borderColor: isWeekView ? '#dc2626' : '#ef4444', // Bright red for week view
                backgroundColor: isWeekView ? '#dc2626' : 'rgba(239, 68, 68, 0.1)', // Solid bright red for week view
                tension: 0.4,
                fill: !isWeekView, // No fill for bar charts
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            };

            // Add bar-specific styling for Week View
            if (isWeekView) {
                historicalDataset.borderWidth = 1;
                historicalDataset.barThickness = 'flex'; // Let Chart.js calculate optimal thickness
                historicalDataset.maxBarThickness = 60; // Limit maximum thickness
                
                predictedDataset.borderWidth = 1;
                predictedDataset.barThickness = 'flex'; // Let Chart.js calculate optimal thickness
                predictedDataset.maxBarThickness = 60; // Limit maximum thickness
                
                // For bar charts, we need to handle null values differently
                // Chart.js doesn't render bars for null values, which is what we want
                historicalDataset.skipNull = true;
                predictedDataset.skipNull = true;
            }
            
            return [historicalDataset, predictedDataset];
        }

        // Handle traditional data format (has values array)
        if (!chartData.values) {
            return [{
                label: 'Gym Traffic',
                data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }];
        }

        const now = new Date();
        const today = new Date();
        
        // Parse the selected date string properly to avoid timezone issues
        const [year, month, day] = this.currentDate.split('-').map(Number);
        const selectedDateOnly = new Date(year, month - 1, day); // month is 0-indexed
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const isToday = selectedDateOnly.getTime() === todayOnly.getTime();
        const isPastDate = selectedDateOnly < todayOnly;
        const isFutureDate = selectedDateOnly > todayOnly;

        console.log(`Selected date: ${this.currentDate}`);
        console.log(`Today: ${today.toDateString()}`);
        console.log(`Selected date only: ${selectedDateOnly.toDateString()}`);
        console.log(`Today only: ${todayOnly.toDateString()}`);
        console.log(`Is today: ${isToday}, Is past: ${isPastDate}, Is future: ${isFutureDate}`);

        // If viewing past date, everything is historical (blue)
        if (isPastDate) {
            console.log('Showing past date - all blue');
            return [{
                label: 'Historical Data',
                data: chartData.values,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }];
        }

        // If viewing future date, everything is predicted (red)
        if (isFutureDate) {
            console.log('Showing future date - all red');
            return [{
                label: 'Predicted Data',
                data: chartData.values,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ef4444',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }];
        }

        // If viewing today, use the new mixed data method for proper static/dynamic split
        if (isToday) {
            console.log('Showing today - using mixed historical/predicted data');
            
            // Use the new method that provides properly separated static/dynamic data
            if (window.dataManager && window.dataManager.getTodayTrafficData) {
                const todayData = window.dataManager.getTodayTrafficData(this.currentGym);
                
                if (todayData) {
                    console.log(`Split at hour: ${todayData.splitHour}`);
                    console.log('Historical values:', todayData.historicalValues);
                    console.log('Predicted values:', todayData.predictedValues);
                    
                    return [
                        {
                            label: 'Historical Data',
                            data: todayData.historicalValues,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: '#3b82f6',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        },
                        {
                            label: 'Predicted Data',
                            data: todayData.predictedValues,
                            borderColor: '#ef4444',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointBackgroundColor: '#ef4444',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            pointHoverRadius: 6
                        }
                    ];
                }
            }

            // Fallback to original logic if new method isn't available
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            
            console.log(`Current time: ${currentHour}:${currentMinutes.toString().padStart(2, '0')}`);
            console.log('Chart labels:', chartData.labels);
            
            // Find the split point in the data
            let splitIndex = -1;
            for (let i = 0; i < chartData.labels.length; i++) {
                const timeStr = chartData.labels[i];
                const hour = this.parseHourFromLabel(timeStr);
                
                if (hour > currentHour) {
                    splitIndex = i;
                    break;
                }
            }

            // If no split point found, everything is historical
            if (splitIndex === -1) {
                return [{
                    label: 'Historical Data',
                    data: chartData.values,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }];
            }

            // Create historical data (blue) up to split point
            const historicalData = [...chartData.values];
            for (let i = splitIndex; i < historicalData.length; i++) {
                historicalData[i] = null;
            }

            // Create predicted data (red) from split point onwards
            const predictedData = [...chartData.values];
            for (let i = 0; i < splitIndex - 1; i++) {
                predictedData[i] = null;
            }
            // Keep one overlapping point for smooth transition
            if (splitIndex > 0) {
                predictedData[splitIndex - 1] = chartData.values[splitIndex - 1];
            }

            return [
                {
                    label: 'Historical Data',
                    data: historicalData,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Predicted Data',
                    data: predictedData,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#ef4444',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ];
        }

        // Default case (shouldn't reach here)
        return [{
            label: 'Gym Traffic',
            data: chartData.values,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }];
    }

    parseHourFromLabel(timeLabel) {
        // Parse hour from labels like "7:00 AM", "12:00 PM", "11:00 PM"
        const match = timeLabel.match(/(\d+):00\s*(AM|PM)/);
        if (!match) return 0;
        
        let hour = parseInt(match[1]);
        const period = match[2];
        
        if (period === 'AM' && hour === 12) {
            hour = 0; // 12:00 AM is midnight (0)
        } else if (period === 'PM' && hour !== 12) {
            hour += 12; // Convert PM to 24-hour format
        }
        
        return hour;
    }

    getSimulatedData() {
        // Use the data manager if available
        if (window.dataManager) {
            return window.dataManager.getCurrentTraffic(this.currentGym);
        }

        // Fallback implementation
        const now = new Date();
        const hour = now.getHours();
        const dayOfWeek = now.getDay();

        // Base capacity for both gyms
        const maxCapacity = this.currentGym === 'activity-center' ? 150 : 100;

        // Check if gym is open using the same logic as data manager
        let isOpen = false;
        if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Mon-Thu
            isOpen = hour >= 7 && hour < 24;
        } else if (dayOfWeek === 5) { // Friday
            isOpen = hour >= 7 && hour < 22;
        } else if (dayOfWeek === 6) { // Saturday
            isOpen = hour >= 8 && hour < 22;
        } else { // Sunday
            isOpen = hour >= 12 && hour < 24;
        }

        if (!isOpen) {
            return {
                currentOccupancy: 0,
                maxCapacity: maxCapacity,
                capacityPercentage: 0,
                gymName: this.currentGym === 'activity-center' ? 'Activity Center' : 'Rec Center West',
                isOpen: false
            };
        }

        // Simulate realistic traffic patterns
        let currentOccupancy = 30; // Base occupancy

        if (hour >= 7 && hour <= 9) {
            currentOccupancy = 60 + Math.random() * 20; // Morning rush
        } else if (hour >= 12 && hour <= 14) {
            currentOccupancy = 80 + Math.random() * 30; // Lunch time
        } else if (hour >= 17 && hour <= 21) {
            currentOccupancy = 100 + Math.random() * 40; // Evening peak
        } else if (hour >= 22) {
            currentOccupancy = 30 + Math.random() * 10; // Late night
        }

        // Add some randomness
        currentOccupancy += Math.random() * 20 - 10;
        currentOccupancy = Math.max(0, Math.min(maxCapacity, currentOccupancy));

        return {
            currentOccupancy: Math.round(currentOccupancy),
            maxCapacity: maxCapacity,
            capacityPercentage: Math.round((currentOccupancy / maxCapacity) * 100),
            gymName: this.currentGym === 'activity-center' ? 'Activity Center' : 'Rec Center West',
            isOpen: true
        };
    }

    // Utility methods
    formatTime(time) {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Cleanup method
    destroy() {
        this.stopLiveUpdates();
        if (this.chart) {
            this.chart.destroy();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gymTracker = new GymTrafficTracker();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GymTrafficTracker;
} 
