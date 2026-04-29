import CustomerPanel from "@/components/customer/customer-panel";
import CreateCustomerDialog from "@/components/customer/create-customer-dialog";
import { findAllCustomers } from "./api/customer";
import { findAllAcctTransactions } from "./api/transaction";
import TransactionPanel from "@/components/transaction/transaction-panel";
import CreateTransactionDialog from "@/components/transaction/create-transaction-dialog";
import { findAllInvoices } from "./api/invoice";
import InvoicePanel from "@/components/invoice/invoice-panel";
import CreateInvoiceDialog from "@/components/invoice/create-invoice-dialog";
import { findAllLines } from "./api/line";
import { findAllProducts } from "./api/product";
import { findAllVendors } from "./api/vendor";
import LinePanel from "@/components/line/line-panel";
import CreateLineDialog from "@/components/line/create-line-dialog";
import ProductPanel from "@/components/product/product-panel";
import CreateProductDialog from "@/components/product/create-product-dialog";
import VendorPanel from "@/components/vendor/vendor-panel";
import CreateVendorDialog from "@/components/vendor/create-vendor-dialog";
import AuthGuard from "@/components/auth/auth-guard";
import UserGuideDialog from "@/components/common/user-guide-dialog";

export default async function Home() {
  const [transactions, customers, invoices, lines, products, vendors] =
    await Promise.all([
      findAllAcctTransactions(),
      findAllCustomers(),
      findAllInvoices(),
      findAllLines(),
      findAllProducts(),
      findAllVendors(),
    ]);

  return (
    <AuthGuard customers={customers}>
      <div className="flex flex-col flex-1 items-center justify-center font-sans">
        <div className="flex flex-1 w-full flex-col items-center gap-4 py-4 px-16 sm:items-start">
          <UserGuideDialog />

          {/* Customer section */}
          <div className="flex w-full items-center justify-between">
            <h3 className="text-xl font-semibold">Customers</h3>
            <CreateCustomerDialog />
          </div>
          <CustomerPanel customers={customers} />

          {/* Transaction section */}
          <div className="flex w-full items-center justify-between">
            <h3 className="text-xl font-semibold">Transactions</h3>
            <CreateTransactionDialog />
          </div>
          <TransactionPanel transactions={transactions} />

          {/* Invoice section */}
          <div className="flex w-full items-center justify-between">
            <h3 className="text-xl font-semibold">Invoices</h3>
            <CreateInvoiceDialog />
          </div>
          <InvoicePanel invoices={invoices} />

          {/* Line section */}
          <div className="flex w-full items-center justify-between">
            <h3 className="text-xl font-semibold">Lines</h3>
            <CreateLineDialog />
          </div>
          <LinePanel lines={lines} />

          {/* Product section */}
          <div className="flex w-full items-center justify-between">
            <h3 className="text-xl font-semibold">Products</h3>
            <CreateProductDialog />
          </div>
          <ProductPanel products={products} />

          {/* Vendor section */}
          <div className="flex w-full items-center justify-between">
            <h3 className="text-xl font-semibold">Vendors</h3>
            <CreateVendorDialog />
          </div>
          <VendorPanel vendors={vendors} />
        </div>
      </div>
    </AuthGuard>
  );
}
