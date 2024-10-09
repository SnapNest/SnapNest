import Login from "../../components/login/Login"
import Register from "../../components/register/Register"

export default function Home() {

    
  return (
    <>
      <div className="flex flex-row items-center h-80">
        <div className="flex-1 text-4xl mr-3">
          SnapNest
        </div>
        <div className="w-0.5 h-full bg-[#283618] mx-4"></div>
        <div>
          <div className="flex-1 text-4xl ml-3">
            Get started
              <div className="flex flex-row mt-5">
                <Register/>
                <Login/>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}