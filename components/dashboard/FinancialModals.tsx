"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, CheckCircle2, FileText, Receipt, ArrowRight, ArrowLeftRight } from "lucide-react";
import styles from "./FinancialModals.module.css";

interface FinancialModalsProps {
  modalType: "create-invoice" | "add-expense" | "record-transaction" | "ask-ai-cfo" | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function FinancialModals({ modalType, onClose, onSuccess }: FinancialModalsProps) {
  // Invoice form state
  const [clientName, setClientName] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("2025-09-30");
  const [isSubmittingInvoice, setIsSubmittingInvoice] = useState(false);

  // Expense form state
  const [vendorName, setVendorName] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Software");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  // Record Transaction form state
  const [txType, setTxType] = useState<"REVENUE" | "EXPENSE" | "TRANSFER">("EXPENSE");
  const [txDescription, setTxDescription] = useState("");
  const [txCategory, setTxCategory] = useState("Software");
  const [txAmount, setTxAmount] = useState("");
  const [isSubmittingTx, setIsSubmittingTx] = useState(false);

  // AI CFO Chat state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiConversation, setAiConversation] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Good morning. I am monitoring Arcova's cash flow, receivables, and spend. How can I help with your finances today?",
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  if (!modalType) return null;

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !invoiceAmount) return;
    setIsSubmittingInvoice(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "RECEIVABLE",
          vendorClient: clientName,
          amount: Number(invoiceAmount),
          dueDate: invoiceDueDate,
        }),
      });
      const json = await res.json();
      if (json.success) {
        onSuccess(`Invoice ${json.data.invoiceNumber} of ₹${Number(invoiceAmount).toLocaleString("en-IN")} for ${clientName} created.`);
        setClientName("");
        setInvoiceAmount("");
        onClose();
      } else {
        onSuccess(`Failed to create invoice: ${json.error?.message || "unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to create invoice:", error);
      onSuccess("Failed to create invoice due to a network error.");
    } finally {
      setIsSubmittingInvoice(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !expenseAmount) return;
    setIsSubmittingExpense(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor: vendorName,
          category: expenseCategory,
          amount: Number(expenseAmount),
        }),
      });
      const json = await res.json();
      if (json.success) {
        onSuccess(`Expense of ₹${Number(expenseAmount).toLocaleString("en-IN")} for ${vendorName} (${expenseCategory}) recorded.`);
        setVendorName("");
        setExpenseAmount("");
        onClose();
      } else {
        onSuccess(`Failed to record expense: ${json.error?.message || "unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to record expense:", error);
      onSuccess("Failed to record expense due to a network error.");
    } finally {
      setIsSubmittingExpense(false);
    }
  };

  const handleRecordTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDescription || !txAmount) return;
    setIsSubmittingTx(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: txType,
          category: txCategory,
          description: txDescription,
          amount: Number(txAmount),
        }),
      });
      const json = await res.json();
      if (json.success) {
        onSuccess(`Transaction of ₹${Number(txAmount).toLocaleString("en-IN")} (${txType.toLowerCase()}) recorded.`);
        setTxDescription("");
        setTxAmount("");
        onClose();
      } else {
        onSuccess(`Failed to record transaction: ${json.error?.message || "unknown error"}`);
      }
    } catch (error) {
      console.error("Failed to record transaction:", error);
      onSuccess("Failed to record transaction due to a network error.");
    } finally {
      setIsSubmittingTx(false);
    }
  };

  const handleSendAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || isAiThinking) return;

    const userText = aiPrompt;
    setAiConversation((prev) => [...prev, { sender: "user", text: userText }]);
    setAiPrompt("");
    setIsAiThinking(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText }),
      });
      const json = await res.json();
      const response = json.success
        ? json.data.answer
        : "I couldn't reach the CFO Agent just now - please try again in a moment.";
      setAiConversation((prev) => [...prev, { sender: "ai", text: response }]);
    } catch (error) {
      console.error("AI CFO chat failed:", error);
      setAiConversation((prev) => [...prev, { sender: "ai", text: "I couldn't reach the CFO Agent due to a network error." }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
          <X size={16} />
        </button>

        {/* Modal: Create Invoice */}
        {modalType === "create-invoice" && (
          <form onSubmit={handleCreateInvoice} className={styles.formContainer}>
            <div className={styles.modalHeader}>
              <div className={styles.iconCircle}>
                <FileText size={18} />
              </div>
              <div>
                <h3 className={styles.modalTitle}>Create New Invoice</h3>
                <p className={styles.modalSubtitle}>
                  Issue a client invoice - it's added to receivables immediately and tracked for reconciliation.
                </p>
              </div>
            </div>

            <div className={styles.formFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Client / Enterprise Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reliance Retail Ltd."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Amount (INR ₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150000"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Due Date</label>
                  <input
                    type="date"
                    required
                    value={invoiceDueDate}
                    onChange={(e) => setInvoiceDueDate(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn} disabled={isSubmittingInvoice}>
                <span>{isSubmittingInvoice ? "Generating..." : "Generate Invoice"}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        )}

        {/* Modal: Add Expense */}
        {modalType === "add-expense" && (
          <form onSubmit={handleAddExpense} className={styles.formContainer}>
            <div className={styles.modalHeader}>
              <div className={styles.iconCircle}>
                <Receipt size={18} />
              </div>
              <div>
                <h3 className={styles.modalTitle}>Record Expense</h3>
                <p className={styles.modalSubtitle}>
                  Add an operating expense - it posts to the ledger immediately and feeds the Expense Agent's analysis.
                </p>
              </div>
            </div>

            <div className={styles.formFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Vendor / Payee</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amazon Web Services"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className={styles.input}
                  >
                    <option value="Software">Software & Cloud</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Marketing">Marketing & Growth</option>
                    <option value="Office">Office & Admin</option>
                    <option value="Legal">Legal & Compliance</option>
                    <option value="Travel">Travel</option>
                    <option value="Payroll">Payroll</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Amount (INR ₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45000"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn} disabled={isSubmittingExpense}>
                <span>{isSubmittingExpense ? "Recording..." : "Record Expense"}</span>
                <CheckCircle2 size={14} />
              </button>
            </div>
          </form>
        )}

        {/* Modal: Record Transaction */}
        {modalType === "record-transaction" && (
          <form onSubmit={handleRecordTransaction} className={styles.formContainer}>
            <div className={styles.modalHeader}>
              <div className={styles.iconCircle}>
                <ArrowLeftRight size={18} />
              </div>
              <div>
                <h3 className={styles.modalTitle}>Record Transaction</h3>
                <p className={styles.modalSubtitle}>
                  Post a ledger entry directly - revenue, expense, or an inter-account transfer.
                </p>
              </div>
            </div>

            <div className={styles.formFields}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Type</label>
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value as "REVENUE" | "EXPENSE" | "TRANSFER")}
                  className={styles.input}
                >
                  <option value="REVENUE">Revenue</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Client payment - Tata Digital Solutions"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.row}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className={styles.input}
                  >
                    <option value="Sales">Sales</option>
                    <option value="Services">Services</option>
                    <option value="Software">Software & Cloud</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Marketing">Marketing & Growth</option>
                    <option value="Office">Office & Admin</option>
                    <option value="Legal">Legal & Compliance</option>
                    <option value="Travel">Travel</option>
                    <option value="Payroll">Payroll</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Amount (INR ₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn} disabled={isSubmittingTx}>
                <span>{isSubmittingTx ? "Recording..." : "Record Transaction"}</span>
                <CheckCircle2 size={14} />
              </button>
            </div>
          </form>
        )}

        {/* Modal: Ask AI CFO */}
        {modalType === "ask-ai-cfo" && (
          <div className={styles.aiChatContainer}>
            <div className={styles.modalHeader}>
              <div className={`${styles.iconCircle} ${styles.aiCircle}`}>
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className={styles.modalTitle}>Finova AI CFO Assistant</h3>
                <p className={styles.modalSubtitle}>
                  Grounded in your real ledger - cash flow, receivables, burn rate, and policy insights.
                </p>
              </div>
            </div>

            <div className={styles.chatHistory}>
              {aiConversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${styles.chatMessage} ${
                    msg.sender === "user" ? styles.userMsg : styles.aiMsg
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className={styles.aiMsgBadge}>
                      <Sparkles size={11} />
                      <span>AI CFO</span>
                    </div>
                  )}
                  <p className={styles.msgText}>{msg.text}</p>
                </div>
              ))}
              {isAiThinking && (
                <div className={`${styles.chatMessage} ${styles.aiMsg}`}>
                  <div className={styles.aiMsgBadge}>
                    <Sparkles size={11} />
                    <span>Analyzing Ledger...</span>
                  </div>
                  <div className={styles.typingDots}>
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendAiPrompt} className={styles.chatInputRow}>
              <input
                type="text"
                placeholder="Ask about cash runway, overdue invoices, spend anomalies..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className={styles.chatInput}
                autoFocus
              />
              <button type="submit" className={styles.chatSendBtn} disabled={isAiThinking}>
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
