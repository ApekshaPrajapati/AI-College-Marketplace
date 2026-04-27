import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/product/${product._id}`)}
      className="border rounded-xl p-3 cursor-pointer hover:shadow-md transition">
      {product.imageUrl &&
        <img src={product.imageUrl} className="w-full h-36 object-cover rounded-lg mb-2" />}
      {product.productType === 'digital' &&
        <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mb-2 inline-block">
          Digital — {product.fileFormat}
        </div>}
      <div className="font-medium text-sm">{product.title}</div>
      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</div>
      <div className="font-medium text-blue-600 mt-2">₹{product.price}</div>
      <div className="text-xs text-gray-400 mt-1">{product.seller?.college}</div>
    </div>
  );
}