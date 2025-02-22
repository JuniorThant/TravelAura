// import NavSearch from "./NavSearch"
import LinksDropsown from "./LinksDropdown"
import DarkMode from "./DarkMode"
import Logo from "./Logo"
import MenuBar from "./MenuBar"

export default function Navbar() {
  return (
    <nav className="border-b">
        <div className="container flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap gap-4 py-2">
            <Logo/>
            {/* <NavSearch/> */}
            <div className="flex gap-4 items-center">
                <MenuBar/>
                <DarkMode/>
                <LinksDropsown/>
            </div>
        </div>
    </nav>
  )
}
