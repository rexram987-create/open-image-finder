import { useI18n } from './i18n/useI18n';

export default function App() {
  const { t } = useI18n();

  return (
    <main className="app-shell">
      <h1>{t('appTitle')}</h1>
    </main>
  );
}
