import React, { useState } from "react";
import { Container } from "@mui/material";
import InvoiceForm from "./InvoiceForm";
import InvoiceGrid from "./InvoiceGrid";

function App() {
  const [invoices, setInvoices] = useState([]);

  const handleAddInvoice = (invoice) => {
    const newInvoice = { id: Date.now(), ...invoice };
    setInvoices([...invoices, newInvoice]);
  };
  
  return (
    <Container maxWidth="md">
      <h1>Invoicing App</h1>
      <InvoiceForm handleAddInvoice={handleAddInvoice} />
      <InvoiceGrid invoices={invoices} setInvoices={setInvoices} />
    </Container>
  );
}

export default App;
