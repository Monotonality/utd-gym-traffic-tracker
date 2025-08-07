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

    // Get current traffic data for a specific gym (DYNAMIC for current time)
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
        
        // Use Math.random() for current traffic to make it dynamic and live-feeling
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

    // Create a deterministic seed based on date and gym for consistent historical data
    createSeed(gymId, date, hour) {
        // Create a simple hash from the input parameters
        const str = `${gymId}-${date}-${hour}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Seeded random number generator for consistent results
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    // Get historical traffic data for a specific date (STATIC - doesn't change)
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
            
            // Use seeded random for consistent historical data
            const seed = this.createSeed(gymId, date, hour);
            const randomFactor = 0.8 + this.seededRandom(seed) * 0.4;
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

    // Get predicted traffic data (DYNAMIC - changes on each call)
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
                // Using Math.random() to make predictions dynamic and change on refresh
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

    // Get traffic data for a specific date and time (for status cards)
    getTrafficForDateTime(gymId, date, time) {
        const gym = this.gymData[gymId];
        if (!gym) return null;

        // Parse the time (format: "HH:MM AM/PM")
        const [timeStr, ampm] = time.split(' ');
        const [hourStr, minuteStr] = timeStr.split(':');
        let hour = parseInt(hourStr);
        
        // Convert to 24-hour format
        if (ampm === 'PM' && hour !== 12) {
            hour += 12;
        } else if (ampm === 'AM' && hour === 12) {
            hour = 0;
        }

        // Check if gym is open at this time
        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.getDay();
        
        if (!this.isGymOpen(hour, dayOfWeek)) {
            return {
                currentOccupancy: 0,
                maxCapacity: gym.maxCapacity,
                capacityPercentage: 0,
                gymName: gym.name,
                isOpen: false,
                dataType: 'historical' // closed gym is always historical
            };
        }

        // Determine if this is historical or predicted data
        const now = new Date();
        const selectedDateTime = new Date(date);
        selectedDateTime.setHours(hour, parseInt(minuteStr), 0, 0);
        
        const isHistorical = selectedDateTime < now;
        
        // Get traffic data
        let baseTraffic = 20;
        
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

        let traffic;
        if (isHistorical) {
            // Use seeded random for consistent historical data
            const seed = this.createSeed(gymId, date, hour);
            const randomFactor = 0.8 + this.seededRandom(seed) * 0.4;
            traffic = Math.round(baseTraffic * dayMultiplier * randomFactor);
        } else {
            // Use Math.random() for dynamic predicted data
            const randomFactor = 0.8 + Math.random() * 0.4;
            traffic = Math.round(baseTraffic * dayMultiplier * randomFactor);
        }

        const currentOccupancy = Math.max(0, Math.min(gym.maxCapacity, traffic));
        const capacityPercentage = Math.round((currentOccupancy / gym.maxCapacity) * 100);

        return {
            currentOccupancy: currentOccupancy,
            maxCapacity: gym.maxCapacity,
            capacityPercentage: capacityPercentage,
            gymName: gym.name,
            isOpen: true,
            dataType: isHistorical ? 'historical' : 'predicted'
        };
    }

    // Get weekly traffic data with historical/predicted split
    getWeeklyTrafficData(gymId, baseDate = null) {
        const gym = this.gymData[gymId];
        if (!gym) return null;

        // Use provided date or current date as reference
        let referenceDate;
        if (baseDate) {
            // Parse the date string properly to avoid timezone issues
            const [year, month, day] = baseDate.split('-').map(Number);
            referenceDate = new Date(year, month - 1, day); // month is 0-indexed
        } else {
            referenceDate = new Date();
        }
        
        // Get Sunday of the week containing the reference date
        const sundayOfWeek = new Date(referenceDate);
        const dayOfWeek = sundayOfWeek.getDay();
        const daysToSunday = dayOfWeek; // Sunday (0) is the start, so subtract current day
        sundayOfWeek.setDate(sundayOfWeek.getDate() - daysToSunday);

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const labels = [];
        const historicalValues = [];
        const predictedValues = [];
        const today = new Date();
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(sundayOfWeek);
            currentDay.setDate(sundayOfWeek.getDate() + i);
            const currentDayOnly = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
            
            // Create label with day name and date (m/dd format)
            const dayName = dayNames[i];
            const month = currentDay.getMonth() + 1; // Month is 0-indexed
            const day = currentDay.getDate();
            const dateLabel = `${dayName}\n${month}/${day}`;
            labels.push(dateLabel);
            
            // Determine if this day is historical or predicted
            // Days before today are historical, today and after are predicted
            const isHistorical = currentDayOnly < todayOnly;
            
            // Calculate average daily traffic for this day
            const dayOfWeekIndex = currentDay.getDay();
            const gymHours = this.getGymHours(dayOfWeekIndex);
            let dailyTotal = 0;
            let hourCount = 0;

            // Calculate average traffic across all operating hours for this day
            for (let hour = gymHours.open; hour < gymHours.close; hour++) {
                let baseTraffic = 20;
                
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
                if (dayOfWeekIndex === 0 || dayOfWeekIndex === 6) { // Weekend
                    dayMultiplier = 0.6; // 40% less traffic on weekends
                } else if (dayOfWeekIndex === 5) { // Friday
                    dayMultiplier = 1.2; // 20% more traffic on Friday
                }

                let traffic;
                if (isHistorical) {
                    // Use seeded random for consistent historical data
                    const dateStr = currentDay.toISOString().split('T')[0];
                    const seed = this.createSeed(gymId, dateStr, hour);
                    const randomFactor = 0.8 + this.seededRandom(seed) * 0.4;
                    traffic = Math.round(baseTraffic * dayMultiplier * randomFactor);
                } else {
                    // Use Math.random() for dynamic predicted data
                    const randomFactor = 0.8 + Math.random() * 0.4;
                    traffic = Math.round(baseTraffic * dayMultiplier * randomFactor);
                }

                dailyTotal += Math.max(0, Math.min(gym.maxCapacity, traffic));
                hourCount++;
            }

            // Calculate average traffic for the day
            const averageTraffic = hourCount > 0 ? Math.round(dailyTotal / hourCount) : 0;

            if (isHistorical) {
                historicalValues.push(averageTraffic);
                predictedValues.push(null);
            } else {
                historicalValues.push(null);
                predictedValues.push(averageTraffic);
            }
        }

        return {
            labels: labels,
            historicalValues: historicalValues,
            predictedValues: predictedValues,
            gymName: gym.name,
            weekStartDate: sundayOfWeek.toISOString().split('T')[0],
            dataType: 'weekly'
        };
    }

    // Get weekly summary statistics
    getWeeklySummary(gymId, baseDate = null) {
        const weeklyData = this.getWeeklyTrafficData(gymId, baseDate);
        if (!weeklyData) return null;

        const gym = this.gymData[gymId];
        const allValues = [];
        
        // Combine historical and predicted values, filtering out nulls
        for (let i = 0; i < weeklyData.labels.length; i++) {
            const historicalValue = weeklyData.historicalValues[i];
            const predictedValue = weeklyData.predictedValues[i];
            const value = historicalValue !== null ? historicalValue : predictedValue;
            if (value !== null) {
                allValues.push({ day: weeklyData.labels[i], value: value });
            }
        }

        if (allValues.length === 0) {
            return {
                averageOccupancy: 0,
                busiestDay: 'N/A',
                weeklySummary: 'No Data',
                capacityPercentage: 0
            };
        }

        // Calculate average occupancy
        const totalOccupancy = allValues.reduce((sum, item) => sum + item.value, 0);
        const averageOccupancy = Math.round(totalOccupancy / allValues.length);

        // Find busiest day
        const busiestDayData = allValues.reduce((max, item) => 
            item.value > max.value ? item : max
        );

        // Calculate average capacity percentage
        const averageCapacityPercentage = Math.round((averageOccupancy / gym.maxCapacity) * 100);

        // Determine weekly summary
        let weeklySummary;
        if (averageCapacityPercentage < 40) {
            weeklySummary = 'Light Week';
        } else if (averageCapacityPercentage <= 70) {
            weeklySummary = 'Normal Week';
        } else {
            weeklySummary = 'Busy Week';
        }

        return {
            averageOccupancy: averageOccupancy,
            busiestDay: busiestDayData.day,
            weeklySummary: weeklySummary,
            capacityPercentage: averageCapacityPercentage
        };
    }

    // Get mixed historical (static) and predicted (dynamic) data for today's view
    getTodayTrafficData(gymId) {
        const gym = this.gymData[gymId];
        if (!gym) return null;

        const now = new Date();
        const currentHour = now.getHours();
        const today = now.toISOString().split('T')[0];
        const dayOfWeek = now.getDay();
        const gymHours = this.getGymHours(dayOfWeek);

        const labels = [];
        const historicalValues = [];
        const predictedValues = [];

        // Generate data for all operating hours
        for (let hour = gymHours.open; hour < gymHours.close; hour++) {
            labels.push(this.formatHour(hour));

            let baseTraffic = 20;
            
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

            if (hour <= currentHour) {
                // Historical data (STATIC) - use seeded random
                const seed = this.createSeed(gymId, today, hour);
                const randomFactor = 0.8 + this.seededRandom(seed) * 0.4;
                const traffic = Math.round(baseTraffic * randomFactor);
                
                const value = Math.max(0, Math.min(gym.maxCapacity, traffic));
                historicalValues.push(value);
                
                // Add the current hour value to predicted array to create smooth transition
                if (hour === currentHour) {
                    predictedValues.push(value);
                } else {
                    predictedValues.push(null);
                }
            } else {
                // Predicted data (DYNAMIC) - use Math.random()
                const randomFactor = 0.8 + Math.random() * 0.4;
                const traffic = Math.round(baseTraffic * randomFactor);
                
                historicalValues.push(null);
                predictedValues.push(Math.max(0, Math.min(gym.maxCapacity, traffic)));
            }
        }

        return {
            labels: labels,
            historicalValues: historicalValues,
            predictedValues: predictedValues,
            gymName: gym.name,
            date: today,
            splitHour: currentHour
        };
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
