 
import { Route, Routes } from 'react-router-dom';
import './App.css';  
import DefaultLayout from './components/default/DefaultLayout';
import HomePage from './components/HomePage';
import DefaultCategory from './components/default/DefaultCategory';
import AdminLayout from './components/admin/AdminLayout';
import AddCategory from './components/admin/AddCategory';
import AddItemForm from './components/admin/AddItem';
import ShowItems from './components/default/ShowItems';
import DeleteItem from './components/admin/DeleteItem';
import EditItem from './components/admin/EditItem'; 

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/DefaultCategory" element={<DefaultCategory />} />
          <Route path='/category/:slug' element={<ShowItems />} />
        </Route>
        <Route path="/Admin/" element={<AdminLayout />}>
          <Route index element={<HomePage />} /> 
          <Route path="AddCategory" element={<AddCategory />} />
          <Route path="AddItem" element={<AddItemForm/>} />
          <Route path="EditItem" element={<EditItem></EditItem>}/>
          <Route path="DeleteItem" element={<DeleteItem />} />
          <Route path="DefaultCategory" element={<DefaultCategory />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
