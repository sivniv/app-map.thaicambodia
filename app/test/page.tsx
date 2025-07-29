export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Server Test Page</h1>
      <p>If you can see this, the server is working!</p>
      <p>Current time: {new Date().toString()}</p>
    </div>
  )
}