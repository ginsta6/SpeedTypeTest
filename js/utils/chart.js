export function createOrUpdateChart(chartInstance, ctx, type, data, options) {
  if (chartInstance) {
    chartInstance.data.datasets[0] = data.datasets[0];
    chartInstance.options = options;
    chartInstance.update();
  } else {
    chartInstance = new Chart(ctx, { type, data, options });
  }
  return chartInstance;
}

export function createWPMChart(chartInstance, ctx, userWPM) {
  const wpmData = {
    labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160],
    datasets: [
      {
        label: "Typing Speed Distribution",
        data: [0.2, 1, 5, 15, 30, 25, 15, 8, 5, 3, 2, 1, 0.5, 0.2],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Your typing speed", // Label for the red vertical line
        data: [], // No actual data
        borderColor: "red",
        borderWidth: 2,
        type: "line", // This is a line dataset but no actual points
      },
    ],
  };

  const wpmOptions = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "Words Per Minute (WPM)" },
        type: "linear",
        min: 0,
        max: 160,
      },
      y: { title: { display: true, text: "% of Typists" } },
    },
    plugins: {
      annotation: {
        annotations: {
          userLine: {
            type: "line",
            mode: "vertical",
            scaleID: "x",
            value: userWPM,
            borderColor: "red",
            borderWidth: 2,
            label: {
              content: `Your WPM: ${userWPM}`,
              enabled: true,
            },
          },
        },
      },
    },
  };

  return createOrUpdateChart(chartInstance, ctx, "line", wpmData, wpmOptions);
}
