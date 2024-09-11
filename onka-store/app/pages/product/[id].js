export async function getServerSideProps(context) {
    const { id } = context.params;
    const res = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
    const product = await res.json();
    return { props: { product } };
  }
  
  return (
    <div className="container mx-auto p-4">
      <img src={product.image} className="w-full h-auto"/>
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p>{product.description}</p>
      <p className="text-primary">${product.price}</p>
      <button className="mt-4 bg-secondary text-white px-4 py-2">Add to Cart</button>
    </div>
  );
  
  <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded">
  Shop Now
</button>
