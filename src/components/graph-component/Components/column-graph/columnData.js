export const columnData = {
  title: "Basic Column",
  subtitle: "2020-04-17",
  summary: { label: "55%", subLabel: "132/237" },
  data: [
    {
      label: "Jan",
      value: 50,
      thresholdValue: 80,
      color: "#FEC35B",
    },
    {
      label: "February",
      value: 40,
      thresholdValue: 20,
      color: "#FEC35B",
    },
    {
      label: "Mar",
      value: 28,
      thresholdValue: 60,
      color: "#FEC35B",
    },

    {
      label: "Apr",
      value: 28,
      thresholdValue: 180,
      color: "#FEC35B",
    },
    {
      label: "May",
      value: 22,
      thresholdValue: 80,
      color: "#FE6161",
    },
    {
      label: "Jun",
      value: 32,
      thresholdValue: 20,
      color: "#FEC35B",
    },
    {
      label: "July",
      value: 22,
      thresholdValue: 60,
      color: "#FEC35B",
    },

    {
      label: "Aug",
      value: 20,
      thresholdValue: 180,
      color: "#FEC35B",
    },
    {
      label: "Sep",
      value: 24,
      thresholdValue: 80,
      color: "#FEC35B",
    },
    {
      label: "Oct",
      value: 78,
      thresholdValue: 20,
      color: "#5ED070",
    },
    {
      label: "Nov",
      value: 42,
      thresholdValue: 60,
      color: "#5ED070",
    },

    {
      label: "Dec",
      value: 64,
      thresholdValue: 180,
      color: "#5ED070",
    },
  ],
  labels: [
    {
      label: "label",
      value: "value",
    },
  ],
  info: [],
};

export const stackedData = {
  title: "Stacked Column",
  subtitle: "2020-04-17",
  summary: {
    subtext: "Group Stacked column",
    value: "120",
    widgetName: "Compliance Categories",
  },
  data: [
    {
      label: "Jan",
      Region1: "15",
      Region2: "20",
      Region3: "35",
      Region4: "-25",
    },
    {
      label: "Feb",
      Region1: "24",
      Region2: "48",
      Region3: "10",
      Region4: "21",
    },
    {
      label: "Mar",
      Region1: "33",
      Region2: "10",
      Region3: "-19",
      Region4: "27",
    },
    {
      label: "Apr",
      Region1: "55",
      Region2: "10",
      Region3: "04",
      Region4: "-56",
    },
    {
      label: "May",
      Region1: "27",
      Region2: "6",
      Region3: "-37",
      Region4: "-7",
    },
    {
      label: "June",
      Region1: "25",
      Region2: "18",
      Region3: "19",
      Region4: "19",
    },
    {
      label: "July",
      Region1: "55",
      Region2: "60",
      Region3: "-14",
      Region4: "-25",
    },
    {
      label: "Aug",
      Region1: "7",
      Region2: "16",
      Region3: "08",
      Region4: "14",
    },
    {
      label: "Sep",
      Region1: "09",
      Region2: "23",
      Region3: "29",
      Region4: "17",
    },
    {
      label: "Oct",
      Region1: "14",
      Region2: "26",
      Region3: "34",
      Region4: "11",
    },
    {
      label: "Nov",
      Region1: "34",
      Region2: "27",
      Region3: "14",
      Region4: "16",
    },
    {
      label: "Dec",
      Region1: "08",
      Region2: "13",
      Region3: "44",
      Region4: "25",
    },
  ],
  labels: [
    {
      label: "Region1",
      value: "Region1",
      color: "#2AB9C6",
      enableDash: true,
    },
    {
      label: "Region2",
      value: "Region2",
      color: "#4666A2",
    },
  ],
  info: [],
};

export const groupColumn = {
  title: "Grouped Column",
  subtitle: "2020-04-17",
  summary: {
    subtext: "Group Stacked column",
    value: "120",
    widgetName: "Compliance Categories",
  },
  data: [
    {
      label: "2011",
      planned: "20",
      actual: "100",
      actual1: "20",
    },
    {
      label: "2012",
      planned: "10",
      actual: "11",
      actual1: "22",
    },
    {
      label: "2013",
      planned: "6",
      actual: "30",
      actual1: "28",
    },
    {
      label: "2014",
      planned: "24",
      actual: "16",
      actual1: "30",
    },
    {
      label: "2015",
      planned: "40",
      actual: "15",
      actual1: "30"
    },
    {
      label: "2016",
      planned: "6",
      actual: "16",
      actual1: "20"
    },
    {
      label: "2017",
      planned: "53",
      actual: "27",
      actual1: "20"
    },
    {
      label: "2018",
      planned: "19",
      actual: "35",
      actual1: "20"
    },
    {
      label: "2019",
      planned: "30",
      actual: "50",
      actual1: "20"
    },
    {
      label: "2020",
      planned: "12",
      actual: "45",
      actual1: "20"
    },
    {
      label: "2021",
      planned: "16",
      actual: "46",
      actual1: "20"
    },
    {
      label: "2022",
      planned: "44",
      actual: "51",
      actual1: "20"
    },
    {
      label: "2023",
      planned: "47",
      actual: "50",
      actual1: "20"
    },
  ],
  labels: [
    {
      label: "Planned",
      value: "planned",
      color: "#4666A2",
      enableDash: true,
    },
    {
      label: "Actual",
      value: "actual",
      color: "#2AB9C6",
    },
    {
      label: "Actual1",
      value: "actual1",
      color: "#4D80E0",
    },
  ],
  info: [],
};

export const secondGrouped = {
  title: "Grouped Column",
  subtitle: "2020-04-17",
  summary: {
    subtext: "Group Stacked column",
    value: "120",
    widgetName: "Compliance Categories",
  },
  data: [
    {
      label: "Jan",
      planned: "20",
      actual: "12",
      planned1: "11",
      actual1: "30",
    },
    {
      label: "Feb",
      planned: "15",
      actual: "11",
      planned1: "14",
      actual1: "30",
    },
    {
      label: "Mar",
      planned: "6",
      actual: "20",
      planned1: "17",
      actual1: "21",
    },
    {
      label: "Apr",
      planned: "6",
      actual: "20",
      planned1: "13",
      actual1: "12",
    },
  ],
  labels: [
    {
      label: "Planned",
      value: "planned",
      color: "#CDCDCD",
      enableDash: true,
    },
    {
      label: "Actual",
      value: "actual",
      color: "#ED0295",
    },
    {
      label: "Planned",
      value: "planned1",
      color: "#CDCD00",
    },
    {
      label: "Actual",
      value: "actual1",
      color: "#ED0200",
    },
  ],
  info: [],
};
