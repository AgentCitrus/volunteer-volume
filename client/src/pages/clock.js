// client/src/pages/clock.js
export default function ClockPage() {
    return (
      <div className="p-8">
        <h1 className="text-2xl mb-4">Clock‑In / Clock‑Out</h1>
        {/* Your clock UI here */}
      </div>
    )
  }
  
  // runs **server‑side** on every request
  export async function getServerSideProps({ req }) {
    const token = req.cookies.token
    if (!token) {
      // not signed in → redirect to login
      return { redirect: { destination: '/login', permanent: false } }
    }
    // you could optionally fetch initial data here…
    return { props: {} }
  }
  