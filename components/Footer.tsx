export default function Footer() {
  return (
    <div className="w-full h-full p-2 flex flex-row justify-center">
      <span className="mx-4">Created by <a className="cursor:pointer underline" href="https://hanspham.com/">Han Pham</a>. 
        Pokémon and Pokémon character names are trademarks of Nintendo.
        All trademarked images and names are property of their respective owners, and any such material used on this site is
        for educational purposes only. Han has no affiliation with The Pokemon Company, Niantic, Inc., or Nintendo.
      </span> 
      <div>
        <img className="h-5 w-29" alt="GitHub commit activity" src="https://img.shields.io/badge/made%20with%20love%20<3-DB2416"/>
        <span>©2025 All rights reserved.</span>
      </div>
    </div>
  )
}
