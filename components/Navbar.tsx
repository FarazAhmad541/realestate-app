export default function Navbar({ username }) {
  return (
    <div className='flex justify-between items-center'>
      <h2>Dream</h2>
      <h2>{username}</h2>
    </div>
  )
}
