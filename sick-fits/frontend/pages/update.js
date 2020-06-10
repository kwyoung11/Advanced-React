import { CreateItem } from "../components/CreateItem";
import { UpdateItem } from "../components/UpdateItem";

const Sell = (props) => {
  console.log({ props });
  return (
    <div>
      <UpdateItem id={props.query.id} />
    </div>
  );
};

export default Sell;
