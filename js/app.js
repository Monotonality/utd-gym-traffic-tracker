// UTD Gym Traffic Tracker - Main Application
class GymTrafficTracker {
    constructor() {
        this.currentGym = 'activity-center';
        this.currentDate = new Date().toISOString().split('T')[0];
        this.currentTime = new Date().toTimeString().slice(0, 5);
        this.viewMode = 'current';
        this.chart = null;
        this.updateInterval = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadInitialData();
        this.startLiveUpdates();
        this.updateDisplay();
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

        // View mode selection
        document.querySelectorAll('input[name="view-mode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.viewMode = e.target.value;
                this.updateDisplay();
            });
        });
    }

    loadInitialData() {
        // Set default values
        document.getElementById('date-select').value = this.currentDate;
        document.getElementById('time-select').value = this.currentTime;
        document.getElementById('gym-select').value = this.currentGym;
    }

    startLiveUpdates() {
        // Update every 30 seconds for current view
        this.updateInterval = setInterval(() => {
            if (this.viewMode === 'current') {
                this.updateCurrentData();
            }
        }, 30000);

        // Initial update
        this.updateCurrentData();
    }

    updateCurrentData() {
        const now = new Date();
        document.getElementById('update-time').textContent = now.toLocaleTimeString();
        
        // Simulate live data updates
        this.updateStatusCards();
    }

    updateStatusCards() {
        const data = this.getSimulatedData();
        
        // Update current occupancy
        document.getElementById('current-occupancy').textContent = data.currentOccupancy;
        
        // Update capacity percentage
        const capacityPercentage = Math.round((data.currentOccupancy / data.maxCapacity) * 100);
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
        this.updateStatusCards();
        this.updateChart();
    }

    updateChart() {
        const data = this.getChartData();
        
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = document.getElementById('traffic-chart').getContext('2d');
        
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Gym Traffic',
                    data: data.values,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff'
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 200,
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#6b7280'
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
        const data = this.getSimulatedData();
        
        if (this.viewMode === 'current') {
            return this.generateCurrentData();
        } else if (this.viewMode === 'historical') {
            return this.generateHistoricalData();
        } else {
            return this.generatePredictedData();
        }
    }

    generateCurrentData() {
        const hours = [];
        const values = [];
        
        for (let i = 0; i < 24; i++) {
            hours.push(`${i}:00`);
            // Simulate realistic gym traffic patterns
            let baseTraffic = 20;
            if (i >= 6 && i <= 8) baseTraffic = 60; // Morning rush
            if (i >= 12 && i <= 14) baseTraffic = 80; // Lunch time
            if (i >= 17 && i <= 21) baseTraffic = 120; // Evening peak
            if (i >= 22 || i <= 5) baseTraffic = 10; // Late night/early morning
            
            values.push(baseTraffic + Math.random() * 20);
        }
        
        return { labels: hours, values: values };
    }

    generateHistoricalData() {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const values = [85, 92, 78, 95, 88, 45, 35]; // Weekend dip
        
        return { labels: days, values: values };
    }

    generatePredictedData() {
        const hours = [];
        const values = [];
        
        for (let i = 0; i < 24; i++) {
            hours.push(`${i}:00`);
            let baseTraffic = 25;
            if (i >= 6 && i <= 8) baseTraffic = 65;
            if (i >= 12 && i <= 14) baseTraffic = 85;
            if (i >= 17 && i <= 21) baseTraffic = 125;
            if (i >= 22 || i <= 5) baseTraffic = 15;
            
            values.push(baseTraffic + Math.random() * 15);
        }
        
        return { labels: hours, values: values };
    }

    getSimulatedData() {
        const now = new Date();
        const hour = now.getHours();
        
        // Base capacity for both gyms
        const maxCapacity = this.currentGym === 'activity-center' ? 150 : 100;
        
        // Simulate realistic traffic patterns
        let currentOccupancy = 30; // Base occupancy
        
        if (hour >= 6 && hour <= 8) {
            currentOccupancy = 60 + Math.random() * 20; // Morning rush
        } else if (hour >= 12 && hour <= 14) {
            currentOccupancy = 80 + Math.random() * 30; // Lunch time
        } else if (hour >= 17 && hour <= 21) {
            currentOccupancy = 100 + Math.random() * 40; // Evening peak
        } else if (hour >= 22 || hour <= 5) {
            currentOccupancy = 10 + Math.random() * 10; // Late night/early morning
        }
        
        // Add some randomness
        currentOccupancy += Math.random() * 20 - 10;
        currentOccupancy = Math.max(0, Math.min(maxCapacity, currentOccupancy));
        
        return {
            currentOccupancy: Math.round(currentOccupancy),
            maxCapacity: maxCapacity,
            gymName: this.currentGym === 'activity-center' ? 'Activity Center' : 'Rec Center West'
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
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
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