import { Bars } from "react-loader-spinner";

const CustomLoader: React.FC<{ noFullWidth?: boolean }> = ({ noFullWidth }) => {
  const loaderProps = {
    visible: true,
    width: "50",
    height: "50",
    duration: 1,
    color: "#144272",
  };

  return (
    <div {...(noFullWidth ? {} : { className: "loader" })}>
      <Bars {...loaderProps} />
    </div>
  );
};

export default CustomLoader;
