import React from 'react'
import { DataTableDemo } from './data-table'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

const Products = () => {
  return (
    <div>
      <Link href={"/admin/products/new-product"}>
      <Button><Plus/></Button>

      </Link>
        <DataTableDemo />
    </div>
  )
}

export default Products