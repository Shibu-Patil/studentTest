import { createBrowserRouter } from "react-router-dom";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import Home from "../components/home/Home";
import AllQuestions from "../components/home/allQuestions/AllQuestions";
import PrivateRoutes from "../components/privateRoute/PrivateRoutes";

const routers=createBrowserRouter([
    {
        path:"/",
        element:<Login></Login>
    },{
        path:"/register",
        element:<Register></Register>
    },{
        path:"/home",
        element:<PrivateRoutes><Home></Home></PrivateRoutes>,
        children:[
            {
                index:true,
                element:<AllQuestions></AllQuestions>
            }
        ]
    }
])

export default routers