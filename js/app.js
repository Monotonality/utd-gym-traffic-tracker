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
            this.updateDisplay();
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

    updateStatusCards(data) {
        // Check if gym is closed
        if (data.isOpen === false) {
            document.getElementById('current-occupancy').textContent = 'CLOSED';
            document.getElementById('capacity-percentage').textContent = 'CLOSED';
            document.getElementById('wait-time').textContent = data.nextOpenTime || 'CLOSED';
            return;
        }

        // Update current occupancy
        document.getElementById('current-occupancy').textContent = data.currentOccupancy;

        // Update capacity percentage
        const capacityPercentage = data.capacityPercentage || Math.round((data.currentOccupancy / data.maxCapacity) * 100);
        document.getElementById('capacity-percentage').textContent = `${capacityPercentage}%`;

        // Update wait time based on occupancy
        let waitTime = '0 min';
        if (capacityPercentage > 80) {
            waitTime = '15-20 min';
        } else if (capacityPercentage > 60) {
            waitTime = '5-10 min';
        }
        document.getElementById('wait-time').textContent = waitTime;
    }

    updateDisplay() {
        const data = this.getSimulatedData();
        this.updateStatusCards(data);
        this.updateChart();
    }

    updateChart() {
        const chartData = this.getChartData();
        
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = document.getElementById('traffic-chart').getContext('2d');
        
        // Check if we need to split data into historical and predicted
        const datasets = this.createDatasets(chartData);
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: datasets
            },
            options: {
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
                        max: 200,
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#6b7280',
                            font: {
                                size: 12
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    getChartData() {
        // Use the data manager to get historical traffic for today
        if (window.dataManager) {
            return window.dataManager.getHistoricalTraffic(this.currentGym, this.currentDate);
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

    createDatasets(chartData) {
        if (!chartData || !chartData.labels || !chartData.values) {
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

        // If viewing today, split based on current time
        if (isToday) {
            console.log('Showing today - splitting at current time');
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            
            console.log(`Current time: ${currentHour}:${currentMinutes.toString().padStart(2, '0')}`);
            console.log('Chart labels:', chartData.labels);
            
            // Find the split point in the data
            let splitIndex = -1;
            for (let i = 0; i < chartData.labels.length; i++) {
                const timeStr = chartData.labels[i];
                const hour = this.parseHourFromLabel(timeStr);
                
                console.log(`Label: ${timeStr}, Parsed hour: ${hour}, Current hour: ${currentHour}`);
                
                if (hour > currentHour) {
                    splitIndex = i;
                    break;
                }
            }
            
            console.log(`Split index: ${splitIndex}`);

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
