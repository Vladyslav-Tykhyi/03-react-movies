import s from "./ErrorMessage.module.css";

const ErrorMessage = () => {
  return (
    <>
      <p className={s.text}>There was an error, please try again...</p>
    </>
  );
};

export default ErrorMessage;
