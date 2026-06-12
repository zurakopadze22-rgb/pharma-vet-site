import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // 👈 თუ ორივე ფაილი src-შია, სწორი გზაა ./firebase
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

const ACCESS_CODE = "1234";

export default function DistributionDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [activeTab, setActiveTab] = useState('preseller'); 

  // ბაზიდან წამოსული მონაცემების რეალური State-ები
  const [products, setProducts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [weeklyArchives, setWeeklyArchives] = useState([]);

  // ადმინის ფორმები
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdVolume, setNewProdVolume] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newPartnerName, setNewPartnerName] = useState('');

  // რედაქტირების ფორმები
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('');
  const [editProdVolume, setEditProdVolume] = useState('');
  const [editProdStock, setEditProdStock] = useState('');
  const [editProdDamaged, setEditProdDamaged] = useState('');

  // პრესელერის ძებნა და კალათა
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [cart, setCart] = useState([]);

  // ================= 🔄 FIREBASE REALTIME SYNCHRONIZATION =================
  useEffect(() => {
    if (!isAuthenticated) return;

    // 1. პროდუქტების რეალურ დროში მოსმენა
    const unsubProducts = onSnapshot(collection(db, "dist_products"), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 2. პარტნიორების რეალურ დროში მოსმენა
    const unsubPartners = onSnapshot(collection(db, "dist_partners"), (snapshot) => {
      setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 3. აქტიური შეკვეთების მოსმენა (სტატუსით: 'მიმდინარე')
    const qOrders = query(collection(db, "dist_orders"), where("status", "==", "მიმდინარე"));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 4. მიმდინარე კვირის დასრულებული რეესტრის მოსმენა
    const qHistory = query(collection(db, "dist_orders"), where("status", "in", ["დასრულებული", "რედაქტირებული"]));
    const unsubHistory = onSnapshot(qHistory, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // 5. ძველი დახურული კვირების არქივის მოსმენა
    const unsubArchives = onSnapshot(collection(db, "dist_weekly_archives"), (snapshot) => {
      setWeeklyArchives(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubProducts();
      unsubPartners();
      unsubOrders();
      unsubHistory();
      unsubArchives();
    };
  }, [isAuthenticated]);

  const categories = ['ყველა', ...new Set(products.map(p => p.category || 'სხვა'))];

  const handleLogin = (e) => {
    e.preventDefault();
    if (authCode === ACCESS_CODE) setIsAuthenticated(true);
    else alert('არასწორი კოდი!');
  };

  // ================= ⚙️ ADMIN & STOCK FUNCTIONS (FIREBASE WRITES) =================
  
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdCategory || !newProdVolume) return alert('შეავსეთ ძირითადი ველები!');
    
    try {
      // ვცდილობთ ბაზაში ჩაწერას
      await addDoc(collection(db, "dist_products"), {
        name: newProdName,
        price: parseFloat(newProdPrice) || 0,
        category: newProdCategory,
        volume: newProdVolume,
        stock: parseInt(newProdStock) || 0,
        damaged: 0
      });
      
      // თუ ჩაიწერა, ამოაგდებს ამას
      alert("✅ წამალი წარმატებით ჩაიწერა ონლაინ ბაზაში!");
      
      setNewProdName(''); setNewProdPrice(''); setNewProdCategory(''); setNewProdVolume(''); setNewProdStock('');
    } catch (error) {
      // თუ ვერ ჩაიწერა, ეკრანზე გამოიტანს კონკრეტულ შეცდომას
      alert("❌ შეცდომა ბაზაში ჩაწერისას: " + error.message);
      console.error("სრული შეცდომა: ", error);
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id); setEditProdName(product.name); setEditProdPrice(product.price); setEditProdCategory(product.category); setEditProdVolume(product.volume); setEditProdStock(product.stock); setEditProdDamaged(product.damaged);
  };

  const saveProductEdit = async (id) => {
    const productRef = doc(db, "dist_products", id);
    await updateDoc(productRef, {
      name: editProdName,
      price: parseFloat(editProdPrice),
      category: editProdCategory,
      volume: editProdVolume,
      stock: parseInt(editProdStock) || 0,
      damaged: parseInt(editProdDamaged) || 0
    });
    setEditingProductId(null);
  };

  const handleQuickStockUpdate = async (productId, field, value) => {
    const productRef = doc(db, "dist_products", productId);
    await updateDoc(productRef, { [field]: parseInt(value) || 0 });
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!newPartnerName) return alert('შეიყვანეთ სახელი!');
    await addDoc(collection(db, "dist_partners"), { name: newPartnerName });
    setNewPartnerName('');
  };

  const handleDeletePartner = async (id) => {
    if (window.confirm('წავშალოთ პარტნიორი?')) {
      await deleteDoc(doc(db, "dist_partners", id));
    }
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
    const formattedDate = now.toLocaleDateString('ka-GE') + ' ' + now.toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' });

    await addDoc(collection(db, "dist_orders"), {
      partner: selectedPartner,
      items: cart.map(item => ({
        product: { id: item.product.id, name: item.product.name, price: item.product.price, volume: item.product.volume },
        originalQuantity: item.quantity,
        quantity: item.quantity
      })),
      totalPrice: orderTotal,
      status: 'მიმდინარე',
      createdAt: formattedDate,
      changesLog: []
    });

    setCart([]);
    setSelectedPartner('');
    alert('შეკვეთა მომენტალურად გაიგზავნა საწყობში! 🚀');
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

    for (const item of order.items) {
      if (item.quantity !== item.originalQuantity) {
        wasEdited = true;
        logs.push(`${item.product.name}: მოთხოვნილი იყო ${item.originalQuantity}ც, ჩაიდო ${item.quantity}ც`);
      }
      
      const dbProd = products.find(p => p.id === item.product.id);
      if (dbProd) {
        const productRef = doc(db, "dist_products", dbProd.id);
        await updateDoc(productRef, {
          stock: Math.max(0, dbProd.stock - item.quantity)
        });
      }
    }

    const now = new Date();
    const completedTime = now.toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' });
    
    const orderRef = doc(db, "dist_orders", orderId);
    await updateDoc(orderRef, {
      items: order.items,
      totalPrice: order.totalPrice,
      status: wasEdited ? 'რედაქტირებული' : 'დასრულებული',
      changesLog: logs,
      completedAt: completedTime
    });

    alert('შეკვეთა წარმატებით ჩალაგდა!');
  };

  // ================= 🔒 ყოველკვირეული ციკლის მართვა =================
  
  const handleCloseCurrentWeek = async () => {
    if (orders.length > 0) return alert('კვირას ვერ დახურავთ, სანამ საწყობში არის აქტიური შეკვეთები!');
    if (history.length === 0) return alert('მიმდინარე კვირაში არცერთი შეკვეთა არ არის შესრულებული.');

    if (window.confirm('ნამდვილად გსურთ მიმდინარე კვირის რეესტრის დახურვა და დაარქივება?')) {
      const today = new Date().toLocaleDateString('ka-GE');
      
      await addDoc(collection(db, "dist_weekly_archives"), {
        closedDate: today,
        ordersCount: history.length,
        totalSales: history.reduce((sum, o) => sum + o.totalPrice, 0)
      });

      for (const hOrder of history) {
        const orderRef = doc(db, "dist_orders", hOrder.id);
        await updateDoc(orderRef, { status: "დაარქივებული" });
      }

      alert('მიმდინარე კვირა წარმატებით დაიხურა და გადავიდა არქივში! 📦');
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
          <button onClick={() => setActiveTab('preseller')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'preseller' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}>🛒 პრესელერი</button>
          <button onClick={() => setActiveTab('warehouse')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'warehouse' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>🏬 საწყობი ({orders.length})</button>
          <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'history' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}>📜 რეესტრი & კვირის არქივი</button>
          <button onClick={() => setActiveTab('admin')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>⚙️ ბაზის მართვა</button>
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
              <p className="text-gray-400 text-xs italic text-center py-6 bg-slate-50 rounded-xl">ბაზა ცარიელია. შედით "ბაზის მართვაში" პროდუქტების დასამატებლად.</p>
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
            <button onClick={submitOrder} className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold hover:bg-emerald-700 transition text-sm">გაგზავნა საწყობში 🚀</button>
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
                          <th className="p-2.5 text-center">სხვაობა</th>
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
                                <input type="number" value={item.quantity} onChange={e => handleQuantityChangeInWarehouse(order.id, item.product.id, e.target.value)} className="w-14 p-1 border rounded bg-yellow-50 font-black text-center text-blue-600 outline-none" />
                              </td>
                              <td className={`p-2.5 text-center font-mono font-bold ${diff < 0 ? 'text-rose-600 bg-rose-50' : 'text-emerald-600'}`}>{diff}ც</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center bg-blue-50/30 p-3 rounded-xl border border-blue-100/50 mb-4 text-xs font-bold">
                    <span className="text-slate-600">ღირებულება:</span>
                    <span className="text-blue-600 text-sm font-black">{order.totalPrice.toFixed(2)} ₾</span>
                  </div>
                  <button onClick={() => confirmOrder(order.id)} className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 font-bold text-xs">ჩალაგების დადასტურება ✓</button>
                </div>
              ))
            )}
          </div>

          {/* საწყობის სწრაფი ინვენტარი */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-1">📦 საწყობის ინვენტარი</h2>
            <p className="text-gray-400 text-[11px] mb-4">სწრაფი კორექტირება ღრუბელში</p>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
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

      {/* ================= TAB 3: კვირის რეესტრი & დიდი არქივი ================= */}
      {activeTab === 'history' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md">
              <h3 className="text-base font-bold mb-1">📅 კვირის ციკლის დახურვა</h3>
              <p className="text-purple-100 text-xs mb-4">ყველა დოკუმენტის ერთიან არქივში გადატანა</p>
              <button onClick={handleCloseCurrentWeek} className="w-full bg-white text-purple-700 p-3 rounded-xl font-extrabold hover:bg-purple-50 transition text-xs shadow-sm">🔒 კვირის დახურვა და დაარქივება</button>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-1">📊 კვირის ჯამური მოთხოვნა (კონსოლიდირებული)</h2>
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
              <h2 className="text-base font-bold text-slate-900 mb-4">📜 მიმდინარე კვირის შესრულებული რეესტრი</h2>
              {history.length === 0 ? (
                <p className="text-gray-400 italic text-sm text-center py-8">მიმდინარე კვირაში შეკვეთები ჯერ არ დასრულებულა.</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {history.map(h => (
                    <div key={h.id} className={`p-4 border rounded-xl text-xs ${h.status === 'რედაქტირებული' ? 'border-amber-100 bg-amber-50/20' : 'border-emerald-100 bg-emerald-50/10'}`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-slate-800 text-sm">{h.partner}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${h.status === 'რედაქტირებული' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>{h.status}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mb-2">🕒 გაფორმდა: {h.createdAt} | დასრულდა: {h.completedAt}</p>
                      <ul className="list-disc pl-4 text-slate-600 space-y-0.5 mb-2">
                        {h.items.map((item, i) => (
                          <li key={i}>{item.product.name} — <span className="font-bold text-slate-800">{item.quantity} ცალი</span></li>
                        ))}
                      </ul>
                      <div className="flex justify-between items-center bg-white p-2 rounded-lg border text-slate-700 font-bold">
                        <span>საბოლოო ჯამი:</span>
                        <span className="text-indigo-600 font-black">{h.totalPrice.toFixed(2)} ₾</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-1">🗄️ დახურული კვირების არქივი</h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 mt-4">
                {weeklyArchives.map(arch => (
                  <div key={arch.id} className="p-3 border rounded-xl bg-slate-50 text-xs">
                    <div className="flex justify-between font-bold text-slate-800 mb-1">
                      <span>📦 დახურული კვირა</span>
                      <span className="text-indigo-600 font-mono">{arch.closedDate}</span>
                    </div>
                    <div className="text-gray-500 text-[11px] space-y-0.5">
                      <div>• შეკვეთები: <span className="font-bold text-slate-700">{arch.ordersCount}ც</span></div>
                      <div>• სრული ბრუნვა: <span className="font-bold text-purple-700">{arch.totalSales.toFixed(2)} ₾</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: მართვის პანელი ================= */}
      {activeTab === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-4">💊 პროდუქციის ბაზის მართვა</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6 bg-slate-50 p-3 rounded-xl border">
              <input type="text" placeholder="სახელი" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="p-2 border rounded-lg text-xs" />
              <input type="number" step="0.01" placeholder="ფასი" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="p-2 border rounded-lg text-xs" />
              <input type="text" placeholder="კატეგორია" value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="p-2 border rounded-lg text-xs" />
              <input type="text" placeholder="მოცულობა" value={newProdVolume} onChange={e => setNewProdVolume(e.target.value)} className="p-2 border rounded-lg text-xs" />
              <input type="number" placeholder="საწყისი მარაგი" value={newProdStock} onChange={e => setNewProdStock(e.target.value)} className="p-2 border rounded-lg text-xs" />
              <button type="submit" className="col-span-2 sm:col-span-5 bg-indigo-600 text-white p-2 rounded-lg text-xs font-bold">ახალი პროდუქტის დამატება +</button>
            </form>

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
                      <span className="text-[10px] text-gray-400 block">მოცულობა: {p.volume} | მარაგი: <span className="text-slate-700 font-bold">{p.stock}ც</span> | ბრაკი: <span className="text-rose-600 font-bold">{p.damaged}ც</span></span>
                    </div>
                  )}
                  <div className="flex gap-1 w-full sm:w-auto justify-end">
                    {editingProductId === p.id ? (
                      <button onClick={() => saveProductEdit(p.id)} className="bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">OK</button>
                    ) : (
                      <button onClick={() => startEditProduct(p)} className="bg-amber-500 text-white px-2.5 py-1 rounded-md text-[10px] font-bold">შეცვლა</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-4">🤝 პარტნიორების ბაზა</h2>
            <form onSubmit={handleAddPartner} className="flex gap-1 mb-6 bg-slate-50 p-2 rounded-xl">
              <input type="text" placeholder="ობიექტის სახელი" value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} className="flex-1 p-2 border rounded-lg text-xs" />
              <button type="submit" className="bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-bold">დამატება</button>
            </form>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {partners.map(partner => (
                <div key={partner.id} className="p-2.5 border rounded-xl bg-slate-50/30 flex justify-between items-center">
                  <span className="font-bold text-xs text-slate-700">{partner.name}</span>
                  <button onClick={() => handleDeletePartner(partner.id)} className="bg-rose-500 text-white px-2 py-1 rounded-md text-[9px] font-bold">X</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}