import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where 
} from "firebase/firestore";

const ACCESS_CODE = import.meta.env.VITE_ADMIN_PIN;

export default function DistributionDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [activeTab, setActiveTab] = useState('preseller'); 

  // სუფთა State-ები Firebase-დან
  const [products, setProducts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [weeklyArchives, setWeeklyArchives] = useState([]);

  // ჩამოსაშლელი ბლოკების State-ები
  const [expandedHistory, setExpandedHistory] = useState({});
  const [expandedArchiveWeek, setExpandedArchiveWeek] = useState(null);
  const [expandedArchiveOrder, setExpandedArchiveOrder] = useState(null);

  // ფორმების State-ები
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdVolume, setNewProdVolume] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newPartnerName, setNewPartnerName] = useState('');

  const [editingProductId, setEditingProductId] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('');
  const [editProdVolume, setEditProdVolume] = useState('');
  const [editProdStock, setEditProdStock] = useState('');
  const [editProdDamaged, setEditProdDamaged] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [cart, setCart] = useState([]);

  // ================= 🔄 FIREBASE REALTIME SYNCHRONIZATION =================
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubProducts = onSnapshot(collection(db, "dist_products"), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubPartners = onSnapshot(collection(db, "dist_partners"), (snapshot) => {
      setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qOrders = query(collection(db, "dist_orders"), where("status", "==", "მიმდინარე"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qHistory = query(collection(db, "dist_orders"), where("status", "in", ["დასრულებული", "რედაქტირებული"]));
    const unsubHistory = onSnapshot(qHistory, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse());
    });

    const unsubArchives = onSnapshot(collection(db, "dist_weekly_archives"), (snapshot) => {
      setWeeklyArchives(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse());
    });

    return () => {
      unsubProducts(); unsubPartners(); unsubOrders(); unsubHistory(); unsubArchives();
    };
  }, [isAuthenticated]);

  const categories = ['ყველა', ...new Set(products.map(p => p.category || 'სხვა'))];

  const handleLogin = (e) => {
    e.preventDefault();
    if (authCode === ACCESS_CODE) setIsAuthenticated(true);
    else alert('არასწორი კოდი!');
  };

  const toggleHistoryDetail = (id) => setExpandedHistory(prev => ({ ...prev, [id]: !prev[id] }));
  
  const toggleArchiveWeek = (id) => {
    setExpandedArchiveWeek(prev => prev === id ? null : id);
    setExpandedArchiveOrder(null); // კვირის შეცვლისას ღია შეკვეთა დაიმალოს
  };
  
  const toggleArchiveOrder = (id) => setExpandedArchiveOrder(prev => prev === id ? null : id);

  // ================= ⚙️ ADMIN FUNCTIONS =================
  const handleAddProduct = async () => {
    if (!newProdName || !newProdPrice || !newProdCategory || !newProdVolume) return alert('შეავსეთ ძირითადი ველები!');
    try {
      await addDoc(collection(db, "dist_products"), {
        name: newProdName, price: parseFloat(newProdPrice) || 0, category: newProdCategory, volume: newProdVolume, stock: parseInt(newProdStock) || 0, damaged: 0
      });
      alert("✅ წამალი დაემატა!");
      setNewProdName(''); setNewProdPrice(''); setNewProdCategory(''); setNewProdVolume(''); setNewProdStock('');
    } catch (error) { alert("❌ შეცდომა: " + error.message); }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id); setEditProdName(product.name); setEditProdPrice(product.price); setEditProdCategory(product.category); setEditProdVolume(product.volume); setEditProdStock(product.stock); setEditProdDamaged(product.damaged);
  };

  const saveProductEdit = async (id) => {
    try {
      await updateDoc(doc(db, "dist_products", id), { name: editProdName, price: parseFloat(editProdPrice) || 0, category: editProdCategory, volume: editProdVolume, stock: parseInt(editProdStock) || 0, damaged: parseInt(editProdDamaged) || 0 });
      setEditingProductId(null);
    } catch(error) { alert("შეცდომა: " + error.message); }
  };

  const handleQuickStockUpdate = async (productId, field, value) => {
    try { await updateDoc(doc(db, "dist_products", productId), { [field]: parseInt(value) || 0 }); } catch(err) { console.error(err); }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('ნამდვილად წავშალოთ პროდუქტი?')) await deleteDoc(doc(db, "dist_products", id));
  };

  const handleAddPartner = async () => {
    if (!newPartnerName) return alert('შეიყვანეთ სახელი!');
    try { await addDoc(collection(db, "dist_partners"), { name: newPartnerName }); setNewPartnerName(''); } catch (error) { alert("❌ შეცდომა: " + error.message); }
  };

  const handleDeletePartner = async (id) => {
    if (window.confirm('წავშალოთ პარტნიორი?')) await deleteDoc(doc(db, "dist_partners", id));
  };

  // ================= 🛒 PRE-SELLER FUNCTIONS =================
  const addToCart = (product, qty) => {
    const quantity = parseInt(qty);
    if (isNaN(quantity) || quantity < 0) return;
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (quantity === 0) return prev.filter(item => item.product.id !== product.id);
      if (existing) return prev.map(item => item.product.id === product.id ? { ...item, quantity } : item);
      return [...prev, { product, quantity }];
    });
  };

  const submitOrder = async () => {
    if (!selectedPartner || cart.length === 0) return alert('აირჩიეთ პარტნიორი და პროდუქტები!');
    const orderTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    try {
      await addDoc(collection(db, "dist_orders"), {
        partner: selectedPartner,
        items: cart.map(item => ({ product: { id: item.product.id, name: item.product.name, price: item.product.price, volume: item.product.volume }, originalQuantity: item.quantity, quantity: item.quantity })),
        totalPrice: orderTotal,
        status: 'მიმდინარე',
        createdAt: formattedDate,
        changesLog: []
      });
      setCart([]); setSelectedPartner('');
      alert('შეკვეთა გაიგზავნა საწყობში!');
    } catch(err) { alert("ვერ გაიგზავნა: " + err.message); }
  };

  // ================= 🏬 WAREHOUSE FUNCTIONS =================
  const handleQuantityChangeInWarehouse = (orderId, productId, newQty) => {
    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => item.product.id === productId ? { ...item, quantity: parseInt(newQty) || 0 } : item);
        return { ...order, items: updatedItems, totalPrice: updatedItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0) };
      }
      return order;
    }));
  };

  const confirmOrder = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    let wasEdited = false;
    const logs = [];

    try {
      for (const item of order.items) {
        if (item.quantity !== item.originalQuantity) {
          wasEdited = true;
          logs.push(`${item.product.name}: მოთხოვნა: ${item.originalQuantity}ც, გაიგზავნა: ${item.quantity}ც`);
        }
        const dbProd = products.find(p => p.id === item.product.id);
        if (dbProd) await updateDoc(doc(db, "dist_products", dbProd.id), { stock: Math.max(0, dbProd.stock - item.quantity) });
      }

      const now = new Date();
      const completedTime = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      await updateDoc(doc(db, "dist_orders", orderId), { 
        items: order.items, 
        totalPrice: order.totalPrice, 
        status: wasEdited ? 'რედაქტირებული' : 'დასრულებული', 
        changesLog: logs, 
        completedAt: completedTime 
      });
      alert('შეკვეთა ჩალაგდა!');
    } catch(err) { alert("შეცდომა ჩალაგებისას: " + err.message); }
  };

  // ================= 🔒 კვირის დახურვა =================
  const handleCloseCurrentWeek = async () => {
    if (orders.length > 0) return alert('კვირას ვერ დახურავთ, სანამ საწყობში აქტიური შეკვეთებია!');
    if (history.length === 0) return alert('მიმდინარე კვირაში შეკვეთები არ არის.');

    if (window.confirm('ნამდვილად გსურთ მიმდინარე კვირის დაარქივება? მონაცემები გადავა არქივის ბაზაში მუდმივად.')) {
      try {
        const now = new Date();
        const today = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()}`;
        
        await addDoc(collection(db, "dist_weekly_archives"), { 
          closedDate: today, 
          ordersCount: history.length, 
          totalSales: history.reduce((sum, o) => sum + o.totalPrice, 0),
          archivedOrders: history 
        });

        for (const hOrder of history) await updateDoc(doc(db, "dist_orders", hOrder.id), { status: "დაარქივებული" });
        alert('მიმდინარე კვირა მუდმივად დაარქივდა! 📦');
      } catch(err) { alert("ვერ დაიხურა: " + err.message); }
    }
  };

  const totalQuantities = (() => {
    const totals = {};
    [...orders, ...history].forEach(o => o.items.forEach(i => totals[i.product.name] = (totals[i.product.name] || 0) + i.quantity));
    return totals;
  })();

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedCategory === 'ყველა' || p.category === selectedCategory));

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border-t-4 border-emerald-500">
          <h2 className="text-2xl font-black mb-2 text-center text-slate-800">შიდა სისტემა</h2>
          <input type="password" value={authCode} onChange={(e) => setAuthCode(e.target.value)} className="w-full p-3 border rounded-xl mb-4 text-center text-xl tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none font-bold bg-slate-50" placeholder="****" />
          <button type="submit" className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold hover:bg-emerald-700 transition">შესვლა</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800 max-w-7xl mx-auto">
      
      {/* ჰედერი */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">🧬 PharmaVet Cloud Distribution</h1>
          <p className="text-emerald-600 text-xs mt-0.5 font-bold">🟢 Firebase ონლაინ რეჟიმი აქტიურია</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-full sm:w-auto overflow-x-auto">
          <button onClick={() => setActiveTab('preseller')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'preseller' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>🛒 პრესელერი</button>
          <button onClick={() => setActiveTab('warehouse')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'warehouse' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>🏬 საწყობი ({orders.length})</button>
          <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'history' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>📜 მიმდინარე კვირა</button>
          <button onClick={() => setActiveTab('admin')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>⚙️ ბაზის მართვა</button>
        </div>
      </div>

      {/* ================= TAB 1: პრესელერი ================= */}
      {activeTab === 'preseller' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 mb-4">პროდუქციის კატალოგი</h2>
            <div className="flex flex-col sm:flex-row gap-2 mb-4 bg-slate-50 p-2 rounded-xl">
              <input type="text" placeholder="🔍 მოძებნე მედიკამენტი..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 p-2 border rounded-lg bg-white text-sm outline-none" />
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="p-2 border rounded-lg bg-white text-sm font-semibold text-slate-700 outline-none">
                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>
            {products.length === 0 ? (
              <p className="text-gray-400 text-xs italic text-center py-6 bg-slate-50 rounded-xl">ბაზა ცარიელია.</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredProducts.map(p => {
                  const cartItem = cart.find(item => item.product.id === p.id);
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/40">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{p.name}</h4>
                        <p className="text-[11px] text-gray-400">მოცულობა: {p.volume} | ხელმისაწვდომია: <span className="font-bold text-slate-600">{p.stock} ცალი</span></p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-extrabold text-sm text-slate-700">{p.price.toFixed(2)} ₾</span>
                        <input type="number" min="0" placeholder="0" value={cartItem ? cartItem.quantity : ''} onChange={e => addToCart(p, e.target.value)} className="w-16 p-1.5 border rounded-lg text-center font-bold bg-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">შეკვეთის გაფორმება</h2>
            <div className="mb-4">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">პარტნიორი ობიექტი</label>
              <select value={selectedPartner} onChange={e => setSelectedPartner(e.target.value)} className="w-full p-2.5 border rounded-xl bg-white text-sm font-semibold">
                <option value="">-- აირჩიეთ პარტნიორი --</option>
                {partners.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
            </div>
            {cart.length > 0 ? (
              <div className="bg-emerald-50/50 p-4 rounded-xl mb-4 border border-emerald-100/60">
                <div className="space-y-1.5 max-h-40 overflow-y-auto mb-3 text-xs">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-emerald-950">
                      <span>{item.product.name} x {item.quantity}</span>
                      <span className="font-semibold">{(item.product.price * item.quantity).toFixed(2)} ₾</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-black text-emerald-900 text-sm border-t pt-2">
                  <span>ჯამური თანხა:</span>
                  <span>{cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)} ₾</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-xs italic text-center py-6 bg-slate-50 rounded-xl mb-4">კალათა ცარიელია</p>
            )}
            <button type="button" onClick={submitOrder} className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold hover:bg-emerald-700 transition text-sm">გაგზავნა საწყობში 🚀</button>
          </div>
        </div>
      )}

      {/* ================= TAB 2: საწყობი ================= */}
      {activeTab === 'warehouse' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-2">🏬 აქტიური შესასრულებელი შეკვეთები</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 border-dashed text-gray-400 italic text-sm">ყველა შეკვეთა ჩალაგებულია! 🎉</div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-black text-slate-800 text-base">{order.partner}</h3>
                      <p className="text-[10px] text-indigo-600 font-bold mt-0.5">📅 გაფორმდა: {order.createdAt}</p>
                    </div>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-bold uppercase">მზადდება</span>
                  </div>

                  <div className="overflow-x-auto mb-4 border rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                        <tr>
                          <th className="p-2.5">წამალი</th>
                          <th className="p-2.5 text-center">მოთხოვნა</th>
                          <th className="p-2.5 text-center">საწყობშია</th>
                          <th className="p-2.5 text-center">ფაქტი</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {order.items.map(item => {
                          const currentDbProduct = products.find(p => p.id === item.product.id) || { stock: 0 };
                          const diff = currentDbProduct.stock - item.quantity;
                          return (
                            <tr key={item.product.id} className="hover:bg-slate-50/50">
                              <td className="p-2.5 font-bold text-slate-700">{item.product.name}</td>
                              <td className="p-2.5 text-center font-mono bg-amber-50 text-amber-800 font-bold">{item.originalQuantity}ც</td>
                              <td className="p-2.5 text-center font-mono text-slate-500">{currentDbProduct.stock}ც</td>
                              <td className="p-2.5 text-center">
                                <input type="number" value={item.quantity} onChange={e => handleQuantityChangeInWarehouse(order.id, item.product.id, e.target.value)} className={`w-14 p-1 border rounded font-black text-center outline-none ${diff < 0 ? 'bg-rose-50 text-rose-600 border-rose-300' : 'bg-emerald-50 text-emerald-600 border-emerald-300'}`} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border mb-4 text-xs font-bold">
                    <span className="text-slate-600">ღირებულება:</span>
                    <span className="text-blue-600 text-sm font-black">{order.totalPrice.toFixed(2)} ₾</span>
                  </div>
                  <button type="button" onClick={() => confirmOrder(order.id)} className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 font-bold text-xs">ჩალაგების დადასტურება ✓</button>
                </div>
              ))
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-1">📦 საწყობის ინვენტარი</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 mt-4">
              {products.map(p => (
                <div key={p.id} className="p-3 border rounded-xl bg-slate-50/50 space-y-2">
                  <div className="font-bold text-xs text-slate-800">{p.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <label className="block text-gray-400 mb-0.5 font-medium">✅ მარაგი:</label>
                      <input type="number" value={p.stock} onChange={e => handleQuickStockUpdate(p.id, 'stock', e.target.value)} className="w-full p-1 border rounded text-center font-bold text-slate-700" />
                    </div>
                    <div>
                      <label className="block text-rose-400 mb-0.5 font-medium">⚠️ ბრაკი:</label>
                      <input type="number" value={p.damaged} onChange={e => handleQuickStockUpdate(p.id, 'damaged', e.target.value)} className="w-full p-1 border rounded text-center font-bold text-rose-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: მიმდინარე კვირა ================= */}
      {activeTab === 'history' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md">
              <h3 className="text-base font-bold mb-1">📅 კვირის ციკლის დახურვა</h3>
              <p className="text-purple-100 text-xs mb-4">დოკუმენტების მუდმივ არქივში გადატანა</p>
              <button type="button" onClick={handleCloseCurrentWeek} className="w-full bg-white text-purple-700 p-3 rounded-xl font-extrabold hover:bg-purple-50 transition text-xs shadow-sm mb-3">🔒 არქივში გადატანა</button>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-1">📊 მიმდინარე კვირის ჯამური მოთხოვნა</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 mt-4">
                {Object.entries(totalQuantities).map(([name, qty], idx) => (
                  <div key={idx} className="flex justify-between p-2.5 border rounded-xl bg-slate-50 text-xs items-center">
                    <span className="text-slate-700 font-medium">{name}</span>
                    <span className="font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{qty} ცალი</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-4">📜 მიმდინარე კვირის რეესტრი</h2>
              {history.length === 0 ? (
                <p className="text-gray-400 italic text-sm text-center py-8">შეკვეთები ჯერ არ დასრულებულა.</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {history.map(h => {
                    const isExpanded = expandedHistory[h.id];
                    return (
                      <div key={h.id} className={`p-4 border rounded-xl text-xs transition-colors ${h.status === 'რედაქტირებული' ? 'border-amber-200 bg-amber-50/30' : 'border-emerald-200 bg-emerald-50/30'}`}>
                        <div className="flex justify-between items-center cursor-pointer group" onClick={() => toggleHistoryDetail(h.id)}>
                          <div>
                            <span className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">🏪 {h.partner}</span>
                            <p className="text-[10px] text-gray-500 mt-1">📅 {h.createdAt} ➜ 📦 {h.completedAt}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${h.status === 'რედაქტირებული' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {h.status}
                            </span>
                            <span className="text-slate-400 font-bold bg-white border px-2 py-1 rounded-md">{isExpanded ? '▲' : '▼'}</span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                            <table className="w-full text-left text-[11px] sm:text-xs">
                              <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                                <tr>
                                  <th className="p-2">პროდუქტი</th>
                                  <th className="p-2 text-center">მოთხოვნა</th>
                                  <th className="p-2 text-center">ფაქტი</th>
                                  <th className="p-2 text-center">სხვაობა</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {h.items.map((item, i) => {
                                  const diff = item.quantity - item.originalQuantity;
                                  const isFullMatch = diff === 0;
                                  return (
                                    <tr key={i} className={isFullMatch ? 'bg-white' : 'bg-rose-50/60'}>
                                      <td className="p-2 font-bold text-slate-700">{item.product.name}</td>
                                      <td className="p-2 text-center text-slate-500">{item.originalQuantity}ც</td>
                                      <td className="p-2 text-center font-bold text-slate-700">{item.quantity}ც</td>
                                      <td className={`p-2 text-center font-black ${isFullMatch ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {isFullMatch ? '✓' : `${diff}ც`}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            <div className="flex justify-between items-center bg-slate-50 p-2 border-t text-slate-700 font-bold">
                              <span>ჯამი:</span>
                              <span className="text-indigo-600">{h.totalPrice.toFixed(2)} ₾</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* არქივზე გადასასვლელი ბლოკი */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
              <div className="text-4xl mb-4">🗄️</div>
              <h2 className="text-lg font-black text-slate-900 mb-2">მუდმივი არქივი</h2>
              <p className="text-xs text-gray-500 mb-6">აქ ინახება დახურული კვირების სრული ისტორია, ყველა შეკვეთა და დეტალური ანალიტიკა სამუდამოდ.</p>
              <button 
                onClick={() => setActiveTab('archive')} 
                className="bg-slate-900 text-white w-full py-3 rounded-xl font-bold hover:bg-indigo-600 transition"
              >
                სრული არქივის გახსნა ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 🚀 ახალი TAB 5: მუდმივი არქივის ფანჯარა ================= */}
      {activeTab === 'archive' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fadeIn min-h-[600px]">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">🗄️ მუდმივი არქივი</h2>
              <p className="text-xs text-gray-500 mt-1">დახურული კვირების დეტალური ისტორია</p>
            </div>
            <button onClick={() => setActiveTab('history')} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm transition">
              ⬅ უკან დაბრუნება
            </button>
          </div>

          {weeklyArchives.length === 0 ? (
            <div className="text-center py-20 text-gray-400 italic">არქივი ჯერ ცარიელია.</div>
          ) : (
            <div className="space-y-4">
              {weeklyArchives.map(arch => {
                const isWeekOpen = expandedArchiveWeek === arch.id;
                return (
                  <div key={arch.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    
                    {/* კვირის ჰედერი (კლიკებადი) */}
                    <div 
                      onClick={() => toggleArchiveWeek(arch.id)}
                      className={`flex justify-between items-center p-4 cursor-pointer transition ${isWeekOpen ? 'bg-indigo-50 border-b border-indigo-100' : 'bg-slate-50 hover:bg-slate-100'}`}
                    >
                      <div>
                        <span className="font-black text-slate-800 text-sm">კვირის დახურვა: <span className="text-indigo-600 ml-1">{arch.closedDate}</span></span>
                        <div className="flex gap-4 text-[11px] text-gray-500 mt-1 font-medium">
                          <span>📦 შეკვეთები: {arch.ordersCount}</span>
                          <span>💰 ბრუნვა: {arch.totalSales.toFixed(2)} ₾</span>
                        </div>
                      </div>
                      <span className="text-slate-400 bg-white border px-2 py-1 rounded-md text-[10px] font-bold">
                        {isWeekOpen ? 'დამალვა ▲' : 'გახსნა ▼'}
                      </span>
                    </div>

                    {/* შიდა შეკვეთები (თუ კვირა ღიაა) */}
                    {isWeekOpen && (
                      <div className="p-4 bg-white space-y-3">
                        {!arch.archivedOrders || arch.archivedOrders.length === 0 ? (
                          <p className="text-xs text-gray-400 italic">დეტალები არ მოიძებნა.</p>
                        ) : (
                          arch.archivedOrders.map(order => {
                            const isOrderOpen = expandedArchiveOrder === order.id;
                            return (
                              <div key={order.id} className="border border-slate-100 rounded-lg bg-slate-50/50">
                                
                                {/* შეკვეთის ჰედერი */}
                                <div 
                                  onClick={() => toggleArchiveOrder(order.id)}
                                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-slate-100 transition"
                                >
                                  <div>
                                    <span className="font-bold text-slate-700 text-xs">🏪 {order.partner}</span>
                                    <p className="text-[10px] text-gray-400 mt-0.5">თარიღი: {order.createdAt}</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <span className="font-black text-indigo-600 text-xs">{order.totalPrice.toFixed(2)} ₾</span>
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${order.status === 'რედაქტირებული' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                      {order.status}
                                    </span>
                                  </div>
                                </div>

                                {/* შეკვეთის დეტალური ცხრილი */}
                                {isOrderOpen && (
                                  <div className="border-t border-slate-200">
                                    <table className="w-full text-left text-[11px]">
                                      <thead className="bg-slate-100 text-slate-500 font-bold border-b">
                                        <tr>
                                          <th className="p-2">პროდუქტი</th>
                                          <th className="p-2 text-center">მოთხოვნა</th>
                                          <th className="p-2 text-center">გაიგზავნა</th>
                                          <th className="p-2 text-center">სხვაობა</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y bg-white">
                                        {order.items.map((item, i) => {
                                          const diff = item.quantity - item.originalQuantity;
                                          const isFullMatch = diff === 0;
                                          return (
                                            <tr key={i} className={isFullMatch ? '' : 'bg-rose-50/40'}>
                                              <td className="p-2 font-bold text-slate-700">{item.product.name}</td>
                                              <td className="p-2 text-center text-slate-500">{item.originalQuantity}ც</td>
                                              <td className="p-2 text-center font-bold text-slate-800">{item.quantity}ც</td>
                                              <td className={`p-2 text-center font-black ${isFullMatch ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {isFullMatch ? '✓' : `${diff}ც`}
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: მართვის პანელი ================= */}
      {activeTab === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-4">💊 პროდუქციის ბაზის მართვა</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 bg-slate-50 p-3 rounded-xl border">
              <input type="text" placeholder="სახელი" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="p-2 border rounded-lg text-xs bg-white outline-none" />
              <input type="number" step="0.01" placeholder="ფასი" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="p-2 border rounded-lg text-xs bg-white outline-none" />
              <input type="text" placeholder="კატეგორია" value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="p-2 border rounded-lg text-xs bg-white outline-none" />
              <input type="text" placeholder="მოცულობა" value={newProdVolume} onChange={e => setNewProdVolume(e.target.value)} className="p-2 border rounded-lg text-xs bg-white outline-none" />
              <input type="number" placeholder="საწყისი მარაგი" value={newProdStock} onChange={e => setNewProdStock(e.target.value)} className="p-2 border rounded-lg text-xs bg-white outline-none" />
              <button type="button" onClick={handleAddProduct} className="col-span-2 sm:col-span-5 bg-indigo-600 text-white p-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition">ახალი პროდუქტის დამატება +</button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {products.map(p => (
                <div key={p.id} className="p-3 border rounded-xl bg-slate-50/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  {editingProductId === p.id ? (
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-1 w-full">
                      <input type="text" value={editProdName} onChange={e => setEditProdName(e.target.value)} className="p-1.5 border rounded text-xs" />
                      <input type="number" step="0.01" value={editProdPrice} onChange={e => setEditProdPrice(e.target.value)} className="p-1.5 border rounded text-xs" />
                      <input type="text" value={editProdCategory} onChange={e => setEditProdCategory(e.target.value)} className="p-1.5 border rounded text-xs" />
                      <input type="text" value={editProdVolume} onChange={e => setEditProdVolume(e.target.value)} className="p-1.5 border rounded text-xs" />
                      <input type="number" value={editProdStock} onChange={e => setEditProdStock(e.target.value)} className="p-1.5 border rounded text-xs" />
                      <input type="number" value={editProdDamaged} onChange={e => setEditProdDamaged(e.target.value)} className="p-1.5 border rounded text-xs" />
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-sm text-slate-800">{p.name}</span>
                      <span className="text-[10px] text-gray-400 block">მოცულობა: {p.volume} | მარაგი: <span className="text-slate-700 font-bold">{p.stock}ც</span> | დაზიანებული: <span className="text-rose-600 font-bold">{p.damaged}ც</span></span>
                    </div>
                  )}
                  <div className="flex gap-1 w-full sm:w-auto justify-end">
                    {editingProductId === p.id ? (
                      <button type="button" onClick={() => saveProductEdit(p.id)} className="bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">OK</button>
                    ) : (
                      <>
                        <button type="button" onClick={() => startEditProduct(p)} className="bg-amber-500 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">შეცვლა</button>
                        <button type="button" onClick={() => handleDeleteProduct(p.id)} className="bg-rose-500 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">წაშლა</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-4">🤝 პარტნიორების ბაზა</h2>
            <div className="flex gap-1 mb-6 bg-slate-50 p-2 rounded-xl">
              <input type="text" placeholder="ობიექტის სახელი" value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} className="flex-1 p-2 border rounded-lg text-xs bg-white outline-none" />
              <button type="button" onClick={handleAddPartner} className="bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-bold">დამატება</button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {partners.map(partner => (
                <div key={partner.id} className="p-2.5 border rounded-xl bg-slate-50/30 flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-700">{partner.name}</span>
                  <button type="button" onClick={() => handleDeletePartner(partner.id)} className="bg-rose-500 text-white px-2 py-1 rounded-md text-[9px] font-bold">X</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}