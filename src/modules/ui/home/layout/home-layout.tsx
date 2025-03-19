import React from 'react'
import Header from '../components/header'

const ModuelHomeLayout = ({children} : {children : React.ReactNode}) => {
  return (
<div className="w-full h-screen flex justify-start items-start flex-col">
  <Header />
   {children}
</div>

  )
}

export default ModuelHomeLayout