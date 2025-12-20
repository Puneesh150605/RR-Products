import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Divider,
  Stack,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from './CartContext';

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100vw', sm: 380 } } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
        <ShoppingCartIcon sx={{ color: 'primary.main', mr: 1 }} />
        <Typography variant="h6" fontWeight={900} sx={{ flexGrow: 1 }}>Cart</Typography>
        <IconButton onClick={onClose}><CloseIcon /></IconButton>
      </Box>
      <List sx={{ p: 0, flex: 1, bgcolor: 'background.paper', minHeight: 100 }}>
        {cart.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 3, textAlign: 'center', fontWeight: 700 }}>Cart is empty.</Typography>
        ) : cart.map(item => (
          <ListItem key={item._id} alignItems="flex-start" sx={{ py: 2, px: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <ListItemText
              primary={<Typography fontWeight={700} fontSize={16}>{item.name}</Typography>}
              secondary={<>
                <Typography color="text.secondary" fontWeight={600} fontSize={14}>{item.brand} - {item.category}</Typography>
                <Typography color="info.main" fontWeight={800} fontSize={15}>₹{item.price.toLocaleString()}</Typography>
              </>}
            />
            <Stack alignItems="center" spacing={0.5} direction="column" sx={{ mr: 2, minWidth: 56 }}>
              <TextField
                size="small"
                label="Qty"
                type="number"
                inputProps={{ min: 1, max: Math.max(1, item.stock) }}
                value={item.quantity}
                onChange={e => {
                  let val = Math.max(1, Math.min(item.stock, parseInt(e.target.value) || 1));
                  updateQuantity(item._id, val);
                }}
                sx={{ width: 56 }}
              />
            </Stack>
            <ListItemSecondaryAction>
              <IconButton edge="end" color="error" onClick={() => removeFromCart(item._id)}><DeleteOutlineIcon /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ px: 3, py: 2, bgcolor: 'background.paper' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography fontWeight={900} color="primary.main">Total</Typography>
          <Typography fontWeight={900} color="primary.main">₹{total.toLocaleString()}</Typography>
        </Stack>
        <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ fontWeight: 800, mb: 1, py: 1.2, borderRadius: 2 }} 
            onClick={async () => {
                try {
                    const response = await fetch('/api/products/purchase', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: cart })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        alert('Purchase successful!');
                        clearCart();
                        onClose();
                        window.location.reload(); // To refresh stock on catalog
                    } else {
                        alert(data.error || 'Purchase failed');
                    }
                } catch (e) {
                    alert('Error processing purchase');
                }
            }} 
            disabled={cart.length === 0}
        >
          Checkout (Mark as Sold)
        </Button>
        <Button fullWidth color="error" variant="text" sx={{ fontWeight: 700 }} onClick={clearCart} disabled={cart.length === 0}>
          Clear Cart
        </Button>
      </Box>
    </Drawer>
  );
}

