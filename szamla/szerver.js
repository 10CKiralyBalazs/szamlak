const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5001;

mongoose.connect('mongodb://localhost:27017/invoicedb', { useNewUrlParser: true, useUnifiedTopology: true });

const partySchema = new mongoose.Schema({
  name: String,
  address: String,
  taxNumber: String
});

const invoiceSchema = new mongoose.Schema({
  issuer: partySchema,
  customer: partySchema,
  invoiceNumber: String,
  invoiceDate: Date,
  performanceDate: Date,
  dueDate: Date,
  totalAmount: Number,
  vatAmount: Number
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

app.use(cors());
app.use(bodyParser.json());

app.get('/invoices', async (req, res) => {
  const invoices = await Invoice.find();
  res.json(invoices);
});

app.post('/invoices', async (req, res) => {
  const invoice = new Invoice(req.body);
  await invoice.save();
  res.json(invoice);
});

app.put('/invoices/:id', async (req, res) => {
  const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(invoice);
});

app.delete('/invoices/:id', async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
