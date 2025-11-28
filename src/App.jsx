import React from 'react'
import "./style/style.css"
import { Provider } from 'react-redux'
import { store } from './store/store'
import { RouterProvider } from 'react-router-dom'
import routers from './routes/routes'
import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
<Provider store={store}>
    <RouterProvider router={routers}></RouterProvider>
    <Toaster></Toaster>
</Provider>
  )
}

export default App