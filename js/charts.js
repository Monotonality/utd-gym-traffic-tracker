// UTD Gym Traffic Tracker - Charts Module

/**
 * Manages chart creation and configuration using Chart.js
 * Provides methods for creating line charts, bar charts, and other visualizations
 */
class ChartManager {
    constructor() {
        this.charts = new Map();
        this.defaultColors = [
            '#3b82f6', // Blue
            '#10b981', // Green
            '#f59e0b', // Yellow
            '#ef4444', // Red
            '#8b5cf6', // Purple
            '#06b6d4', // Cyan
            '#f97316', // Orange
            '#84cc16'  // Lime
        ];
    }

    /**
     * Create a line chart for time series data
     * @param {string} canvasId - The ID of the canvas element
     * @param {Object} data - Chart data object
     * @param {Object} options - Chart configuration options
     * @returns {Chart} The created chart instance
     */
    createLineChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const defaultOptions = {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label || 'Gym Traffic',
                    data: data.values,
                    borderColor: this.defaultColors[0],
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: this.defaultColors[0],
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
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
                        bodyColor: '#ffffff',
                        cornerRadius: 8,
                        displayColors: false
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
        };

        const mergedOptions = this.mergeOptions(defaultOptions, options);
        
        const chart = new Chart(ctx, mergedOptions);
        this.charts.set(canvasId, chart);
        
        return chart;
    }

    // Create a bar chart for historical data
    createBarChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const defaultOptions = {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: data.label || 'Gym Traffic',
                    data: data.values,
                    backgroundColor: this.defaultColors[0],
                    borderColor: this.defaultColors[0],
                    borderWidth: 1
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
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                }
            }
        };

        const mergedOptions = this.mergeOptions(defaultOptions, options);
        
        const chart = new Chart(ctx, mergedOptions);
        this.charts.set(canvasId, chart);
        
        return chart;
    }

    // Create a doughnut chart for capacity visualization
    createDoughnutChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        const defaultOptions = {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: this.defaultColors.slice(0, data.values.length),
                    borderColor: '#ffffff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#6b7280',
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff'
                    }
                }
            }
        };

        const mergedOptions = this.mergeOptions(defaultOptions, options);
        
        const chart = new Chart(ctx, mergedOptions);
        this.charts.set(canvasId, chart);
        
        return chart;
    }

    // Update existing chart
    updateChart(canvasId, newData) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.data.labels = newData.labels;
            chart.data.datasets[0].data = newData.values;
            chart.update();
        }
    }

    // Destroy chart
    destroyChart(canvasId) {
        const chart = this.charts.get(canvasId);
        if (chart) {
            chart.destroy();
            this.charts.delete(canvasId);
        }
    }

    // Destroy all charts
    destroyAllCharts() {
        this.charts.forEach((chart, canvasId) => {
            chart.destroy();
        });
        this.charts.clear();
    }

    // Utility methods
    mergeOptions(defaultOptions, customOptions) {
        return JSON.parse(JSON.stringify({
            ...defaultOptions,
            ...customOptions,
            data: {
                ...defaultOptions.data,
                ...customOptions.data
            },
            options: {
                ...defaultOptions.options,
                ...customOptions.options
            }
        }));
    }

    // Generate color based on traffic level
    getTrafficColor(percentage) {
        if (percentage < 30) return '#10b981'; // Green
        if (percentage < 60) return '#f59e0b'; // Yellow
        if (percentage < 80) return '#f97316'; // Orange
        return '#ef4444'; // Red
    }

    // Format data for different chart types
    formatDataForChart(data, chartType) {
        switch (chartType) {
            case 'line':
                return this.formatLineData(data);
            case 'bar':
                return this.formatBarData(data);
            case 'doughnut':
                return this.formatDoughnutData(data);
            default:
                return data;
        }
    }

    formatLineData(data) {
        return {
            labels: data.labels,
            values: data.values,
            label: data.label || 'Gym Traffic'
        };
    }

    formatBarData(data) {
        return {
            labels: data.labels,
            values: data.values,
            label: data.label || 'Gym Traffic'
        };
    }

    formatDoughnutData(data) {
        return {
            labels: ['Low Traffic', 'Medium Traffic', 'High Traffic'],
            values: [
                data.values.filter(v => v < 50).length,
                data.values.filter(v => v >= 50 && v < 100).length,
                data.values.filter(v => v >= 100).length
            ]
        };
    }
}

// Initialize chart manager
window.chartManager = new ChartManager();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
}
