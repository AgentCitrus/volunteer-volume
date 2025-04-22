// client/src/pages/dashboard.js
export default function DashboardPage() {
    return (
      <div className="p-8">
        <h1 className="text-2xl mb-4">Admin Dashboard</h1>
        {/* Your charts & tables here */}
      </div>
    )
  }
  
  export async function getServerSideProps({ req }) {
    const token = req.cookies.token
    if (!token) {
      return { redirect: { destination: '/login', permanent: false } }
    }
    return { props: {} }
  }
  