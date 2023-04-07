import React, { useState, useEffect } from "react";
import { Paper, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from "@mui/material";
import { Edit, Save } from "@mui/icons-material";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";




function InvoiceGrid({ invoices, setInvoices }) {

    const isFormValid = (data) => {
      const { qty, price, discount, tax, discountPercentage, taxPercentage } = data;
      if (qty <= 0 || price <= 0 || discount < 0 || tax < 0) return false;
      if (discount > qty * price) return false;
      if (discountPercentage > 100 || taxPercentage > 100) return false;
      return true;
    };

    const [state, setState] = useState({
      editingIndex: -1,
      gridData: invoices,
      openSnackbar: false,
    });

    const handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setState((prevState) => ({ ...prevState, openSnackbar: false }));
    };
  


    useEffect(() => {
      setState((prevState) => ({ ...prevState, gridData: invoices }));
    }, [invoices]);
  
    const handleEdit = (index) => {
      setState((prevState) => ({ ...prevState, editingIndex: index }));
    };
  
    const handleSave = (index) => {
      if (!isFormValid(state.gridData[index])) {
        setState((prevState) => ({ ...prevState, openSnackbar: true }));
        return;
      }
    
      const updatedInvoices = invoices.map((inv) => (inv.id === state.gridData[index].id ? state.gridData[index] : inv));
      setInvoices(updatedInvoices);
      setState((prevState) => ({ ...prevState, editingIndex: -1, openSnackbar: false }));
    };
    
  
      
  
    const handleChange = (index, field, value) => {
      let newGridData = [...state.gridData];
     
      if (field === "discountPercentage" || field === "taxPercentage") {
          value = Math.min(100, value);
      }
      newGridData[index] = { ...state.gridData[index], [field]: value };
  
      if (field === "discountPercentage") {
        newGridData[index].discount = (state.gridData[index].price * state.gridData[index].qty * value) / 100;
      } else if (field === "discount") {
        newGridData[index].discountPercentage = (value * 100) / (state.gridData[index].price * state.gridData[index].qty);
      } else if (field === "taxPercentage") {
        newGridData[index].tax = (state.gridData[index].price * state.gridData[index].qty * value) / 100;
      } else if (field === "tax") {
        newGridData[index].taxPercentage = (value * 100) / (state.gridData[index].price * state.gridData[index].qty);
      }
  
      const tempDiscount = (state.gridData[index].price * state.gridData[index].qty * newGridData[index].discountPercentage) / 100;
      const tempTax = (state.gridData[index].price * state.gridData[index].qty * newGridData[index].taxPercentage) / 100;
      newGridData[index].totalPrice = state.gridData[index].price * state.gridData[index].qty - tempDiscount + tempTax;
  
      setState((prevState) => ({ ...prevState, gridData: newGridData }));

    };
  
    return (
      <>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Qty</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Discount %</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Tax %</TableCell>
                <TableCell>Tax</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.gridData.map((invoice, index) => (
                <TableRow key={invoice.id}>
                  {state.editingIndex === index ? (
                    <>
                      <TableCell>
                        <TextField
                          type="number"
                          value={invoice.qty}
                          onChange={(e) => handleChange(index, "qty", Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={invoice.price}
                          onChange={(e) => handleChange(index, "price", Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={invoice.discountPercentage}
                          onChange={(e) => handleChange(index, "discountPercentage", Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={invoice.discount}
                          onChange={(e) => handleChange(index, "discount", Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={invoice.taxPercentage}
                          onChange={(e) => handleChange(index, "taxPercentage", Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={invoice.tax}
                          onChange={(e) => handleChange(index, "tax", Number(e.target.value))}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField type="number" value={invoice.totalPrice} disabled />
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{invoice.qty}</TableCell>
                      <TableCell>{invoice.price}</TableCell>
                      <TableCell>{invoice.discountPercentage}</TableCell>
                      <TableCell>{invoice.discount}</TableCell>
                      <TableCell>{invoice.taxPercentage}</TableCell>
                      <TableCell>{invoice.tax}</TableCell>
                      <TableCell>{invoice.totalPrice}</TableCell>
                    </>
                  )}
                  <TableCell>
                    {state.editingIndex === index ? (
                      <IconButton onClick={() => handleSave(index)}>
                        <Save />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleEdit(index)}>
                        <Edit />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Snackbar
        open={state.openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
            Invalid input. Please check your values.
        </Alert>
    </Snackbar>
        
        </>
      );    
}  

export default InvoiceGrid;