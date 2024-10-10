export default function Sidenav() {
    return (
      <div id="navbar" className="fixed left-0 flex flex-col bg-[#bd803a] h-full w-[6rem] border-r border-[#a3723ad5] items-center">
        <div id="button-container" className="mt-5 flex flex-col">
          <button className="bg-[#ece6ba] text-xl text-black w-20 h-10 px-4 py-2 rounded flex items-center justify-center">
            Teams
          </button>
          <button className="bg-[#ece6ba] text-xl text-black mt-5 w-20 h-10 px-4 py-2 rounded flex items-center justify-center">
            Chats
          </button>
        </div>
      </div>
    );
  }