export const stackedGroupedData = {
  title: "Stacked Grouped Column",
  subtitle: "2020-04-17",
  summary: {
    subtext: "Stacked Grouped column",
    value: "120",
    widgetName: "Compliance Categories",
  },
  data: [
    {
      label: "2011",
      planned: {
        Region1: -20,
        Region2: 30,
        Region3: 10,
        Region4: -15,
      },
      actual: {
        Region1: 100,
        Region2: 60,
        Region3: 80,
        Region4: 90,
      },
    },
    {
      label: "2012",
      planned: {
        Region1: 2022,
        Region2: 1800,
        Region3: 1900,
        Region4: 1950,
      },
      actual: {
        Region1: 11,
        Region2: 20,
        Region3: 15,
        Region4: 18,
      },
    },
    {
      label: "2013",
      planned: {
        Region1: 6,
        Region2: 20,
        Region3: 15,
        Region4: 12,
      },
      actual: {
        Region1: -30,
        Region2: 10,
        Region3: -20,
        Region4: 5,
      },
    },
    {
      label: "2014",
      planned: {
        Region1: -24,
        Region2: 18,
        Region3: 8,
        Region4: -10,
      },
      actual: {
        Region1: 16,
        Region2: 22,
        Region3: 19,
        Region4: 18,
      },
    },
    {
      label: "2015",
      planned: {
        Region1: -40,
        Region2: 5,
        Region3: -8,
        Region4: -20,
      },
      actual: {
        Region1: -15,
        Region2: -12,
        Region3: -10,
        Region4: -8,
      },
    },
  ],
  labels: [
    {
      label: "Region1",
      value: "Region1",
      color: "#CDCDCD",
    },
    {
      label: "Region2",
      value: "Region2",
      color: "#ED0295",
    },
    {
      label: "Region3",
      value: "Region3",
      color: "#FF0000",
    },
    {
      label: "Region4",
      value: "Region4",
      color: "#00FF00",
    },
  ],
};

export const mockData = {
  labels: ["T-Mobile", "Verizon", "AT&T", "others"],
  datasets: [
    [
      { Great: 5, Average: 15, Poor: 30 },
      { Great: 10, Average: 5, Poor: 20 },
    ],
    [
      { Great: 3, Average: 8, Poor: 5 },
      { Great: 15, Average: 13, Poor: 10 },
    ],
    [
      { Great: 18, Average: 12, Poor: 10 },
      { Great: 15, Average: 13, Poor: 20 },
    ],
    [
      { Great: 12, Average: 15, Poor: 19 },
      { Great: 15, Average: 13, Poor: 10 },
    ],
  ],
  groups: ["5G", "LTE"],
  colors: {
    Great: "#63D47F",
    Average: "#52BCDE",
    Poor: "#F65959",
  },
};
