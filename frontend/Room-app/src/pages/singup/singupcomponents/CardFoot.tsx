import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
type CardFooterProps = {
  durr: () => Promise<void>;
};

const CardFoot : React.FC<CardFooterProps>= ({ durr })=> {
    const navigate=useNavigate()
    const RedirectToLogin =()=>{
      navigate("/Login")
    }
  return (
    <>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={RedirectToLogin}>
          Log In
        </Button>
        <Button onClick={durr}>Sing Up</Button>
      </CardFooter>
    </>
  );
};

export default CardFoot;
