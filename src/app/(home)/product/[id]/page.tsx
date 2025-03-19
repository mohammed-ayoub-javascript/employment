import React from 'react'
interface ProductPageProps{
  id : string
}


const ProductPage = ({params} : {params : ProductPageProps}) => {
  
  return (
    <div className=' mt-[90px]'>
      {params.id}
    </div>
  )
}

export default ProductPage