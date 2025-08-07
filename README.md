# UTD Gym Traffic Tracker

A modern, responsive web application for tracking real-time gym occupancy at the University of Texas at Dallas (UTD) campus recreation facilities.

## 🏋️ Features

- **Real-time Traffic Monitoring**: Live occupancy tracking for Activity Center and Rec Center West
- **Interactive Charts**: Beautiful data visualization using Chart.js
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Smart Predictions**: Historical data analysis for traffic forecasting
- **Mobile-Friendly**: Optimized for all device sizes

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/utd-gym-traffic-tracker.git
   cd utd-gym-traffic-tracker
   ```

2. **Start the development server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open your browser**
   Navigate to `http://localhost:8000`

## 📁 Project Structure

```
utd-gym-traffic-tracker/
├── index.html          # Main application entry point
├── css/
│   └── styles.css      # Custom styles and animations
├── js/
│   ├── app.js          # Main application logic
│   ├── charts.js       # Chart.js configurations
│   └── data.js         # Data management and API simulation
├── data/
│   └── sample-data.json # Sample gym traffic data
├── assets/             # Images and static resources
├── README.md           # This file
├── PRD.md             # Product Requirements Document
└── LICENSE            # Project license
```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS for modern, responsive design
- **Charts**: Chart.js for data visualization
- **Data**: Simulated gym traffic data (Phase 1)
- **Deployment**: Static web hosting ready

## 📊 Data Sources

### Current Implementation
- **Simulated Data**: Realistic traffic patterns based on typical gym usage
- **Historical Patterns**: Day-of-week and time-of-day variations
- **Predictive Models**: Machine learning algorithms for traffic forecasting

### Future Enhancements
- **Real-time API Integration**: Direct connection to UTD campus recreation systems
- **Live Sensors**: IoT devices for real-time occupancy tracking
- **User Contributions**: Crowdsourced traffic reports

## 🎯 Core Functionality

### Gym Selection
- Choose between Activity Center and Rec Center West
- Real-time updates when switching between facilities

### Traffic Monitoring
- **Current Occupancy**: Live headcount display
- **Capacity Percentage**: Visual representation of gym utilization
- **Wait Time Estimates**: Smart predictions based on current traffic

### Data Visualization
- **Hourly Patterns**: 24-hour traffic overview
- **Weekly Trends**: Day-of-week analysis
- **Historical Data**: Past traffic patterns
- **Predictions**: Future traffic forecasting

## 🔧 Development

### Local Development
1. Start a local web server in the project directory
2. Open `index.html` in your browser
3. The application will load with simulated data

### Code Structure
- **Modular JavaScript**: ES6+ classes for maintainable code
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG 2.1 compliant design patterns

### Customization
- Edit `data/sample-data.json` to modify traffic patterns
- Update `js/data.js` for custom data logic
- Modify `css/styles.css` for styling changes

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **UTD Campus Recreation**: For providing access to gym facilities and data
- **Chart.js**: For excellent data visualization library
- **Tailwind CSS**: For the modern utility-first CSS framework
- **UTD Students**: For feedback and testing

## 📞 Support

For questions, issues, or feature requests:
- Create an issue on GitHub
- Contact the development team
- Check the [PRD.md](PRD.md) for detailed requirements

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic traffic monitoring
- ✅ Responsive design
- ✅ Chart visualizations
- ✅ Simulated data

### Phase 2 (Planned)
- 🔄 Real-time API integration
- 🔄 User authentication
- 🔄 Push notifications
- 🔄 Advanced analytics

### Phase 3 (Future)
- 📋 Mobile app development
- 📋 IoT sensor integration
- 📋 Machine learning predictions
- 📋 Social features

---

**Built with ❤️ for UTD Students**

*Last updated: January 2024*
