import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const OrderItemRow = ({ item, orderId }) => {
  const [editingSize, setEditingSize] = useState(false);
  const [tempSize, setTempSize] = useState(item.customSize);
  
  const handleEditSize = () => {
    setEditingSize(true);
  };
  
  const handleSaveSize = () => {
    console.log('Saving size:', {
      orderId,
      orderItemId: item.orderItemId,
      newSize: tempSize
    });
    setEditingSize(false);
  };
  
  const handleCancelEdit = () => {
    setTempSize(item.customSize);
    setEditingSize(false);
  };
  
  const handleSizeChange = (field, value) => {
    setTempSize(prev => ({
      ...prev,
      [field]: parseInt(value) || 0
    }));
  };
  
  return (
    <Box mb={1}>
      <Typography variant="body2">
        {item.itemName} - Price: ${item.price.toFixed(2)}, 
        {editingSize ? (
          <>
            <Box display="inline-flex" alignItems="center" ml={1}>
              Chest: 
              <TextField
                size="small"
                type="number"
                value={tempSize.chest}
                onChange={(e) => handleSizeChange('chest', e.target.value)}
                sx={{ width: 60, mx: 1 }}
              />
              Waist: 
              <TextField
                size="small"
                type="number"
                value={tempSize.waist}
                onChange={(e) => handleSizeChange('waist', e.target.value)}
                sx={{ width: 60, mx: 1 }}
              />
              Hips: 
              <TextField
                size="small"
                type="number"
                value={tempSize.hips}
                onChange={(e) => handleSizeChange('hips', e.target.value)}
                sx={{ width: 60, mx: 1 }}
              />
              <IconButton size="small" onClick={handleSaveSize}>
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleCancelEdit}>
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          </>
        ) : (
          <>
            Size (C/W/H): {item.customSize.chest}/{item.customSize.waist}/{item.customSize.hips}
            <IconButton size="small" onClick={handleEditSize}>
              <EditIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Typography>
    </Box>
  );
};

export default OrderItemRow;