import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <div>
      <h3>Unauthorized</h3>
      <br />
      <p>You do not have access to requested page</p>
      <section>
        <button onClick={goBack}>go back</button>
      </section>
    </div>
  );
};

export default Unauthorized;
