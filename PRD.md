# UTDGains - UTD Gym Traffic Tracker - Product Requirements Document

## 📋 Overview

UTDGains is a sophisticated web-based application designed to provide comprehensive gym traffic visualization for the University of Texas at Dallas campus recreation facilities. The application combines historical data analysis with predictive modeling to help students make informed decisions about when to visit the gym based on current traffic patterns and future predictions.

## 🎯 Product Vision

**Mission**: Empower UTD students with real-time gym traffic data to optimize their workout schedules and reduce wait times.

**Vision**: Become the go-to platform for UTD students seeking gym availability information, fostering a more efficient and enjoyable fitness experience.

## 👥 Target Users

### Primary Users
- **UTD Students**: Undergraduate and graduate students using campus recreation facilities
- **Campus Recreation Staff**: Administrators managing gym operations

### Secondary Users
- **UTD Faculty/Staff**: University employees using campus recreation facilities
- **Visitors**: Temporary users with campus access

## 🏋️ Core Features

### 1. Dual-View Traffic Monitoring
- **Day View**: Hourly traffic patterns for a specific day with historical/predicted split
- **Week View**: Daily traffic overview for an entire week (Sunday-Saturday)
- **Real-time Status**: Dynamic occupancy, capacity percentage, and busy indicators
- **Color-coded Data**: Blue for historical data, red for predicted data
- **Smart Status Indicators**: Not Busy (<40%), Busy (40-80%), Very Busy (>80%)

### 2. Advanced Gym Selection
- **Activity Center**: Main campus recreation facility (150 capacity)
- **Rec Center West**: Secondary recreation facility (100 capacity)
- **Operating Hours Integration**: 
  - Mon-Thu: 7 AM - 12 AM
  - Fri: 7 AM - 10 PM
  - Sat: 8 AM - 10 PM
  - Sun: 12 PM - 12 AM
- **Dynamic Capacity Scaling**: Y-axis automatically adjusts to gym capacity

### 3. Interactive Data Visualization
- **Dual Chart Types**: Line charts for daily view, bar charts for weekly view
- **Time Format**: 12-hour format for better readability
- **Historical/Predicted Split**: Visual distinction between past and future data
- **Seamless Navigation**: Date pickers, week navigation buttons
- **State Preservation**: Maintains selected dates when switching views

### 4. Enhanced User Interface
- **View Toggle System**: Smooth transitions between Day and Week views
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern Styling**: Tailwind CSS with custom components
- **Dynamic Navigation**: Context-aware controls (time picker hidden in week view)
- **Status Cards**: Real-time updates with color-coded indicators

### 5. Advanced State Management
- **Cross-view Navigation**: Preserves last selected dates for each view
- **Week Selection Logic**: Automatic Sunday-based week calculations
- **Date Validation**: Ensures selected dates align with gym operating hours
- **Smooth Transitions**: Seamless switching between views with proper state restoration

## 📊 Data Requirements

### Current Data Sources
- **Seeded Historical Data**: Static, reproducible historical patterns using deterministic algorithms
- **Dynamic Predicted Data**: Real-time generated predictions for future time periods
- **Realistic Traffic Patterns**: Time-of-day and day-of-week variations based on actual gym usage
- **Capacity Integration**: Gym-specific maximum occupancy limits
- **Operating Hours**: Accurate facility schedules with time-based data filtering

### Future Data Sources
- **Real-time API**: Direct integration with UTD campus recreation systems

### Data Structure
```json
{
  "gymId": "activity-center",
  "currentOccupancy": 85,
  "maxCapacity": 150,
  "capacityPercentage": 57,
  "busyStatus": "Busy",
  "isOpen": true,
  "dataType": "historical",
  "lastUpdated": "2025-08-06T14:30:00Z",
  "weeklyData": {
    "labels": ["Sunday\n8/3", "Monday\n8/4", "..."],
    "historicalValues": [45, 67, null, null, null, null, null],
    "predictedValues": [null, null, null, 89, 123, 78, 56]
  }
}
```

## 🎨 User Experience

### Design Principles
- **Simplicity**: Clean, uncluttered interface
- **Speed**: Fast loading and real-time updates
- **Accuracy**: Reliable data and predictions
- **Accessibility**: Inclusive design for all users

### User Journey
1. **Landing**: User arrives at UTDGains application
2. **Initial View**: Automatic display of current day's traffic for Activity Center
3. **Gym Selection**: Toggle between Activity Center and Rec Center West
4. **View Selection**: Switch between Day View (hourly) and Week View (daily)
5. **Date/Time Navigation**: Use date pickers, time selectors, or week navigation
6. **Data Analysis**: Observe historical (blue) vs predicted (red) patterns
7. **Status Monitoring**: Check real-time occupancy and busy status
8. **Decision Making**: Use comprehensive data to optimize gym visit timing
9. **Return**: Regular usage with preserved preferences and navigation state

## 🔧 Technical Requirements

### Frontend Technologies
- **HTML5**: Semantic markup with proper accessibility structure
- **CSS3**: Modern styling with Tailwind CSS framework
- **JavaScript (ES6+)**: Modular ES6+ classes with comprehensive state management
- **Chart.js**: Advanced interactive visualizations (line charts, bar charts)
- **Responsive Design**: Mobile-first approach with Tailwind CSS utilities

### Performance Requirements
- **Load Time**: < 3 seconds on 3G connection
- **Update Frequency**: Real-time updates every 30 seconds
- **Responsiveness**: Smooth interactions on all devices
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Data Management
- **Modular Architecture**: Separate DataManager class for data operations
- **Seeded Random Generation**: Deterministic historical data using seed algorithms
- **Dynamic Predictions**: Real-time generation of future traffic patterns
- **State Management**: Comprehensive application state with view preservation
- **Error Handling**: Graceful degradation with fallback data generation

## 📱 Platform Support

### Web Application
- **Desktop**: Full-featured experience on large screens
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface for smartphones

### Future Platforms
- **Mobile App**: Native iOS and Android applications
- **Progressive Web App**: Offline-capable web application
- **Smart Watch**: Quick traffic checks on wearable devices

## 🔒 Security & Privacy

### Data Protection
- **No Personal Data**: Application doesn't collect user information
- **Anonymous Usage**: Traffic data is aggregated and anonymous
- **Secure Connections**: HTTPS for all data transmission
- **Privacy Compliance**: Adherence to UTD privacy policies

### Access Control
- **Public Access**: Open to all UTD community members
- **No Authentication**: Simplified access for ease of use
- **Rate Limiting**: Prevent abuse of data endpoints

## 📈 Success Metrics

### User Engagement
- **Daily Active Users**: Track regular usage patterns
- **Session Duration**: Measure time spent on the application
- **Return Rate**: Monitor repeat usage behavior

### Data Accuracy
- **Prediction Accuracy**: Compare forecasts with actual traffic
- **Update Reliability**: Monitor data freshness and availability
- **User Feedback**: Collect accuracy ratings from users

### Performance
- **Page Load Speed**: Maintain fast loading times
- **Uptime**: Ensure 99.9% availability
- **Mobile Performance**: Optimize for mobile devices

## 🚀 Development Phases

### Phase 1 (Completed) - Advanced MVP
- ✅ Dual-view traffic monitoring (Day/Week views)
- ✅ Historical/Predicted data visualization with color coding
- ✅ Responsive web design with Tailwind CSS
- ✅ Advanced Chart.js visualizations (line and bar charts)
- ✅ Sophisticated simulated data system with seeded randomness
- ✅ Comprehensive state management across views
- ✅ Dynamic gym capacity scaling and status indicators
- ✅ Operating hours integration with time-based filtering
- ✅ Week navigation with Sunday-Saturday logic
- ✅ Cross-view date preservation and smooth transitions

### Phase 2 (After Class Development) - Enhanced and Integration
- 🔄 Real-time API integration
- 🔄 Advanced analytics dashboard
- 🔄 Push notifications
- 🔄 User preferences

## 🛠️ Implementation Guidelines

### Code Quality
- **Modular Architecture**: ES6+ classes with clear separation of concerns
- **JSDoc Documentation**: Comprehensive inline documentation for all methods
- **Clean Code**: Removed debug statements, improved formatting
- **State Management**: Robust centralized state handling with proper transitions
- **Error Handling**: Graceful degradation and fallback mechanisms

### Deployment
- **Static Hosting**: CDN-based deployment for performance
- **CI/CD**: Automated testing and deployment pipeline
- **Monitoring**: Real-time application monitoring
- **Backup**: Regular data backup and recovery procedures

---

## 📁 Project Structure
```
utd-gym-traffic-tracker/
├── index.html              # Main application entry point
├── css/
│   └── styles.css          # Custom styling and component definitions
├── js/
│   ├── app.js             # Main GymTrafficTracker class and application logic
│   ├── data.js            # DataManager class for traffic data simulation
│   ├── charts.js          # ChartManager class for Chart.js configurations
│   └── theme.js           # Theme management and utilities
├── data/
│   └── sample-data.json    # Gym configuration and sample data
├── assets/
│   └── favicon.png         # UTDGains favicon
├── README.md               # Project documentation
├── PRD.md                  # This product requirements document
└── LICENSE                 # Project license
```

## 🎯 Key Achievements
- **Sophisticated Data Visualization**: Successfully implemented dual-view system with seamless transitions
- **Advanced State Management**: Robust handling of dates, views, and user preferences
- **Realistic Data Simulation**: Accurate traffic patterns using seeded historical data and dynamic predictions
- **Professional UI/UX**: Modern, responsive design with intuitive navigation
- **Performance Optimized**: Clean, documented code with efficient rendering

---

**Document Version**: 2.0  
**Last Updated**: August 2025  
**Next Review**: September 2025  
