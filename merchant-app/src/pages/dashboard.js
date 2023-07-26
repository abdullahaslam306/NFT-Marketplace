import Layout from "../components/Layout";
import CustomDrawer from "../components/Drawer/CustomDrawer";
import InterimComponent from "../components/Interimcomponent/InterimComponent";

export default function Dashboard() {
  return (
    <InterimComponent
      pageName={"dashboard"}
      element={
        <Layout>
          <CustomDrawer />
        </Layout>
      }
    />
  );
}
