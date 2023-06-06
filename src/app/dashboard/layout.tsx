import Menu from "@/components/Menu";
import css from "@/styles/Dashboard.module.scss";

export const metadata = {
  title: "Dashboard - Workplus+",
  description: "Your ideal application for generating invoice!",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className={css.dashboard}>
      <div className={css.left}>
        <Menu />
      </div>
      <div className={css.right}> {children}</div>
    </section>
  );
};

export default Layout;
