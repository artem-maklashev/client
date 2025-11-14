// SlideSidebar.tsx
import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

interface SlideSidebarProps {
  header?: string;
  children: React.ReactNode; // содержимое панели
}

export const SlideSidebar: React.FC<SlideSidebarProps> = ({ header = 'Панель', children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        label="Открыть панель"
        icon="pi pi-bars"
        onClick={() => setVisible(true)}
        className="p-button-sm"
      />

      <Sidebar
        visible={visible}
        position="left"     // панель выезжает слева
        onHide={() => setVisible(false)}
        style={{ width: '50vw' }} // половина ширины экрана
      >
        <h3>{header}</h3>
        {children}
      </Sidebar>
    </>
  );
};
