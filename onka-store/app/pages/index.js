export async function getServerSideProps(context) {
    const page = context.query.page || 1;
    const res = await fetch(`https://next-ecommerce-api.vercel.app/products?skip=${(page - 1) * 20}`);
    const products = await res.json();
    return {
      props: { products },
    };
  }
  
  

try {
    // fetch logic
  } catch (error) {
    return <div className="text-red-500">Failed to load products</div>;
  }
  
  
