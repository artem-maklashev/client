// SlidePanel.tsx
import React, { useState } from 'react';
import { Panel } from 'primereact/panel';
import { Button } from 'primereact/button';
import './slide-panel.css';

interface SlidePanelProps {
  header?: string;
  children: React.ReactNode; // содержимое панели
}

export const SlidePanel: React.FC<SlidePanelProps> = ({ header = 'Панель', children }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        label={open ? 'Закрыть' : 'Открыть'}
        icon={open ? 'pi pi-times' : 'pi pi-bars'}
        onClick={() => setOpen((v) => !v)}
        className="p-button-sm"
      />

      <div className={`slide-panel ${open ? 'is-open' : ''}`}>
        <Panel header={header}>
          {children}
        </Panel>
      </div>

      {open && <div className="slide-overlay" onClick={() => setOpen(false)} />}
    </>
  );
};
