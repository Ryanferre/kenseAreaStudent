import ReactApexChart from "react-apexcharts"

interface ProgressRadialChartProps {
  progress: number // 0 a 100
}

const ProgressRadialChart = ({ progress }: ProgressRadialChartProps) => {
  const series = [progress]

  const options: any = {
    chart: {
      type: "radialBar",
      height: 350,
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: "14px",
            formatter: () => "Progresso",
          },
          value: {
            show: true,
            fontSize: "32px",
            fontWeight: 700,
            formatter: () => `${progress}%`,
          },
        },
      },
    },
    labels: ["Concluído"],
    colors: [
      progress < 30
        ? "#ef4444" // vermelho
        : progress < 70
        ? "#f59e0b" // amarelo
        : "#22c55e", // verde
    ],
  }

  return (
    <div className="flex flex-col items-center">
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        height={300}
      />

      {/* Mensagem emocional */}
      <p className="mt-2 text-sm text-gray-600 text-center">
        {progress < 25 && "Todo mundo começa do zero. Continue 🚀"}
        {progress >= 25 && progress < 60 && "Você já evoluiu bastante 👏"}
        {progress >= 60 && progress < 85 && "Tá ficando muito bom 😄"}
        {progress >= 85 && "Quase gringo! 😎"}
      </p>
    </div>
  )
}

export default ProgressRadialChart