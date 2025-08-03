import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Typography,
  Table,
  TableBody,
  TableHead,
  CircularProgress,
  Alert,
  Chip,
  Select,
  MenuItem,
  Button,
  Stack
} from '@mui/material';
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import OrderItemRow from './OrderItemRow';

const StatusChip = ({ status }) => {
  const getColor = () => {
    switch (status) {
      case 'active': return 'success';
      case 'churned': return 'error';
      case 'prospect': return 'info';
      default: return 'default';
    }
  };
  
  return <Chip label={status} color={getColor()} size="small" />;
};

const CustomerRow = ({ customer }) => {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);
  const [editingStatus, setEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState(customer.status);

  const fetchOrders = async () => {
    if (!customer?.id) {
      console.error('Invalid customer:', customer);
      setError('Missing customer data');
      return;
    }

    try {
      setLoadingOrders(true);
      setError(null);
      
      const response = await fetch(`/api/customers/${encodeURIComponent(customer.id)}/orders`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with ${response.status}`);
      }

      const { data, success } = await response.json();
      
      if (!success || !Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      setOrders(data);
      
    } catch (err) {
      console.error('Failed to fetch orders:', {
        error: err.message,
        customerId: customer.id,
        endpoint: `/api/customers/${customer.id}/orders`
      });
      setError(err.message);
    } finally {
      setLoadingOrders(false);
    }
  };
  
  const handleExpandClick = async () => {
    if (!open) {
      await fetchOrders();
    }
    setOpen(!open);
  };

  const handleRetry = () => {
    fetchOrders();
  };
  
  const handleEditStatus = () => {
    setEditingStatus(true);
  };
  
  const handleSaveStatus = () => {
    console.log('Saving status:', { customerId: customer.id, newStatus: tempStatus });
    setEditingStatus(false);
  };
  
  const handleCancelEdit = () => {
    setTempStatus(customer.status);
    setEditingStatus(false);
  };
  
  const handleStatusChange = (event) => {
    setTempStatus(event.target.value);
  };
  
  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton 
            size="small" 
            onClick={handleExpandClick}
            disabled={loadingOrders}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography fontWeight={500}>
            {customer.name}
          </Typography>
        </TableCell>
        <TableCell>
          {editingStatus ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Select
                value={tempStatus}
                onChange={handleStatusChange}
                size="small"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="churned">Churned</MenuItem>
                <MenuItem value="prospect">Prospect</MenuItem>
              </Select>
              <IconButton size="small" onClick={handleSaveStatus}>
                <SaveIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleCancelEdit}>
                <CancelIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : (
            <Stack direction="row" alignItems="center" spacing={1}>
              <StatusChip status={customer.status} />
              <IconButton size="small" onClick={handleEditStatus}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </TableCell>
        <TableCell>{customer.email}</TableCell>
        <TableCell align="center">{customer.orderCount}</TableCell>
        <TableCell>${customer.revenue.toFixed(2)}</TableCell>
      </TableRow>
      
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {loadingOrders ? (
                <Box display="flex" justifyContent="center" p={2}>
                  <CircularProgress size={24} />
                </Box>
              ) : error ? (
                <Alert 
                  severity="error"
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={handleRetry}
                    >
                      Retry
                    </Button>
                  }
                >
                  {error}
                </Alert>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <TableRow key={order.orderId}>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {order.orderId}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Stack spacing={1}>
                              {order.items.map((item) => (
                                <OrderItemRow 
                                  key={item.orderItemId} 
                                  item={item} 
                                  orderId={order.orderId} 
                                />
                              ))}
                            </Stack>
                          </TableCell>
                          <TableCell align="right">
                            ${order.totalAmount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                          <Typography color="text.secondary">
                            No orders found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default CustomerRow;