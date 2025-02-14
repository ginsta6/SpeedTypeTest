# Key Discipline. A speed-typing test app.

## About the Project

This web-based typing speed test isn't just about how fast you can type—it’s about how well you can do it. Sure, you can blaze through the words at lightning speed, but if your accuracy isn’t on point, you're just creating a mess faster. This app ensures that speed and precision go hand in hand.

### What Makes It Special?

- **No Distracting Real-Time Stats** – Unlike other typing tests that bombard you with flashing numbers changing every millisecond, this app lets you _focus_. Your WPM and accuracy are calculated _after_ the test, so you're not constantly glancing at fluctuating stats instead of the words in front of you.

- **Accuracy Tracking** – Every keystroke counts. If you make a typo, you can’t just ignore it; you have to fix it. That means no reckless spamming—just focused, controlled typing.
- **Accuracy Calculation** – If you make more mistakes than correct keystrokes, your accuracy can go _negative_. That’s right—typing nonsense isn't just inefficient, it actively works against you.
- **Detailed Performance Metrics** – At the end of each test, you'll get your **Words Per Minute (WPM)** and **accuracy.** See where you thrive, and where you need improvement.
- **Randomized Texts from an API** – No memorization tricks here. Every test presents you with fresh content, keeping your skills sharp and adaptive.
- **Intuitive UI with Real-Time Feedback** – Instant visual feedback shows errors, highlights corrections, and makes sure you know exactly where you stand at every moment.

### Speed is Nothing Without Control

A little wisdom to drive the point home—this reminds us of an old joke:

> A rookie typist applies for a secretary job. The interviewer asks how fast they can type.  
> They proudly reply, "1,000 characters per minute!"  
> The employer, shocked, asks, "Really?! How?!"  
> They nod and say, "Yeah. But it turns out to be complete nonsense."

Typing fast means nothing if what you're typing is gibberish. This test ensures that speed and accuracy go hand in hand.

So, do you have the perfect balance of speed and control? Or are you just smashing keys hoping for the best? Find out now—start typing! 🚀

## Features

- **Typing Test**: Users can type a given text within a 60-second timer.
- **Real-time Feedback**: Highlights correct and incorrect inputs in real-time.
- **Performance Metrics**: Displays WPM, accuracy, and other statistics after each test.
- **Historical Data**: Saves previous test results and displays them in a table.
- **Charts**: Visualizes typing speed distribution and accuracy using charts.
- **Responsive Design**: Works well on different screen sizes.
- **Keyboard Shortcuts**:
  - **Enter**: Restart the test.
  - **Escape**: Reset the test.
  - **Alt Key**: Load dummy text for testing.

## File Structure

Below is the structure of the project files:

```
typing-speed-test/
├── css/
│ └── styles.css # Custom CSS styles for the application
|
├── js/
│ ├── logic/
│ │ ├── results.js # Handles displaying historical results and metrics
│ │ ├── statistics.js # Manages calculation and display of typing stats
│ │ └── typing.js # Controls typing test logic (text fetching, input handling, timer)
| |
│ ├── utils/
│ │ ├── chart.js # Manages chart creation and updates (WPM and accuracy charts)
│ │ ├── storage.js # Utility functions for local storage operations
│ │ └── ui.js # Handles UI updates (text highlighting, timer display)
│ └── index.js # Initializes the app, sets up event listeners
|
├── index.html # Main HTML file for the typing test interface
├── results.html # HTML file for displaying historical results and performance metrics
└── README.md # Project documentation
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/typing-speed-test.git
   ```

2. Open the project in VS Code:
   ```bash
   cd typing-speed-test
   code .
   ```
3. Launch the app using Live Server:

   This project is designed to be run in a browser. The easiest way to do this is by using the **Live Server** extension in VS Code:

   - Install the Live Server extension from the VS Code marketplace (if you haven't already).
   - Open index.html in VS Code.
   - Right-click inside the editor and select "Open with Live Server".
   - The app will launch in your default web browser.

## Usage

1. Start Typing Test: Click on the input field and start typing the displayed text.
2. View Results: After the timer ends, the application will display your WPM and accuracy.
3. Historical Data: View your previous test results in the results page.
4. Charts: Check the charts to see your typing speed distribution and accuracy breakdown.

5. Keyboard Shortcuts:
   - Press Enter to restart the test.
   - Press Escape to reset the test.

## Technologies Used

- HTML, CSS, JavaScript
- [Bootstrap](https://getbootstrap.com/) for styling and UI components.
- [Chart.js](https://www.chartjs.org/) for data visualization.
- Local Storage for saving user data.
