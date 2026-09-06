import { App as AntdApp, ConfigProvider } from 'antd';
import AppRouter from './app/AppRouter';

export default function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0f172a', borderRadius: 8 } }}>
      <AntdApp>
        <AppRouter />
      </AntdApp>
    </ConfigProvider>
  );
}
