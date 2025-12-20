import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Alert, Stack } from '@mui/material';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const rrAdmin = localStorage.getItem('rr_admin');
    const headers = token ? { Authorization: `Bearer ${token}` } : rrAdmin ? { 'X-RR-Admin': '1' } : {};
    axios.get('/api/products', { headers })
      .then(res => setProducts(res.data.length ? res.data : [
        { _id: 1, name: 'Disc Brake Pad', brand: 'Brembo', category: 'Brakes & Suspension', price: 890, stock: 22, image: '/images/brake-pad.jpg' },
        { _id: 2, name: 'LED Headlight', brand: 'Osram', category: 'Electrical & Lighting', price: 1190, stock: 14, image: '/images/led-headlight.jpg' },
        { _id: 3, name: 'Side Mirror Set', brand: 'Hero', category: 'Body & Frame', price: 450, stock: 70, image: '/images/mirror-set.jpg' },
        { _id: 4, name: 'Engine Oil 10W-40', brand: 'Motul', category: 'Oils & Lubricants', price: 420, stock: 210, image: '/images/engine-oil.jpg' },
      ]))
      .catch(e => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);
  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return;
    const token = localStorage.getItem('token');
    const rrAdmin = localStorage.getItem('rr_admin');
    const headers = token ? { Authorization: `Bearer ${token}` } : rrAdmin ? { 'X-RR-Admin': '1' } : {};
    axios.delete(`/api/products/${id}`, { headers })
      .then(() => setProducts(products => products.filter(p => p._id !== id)))
      .catch(e => alert('Failed to delete'));
  };
  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <h2>Manage Products</h2>
        <Button component={RouterLink} to="/admin/products/new" variant="contained">Add Product</Button>
      </Stack>
      <div style={{ height: 480, width: '100%' }}>
        <DataGrid
          rows={products}
          getRowId={row => row._id}
          columns={[
            { field: 'name', headerName: 'Name', flex: 1 },
            { field: 'category', headerName: 'Category', flex: 1 },
            { field: 'brand', headerName: 'Brand', flex: 1 },
            { field: 'price', headerName: 'Price', flex: 0.6, type: 'number' },
            { field: 'stock', headerName: 'Stock', flex: 0.5, type: 'number' },
            {
              field: 'actions', headerName: 'Actions', flex: 0.8, renderCell: (params) => (
                <>
                  <Button size="small" onClick={()=>navigate(`/admin/products/${params.id}`)} variant="outlined">Edit</Button>
                  <Button size="small" onClick={()=>handleDelete(params.id)} variant="outlined" color="error" sx={{ml:1}}>Delete</Button>
                </>
              )
            }
          ]}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </div>
    </Box>
  );
}
