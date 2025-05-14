
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import DetectionLog from "../components/DetectionLog";
import ThreatDetails from "../components/ThreatDetails";
import { AppProvider } from "../contexts/AppContext";

const Details = () => {
  const { id } = useParams<{ id?: string }>();
  
  return (
    <AppProvider>
      <Layout>
        {id ? <ThreatDetails /> : <DetectionLog />}
      </Layout>
    </AppProvider>
  );
};

export default Details;
