import ReactApexChart from "react-apexcharts"

const colors = [
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#FF4560",
  "#775DD0",
  "#3F51B5",
  "#546E7A",
  "#D4526E",
]

const ApexChartHabilit = () => {
  const series = [
    {
      name: "Alunos",
      data: [21, 22, 10, 28],
    },
  ]

  const options: any = {
    chart: {
      type: "bar",
      height: 350,
    },
    colors,
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        "Reading",
        "Speaking",
        "Writing",
        "Listening"
      ],
      labels: {
        style: {
          colors,
          fontSize: "12px",
        },
      },
    },
  }

  return (
    <div className="w-full">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  )
}

export default ApexChartHabilit