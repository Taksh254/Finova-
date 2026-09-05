"use client";

import React, { useState } from "react";
import { X, Sparkles, Send, CheckCircle2, FileText, Receipt, ArrowRight } from "lucide-react";
import styles from "./FinancialModals.module.css";

interface FinancialModalsProps {
  modalType: "create-invoice" | "add-expense" | "ask-ai-cfo" | null;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export function FinancialModals({ modalType, onClose, onSuccess }: FinancialModalsProps) {
  // Invoice form state
  const [clientName, setClientName] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("2026-09-30");

  // Expense form state
  const [vendorName, setVendorName] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Software");
  const [expenseAmount, setExpenseAmount] = useState("");

  // AI CFO Chat state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiConversation, setAiConversation] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "Good morning, Taksh. I am monitoring Arcova's cash flow, tax provisions, and collections. How can I assist you with your finances today?",
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  if (!modalType) return null;

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !invoiceAmount) return;
    onSuccess(`Invoice of ₹${Number(invoiceAmount).toLocaleString("en-IN")} for ${clientName} generated and routed for approval.`);
    onClose();
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !expenseAmount) return;
    onSuccess(`Expense of ₹${Number(expenseAmount).toLocaleString("en-IN")} for ${vendorName} (${expenseCategory}) recorded.`);
    onClose();
  };

  const handleSendAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userText = aiPrompt;
    setAiConversation((prev) => [...prev, { sender: "user", text: userText }]);
    setAiPrompt("");
    setIsAiThinking(true);

    setTimeout(() => {
      let response = "I analyzed your current ledger: revenue is pacing at ₹8.6L (+14.2%) with healthy runway of 6.2 months. Operating expenses increased 18% primarily in cloud hosting and vendor licenses.";
      if (userText.toLowerCase().includes("cash") || userText.toLowerCase().includes("runway")) {
        response = "Total cash stands at ₹12.4L (+8.4% this month). With monthly burn around ₹3.1L, your current net runway is approximately 6.2 months without additional debt or dilutive financing.";
      } else if (userText.toLowerCase().includes("invoice") || userText.toLowerCase().includes("overdue")) {
        response = "You have 3 invoices overdue totaling ₹84,500. The largest is from Infosys BPO (₹48,200, 18 days overdue). I recommend issuing an automated reminder notice.";
      } else if (userText.toLowerCase().includes("expense") || userText.toLowerCase().includes("save")) {
        response = "I detected ₹27,400 in duplicate subscriptions across Figma and Notion enterprise seats. Downgrading 4 inactive seats will save approximately ₹28,000 monthly.";
      }

      setAiConversation((prev) => [...prev, { sender: "ai", text: response }]);
      setIsAiThinking(false);
    }, 800);
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
                  Issue client invoice with autonomous payment tracking and tax ledger integration.
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
              <button type="submit" className={styles.submitBtn}>
                <span>Generate Invoice</span>
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
                  Add operating expense with AI tax classification and receipt OCR pairing.
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
                    <option value="Admin">Office & Admin</option>
                    <option value="Legal">Legal & Compliance</option>
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
              <button type="submit" className={styles.submitBtn}>
                <span>Record Expense</span>
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
                  Real-time autonomous intelligence for cash flow, audit, burn rate, and policy insights.
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
