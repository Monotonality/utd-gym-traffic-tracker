// UTD Gym Traffic Tracker - Data Module
class DataManager {
    constructor() {
        this.gymData = {
            'activity-center': {
                name: 'Activity Center',
                maxCapacity: 150,
                location: 'UTD Campus',
                hours: 'Mon-Thu: 7am-12am | Fri: 7am-10pm | Sat: 8am-10pm | Sun: 12pm-12am'
            },
            'rec-center-west': {
                name: 'Rec Center West',
                maxCapacity: 100,
                location: 'UTD Campus',
                hours: 'Mon-Thu: 7am-12am | Fri: 7am-10pm | Sat: 8am-10pm | Sun: 12pm-12am'
            }
        };
        
        this.trafficPatterns = this.generateTrafficPatterns();
    }

    // Get gym operating hours for a specific day
    getGymHours(dayOfWeek) {
        // dayOfWeek: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Mon-Thu
            return { open: 7, close: 24 }; // 7am - 12am (midnight)
        } else if (dayOfWeek === 5) { // Friday
            return { open: 7, close: 22 }; // 7am - 10pm
        } else if (dayOfWeek === 6) { // Saturday
            return { open: 8, close: 22 }; // 8am - 10pm
        } else { // Sunday
            return { open: 12, close: 24 }; // 12pm - 12am (midnight)
        }
    }

    // Check if gym is open at a specific hour on a specific day
    isGymOpen(hour, dayOfWeek) {
        const hours = this.getGymHours(dayOfWeek);
        return hour >= hours.open && hour < hours.close;
    }

    // Get next opening time when gym is closed
    getNextOpenTime(currentTime) {
        const dayOfWeek = currentTime.getDay();
        const hour = currentTime.getHours();
        const gymHours = this.getGymHours(dayOfWeek);
        
        // If today and before opening time
        if (hour < gymHours.open) {
            return `Today at ${this.formatHour(gymHours.open)}`;
        }
        
        // If closed for today, check tomorrow
        let nextDay = (dayOfWeek + 1) % 7;
        const tomorrowHours = this.getGymHours(nextDay);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        return `${dayNames[nextDay]} at ${this.formatHour(tomorrowHours.open)}`;
    }

    // Generate realistic traffic patterns for different times of day
    generateTrafficPatterns() {
        const patterns = {};
        
        for (let hour = 0; hour < 24; hour++) {
            let baseTraffic = 0; // Default to 0 for closed hours
            
            // Only generate traffic for operating hours
            const now = new Date();
            const dayOfWeek = now.getDay();
            
            if (this.isGymOpen(hour, dayOfWeek)) {
                baseTraffic = 20; // Base traffic when open
                
                // Morning rush (7-9 AM)
                if (hour >= 7 && hour <= 9) {
                    baseTraffic = 60;
                }
                // Lunch time (12-2 PM)
                else if (hour >= 12 && hour <= 14) {
                    baseTraffic = 80;
                }
                // Evening peak (5-9 PM)
                else if (hour >= 17 && hour <= 21) {
                    baseTraffic = 120;
                }
                // Late night (after 10 PM)
                else if (hour >= 22) {
                    baseTraffic = 30;
                }
            }
            
            patterns[hour] = baseTraffic;
        }
        
        return patterns;
    }

    // Get current traffic data for a specific gym
    getCurrentTraffic(gymId) {
        const gym = this.gymData[gymId];
        if (!gym) return null;

        const now = new Date();
        const hour = now.getHours();
        const dayOfWeek = now.getDay();
        
        // Check if gym is currently open
        if (!this.isGymOpen(hour, dayOfWeek)) {
            return {
                currentOccupancy: 0,
                maxCapacity: gym.maxCapacity,
                capacityPercentage: 0,
                gymName: gym.name,
                timestamp: now.toISOString(),
                isOpen: false,
                nextOpenTime: this.getNextOpenTime(now)
            };
        }

        let baseTraffic = 20; // Base traffic when open
        
        // Apply time-based patterns
        if (hour >= 7 && hour <= 9) {
            baseTraffic = 60; // Morning rush
        } else if (hour >= 12 && hour <= 14) {
            baseTraffic = 80; // Lunch time
        } else if (hour >= 17 && hour <= 21) {
            baseTraffic = 120; // Evening peak
        } else if (hour >= 22) {
            baseTraffic = 30; // Late night
        }
        
        // Add realistic randomness
        const randomFactor = 0.8 + Math.random() * 0.4; // ±20% variation
        let currentOccupancy = Math.round(baseTraffic * randomFactor);
        
        // Ensure within capacity limits
        currentOccupancy = Math.max(0, Math.min(gym.maxCapacity, currentOccupancy));
        
        return {
            currentOccupancy: currentOccupancy,
            maxCapacity: gym.maxCapacity,
            capacityPercentage: Math.round((currentOccupancy / gym.maxCapacity) * 100),
            gymName: gym.name,
            timestamp: now.toISOString(),
            isOpen: true
        };
    }

    // Convert 24-hour time to 12-hour format
    formatHour(hour) {
        if (hour === 0) return '12:00 AM';
        if (hour === 12) return '12:00 PM';
        if (hour < 12) return `${hour}:00 AM`;
        return `${hour - 12}:00 PM`;
    }

    // Get historical traffic data for a specific date
    getHistoricalTraffic(gymId, date) {
        const gym = this.gymData[gymId];
        if (!gym) return null;

        const hours = [];
        const values = [];
        const dayOfWeek = new Date(date).getDay();
        const gymHours = this.getGymHours(dayOfWeek);
        
        // Only show hours when gym is open
        for (let hour = gymHours.open; hour < gymHours.close; hour++) {
            hours.push(this.formatHour(hour));
            
            let baseTraffic = 20; // Base traffic when open
            
            // Apply time-based patterns
            if (hour >= 7 && hour <= 9) {
                baseTraffic = 60; // Morning rush
            } else if (hour >= 12 && hour <= 14) {
                baseTraffic = 80; // Lunch time
            } else if (hour >= 17 && hour <= 21) {
                baseTraffic = 120; // Evening peak
            } else if (hour >= 22) {
                baseTraffic = 30; // Late night
            }
            
            // Add day-of-week variation
            let dayMultiplier = 1.0;
            if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
                dayMultiplier = 0.6; // 40% less traffic on weekends
            } else if (dayOfWeek === 5) { // Friday
                dayMultiplier = 1.2; // 20% more traffic on Friday
            }
            
            // Add random variation
            const randomFactor = 0.8 + Math.random() * 0.4;
            const traffic = Math.round(baseTraffic * dayMultiplier * randomFactor);
            
            values.push(Math.max(0, Math.min(gym.maxCapacity, traffic)));
        }
        
        return {
            labels: hours,
            values: values,
            gymName: gym.name,
            date: date,
            dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek],
            hours: `${this.formatHour(gymHours.open)} - ${this.formatHour(gymHours.close === 24 ? 0 : gymHours.close)}`
        };
    }

    // Get weekly traffic data
    getWeeklyTraffic(gymId) {
        const gym = this.gymData[gymId];
        if (!gym) return null;

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const values = [];
        
        for (let day = 0; day < 7; day++) {
            let avgTraffic = 0;
            
            // Calculate average traffic for each day
            for (let hour = 6; hour <= 22; hour++) { // Operating hours
                avgTraffic += this.trafficPatterns[hour];
            }
            
            avgTraffic = avgTraffic / 17; // Average over 17 hours
            
            // Apply day-specific multipliers
            let dayMultiplier = 1.0;
            if (day === 0 || day === 6) { // Weekend
                dayMultiplier = 0.6;
            } else if (day === 5) { // Friday
                dayMultiplier = 1.2;
            }
            
            const traffic = Math.round(avgTraffic * dayMultiplier);
            values.push(Math.max(0, Math.min(gym.maxCapacity, traffic)));
        }
        
        return {
            labels: days,
            values: values,
            gymName: gym.name
        };
    }

    // Get predicted traffic data
    getPredictedTraffic(gymId, hoursCount = 12) {
        const gym = this.gymData[gymId];
        if (!gym) return null;

        const labels = [];
        const values = [];
        const now = new Date();
        const currentHour = now.getHours();
        const dayOfWeek = now.getDay();
        const gymHours = this.getGymHours(dayOfWeek);
        
        let count = 0;
        for (let i = 0; count < hoursCount && i < 24; i++) {
            const futureHour = (currentHour + i) % 24;
            const futureDay = dayOfWeek + Math.floor((currentHour + i) / 24);
            const futureDayOfWeek = futureDay % 7;
            const futureDayHours = this.getGymHours(futureDayOfWeek);
            
            // Only include hours when gym is open
            if (futureHour >= futureDayHours.open && futureHour < futureDayHours.close) {
                labels.push(this.formatHour(futureHour));
                
                let baseTraffic = 20; // Base traffic when open
                
                // Apply time-based patterns
                if (futureHour >= 7 && futureHour <= 9) {
                    baseTraffic = 60; // Morning rush
                } else if (futureHour >= 12 && futureHour <= 14) {
                    baseTraffic = 80; // Lunch time
                } else if (futureHour >= 17 && futureHour <= 21) {
                    baseTraffic = 120; // Evening peak
                } else if (futureHour >= 22) {
                    baseTraffic = 30; // Late night
                }
                
                // Add prediction uncertainty (more uncertainty for further future)
                const uncertaintyFactor = 1 + (count * 0.05); // 5% more uncertainty per hour
                const randomFactor = (0.9 + Math.random() * 0.2) * uncertaintyFactor;
                
                const traffic = Math.round(baseTraffic * randomFactor);
                values.push(Math.max(0, Math.min(gym.maxCapacity, traffic)));
                count++;
            }
        }
        
        return {
            labels: labels,
            values: values,
            gymName: gym.name,
            predictionType: 'short-term'
        };
    }

    // Get gym information
    getGymInfo(gymId) {
        return this.gymData[gymId] || null;
    }

    // Get all gyms
    getAllGyms() {
        return Object.keys(this.gymData).map(id => ({
            id: id,
            ...this.gymData[id]
        }));
    }

    // Calculate wait time based on occupancy
    calculateWaitTime(occupancy, maxCapacity) {
        const percentage = (occupancy / maxCapacity) * 100;
        
        if (percentage >= 90) return '20-30 min';
        if (percentage >= 80) return '15-20 min';
        if (percentage >= 70) return '10-15 min';
        if (percentage >= 60) return '5-10 min';
        return '0 min';
    }

    // Get traffic status (low, medium, high, very high)
    getTrafficStatus(occupancy, maxCapacity) {
        const percentage = (occupancy / maxCapacity) * 100;
        
        if (percentage >= 90) return 'very-high';
        if (percentage >= 70) return 'high';
        if (percentage >= 40) return 'medium';
        return 'low';
    }

    // Format data for API response
    formatApiResponse(data, type = 'current') {
        return {
            success: true,
            data: data,
            type: type,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    // Simulate API delay
    async simulateApiDelay(minDelay = 100, maxDelay = 500) {
        const delay = Math.random() * (maxDelay - minDelay) + minDelay;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // Async wrapper for data retrieval (simulates API calls)
    async getCurrentTrafficAsync(gymId) {
        await this.simulateApiDelay();
        return this.getCurrentTraffic(gymId);
    }

    async getHistoricalTrafficAsync(gymId, date) {
        await this.simulateApiDelay();
        return this.getHistoricalTraffic(gymId, date);
    }

    async getWeeklyTrafficAsync(gymId) {
        await this.simulateApiDelay();
        return this.getWeeklyTraffic(gymId);
    }

    async getPredictedTrafficAsync(gymId, hours) {
        await this.simulateApiDelay();
        return this.getPredictedTraffic(gymId, hours);
    }
}

// Initialize data manager
window.dataManager = new DataManager();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}
