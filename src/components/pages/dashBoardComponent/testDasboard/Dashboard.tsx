// Dashboard.tsx
import React from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Badge } from 'primereact/badge';
import 'primeflex/primeflex.css'; // для grid

const Dashboard = () => {
  // Пример данных для графика
  const chartData = {
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май'],
    datasets: [{
      label: 'Продажи',
      data: [12, 19, 3, 5, 2],
      backgroundColor: '#4F81BD'
    }]
  };

  const tableData = [
    { id: 1, name: 'Товар A', revenue: 12000 },
    { id: 2, name: 'Товар B', revenue: 8500 },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Аналитика продаж</h1>

      {/* Сетка из карточек */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card title="Выручка" className="text-center">
          <div className="text-3xl font-bold text-green-600">₽84 200</div>
          <Badge value="+12%" severity="success" className="mt-2" />
        </Card>

        <Card title="Заказы">
          <div className="text-3xl font-bold">142</div>
        </Card>

        <Card title="Новые клиенты">
          <div className="text-3xl font-bold">28</div>
        </Card>
      </div>

      {/* График */}
      <Card title="Динамика продаж" className="mb-6">
        <Chart type="bar" data={chartData} />
      </Card>

      {/* Таблица */}
      <Card title="Топ товаров">
        <DataTable value={tableData} className="p-datatable-sm">
          <Column field="name" header="Название" />
          <Column field="revenue" header="Выручка" body={(row) => `₽${row.revenue}`} />
        </DataTable>
      </Card>
    </div>
  );
};

export default Dashboard;