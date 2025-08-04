// UTD Gym Traffic Tracker - Charts Module
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

        // Merge custom options
        const mergedOptions = this.mergeOptions(defaultOptions, options);
        
        const chart = new Chart(ctx, mergedOptions);
        this.charts.set(canvasId, chart);
        
        return chart;
    }

    // Create a line chart for time series data
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

    // Create a heatmap chart for weekly patterns
    createHeatmapChart(canvasId, data, options = {}) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // Convert data to heatmap format
        const heatmapData = this.convertToHeatmapData(data);
        
        const defaultOptions = {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Traffic Heatmap',
                    data: heatmapData,
                    backgroundColor: (context) => {
                        const value = context.parsed.y;
                        const max = Math.max(...data.values);
                        const ratio = value / max;
                        return `rgba(59, 130, 246, ${ratio})`;
                    },
                    pointRadius: 8,
                    pointHoverRadius: 10
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
                        callbacks: {
                            label: (context) => {
                                return `Traffic: ${context.parsed.y} people`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: 0,
                        max: 23,
                        ticks: {
                            stepSize: 1,
                            color: '#6b7280'
                        },
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
                        }
                    },
                    y: {
                        type: 'linear',
                        min: 0,
                        max: 6,
                        ticks: {
                            stepSize: 1,
                            color: '#6b7280',
                            callback: (value) => {
                                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                                return days[value] || '';
                            }
                        },
                        grid: {
                            color: 'rgba(156, 163, 175, 0.2)'
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

    convertToHeatmapData(data) {
        const heatmapData = [];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        data.labels.forEach((label, dayIndex) => {
            data.values.forEach((value, hourIndex) => {
                heatmapData.push({
                    x: hourIndex,
                    y: dayIndex,
                    r: value / 10 // Size based on value
                });
            });
        });
        
        return heatmapData;
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
            case 'heatmap':
                return this.formatHeatmapData(data);
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

    formatHeatmapData(data) {
        return {
            labels: data.labels,
            values: data.values,
            label: 'Weekly Traffic Pattern'
        };
    }
}

// Initialize chart manager
window.chartManager = new ChartManager();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartManager;
} 