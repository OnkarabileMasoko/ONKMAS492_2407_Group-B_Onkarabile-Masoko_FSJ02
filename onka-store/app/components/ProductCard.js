<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {products.map(product => (
    <div key={product.id} className="border p-4 rounded-lg">
      <img src={product.image} alt={product.title} className="h-40 w-full object-cover"/>
      <h2 className="text-xl font-semibold">{product.title}</h2>
      <p className="text-secondary">${product.price}</p>
    </div>
  ))}
</div>