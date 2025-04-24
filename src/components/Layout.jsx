export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 sha">
      <header className="bg-purple-400 text-white shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Real-Time Crypto Price Tracker</h1>
          <p className="mt-1 text-sm sm:text-base">Track, filter, and sort cryptocurrency prices</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
    </div>
  );
}