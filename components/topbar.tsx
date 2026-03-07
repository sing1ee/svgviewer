'use client';

import { useEffect, useState } from 'react';

interface TopbarConfig {
  version: number;
  bgColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
  textColor?: string;
  text?: string;
  link?: string;
  buttonText?: string;
  buttonBgColor?: string;
  countdownEndTime?: string | null;
  clickReportUrl?: string;
}

export default function Topbar() {
  const [config, setConfig] = useState<TopbarConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('https://img.veo3.directory/0000-topbar/config.json');
        if (response.ok) {
          const data: TopbarConfig = await response.json();
          setConfig(data);
          setIsVisible(true);
        }
      } catch (error) {
        console.error('Failed to fetch topbar config:', error);
      }
    };

    fetchConfig();
  }, []);

  const handleClick = () => {
    // 只要有上报地址，就发请求（不阻塞，后台发送）
    if (config?.clickReportUrl) {
      fetch(config.clickReportUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: window.location.origin }),
        keepalive: true, // 关键
      }).catch(() => {}); // 忽略错误，不影响用户跳转
    }
  };


  if (!config || !isVisible || !config.text) {
    return null;
  }

  const backgroundStyle = config.gradientStart && config.gradientEnd
    ? {
        background: `linear-gradient(to right, ${config.gradientStart}, ${config.gradientEnd})`,
      }
    : {
        backgroundColor: config.bgColor || '#6366f1',
      };

  return (
    <div
      className="w-full py-2 px-4 text-center text-base font-bold"
      style={{
        ...backgroundStyle,
        color: config.textColor || '#fff',
      }}
    >
      <div className="container mx-auto flex items-center justify-center gap-3 flex-wrap">
        {config.link && (
          <a
            href={config.link}
            onClick={handleClick}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 flex-wrap hover:opacity-90 transition-opacity"
          >
            <span>{config.text}</span>
            {config.buttonText && (
              <span
                className="inline-block px-4 py-1 rounded-md font-semibold"
                style={{
                  backgroundColor: config.buttonBgColor || '#0a23db',
                  color: config.textColor || '#fff',
                }}
              >
                {config.buttonText}
              </span>
            )}
          </a>
        )}
      </div>
    </div>
  );
}