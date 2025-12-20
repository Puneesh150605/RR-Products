import React from 'react';
import { Badge, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from './CartContext';

export default function CartIconWithBadge({ onClick }) {
  const { cart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <IconButton color="primary" onClick={onClick} sx={{ ml: 1 }}>
      <Badge badgeContent={count} color="primary" overlap="circular" showZero>
        <ShoppingCartIcon />
      </Badge>
    </IconButton>
  );
}

