import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { 
  collection, doc, onSnapshot, query, where, updateDoc 
} from "firebase/firestore";

const getCourierPin = () => {
  const pin = import.meta.env.VITE_COURIER_PIN;
  if (!pin || pin === 'undefined') return '3333';
  return String(pin).trim();
};
const COURIER_CODE = getCourierPin();

export default function CourierDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('courier_authenticated') === 'true');
  const [authCode, setAuthCode] = useState('');
  const [activeTab, setActiveTab] = useState('deliveries'); // 'deliveries' | 'history' | 'debts'

  // Firebase orders list
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Confirmation flow sub-states
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [isPartialMode, setIsPartialMode] = useState(false);
  const [amountPaid, setAmountPaid] = useState('');
  const [expandedOrders, setExpandedOrders] = useState({});

  // Debt resolution sub-states
  const [resolvingDebtOrderId, setResolvingDebtOrderId] = useState(null);
  const [isDebtPartialMode, setIsDebtPartialMode] = useState(false);
  const [debtPaymentAmount, setDebtPaymentAmount] = useState('');

  // Sync active orders from Firestore (Completed / Edited ones)
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    // Fetch all packed orders (status: დასრულებული / რედაქტირებული / დაარქივებული - so we can track historical debts too!)
    const qOrders = query(
      collection(db, "dist_orders"), 
      where("status", "in", ["დასრულებული", "რედაქტირებული", "დაარქივებული"])
    );

    const unsub = onSnapshot(qOrders, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(list);
      setLoading(false);
    }, (err) => {
      console.error("Firestore sync error:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (String(authCode).trim() === COURIER_CODE) {
      sessionStorage.setItem('courier_authenticated', 'true');
      setIsAuthenticated(true);
    } else {
      alert(`არასწორი კოდი!\nშეყვანილია: "${String(authCode).trim()}"\nბაზაშია: "${COURIER_CODE}"`);
    }
  };

  const toggleOrderDetails = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Direct Delivery Confirmation logic
  const handleConfirmDeliveryDirect = async (order, status, paidValue) => {
    const paidNum = parseFloat(paidValue);
    if (isNaN(paidNum) || paidNum < 0) {
      return alert("შეყვანილი თანხა არასწორია!");
    }

    const remaining = Math.max(0, order.totalPrice - paidNum);
    let paymentStatus = 'paid';
    if (paidNum === 0) {
      paymentStatus = 'unpaid';
    } else if (remaining > 0) {
      paymentStatus = 'partial';
    }

    if (status === 'failed') {
      paymentStatus = 'unpaid';
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    try {
      await updateDoc(doc(db, "dist_orders", order.id), {
        courierConfirmed: true,
        courierConfirmedAt: formattedDate,
        deliveryStatus: status,
        amountPaid: status === 'failed' ? 0 : paidNum,
        amountRemaining: status === 'failed' ? order.totalPrice : remaining,
        paymentStatus: paymentStatus
      });

      alert("✅ შეკვეთის სტატუსი წარმატებით განახლდა!");
      setConfirmingOrderId(null);
      setIsPartialMode(false);
      setAmountPaid('');
    } catch (err) {
      alert("❌ შეცდომა შენახვისას: " + err.message);
    }
  };

  // Debt Resolution logic (updates amountRemaining and amountPaid)
  const handleResolveDebtDirect = async (order, paymentVal) => {
    const paymentNum = parseFloat(paymentVal);
    if (isNaN(paymentNum) || paymentNum <= 0) {
      return alert("გთხოვთ შეიყვანოთ დაფარვის ვალიდური თანხა!");
    }
    if (paymentNum > order.amountRemaining) {
      return alert("დაფარვის თანხა აღემატება დარჩენილ ვალს!");
    }

    const newAmountPaid = (order.amountPaid || 0) + paymentNum;
    const newAmountRemaining = Math.max(0, order.amountRemaining - paymentNum);
    let paymentStatus = 'paid';
    if (newAmountRemaining > 0) {
      paymentStatus = 'partial';
    }

    try {
      await updateDoc(doc(db, "dist_orders", order.id), {
        amountPaid: newAmountPaid,
        amountRemaining: newAmountRemaining,
        paymentStatus: paymentStatus
      });

      alert("✅ ნისია წარმატებით განახლდა/დაიფარა!");
      setResolvingDebtOrderId(null);
      setIsDebtPartialMode(false);
      setDebtPaymentAmount('');
    } catch (err) {
      alert("❌ შეცდომა ვალის დაფარვისას: " + err.message);
    }
  };

  // Active deliveries (where status is packed, and courierConfirmed is not set)
  // We exclude archived orders here, couriers only deliver active ones
  const activeDeliveries = orders.filter(o => o.status !== 'დაარქივებული' && !o.courierConfirmed);

  // Delivered history (where courierConfirmed is true and status is not archived)
  const deliveredHistory = orders.filter(o => o.status !== 'დაარქივებული' && o.courierConfirmed);

  // All long-term outstanding debts (amountRemaining > 0) across both active and archived
  const outstandingDebts = orders.filter(o => o.amountRemaining > 0);

  // Helper search filters
  const filterByQuery = (list) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(o => 
      (o.partner && o.partner.toLowerCase().includes(q)) || 
      (o.partnerAddress && o.partnerAddress.toLowerCase().includes(q)) || 
      (o.partnerTin && o.partnerTin.toLowerCase().includes(q))
    );
  };

  const filteredDeliveries = filterByQuery(activeDeliveries);
  const filteredDebts = filterByQuery(outstandingDebts);

  // Calculations for stats
  const totalCollectedCash = deliveredHistory.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  const totalRemainingDebt = deliveredHistory.reduce((sum, o) => sum + (o.amountRemaining || 0), 0);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border-t-4 border-teal-500">
          <div className="text-center mb-6">
            <span className="text-4xl">🚚</span>
            <h2 className="text-2xl font-black text-slate-800 mt-2">კურიერის სისტემა</h2>
            <p className="text-xs text-gray-500 mt-1">შეიყვანეთ მიმწოდებლის PIN კოდი შესასვლელად</p>
          </div>
          <input 
            type="password" 
            value={authCode} 
            onChange={(e) => setAuthCode(e.target.value)} 
            className="w-full p-3 border rounded-xl mb-4 text-center text-xl tracking-widest focus:ring-2 focus:ring-teal-500 outline-none font-bold bg-slate-50" 
            placeholder="****" 
          />
          <button 
            type="submit" 
            className="w-full p-3 rounded-xl text-xs font-bold transition text-white bg-teal-600 hover:bg-teal-700 shadow-md"
          >
            შესვლა სისტემაში ✓
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen font-sans text-slate-800 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">🚚 მიმწოდებლის პანელი</h1>
          <p className="text-teal-600 text-xs mt-0.5 font-bold">🟢 ონლაინ რეჟიმი</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-full sm:w-auto overflow-x-auto">
          <button 
            onClick={() => { setActiveTab('deliveries'); setConfirmingOrderId(null); setSearchQuery(''); }} 
            className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'deliveries' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            📦 მიწოდებები ({activeDeliveries.length})
          </button>
          <button 
            onClick={() => { setActiveTab('debts'); setResolvingDebtOrderId(null); setSearchQuery(''); }} 
            className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'debts' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            🔴 ვალები ({outstandingDebts.length})
          </button>
          <button 
            onClick={() => { setActiveTab('history'); setSearchQuery(''); }} 
            className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'history' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            📜 ისტორია ({deliveredHistory.length})
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-xs text-gray-500 mt-4">მონაცემები იტვირთება...</p>
        </div>
      ) : (
        <>
          {/* Search bar for Deliveries and Debts tabs */}
          {(activeTab === 'deliveries' || activeTab === 'debts') && (
            <div className="bg-white p-3 rounded-2xl border shadow-sm flex items-center gap-2">
              <span className="text-slate-400 pl-1 text-sm">🔍</span>
              <input 
                type="text" 
                placeholder="მოძებნე კლიენტი, მისამართი ან საიდენტ. კოდი..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full text-xs font-bold text-slate-800 bg-transparent border-none outline-none placeholder-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')} 
                  className="text-slate-400 hover:text-slate-600 text-xs px-2"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {activeTab === 'deliveries' && (
            /* Deliveries Tab */
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">📦 აქტიური შესასრულებელი მიწოდებები</h2>
              
              {filteredDeliveries.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed text-gray-400 italic text-sm">
                  {searchQuery ? 'საძიებო პარამეტრით შეკვეთა ვერ მოიძებნა.' : 'ყველა შეკვეთა ჩაბარებულია! 🎉'}
                </div>
              ) : (
                filteredDeliveries.map(order => {
                  const isExpanded = expandedOrders[order.id];
                  const isConfirming = confirmingOrderId === order.id;
                  
                  return (
                    <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                      {/* Order Top Info */}
                      <div className="flex justify-between items-start gap-4">
                        <div onClick={() => toggleOrderDetails(order.id)} className="cursor-pointer flex-1">
                          <h3 className="font-black text-slate-800 text-sm sm:text-base hover:text-teal-600 transition-colors">🏪 {order.partner}</h3>
                          <p className="text-[10px] text-slate-400 mt-1">📍 მისამართი: <span className="text-slate-700 font-medium">{order.partnerAddress}</span></p>
                          {order.partnerTin && <p className="text-[10px] text-slate-400">🔢 კოდი: <span className="text-slate-700 font-medium">{order.partnerTin}</span></p>}
                          <p className="text-[10px] text-indigo-600 font-bold mt-1">📅 მომზადდა: {order.completedAt || order.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-sm sm:text-base font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-xl border border-teal-100">
                            {order.totalPrice.toFixed(2)} ₾
                          </span>
                        </div>
                      </div>

                      {/* Toggle items view */}
                      <button 
                        onClick={() => toggleOrderDetails(order.id)} 
                        className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 flex items-center gap-1"
                      >
                        {isExpanded ? '▲ დეტალების დამალვა' : '▼ პროდუქტების სიის ნახვა'}
                      </button>

                      {/* Order Items Table */}
                      {isExpanded && (
                        <div className="overflow-x-auto border rounded-xl bg-slate-50/50">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 font-bold border-b text-[10px] uppercase">
                              <tr>
                                <th className="p-2.5">დასახელება</th>
                                <th className="p-2.5 text-center">რაოდენობა</th>
                                <th className="p-2.5 text-right">ფასი</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y text-slate-700">
                              {order.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="p-2.5 font-bold">{item.product.name}</td>
                                  <td className="p-2.5 text-center font-mono">{item.quantity}ც</td>
                                  <td className="p-2.5 text-right font-mono">{(item.product.price * item.quantity).toFixed(2)} ₾</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Simplified Confirmation Flow */}
                      {!isConfirming ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button 
                            onClick={() => {
                              if(window.confirm('დაადასტუროთ შეკვეთის სრულად გადახდა?')) {
                                handleConfirmDeliveryDirect(order, 'delivered', order.totalPrice);
                              }
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition"
                          >
                            🟢 სრულად გადახდა
                          </button>
                          <button 
                            onClick={() => {
                              if(window.confirm('დაადასტუროთ ჩაბარება ნისიად (გადახდის გარეშე)?')) {
                                handleConfirmDeliveryDirect(order, 'delivered', 0);
                              }
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition"
                          >
                            🔴 ნისია (გადაუხდელად)
                          </button>
                          <button 
                            onClick={() => {
                              setConfirmingOrderId(order.id);
                              setIsPartialMode(true);
                              setAmountPaid('');
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm transition"
                          >
                            🟡 ნაწილობრივი გადახდა
                          </button>
                          <button 
                            onClick={() => {
                              if(window.confirm('ნამდვილად ვერ ჩაბარდა შეკვეთა?')) {
                                handleConfirmDeliveryDirect(order, 'failed', 0);
                              }
                            }}
                            className="sm:col-span-3 text-center text-[10px] font-bold text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 py-1.5 rounded-lg transition"
                          >
                            ❌ ვერ ჩაბარდა (უარი/გაუქმება)
                          </button>
                        </div>
                      ) : (
                        /* Partial pay block */
                        isPartialMode && (
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-3">
                            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">💰 შეიყვანეთ მიღებული თანხა:</h4>
                            <div>
                              <input 
                                type="number" 
                                step="0.01" 
                                placeholder="მაგ: 150.00" 
                                value={amountPaid} 
                                onChange={(e) => setAmountPaid(e.target.value)}
                                className="w-full p-2.5 bg-white border rounded-xl text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-500" 
                              />
                              {amountPaid && (
                                <span className="block text-[10px] text-slate-400 mt-1 font-bold">
                                  დარჩენილი ნისია: 
                                  <span className="ml-1 text-rose-500 font-black">
                                    {(order.totalPrice - (parseFloat(amountPaid) || 0)).toFixed(2)} ₾
                                  </span>
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setConfirmingOrderId(null)} 
                                className="w-1/3 bg-slate-200 text-slate-700 py-2 rounded-xl hover:bg-slate-300 font-bold text-xs"
                              >
                                უკან
                              </button>
                              <button 
                                onClick={() => handleConfirmDeliveryDirect(order, 'delivered', amountPaid)} 
                                className="w-2/3 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 font-bold text-xs"
                              >
                                ჩაბარების დადასტურება ✓
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'debts' && (
            /* Debts Tab */
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">🔴 კლიენტების ნისიები (ვალების რეესტრი)</h2>
              
              {filteredDebts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed text-gray-400 italic text-sm">
                  {searchQuery ? 'საძიებო პარამეტრით ნისია ვერ მოიძებნა.' : 'აქტიური ვალები არ ფიქსირდება! 🎉'}
                </div>
              ) : (
                filteredDebts.map(debtOrder => {
                  const isResolving = resolvingDebtOrderId === debtOrder.id;
                  
                  return (
                    <div key={debtOrder.id} className="bg-white border border-rose-100 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-black text-slate-800 text-sm sm:text-base">🏪 {debtOrder.partner}</h3>
                          <p className="text-[10px] text-slate-400 mt-1">📍 {debtOrder.partnerAddress}</p>
                          <p className="text-[9px] text-slate-500 font-medium">📅 ჩაბარდა: {debtOrder.courierConfirmedAt || debtOrder.completedAt}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold block">დარჩენილი ვალი:</span>
                          <span className="text-base font-black text-rose-600 block bg-rose-50 px-3 py-1 rounded-xl border border-rose-100 mt-1">
                            {debtOrder.amountRemaining?.toFixed(2)} ₾
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 p-2.5 rounded-lg border text-[10px] text-slate-500 font-bold flex justify-between">
                        <span>💵 სულ შეკვეთა: {debtOrder.totalPrice.toFixed(2)} ₾</span>
                        <span>💰 გადახდილია: {debtOrder.amountPaid?.toFixed(2) || 0} ₾</span>
                      </div>

                      {/* Debt resolution interface */}
                      {!isResolving ? (
                        <button 
                          onClick={() => {
                            setResolvingDebtOrderId(debtOrder.id);
                            setIsDebtPartialMode(false);
                          }}
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 rounded-xl text-xs shadow-sm transition"
                        >
                          💰 ვალის დაფარვა (თანხის მიღება)
                        </button>
                      ) : (
                        <div className="bg-slate-50 p-4 rounded-xl border border-rose-200/60 space-y-3">
                          <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide">💸 ვალის დაფარვის ფორმა:</h4>
                          
                          {!isDebtPartialMode ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <button 
                                onClick={() => {
                                  if(window.confirm('დაადასტუროთ ვალის სრულად დაფარვა?')) {
                                    handleResolveDebtDirect(debtOrder, debtOrder.amountRemaining);
                                  }
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition"
                              >
                                ✅ სრულად დაფარვა ({debtOrder.amountRemaining.toFixed(2)} ₾)
                              </button>
                              <button 
                                onClick={() => {
                                  setIsDebtPartialMode(true);
                                  setDebtPaymentAmount('');
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs transition"
                              >
                                🪙 ნაწილობრივი დაფარვა
                              </button>
                              <button 
                                onClick={() => setResolvingDebtOrderId(null)} 
                                className="sm:col-span-2 text-center text-[10px] font-bold text-slate-500 hover:text-slate-700 bg-slate-200 py-1.5 rounded-lg transition"
                              >
                                გაუქმება
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">მიღებული თანხა (₾)</label>
                                <input 
                                  type="number" 
                                  step="0.01" 
                                  placeholder="მაგ: 50.00" 
                                  value={debtPaymentAmount} 
                                  onChange={(e) => setDebtPaymentAmount(e.target.value)}
                                  className="w-full p-2.5 bg-white border rounded-xl text-sm font-black text-slate-800 outline-none focus:ring-2 focus:ring-rose-500" 
                                />
                                {debtPaymentAmount && (
                                  <span className="block text-[10px] text-slate-400 mt-1 font-bold">
                                    ახალი დარჩენილი ვალი: 
                                    <span className="ml-1 text-rose-500 font-black">
                                      {(debtOrder.amountRemaining - (parseFloat(debtPaymentAmount) || 0)).toFixed(2)} ₾
                                    </span>
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => setIsDebtPartialMode(false)} 
                                  className="w-1/3 bg-slate-200 text-slate-700 py-2 rounded-xl hover:bg-slate-300 font-bold text-xs"
                                >
                                  უკან
                                </button>
                                <button 
                                  onClick={() => handleResolveDebtDirect(debtOrder, debtPaymentAmount)} 
                                  className="w-2/3 bg-emerald-600 text-white py-2 rounded-xl hover:bg-emerald-700 font-bold text-xs"
                                >
                                  დადასტურება ✓
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'history' && (
            /* History Tab */
            <div className="space-y-6">
              {/* Summary stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">💰 ჯამური მიღებული ნაღდი ფული</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-950 block mt-2">{totalCollectedCash.toFixed(2)} ₾</span>
                </div>
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">⚠️ ჯამური ნისიები (ვალები)</span>
                  <span className="text-xl sm:text-2xl font-black text-rose-950 block mt-2">{totalRemainingDebt.toFixed(2)} ₾</span>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">📜 ამ კვირის ჩაბარებული რეესტრი</h2>
                
                {deliveredHistory.length === 0 ? (
                  <p className="text-gray-400 italic text-sm text-center py-8">ჩაბარებული შეკვეთები ჯერ არ ფიქსირდება.</p>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {deliveredHistory.map(h => (
                      <div 
                        key={h.id} 
                        className={`p-4 border rounded-xl text-xs bg-white space-y-2 ${h.deliveryStatus === 'failed' ? 'border-rose-200' : 'border-slate-100'}`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="font-black text-slate-800 text-sm">🏪 {h.partner}</span>
                            <p className="text-[10px] text-gray-400 mt-1">📍 {h.partnerAddress}</p>
                            <p className="text-[9px] text-gray-500 font-medium">📅 მიეწოდა: {h.courierConfirmedAt}</p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-700 block">{h.totalPrice.toFixed(2)} ₾</span>
                            
                            {/* Status tag */}
                            {h.deliveryStatus === 'failed' ? (
                              <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase bg-red-100 text-red-800">
                                ❌ ვერ ჩაბარდა
                              </span>
                            ) : h.paymentStatus === 'paid' ? (
                              <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-100 text-emerald-800">
                                ✅ სრულად გადახდილი
                              </span>
                            ) : h.paymentStatus === 'partial' ? (
                              <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase bg-amber-100 text-amber-800">
                                ⚠️ ნაწილობრივი ვალი
                              </span>
                            ) : (
                              <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase bg-slate-100 text-slate-700 border">
                                💵 ნისია (ვალზე)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Detailed payment breakdown */}
                        {h.deliveryStatus !== 'failed' && (
                          <div className="bg-slate-50 p-2.5 rounded-lg border flex justify-between items-center text-[10px] text-slate-500 font-bold">
                            <span>💵 გადახდილი: <span className="font-black text-slate-800">{h.amountPaid?.toFixed(2)} ₾</span></span>
                            <span>⚠️ დარჩენილი: <span className={`font-black ${h.amountRemaining > 0 ? 'text-red-500' : 'text-slate-800'}`}>{h.amountRemaining?.toFixed(2)} ₾</span></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
