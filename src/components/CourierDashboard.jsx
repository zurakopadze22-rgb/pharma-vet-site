import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { 
  collection, doc, onSnapshot, query, where, updateDoc 
} from "firebase/firestore";

const COURIER_CODE = import.meta.env.VITE_COURIER_PIN || '3333';

export default function CourierDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [activeTab, setActiveTab] = useState('deliveries'); 

  // Firebase orders list
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delivery confirmation form state
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [amountPaid, setAmountPaid] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState('delivered'); // 'delivered' or 'failed'
  const [expandedOrders, setExpandedOrders] = useState({});

  // Sync active orders from Firestore
  useEffect(() => {
    if (!isAuthenticated) return;

    setLoading(true);
    // Fetch orders that are packed (status: დასრულებული / რედაქტირებული)
    const qOrders = query(
      collection(db, "dist_orders"), 
      where("status", "in", ["დასრულებული", "რედაქტირებული"])
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
    if (authCode === COURIER_CODE) {
      setIsAuthenticated(true);
    } else {
      alert('არასწორი კოდი!');
    }
  };

  const toggleOrderDetails = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Open delivery modal/section and set initial inputs
  const startDeliveryConfirm = (order) => {
    setConfirmingOrderId(order.id);
    setAmountPaid(order.totalPrice.toString());
    setDeliveryStatus('delivered');
  };

  const cancelDeliveryConfirm = () => {
    setConfirmingOrderId(null);
  };

  const saveDeliveryState = async (order) => {
    const paidNum = parseFloat(amountPaid);
    if (isNaN(paidNum) || paidNum < 0) {
      return alert("გთხოვთ შეიყვანოთ ვალიდური გადახდილი თანხა!");
    }
    if (paidNum > order.totalPrice) {
      return alert("გადახდილი თანხა არ შეიძლება აღემატებოდეს შეკვეთის ჯამურ ღირებულებას!");
    }

    const remaining = Math.max(0, order.totalPrice - paidNum);
    let paymentStatus = 'paid';
    if (paidNum === 0) {
      paymentStatus = 'unpaid';
    } else if (remaining > 0) {
      paymentStatus = 'partial';
    }

    if (deliveryStatus === 'failed') {
      paymentStatus = 'unpaid'; // If delivery failed, no money was paid
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    try {
      await updateDoc(doc(db, "dist_orders", order.id), {
        courierConfirmed: true,
        courierConfirmedAt: formattedDate,
        deliveryStatus: deliveryStatus,
        amountPaid: deliveryStatus === 'failed' ? 0 : paidNum,
        amountRemaining: deliveryStatus === 'failed' ? order.totalPrice : remaining,
        paymentStatus: paymentStatus
      });

      alert("✅ შეკვეთის სტატუსი წარმატებით განახლდა!");
      setConfirmingOrderId(null);
    } catch (err) {
      alert("❌ შეცდომა შენახვისას: " + err.message);
    }
  };

  // Active deliveries (where courierConfirmed is not true)
  const activeDeliveries = orders.filter(o => !o.courierConfirmed);

  // Delivered history (where courierConfirmed is true)
  const deliveredHistory = orders.filter(o => o.courierConfirmed);

  // Stats calculation
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
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen font-sans text-slate-800 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">🚚 მიმწოდებლის პანელი</h1>
          <p className="text-teal-600 text-xs mt-0.5 font-bold">🟢 ონლაინ რეჟიმი</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-full sm:w-auto">
          <button 
            onClick={() => { setActiveTab('deliveries'); setConfirmingOrderId(null); }} 
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'deliveries' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            📦 მიწოდებები ({activeDeliveries.length})
          </button>
          <button 
            onClick={() => { setActiveTab('history'); setConfirmingOrderId(null); }} 
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition whitespace-nowrap ${activeTab === 'history' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
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
      ) : activeTab === 'deliveries' ? (
        /* Deliveries Tab */
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">📦 აქტიური შესასრულებელი მიწოდებები</h2>
          
          {activeDeliveries.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 border-dashed text-gray-400 italic text-sm">
              ყველა შეკვეთა ჩაბარებულია! 🎉
            </div>
          ) : (
            activeDeliveries.map(order => {
              const isExpanded = expandedOrders[order.id];
              const isConfirming = confirmingOrderId === order.id;
              
              return (
                <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
                  {/* Order Top Info */}
                  <div className="flex justify-between items-start gap-4">
                    <div onClick={() => toggleOrderDetails(order.id)} className="cursor-pointer flex-1">
                      <h3 className="font-black text-slate-800 text-sm sm:text-base hover:text-teal-600 transition-colors">🏪 {order.partner}</h3>
                      <p className="text-[10px] text-slate-400 mt-1">📍 მისამართი: <span className="text-slate-700 font-medium">{order.partnerAddress}</span></p>
                      {order.partnerTin && <p className="text-[10px] text-slate-400">🔢 საიდენტიფიკაციო კოდი: <span className="text-slate-700 font-medium">{order.partnerTin}</span></p>}
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

                  {/* Action Buttons & Confirmation Block */}
                  {!isConfirming ? (
                    <button 
                      onClick={() => startDeliveryConfirm(order)}
                      className="w-full bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-teal-50"
                    >
                      ✓ ჩაბარების დადასტურება
                    </button>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
                      <h4 className="text-xs font-black text-slate-700 border-b pb-2 uppercase tracking-wide">📦 ჩაბარების მონაცემები:</h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Delivery Status Select */}
                        <div>
                          <label className="block text-[10px] text-slate-400 font-black uppercase mb-1">🚚 მიწოდების სტატუსი</label>
                          <select 
                            value={deliveryStatus} 
                            onChange={(e) => setDeliveryStatus(e.target.value)}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs font-bold focus:ring-2 focus:ring-teal-500 outline-none"
                          >
                            <option value="delivered">✅ ჩაბარდა წარმატებით</option>
                            <option value="failed">❌ ვერ ჩაბარდა (უარი/გაუქმება)</option>
                          </select>
                        </div>

                        {/* Amount Paid input */}
                        {deliveryStatus === 'delivered' && (
                          <div>
                            <label className="block text-[10px] text-slate-400 font-black uppercase mb-1">💰 გადახდილი თანხა (₾)</label>
                            <input 
                              type="number" 
                              step="0.01" 
                              value={amountPaid} 
                              onChange={(e) => setAmountPaid(e.target.value)}
                              className="w-full p-2 bg-white border rounded-xl text-xs font-black text-slate-800 outline-none focus:ring-2 focus:ring-teal-500" 
                            />
                            {/* Auto remaining display */}
                            <span className="block text-[9px] text-slate-400 mt-1 font-bold">
                              დარჩენილი ვალი (ნისია): 
                              <span className={`ml-1 font-black ${order.totalPrice - parseFloat(amountPaid || 0) > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                {(order.totalPrice - (parseFloat(amountPaid) || 0)).toFixed(2)} ₾
                              </span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Confirm/Cancel actions */}
                      <div className="flex gap-2 pt-2">
                        <button 
                          type="button" 
                          onClick={cancelDeliveryConfirm}
                          className="w-1/3 bg-slate-200 text-slate-700 py-2.5 rounded-xl hover:bg-slate-300 font-bold text-xs transition"
                        >
                          გაუქმება
                        </button>
                        <button 
                          type="button" 
                          onClick={() => saveDeliveryState(order)}
                          className="w-2/3 bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 font-bold text-xs transition"
                        >
                          მონაცემების შენახვა ✓
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : (
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
    </div>
  );
}
