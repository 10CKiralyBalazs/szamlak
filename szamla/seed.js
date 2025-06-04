const mongoose = require('mongoose');
const Invoice = require('./server').Invoice;

mongoose.connect('mongodb://localhost:27017/invoicedb', { useNewUrlParser: true, useUnifiedTopology: true });

async function seed() {
  await Invoice.deleteMany();

  const customers = [
    { name: 'Cég A', address: '1111 Budapest, Fő utca 1.', taxNumber: '12345678-1-11' },
    { name: 'Cég B', address: '2222 Győr, Kossuth u. 2.', taxNumber: '23456789-2-22' },
    { name: 'Cég C', address: '3333 Debrecen, Petőfi tér 3.', taxNumber: '34567890-3-33' }
  ];

  const issuer = { name: 'Számlakibocsátó Kft.', address: '1000 Budapest, Iroda u. 10.', taxNumber: '87654321-1-00' };
  const invoices = [];

  customers.forEach((cust, idx) => {
    for (let i = 1; i <= 3; i++) {
      invoices.push({
        issuer,
        customer: cust,
        invoiceNumber: `SZML${idx+1}${i}`,
        invoiceDate: new Date(),
        performanceDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 86400000),
        totalAmount: 10000 + i * 1000,
        vatAmount: (10000 + i * 1000) * 0.27
      });
    }
  });

  await Invoice.insertMany(invoices);
  console.log('Számlák feltöltve.');
  process.exit();
}
seed();
