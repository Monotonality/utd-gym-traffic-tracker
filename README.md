# UTD Gym Traffic Tracker

A modern web application designed to help University of Texas at Dallas students make informed decisions about when to visit campus gyms by providing visual data on historical, current, and predicted traffic levels.

## 🎯 Overview

The UTD Gym Traffic Tracker is inspired by the popular UTDGrades platform and aims to improve the gym experience by reducing wait times and helping students plan their workouts more effectively. The application provides real-time insights into gym traffic patterns at two main campus locations.

## ✨ Features

### 🏋️ Gym Locations
- **Activity Center** - Main campus gym facility
- **Rec Center West** - Secondary gym location

### 📊 Data Visualization
- **Current Usage**: Live or near-live view of current gym occupancy
- **Historical Data**: Past traffic patterns and trends
- **Predicted Usage**: AI-powered predictions based on historical data and patterns

### 🎨 User Experience
- **Light/Dark Mode**: Toggle between themes for optimal viewing
- **Interactive Charts**: Modern data visualization with interactive elements
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Intuitive Navigation**: Clean, UTDGrades-inspired interface

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/utd-gym-traffic-tracker.git
   cd utd-gym-traffic-tracker
   ```

2. Open `index.html` in your web browser or serve the files using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. Navigate to `http://localhost:8000` in your browser

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS for modern, responsive design
- **Charts**: Chart.js for data visualization
- **Data**: Simulated gym traffic data (Phase 1)
- **Deployment**: Static web hosting ready

## 📁 Project Structure

```
utd-gym-traffic-tracker/
├── index.html          # Main application entry point
├── css/                # Stylesheets
├── js/                 # JavaScript modules
├── data/               # Simulated data files
├── assets/             # Images and static resources
├── README.md           # This file
├── PRD.md             # Product Requirements Document
└── LICENSE            # Project license
```

## 🎯 Use Cases

### For Students
- **Plan Workouts**: Check predicted traffic before heading to the gym
- **Avoid Crowds**: Find optimal times to visit based on historical data
- **Save Time**: Reduce wait times by choosing less busy periods

### For Campus Staff
- **Monitor Usage**: Track gym utilization patterns
- **Resource Planning**: Use data for facility management decisions

## 🔮 Future Roadmap

### Phase 2: Real-time Integration
- Integration with UTD swipe card system
- Live occupancy tracking
- Real-time data updates

### Phase 3: Advanced Features
- Push notifications for optimal workout times
- Social features (workout buddy finder)
- Mobile application development
- Integration with fitness tracking apps

### Phase 4: Expansion
- Additional campus facilities
- Integration with UTD's official student portal
- Advanced analytics and reporting

## 🤝 Contributing

We welcome contributions! Please feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test across different browsers
- Ensure responsive design works on mobile devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the UTDGrades platform design and functionality
- Built for the UTD student community
- Special thanks to the UTD campus recreation department

## 📞 Support

For questions, suggestions, or issues:
- Open an issue on GitHub
- Contact the development team
- Check the [PRD.md](PRD.md) file for detailed project requirements

---

**Note**: This is currently a proof-of-concept application using simulated data. The ultimate goal is to integrate with UTD's official systems for real-time gym traffic monitoring.

*Built with ❤️ for the UTD community*
