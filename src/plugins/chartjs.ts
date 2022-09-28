import { ArcElement, Chart, Legend, PieController, Title, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(Tooltip, PieController, Legend, Title, ArcElement, ChartDataLabels);
