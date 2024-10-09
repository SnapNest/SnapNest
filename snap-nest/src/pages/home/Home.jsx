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
                <button className="bg-[#283618] text-white px-4 py-2 rounded-lg mr-1 text-2xl">Register</button>
                <button className="bg-[#283618] text-white px-4 py-2 rounded-lg ml-1 text-2xl">Log In</button>
              </div>
          </div>
        </div>
      </div>
    </>
  )
}