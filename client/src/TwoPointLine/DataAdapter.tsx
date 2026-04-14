import { allTeamColors, allTeams } from "../utils/Consts";

export const createTeam = (abbrev: any, score: any) => {
  return {
    abbrev: abbrev,
    score: score,
    fullTeamName: allTeams[abbrev],
    img: `https://assets.nhle.com/logos/nhl/svg/${abbrev}_light.svg`,
    color: allTeamColors[abbrev][0],
    blackText: allTeamColors[abbrev][1],
  };
};

const image = new Image();
image.src = "https://i.imgur.com/Mm17Z4Q.png";

export const plugin = {
  id: "customCanvasBackgroundImage",
  beforeDraw: (chart) => {
    if (image.complete) {
      const ctx = chart.ctx;
      const { top, left, width, height } = chart.chartArea;
      const x = left - 1;
      const y = top - 1;
      ctx.drawImage(image, x, y, width, height + 1);
    } else {
      image.onload = () => chart.draw();
    }
  },
};

export const options = {
  scales: {
    x: {
      display: false,
      max: 100,
      min: -100,
    },
    y: {
      display: false,
      max: 42.5,
      min: -42.5,
    },
  },
  parsing: {
    xAxisKey: "x",
    yAxisKey: "y",
  },
  animation: {
    duration: 0,
  },

  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      usePointStyle: true,
      callbacks: {
        label: function (tooltipData) {
          const labels = tooltipData.dataset.label.toString();
          const values =
            tooltipData.dataset.data[tooltipData.dataIndex].distanceFromGoal;

          return `${labels}: ${values} ft from goal`;
        },
        title: function (tooltipData) {
          return tooltipData[0].dataset.data[tooltipData[0].dataIndex].name;
        },
      },
    },
  },
};

