// app/(dashboard)/[storeId]/(routes)/products/[productId]/page.tsx

import connectDB from '@/lib/mongodb';
import { isValidObjectId } from 'mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Size from '@/models/Size';
import Color from '@/models/Color';
import { ProductForm } from './components/product-form';

/** Minimal TS types matching your Mongoose schemas */
interface LeanProduct {
  _id: string;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  categoryId: string;
  sizeId: string;
  colorId: string;
  images: string[];
}

interface LeanCategory {
  _id: string;
  name: string;
}
interface LeanSize {
  _id: string;
  name: string;
  value: string;
}
interface LeanColor {
  _id: string;
  name: string;
  value: string;
}

const ProductPage = async ({ params }: { params: { productId: string; storeId: string } }) => {
  await connectDB();

  // 1. Load existing product if editing
  let product: LeanProduct | null = null;
  if (params.productId !== 'new' && isValidObjectId(params.productId)) {
    const found = await Product.findById(params.productId).lean<{
      _id: any;
      name: string;
      price: number;
      isFeatured: boolean;
      isArchived: boolean;
      categoryId: any;
      sizeId: any;
      colorId: any;
      images: string[];
    } | null>();

    if (found) {
      product = {
        _id: found._id.toString(),
        name: found.name,
        price: found.price,
        isFeatured: found.isFeatured,
        isArchived: found.isArchived,
        categoryId: found.categoryId.toString(),
        sizeId: found.sizeId.toString(),
        colorId: found.colorId.toString(),
        images: found.images,
      };
    }
  }

  // 2. Load dropdown data in parallel
  let categories: LeanCategory[] = [];
  let sizes: LeanSize[] = [];
  let colors: LeanColor[] = [];

  try {
    const [rawCats, rawSizes, rawColors] = await Promise.all([
      Category.find({ storeId: params.storeId }).lean<{ _id: any; name: string }[]>(),
      Size.find({ storeId: params.storeId }).lean<{ _id: any; name: string; value: string }[]>(),
      Color.find({ storeId: params.storeId }).lean<{ _id: any; name: string; value: string }[]>(),
    ]);

    categories = rawCats.map((c) => ({ _id: c._id.toString(), name: c.name }));
    sizes = rawSizes.map((s) => ({ _id: s._id.toString(), name: s.name, value: s.value }));
    colors = rawColors.map((c) => ({ _id: c._id.toString(), name: c.name, value: c.value }));
  } catch (error) {
    console.error('Error fetching product-related data:', error);
  }

  // 3. Render form
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default ProductPage;
