import { Button, Grid, TextField } from '@mui/material';
import { useState } from 'react';

function InvoiceForm({ handleAddInvoice }) {

    const [formData, setFormData] = useState({
      qty: 1,
      price: 0.1,
      discountPercentage: 0,
      discount: 0,
      taxPercentage: 0,
      tax: 0,
      totalPrice: 0,
    });

    const calculateTotalPrice = (data) => {
        const { qty, price, discount, tax } = data;
        const totalPrice = qty * price - discount + tax;
        return totalPrice;
      };
  
      const handleChange = (field, value) => {
          setFormData((prevFormData) => {
              if (field === "discountPercentage" || field === "taxPercentage") {
                value = Math.min(100, value);
              }
              let newFormData = { ...prevFormData, [field]: value };
              if (field === "qty" || field === "price") {
                  newFormData.totalPrice = calculateTotalPrice(newFormData);
                } else if (field === "discount" || field === "discountPercentage") {
                    const discountPercentage = field === "discount" ? (value / (newFormData.qty * newFormData.price)) * 100 : value;
                    const discount = (discountPercentage / 100) * newFormData.qty * newFormData.price;
                    newFormData = { ...newFormData, discount, discountPercentage, totalPrice: calculateTotalPrice({ ...newFormData, discount }) };
                } else if (field === "tax" || field === "taxPercentage") {
                    const taxPercentage = field === "tax" ? (value / (newFormData.qty * newFormData.price - newFormData.discount)) * 100 : value;
                    const tax = (taxPercentage / 100) * (newFormData.qty * newFormData.price - newFormData.discount);
                    newFormData = { ...newFormData, tax, taxPercentage, totalPrice: calculateTotalPrice({ ...newFormData, tax }) };
                }
                return newFormData;
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();

        // Check for invalid inputs
        if (
            Object.keys(formData).some(
            (field) =>
                formData[field] < (fieldValidation[field]?.min || 0)
            )
        ) {
            return;
        }

        const { qty, price, discount, discountPercentage, taxPercentage } = formData;
        if (discount > qty * price || taxPercentage > 100 || discountPercentage > 100) {
            return;
        }

        handleAddInvoice(formData);
        setFormData({
          qty: 1,
          price: 0.1,
          discountPercentage: 0,
          discount: 0,
          taxPercentage: 0,
          tax: 0,
          totalPrice: 0,
        });
      };

      const fieldValidation = {
        qty: { required: true, min: 1 },
        price: { required: true, min: 0.01, step: 0.01 },
        discountPercentage: { required: true, min: 0, max:100, step: 0.01 },
        discount: { required: true, min: 0, step: 0.01 },
        taxPercentage: { required: true, min: 0, max:100, step: 0.01 },
        tax: { required: true, min: 0, step: 0.01 },
      };
      
    
      return (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {['qty', 'price', 'discountPercentage', 'discount', 'taxPercentage', 'tax'].map((field) => (
              <Grid item key={field} xs={12} sm={6} md={4} lg={2}>
                <TextField
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  type="number"
                  value={formData[field]}
                  onChange={(e) => handleChange(field, Number(e.target.value))}
                  error={formData[field] < (fieldValidation[field]?.min || 0)}
                  inputProps={{
                    min: fieldValidation[field]?.min,
                    max: fieldValidation[field]?.max,
                    step: fieldValidation[field]?.step,
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <TextField fullWidth label="Total Price" type="number" value={formData.totalPrice} disabled />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Add Invoice
              </Button>
            </Grid>
          </Grid>
        </form>
      );    
  }

export default InvoiceForm;
  