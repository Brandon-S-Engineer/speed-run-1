'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { BillboardColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface BillboardClientProps {
  data: BillboardColumn[];
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams<{ storeId: string }>();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Billboards: ${data.length}`}
          description='Billboards are the main way to advertise your products and services. You can create a billboard by clicking on the button.'
        />

        <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
          <Plus className='mr-4 h-4 w-4' />
          Add New
        </Button>
      </div>

      <Separator />

      <DataTable
        searchKey='label'
        columns={columns}
        data={data}
      />

      <Heading
        title='API'
        description='API calls for Billboards'
      />

      <Separator />

      <ApiList
        entityName='billboards'
        entityIdName='billboardId'
      />
    </>
  );
};
