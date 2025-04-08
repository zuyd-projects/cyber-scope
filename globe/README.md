# Cyber-Scope Globe

An interactive 3D globe visualization for cybersecurity attack data using React and Three.js.

## Overview

This project visualizes simulated cyber attacks from various global locations to a central point. The visualization represents attacks as animated arcs flowing across the globe, providing an intuitive way to monitor and understand attack patterns in real-time.

## Features

- 3D interactive globe with realistic Earth texture
- Animated arc trajectories representing cyber attacks
- Customizable attack visualization (colors, speed, etc.)
- Randomly generated attack data with hostnames and IP addresses
- Starfield background effect
- Camera controls for zoom and rotation

## Technologies Used

- React
- react-globe.gl
- Three.js
- JSON data sources

## Project Structure

```
globe/
├── src/
│   ├── assets/
│   │   ├── earth-dark.jpg       # Earth texture
│   │   └── random-locations.json # Geographic point data
│   ├── routes/
│   │   └── finished.jsx         # Main globe component
│   └── ...
└── ... 
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cyber-scope.git
   cd cyber-scope/globe
   ```

2. Install dependencies
   ```bash
   npm install
   # or 
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to the localhost address shown in your terminal

## Usage

The globe visualization will start automatically. You can:
- Click and drag to rotate the globe
- Scroll to zoom in and out
- Hover over arcs to see attack details (source IP and target hostname)

## Customization

You can modify the following aspects of the visualization:

- Attack frequency: Adjust `min` and `max` constants
- Data points: Change the slice parameters in `sliceData`
- Visual appearance: Modify the arc and globe material properties
- Starfield density: Change the array size in `customLayerData`

## License

[Include your license information here]

## Acknowledgments

- Built with [react-globe.gl](https://github.com/vasturiano/react-globe.gl)
- Earth texture sourced from [source name]
