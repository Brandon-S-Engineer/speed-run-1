'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { CategoryColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface CategoryClientProps {
  data: CategoryColumn[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Categories: ${data.length}`}
          description='Manage Categories'
        />

        <Button onClick={() => router.push(`/${params.storeId}/categories/new`)}>
          <Plus className='mr-4 h-4 w-4' />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable
        searchKey='name'
        columns={columns}
        data={data}
      />

      <Heading
        title='API'
        description='API calls for Categories'
      />

      <Separator />

      <ApiList
        entityName='categories'
        entityIdName='categoryId'
      />
    </>
  );
};
