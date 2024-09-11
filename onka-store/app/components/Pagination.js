<nav className="flex justify-between mt-4">
  <Link href={`/?page=${parseInt(currentPage) - 1}`} className="px-4 py-2 bg-primary text-white">Previous</Link>
  <Link href={`/?page=${parseInt(currentPage) + 1}`} className="px-4 py-2 bg-secondary text-white">Next</Link>
</nav>