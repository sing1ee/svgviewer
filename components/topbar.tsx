'use client';

import { useEffect, useState } from 'react';

interface TopbarConfig {
  bgColor?: string;
  gradientStart?: string;
  gradientEnd?: string;
  textColor?: string;
  text?: string;
  link?: string;
  buttonText?: string;
  buttonBgColor?: string;
  clickReportUrl?: string;
}

const TOPBAR_CONFIG_URL = 'https://img.veo3.directory/0000-topbar/config.json';

// 只允许 http(s) 链接，防止注入 javascript: 等危险协议
function isSafeUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

export default function Topbar() {
  const [config, setConfig] = useState<TopbarConfig | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(TOPBAR_CONFIG_URL);
        if (response.ok) {
          const data: TopbarConfig = await response.json();
          if (data.text) {
            setConfig(data);
          }
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

  if (!config) {
    return null;
  }

  const backgroundStyle = config.gradientStart && config.gradientEnd
    ? {
        background: `linear-gradient(to right, ${config.gradientStart}, ${config.gradientEnd})`,
      }
    : {
        backgroundColor: config.bgColor || '#6366f1',
      };

  const safeLink = config.link && isSafeUrl(config.link) ? config.link : null;

  return (
    <div
      className="w-full py-2 px-4 text-center text-base font-bold"
      style={{
        ...backgroundStyle,
        color: config.textColor || '#fff',
      }}
    >
      <div className="container mx-auto flex items-center justify-center gap-3 flex-wrap">
        {safeLink ? (
          <a
            href={safeLink}
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
        ) : (
          <span>{config.text}</span>
        )}
      </div>
    </div>
  );
}
