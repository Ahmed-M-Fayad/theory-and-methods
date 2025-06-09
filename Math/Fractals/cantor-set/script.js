/**
 * Interactive Cantor Set Visualizer
 * A comprehensive tool for exploring fractal geometry
 */

class CantorSetVisualizer {
    constructor() {
        // Configuration
        this.maxIterations = 8;
        this.currentIteration = 1;
        this.segments = [[[0, 1]]];
        this.isAnimating = false;
        this.animationSpeed = 3;
        this.animationFrame = null;
        
        // Initialize the application
        this.initializeElements();
        this.setupEventListeners();
        this.generateAllSegments();
        this.updateVisualization();
    }
    
    /**
     * Initialize DOM elements
     */
    initializeElements() {
        this.iterationSlider = document.getElementById('iterationSlider');
        this.speedSlider = document.getElementById('speedSlider');
        this.playPauseBtn = document.getElementById('playPause');
        this.resetBtn = document.getElementById('reset');
        this.iterationValue = document.getElementById('iterationValue');
        this.speedValue = document.getElementById('speedValue');
        
        // Statistics elements
        this.segmentCountEl = document.getElementById('segmentCount');
        this.totalLengthEl = document.getElementById('totalLength');
        this.fractalDimEl = document.getElementById('fractalDim');
        this.efficiencyEl = document.getElementById('efficiency');
    }
    
    /**
     * Setup event listeners for user interactions
     */
    setupEventListeners() {
        // Iteration slider
        this.iterationSlider.addEventListener('input', (e) => {
            this.currentIteration = parseInt(e.target.value);
            this.iterationValue.textContent = this.currentIteration;
            if (!this.isAnimating) {
                this.updateVisualization();
            }
        });
        
        // Speed slider
        this.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.speedValue.textContent = this.animationSpeed;
        });
        
        // Control buttons
        this.playPauseBtn.addEventListener('click', () => {
            this.toggleAnimation();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.reset();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    this.toggleAnimation();
                    break;
                case 'r':
                case 'R':
                    this.reset();
                    break;
                case 'ArrowRight':
                    if (!this.isAnimating && this.currentIteration < this.maxIterations) {
                        this.currentIteration++;
                        this.updateIterationUI();
                        this.updateVisualization();
                    }
                    break;
                case 'ArrowLeft':
                    if (!this.isAnimating && this.currentIteration > 1) {
                        this.currentIteration--;
                        this.updateIterationUI();
                        this.updateVisualization();
                    }
                    break;
            }
        });
    }
    
    /**
     * Generate one iteration of the Cantor set
     * @param {Array} segments - Current segments
     * @returns {Array} New segments after removing middle thirds
     */
    generateCantorIteration(segments) {
        const newSegments = [];
        for (const [start, end] of segments) {
            const length = end - start;
            const third = length / 3;
            
            // Keep first third and last third, remove middle third
            newSegments.push([start, start + third]);
            newSegments.push([start + 2 * third, end]);
        }
        return newSegments;
    }
    
    /**
     * Pre-generate all Cantor set iterations
     */
    generateAllSegments() {
        this.segments = [[[0, 1]]]; // Initial segment
        
        for (let i = 1; i < this.maxIterations; i++) {
            const newSegments = this.generateCantorIteration(this.segments[i - 1]);
            this.segments.push(newSegments);
        }
    }
    
    /**
     * Generate color for given iteration
     * @param {number} iteration - Current iteration
     * @param {number} total - Total iterations
     * @returns {string} HSL color string
     */
    getColorScale(iteration, total) {
        const hue = (iteration / total) * 280; // Blue to purple range
        const saturation = 70 + (iteration / total) * 20; // Increase saturation
        const lightness = 50 + (iteration / total) * 20; // Increase lightness
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    
    /**
     * Update the main construction plot
     */
    updateMainPlot() {
        const traces = [];
        const iterations = Math.min(this.currentIteration, this.segments.length);
        
        // Create traces for each iteration
        for (let i = 0; i < iterations; i++) {
            const segments = this.segments[i];
            const y = this.maxIterations - i - 1; // Reverse order for display
            const color = this.getColorScale(i, this.maxIterations - 1);
            
            // Create filled rectangles for each segment
            for (const [start, end] of segments) {
                traces.push({
                    x: [start, end, end, start, start],
                    y: [y - 0.35, y - 0.35, y + 0.35, y + 0.35, y - 0.35],
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'lines',
                    line: { 
                        color: color, 
                        width: 3 
                    },
                    fillcolor: color,
                    opacity: 0.8,
                    showlegend: false,
                    hovertemplate: `<b>Iteration:</b> ${i}<br>` +
                                  `<b>Segment:</b> [${start.toFixed(4)}, ${end.toFixed(4)}]<br>` +
                                  `<b>Length:</b> ${(end - start).toFixed(6)}<br>` +
                                  `<extra></extra>`
                });
            }
        }
        
        // Plot layout configuration
        const layout = {
            title: {
                text: `Cantor Set Construction - Iteration ${iterations - 1}`,
                font: { 
                    size: 20, 
                    color: 'white',
                    family: 'Segoe UI, Arial'
                }
            },
            xaxis: {
                title: {
                    text: 'Position',
                    font: { color: 'white', size: 14 }
                },
                range: [-0.05, 1.05],
                gridcolor: '#333',
                color: 'white',
                tickfont: { color: 'white' }
            },
            yaxis: {
                title: {
                    text: 'Iteration Level',
                    font: { color: 'white', size: 14 }
                },
                range: [-0.5, this.maxIterations - 0.5],
                tickvals: Array.from({length: this.maxIterations}, (_, i) => this.maxIterations - i - 1),
                ticktext: Array.from({length: this.maxIterations}, (_, i) => i.toString()),
                gridcolor: '#333',
                color: 'white',
                tickfont: { color: 'white' }
            },
            plot_bgcolor: 'rgba(0,0,0,0.2)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: 'white' },
            margin: { t: 60, r: 20, b: 60, l: 60 }
        };
        
        const config = {
            responsive: true,
            displayModeBar: false
        };
        
        Plotly.newPlot('mainPlot', traces, layout, config);
    }
    
    /**
     * Update the fractal dimension analysis plot
     */
    updateDimensionPlot() {
        const iterations = Math.min(this.currentIteration, this.segments.length);
        const x = Array.from({length: iterations}, (_, i) => i);
        const y = x.map(i => Math.log(this.segments[i].length));
        
        const trace = {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'lines+markers',
            line: { 
                color: '#4ecdc4', 
                width: 4,
                shape: 'spline'
            },
            marker: { 
                color: '#ff6b6b', 
                size: 10,
                line: { color: 'white', width: 2 }
            },
            name: 'Log(Segments)',
            hovertemplate: '<b>Iteration:</b> %{x}<br>' +
                          '<b>Log(Segments):</b> %{y:.3f}<br>' +
                          '<extra></extra>'
        };
        
        const layout = {
            title: {
                text: 'Fractal Dimension Analysis',
                font: { size: 16, color: 'white' }
            },
            xaxis: {
                title: {
                    text: 'Iteration',
                    font: { color: 'white', size: 12 }
                },
                gridcolor: '#333',
                color: 'white',
                tickfont: { color: 'white' }
            },
            yaxis: {
                title: {
                    text: 'Log(Number of Segments)',
                    font: { color: 'white', size: 12 }
                },
                gridcolor: '#333',
                color: 'white',
                tickfont: { color: 'white' }
            },
            plot_bgcolor: 'rgba(0,0,0,0.2)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: 'white' },
            showlegend: false,
            margin: { t: 50, r: 20, b: 50, l: 60 }
        };
        
        const config = {
            responsive: true,
            displayModeBar: false
        };
        
        Plotly.newPlot('dimensionPlot', [trace], layout, config);
    }
    
    /**
     * Update the total length evolution plot
     */
    updateLengthPlot() {
        const iterations = Math.min(this.currentIteration, this.segments.length);
        const x = Array.from({length: iterations}, (_, i) => i);
        const y = x.map(i => {
            return this.segments[i].reduce((sum, [start, end]) => sum + (end - start), 0);
        });
        
        const trace = {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'lines+markers',
            line: { 
                color: '#45b7d1', 
                width: 4,
                shape: 'spline'
            },
            marker: { 
                color: '#ff9ff3', 
                size: 10,
                line: { color: 'white', width: 2 }
            },
            fill: 'tonexty',
            fillcolor: 'rgba(69, 183, 209, 0.3)',
            name: 'Total Length',
            hovertemplate: '<b>Iteration:</b> %{x}<br>' +
                          '<b>Total Length:</b> %{y:.6f}<br>' +
                          '<extra></extra>'
        };
        
        const layout = {
            title: {
                text: 'Total Length vs Iteration',
                font: { size: 16, color: 'white' }
            },
            xaxis: {
                title: {
                    text: 'Iteration',
                    font: { color: 'white', size: 12 }
                },
                gridcolor: '#333',
                color: 'white',
                tickfont: { color: 'white' }
            },
            yaxis: {
                title: {
                    text: 'Total Length',
                    font: { color: 'white', size: 12 }
                },
                gridcolor: '#333',
                color: 'white',
                tickfont: { color: 'white' }
            },
            plot_bgcolor: 'rgba(0,0,0,0.2)',
            paper_bgcolor: 'rgba(0,0,0,0)',
            font: { color: 'white' },
            showlegend: false,
            margin: { t: 50, r: 20, b: 50, l: 60 }
        };
        
        const config = {
            responsive: true,
            displayModeBar: false
        };
        
        Plotly.newPlot('lengthPlot', [trace], layout, config);
    }
    
    /**
     * Update statistics panel
     */
    updateStats() {
        const iteration = Math.min(this.currentIteration - 1, this.segments.length - 1);
        
        if (iteration >= 0) {
            const currentSegments = this.segments[iteration];
            const segmentCount = currentSegments.length;
            const totalLength = currentSegments.reduce((sum, [start, end]) => sum + (end - start), 0);
            const fractalDim = Math.log(2) / Math.log(3); // Theoretical value
            const efficiency = totalLength * 100;
            
            // Animate number changes
            this.animateValue(this.segmentCountEl, segmentCount, 0);
            this.animateValue(this.totalLengthEl, totalLength, 3);
            this.animateValue(this.fractalDimEl, fractalDim, 3);
            this.animateValue(this.efficiencyEl, efficiency, 1, '%');
        }
    }
    
    /**
     * Animate number changes in statistics
     */
    animateValue(element, targetValue, decimals = 0, suffix = '') {
        const currentValue = parseFloat(element.textContent) || 0;
        const increment = (targetValue - currentValue) / 20;
        let current = currentValue;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= targetValue) || 
                (increment < 0 && current <= targetValue)) {
                current = targetValue;
                clearInterval(timer);
            }
            element.textContent = current.toFixed(decimals) + suffix;
        }, 50);
    }
    
    /**
     * Update iteration UI elements
     */
    updateIterationUI() {
        this.iterationSlider.value = this.currentIteration;
        this.iterationValue.textContent = this.currentIteration;
    }
    
    /**
     * Update all visualizations
     */
    updateVisualization() {
        this.updateMainPlot();
        this.updateDimensionPlot();
        this.updateLengthPlot();
        this.updateStats();
    }
    
    /**
     * Toggle animation play/pause
     */
    toggleAnimation() {
        if (this.isAnimating) {
            this.stopAnimation();
        } else {
            this.startAnimation();
        }
    }
    
    /**
     * Start the animation
     */
    startAnimation() {
        this.isAnimating = true;
        this.playPauseBtn.textContent = '⏸ Pause';
        this.iterationSlider.disabled = true;
        
        const animate = () => {
            if (!this.isAnimating) return;
            
            this.currentIteration++;
            if (this.currentIteration > this.maxIterations) {
                this.currentIteration = 1;
            }
            
            this.updateIterationUI();
            this.updateVisualization();
            
            // Calculate delay based on speed (higher speed = shorter delay)
            const delay = Math.max(100, 1500 - (this.animationSpeed * 150));
            this.animationFrame = setTimeout(animate, delay);
        };
        
        animate();
    }
    
    /**
     * Stop the animation
     */
    stopAnimation() {
        this.isAnimating = false;
        this.playPauseBtn.textContent = '▶ Play Animation';
        this.iterationSlider.disabled = false;
        
        if (this.animationFrame) {
            clearTimeout(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    /**
     * Reset to initial state
     */
    reset() {
        this.stopAnimation();
        this.currentIteration = 1;
        this.updateIterationUI();
        this.updateVisualization();
    }
}

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initializing Cantor Set Visualizer...');
    
    try {
        new CantorSetVisualizer();
        console.log('✅ Cantor Set Visualizer initialized successfully!');
        
        // Display keyboard shortcuts in console
        console.log('⌨️  Keyboard Shortcuts:');
        console.log('   Spacebar: Play/Pause animation');
        console.log('   R: Reset to beginning');
        console.log('   ←/→: Navigate iterations manually');
        
    } catch (error) {
        console.error('❌ Error initializing visualizer:', error);
    }
});