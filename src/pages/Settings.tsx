
import Layout from "../components/Layout";
import SettingsPanel from "../components/SettingsPanel";
import { AppProvider } from "../contexts/AppContext";

const Settings = () => {
  return (
    <AppProvider>
      <Layout>
        <SettingsPanel />
      </Layout>
    </AppProvider>
  );
};

export default Settings;
