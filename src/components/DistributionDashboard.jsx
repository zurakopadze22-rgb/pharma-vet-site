import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import {
  collection, doc, addDoc, updateDoc, deleteDoc, onSnapshot, query, where, setDoc, getDoc
} from "firebase/firestore";

const ADMIN_CODE = import.meta.env.VITE_ADMIN_PIN;
const PRESELLER_CODE = import.meta.env.VITE_PRESELLER_PIN;
const COURIER_CODE = (() => {
  const pin = import.meta.env.VITE_COURIER_PIN;
  if (!pin || pin === 'undefined') return '3333';
  return String(pin).trim();
})();

export default function DistributionDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [activeTab, setActiveTab] = useState('preseller');

  // სუფთა State-ები Firebase-დან
  const [products, setProducts] = useState([]);
  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [weeklyArchives, setWeeklyArchives] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // RS.ge ავტორიზაციის State-ები
  const [rsUsername, setRsUsername] = useState('');
  const [rsPassword, setRsPassword] = useState('');
  const [savedRsUser, setSavedRsUser] = useState('არ არის მითითებული');
  const [isUploadingRS, setIsUploadingRS] = useState(false);
  const [isClosingRS, setIsClosingRS] = useState(false);
  const [isClosingAllRS, setIsClosingAllRS] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // 🚚 სატრანსპორტო მონაცემების ახალი State-ები (ინახავს ლოკალურად ბრაუზერში)
  const [rsCarNumber, setRsCarNumber] = useState(localStorage.getItem('rsCarNumber') || '');
  const [rsDriverTin, setRsDriverTin] = useState(localStorage.getItem('rsDriverTin') || '');
  const [rsDriverName, setRsDriverName] = useState(localStorage.getItem('rsDriverName') || '');

  // 💾 ყოველ შეცვლაზე ავტომატურად ინახავს მძღოლის მონაცემებს
  useEffect(() => {
    localStorage.setItem('rsCarNumber', rsCarNumber);
    localStorage.setItem('rsDriverTin', rsDriverTin);
    localStorage.setItem('rsDriverName', rsDriverName);
  }, [rsCarNumber, rsDriverTin, rsDriverName]);

  // ჩამოსაშლელი ბლოკების State-ები
  const [expandedHistory, setExpandedHistory] = useState({});
  const [expandedArchiveWeek, setExpandedArchiveWeek] = useState(null);
  const [expandedArchiveOrder, setExpandedArchiveOrder] = useState(null);

  // კურიერის მონაცემების რედაქტირების State-ები ადმინისთვის
  const [editingDeliveryOrderId, setEditingDeliveryOrderId] = useState(null);
  const [adminAmountPaid, setAdminAmountPaid] = useState('');
  const [adminDeliveryStatus, setAdminDeliveryStatus] = useState('delivered');

  // კვირის ფინანსური მონაცემების დეტალების ფანჯარა (Modals)
  const [activeSummaryModal, setActiveSummaryModal] = useState(null); // 'collected' | 'debts' | null

  // გრძელვადიანი ვალების (ნისიების) State
  const [debtOrders, setDebtOrders] = useState([]);
  const [expandedDebtorPartner, setExpandedDebtorPartner] = useState(null);

  // 📦 პროდუქტის ახალი ველები
  const [newProdName, setNewProdName] = useState('');
  const [newProdRetailPrice, setNewProdRetailPrice] = useState('');
  const [newProdWholesalePrice, setNewProdWholesalePrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdVolume, setNewProdVolume] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdBarcode, setNewProdBarcode] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('1');
  const [newProdVat, setNewProdVat] = useState('0');
  const [newProdIsMed, setNewProdIsMed] = useState(false);

  // ✍️ პროდუქტის რედაქტირების ველები
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdRetailPrice, setEditProdRetailPrice] = useState(''); // 👈 საცალო ფასი
  const [editProdWholesalePrice, setEditProdWholesalePrice] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('');
  const [editProdVolume, setEditProdVolume] = useState('');
  const [editProdStock, setEditProdStock] = useState('');
  const [editProdDamaged, setEditProdDamaged] = useState('');
  const [editProdBarcode, setEditProdBarcode] = useState('');
  const [editProdUnit, setEditProdUnit] = useState('1');
  const [editProdVat, setEditProdVat] = useState('0');
  const [editProdIsMed, setEditProdIsMed] = useState(false);

  // 🤝 პარტნიორის ახალი ველები
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerTin, setNewPartnerTin] = useState('');
  const [newPartnerAddress, setNewPartnerAddress] = useState('');
  const [newPartnerType, setNewPartnerType] = useState('საცალო');

  // ✏️ პარტნიორის რედაქტირების ველები (დაამატე ესენი)
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [editPartnerName, setEditPartnerName] = useState('');
  const [editPartnerTin, setEditPartnerTin] = useState('');
  const [editPartnerAddress, setEditPartnerAddress] = useState('');
  const [editPartnerType, setEditPartnerType] = useState('საცალო');

  // 🚚 მომწოდებლის ახალი ველები
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');
  const [selectedSupplierForStock, setSelectedSupplierForStock] = useState('');
  const [qtyToReceive, setQtyToReceive] = useState('');
  const [productToReceiveId, setProductToReceiveId] = useState('');

  const [showAllPartners, setShowAllPartners] = useState(false);
  const [showAllSuppliers, setShowAllSuppliers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminSearchQuery, setAdminSearchQuery] = useState(''); // 🔍 საძიებო ველის state ადმინისთვის
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [partnerSearchQuery, setPartnerSearchQuery] = useState(''); // პრესელერის ტაბის ძებნა
  const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState(false);
  const [partnerListSearchQuery, setPartnerListSearchQuery] = useState(''); // პარტნიორების ტაბის ძებნა
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

    const unsubSuppliers = onSnapshot(collection(db, "dist_suppliers"), (snapshot) => {
      setSuppliers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      setWeeklyArchives(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qDebts = query(collection(db, "dist_orders"), where("amountRemaining", ">", 0));
    const unsubDebts = onSnapshot(qDebts, (snapshot) => {
      setDebtOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const fetchRSCredentials = async () => {
      const rsDoc = await getDoc(doc(db, "settings", "rs_auth"));
      if (rsDoc.exists()) {
        const data = rsDoc.data();
        setRsUsername(data.su || '');
        setRsPassword(data.sp || '');
        if (data.su) setSavedRsUser(data.su);
      }
    };
    fetchRSCredentials();

    return () => {
      unsubProducts(); unsubPartners(); unsubSuppliers(); unsubOrders(); unsubHistory(); unsubArchives(); unsubDebts();
    };
  }, [isAuthenticated]);

  const categories = ['ყველა', ...new Set(products.map(p => p.category || 'სხვა'))];

  const handleLogin = (e) => {
    e.preventDefault();
    const trimmedCode = String(authCode).trim();
    if (trimmedCode === String(ADMIN_CODE).trim()) {
      setUserRole('admin');
      setIsAuthenticated(true);
    } else if (trimmedCode === String(PRESELLER_CODE).trim()) {
      setUserRole('preseller');
      setIsAuthenticated(true);
    } else if (trimmedCode === COURIER_CODE) {
      navigate('/courier');
    } else {
      alert(`არასწორი კოდი!\nშეყვანილია: "${trimmedCode}"\nბაზაშია:\n- admin: "${String(ADMIN_CODE).trim()}"\n- preseller: "${String(PRESELLER_CODE).trim()}"\n- courier: "${COURIER_CODE}"`);
    }
  };

  const toggleHistoryDetail = (id) => setExpandedHistory(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleArchiveWeek = (id) => { setExpandedArchiveWeek(prev => prev === id ? null : id); setExpandedArchiveOrder(null); };
  const toggleArchiveOrder = (id) => setExpandedArchiveOrder(prev => prev === id ? null : id);

  const saveRSCredentials = async (e) => {
    if (e) e.preventDefault();
    if (!rsUsername || !rsPassword) return alert("გთხოვთ შეავსოთ იუზერიც და პაროლიც!");

    // 🚀 დროებითი დაშვება: თუ სატესტო იუზერია, ვაგდებთ შემოწმებას და ეგრევე ვინახავთ
    if (rsUsername.toLowerCase() === 'tbilisi') {
      try {
        await setDoc(doc(db, "settings", "rs_auth"), { su: rsUsername, sp: rsPassword });
        setSavedRsUser(rsUsername);
        alert("✅ სატესტო იუზერი 'tbilisi' შეინახა შემოწმების გარეშე!");
        return;
      } catch (error) {
        return alert("❌ Firebase-ში შენახვის შეცდომა: " + error.message);
      }
    }

    setIsCheckingAuth(true);
    try {
      const response = await fetch('https://api.pharmavet.ge/api/check-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ su: rsUsername, sp: rsPassword })
      });

      const result = await response.json();

      if (result.success && result.valid) {
        await setDoc(doc(db, "settings", "rs_auth"), { su: rsUsername, sp: rsPassword });
        setSavedRsUser(rsUsername);
        alert("✅ ავტორიზაცია წარმატებულია! პარამეტრები შეინახა.");
      } else {
        alert("❌ RS.ge-მ უარყო ავტორიზაცია!\nმომხმარებლის სახელი ან პაროლი არასწორია.");
      }
    } catch (error) {
      alert("❌ სერვერთან კავშირის შეცდომა: " + error.message);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const uploadToRS = async (order) => {
    if (!rsUsername || !rsPassword) return alert("გთხოვთ, შეავსოთ RS.ge-ს პარამეტრები 'ბაზის მართვის' გვერდზე.");
    if (order.rsUploaded) return alert("ეს ზედნადები უკვე ატვირთულია RS-ზე!");

    // ვალიდაცია: ვამოწმებთ შევსებულია თუ არა ველები საიტზე
    if (!rsCarNumber || !rsDriverTin || !rsDriverName) {
      return alert("გთხოვთ, შეავსოთ სატრანსპორტო მონაცემები (მანქანის ნომერი, მძღოლი) რეესტრის ბლოკში გაგზავნამდე!");
    }

    setIsUploadingRS(true);
    try {
      const SERVER_URL = 'https://api.pharmavet.ge/api/upload-waybill';

      const formattedGoods = order.items.map(item => ({
        W_NAME: item.product.name,
        BAR_CODE: item.product.barcode || "",
        UNIT_ID: parseInt(item.product.unitId) || 1,
        QUANTITY: parseInt(item.quantity),
        PRICE: parseFloat(item.product.price),
        VAT_TYPE: parseInt(item.product.vatType) || 0
      }));

      // 🌟 ამოწმებს, თუ კალათაში ერთი პროდუქტი მაინც არის მედიკამენტი
      const isMedicineOrder = order.items.some(item => item.product.isMed === true);

      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          su: rsUsername,
          sp: rsPassword,
          waybillData: {
            BUYER_TIN: order.partnerTin,
            BUYER_NAME: order.partner,
            START_ADDRESS: "თბილისი",
            END_ADDRESS: order.partnerAddress || "თბილისი",
            CAR_NUMBER: rsCarNumber.trim().toUpperCase(),
            DRIVER_TIN: rsDriverTin.trim(),
            DRIVER_NAME: rsDriverName.trim(),
            IS_MED: isMedicineOrder ? 1 : 0, // 👈 გადაეცემა ბექენდს
            GOODS: formattedGoods
          }
        })
      });

      const result = await response.json();

      if (result.success) {
        const statusCode = parseInt(result.status);
        const waybillId = result.id;

        if (statusCode < 0) {
          alert(`❌ RS.ge-მ უარყო ზედნადები!\nშეცდომის კოდი: ${statusCode}`);
          return;
        }

        await updateDoc(doc(db, "dist_orders", order.id), {
          rsUploaded: true,
          rsWaybillId: String(waybillId)
        });

        alert(`✅ ზედნადები წარმატებით აიტვირთა ლაივზე!\nზედნადების ID: ${waybillId}`);
      } else {
        alert(`❌ სერვერის შეცდომა: ${result.error}`);
      }
    } catch (err) {
      alert(`❌ ვერ დავუკავშირდი სერვერს: ${err.message}`);
    } finally {
      setIsUploadingRS(false);
    }
  };
  // 🔒 1. სათითაოდ დასრულების ფუნქცია (ცალკეული ზედნადებისთვის)
  const closeRSWaybill = async (order) => {
    if (!rsUsername || !rsPassword) return alert("გთხოვთ შეავსოთ RS.ge იუზერი/პაროლი");
    if (!order.rsWaybillId) return alert("ეს ზედნადები ჯერ არ ატვირთულა RS-ზე!");
    if (order.rsClosed) return alert("ეს ზედნადები უკვე დასრულებულია!");

    if (!window.confirm(`ნამდვილად გსურთ დასრულდეს ზედნადები (ID: ${order.rsWaybillId}) RS.ge-ზე?`)) return;

    setIsClosingRS(true);
    try {
      const SERVER_URL = 'https://api.pharmavet.ge/api/close-waybill';
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ su: rsUsername, sp: rsPassword, waybillId: order.rsWaybillId })
      });
      const result = await response.json();

      if (result.success) {
        if (result.status === '1') {
          await updateDoc(doc(db, "dist_orders", order.id), { rsClosed: true });
          alert("✅ ზედნადები წარმატებით დასრულდა RS.ge-ზე!");
        } else {
          alert(`❌ ვერ დასრულდა. შეცდომის კოდი: ${result.status}`);
        }
      } else {
        alert(`❌ სერვერის შეცდომა: ${result.error}`);
      }
    } catch (e) { alert(`❌ კავშირის შეცდომა: ${e.message}`); }
    finally { setIsClosingRS(false); }
  };

  // 🚀 2. მასიური დასრულების ფუნქცია (ყველა ზედნადების ერთად)
  const handleCloseAllRSWaybills = async () => {
    if (!rsUsername || !rsPassword) return alert("გთხოვთ შეავსოთ RS.ge იუზერი/პაროლი ბაზის მართვის ტაბში.");

    // ვფილტრავთ მხოლოდ იმ შეკვეთებს, რომლებიც ატვირთულია RS-ზე, აქვთ ID და ჯერ არ დასრულებულან
    const waybillsToClose = history.filter(o => o.rsUploaded && o.rsWaybillId && !o.rsClosed);

    if (waybillsToClose.length === 0) {
      return alert("ამ კვირაში არ მოიძებნა ღია (დაუსრულებელი) ზედნადები.");
    }

    if (!window.confirm(`ნამდვილად გსურთ RS.ge-ზე ავტომატურად დაასრულოთ ${waybillsToClose.length} ზედნადები?`)) return;

    setIsClosingAllRS(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const SERVER_URL = 'https://api.pharmavet.ge/api/close-waybill';

      // სათითაოდ ვუგზავნით ბექენდს დასრულების ბრძანებას
      for (const order of waybillsToClose) {
        try {
          const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ su: rsUsername, sp: rsPassword, waybillId: order.rsWaybillId })
          });
          const result = await response.json();

          if (result.success && result.status === '1') {
            await updateDoc(doc(db, "dist_orders", order.id), { rsClosed: true });
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) { failCount++; }
      }

      alert(`✅ ოპერაცია დასრულდა!\nწარმატებით დაიხურა: ${successCount}\nვერ დაიხურა: ${failCount}`);
    } catch (error) {
      alert(`❌ მოულოდნელი შეცდომა: ${error.message}`);
    } finally {
      setIsClosingAllRS(false);
    }
  };


  // ================= 🖨️ პრინტი & ექსპორტი =================
  const handlePrintOrder = (order) => {
    const today = new Date();
    const printDate = `${today.getDate().toString().padStart(2, '0')}.${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getFullYear()}`;

    // 🌐 ვიღებთ შენი ლოკალური ფაილის სრულ, აბსოლუტურ მისამართს
    const logoUrl = `${window.location.origin}/logo.webp`;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
    <html>
      <head>
        <title>ინვოისი - ${order.partner}</title>
        <style>
          html, body { margin: 0; padding: 0; font-family: 'Helvetica', 'Arial', sans-serif; color: #0f172a; font-size: 11px; }
          body { padding: 15px; box-sizing: border-box; }
          
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #cbd5e1; padding-bottom: 10px; margin-bottom: 15px; }
          .title-block h1 { font-size: 18px; font-weight: 800; margin: 0; color: #1e293b; }
          .title-block .doc-num { font-size: 10px; color: #64748b; margin-top: 3px; font-weight: bold; }
          
          .logo-block { text-align: right; }
          .logo-img { height: 45px; object-fit: contain; }
          
          .requisites { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 15px; }
          .req-box { background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; }
          .req-box h3 { margin: 0 0 4px 0; font-size: 11px; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 2px; text-transform: uppercase; }
          .req-box p { margin: 2px 0; color: #475569; }
          
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; page-break-inside: avoid; }
          th { background-color: #f1f5f9; color: #334155; font-weight: 700; padding: 6px 8px; border: 1px solid #cbd5e1; text-transform: uppercase; font-size: 10px; }
          td { padding: 6px 8px; border: 1px solid #e2e8f0; color: #334155; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .w-10 { width: 30px; }
          
          .total-block { display: flex; justify-content: flex-end; margin-top: 10px; page-break-inside: avoid; }
          .total-table { width: 200px; font-size: 12px; }
          .total-table td { padding: 4px; border: none; }
          .total-row { font-size: 14px; font-weight: 900; color: #1e293b; border-top: 2px solid #cbd5e1 !important; }
          
          .signatures { display: grid; grid-template-cols: 1fr 1fr; gap: 40px; margin-top: 30px; page-break-inside: avoid; }
          .sig-line { border-bottom: 1px solid #94a3b8; height: 30px; margin-bottom: 4px; }
          .sig-box p { margin: 1px 0; color: #64748b; }
          
          @media print { 
            html, body { height: 99%; overflow: hidden; }
            body { padding: 10px; }
            .req-box { background: transparent; }
            @page { size: A4; margin: 0.5cm; } 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title-block">
            <h1>სასაქონლო ზედნადები / ინვოისი</h1>
            <div class="doc-num">სისტემური №: ${order.id ? order.id.substring(0, 8).toUpperCase() : 'N/A'} | თარიღი: ${printDate}</div>
          </div>
          <div class="logo-block">
            <img src="${logoUrl}" alt="PharmaVet Logo" class="logo-img" onload="window.print(); window.close();" onerror="window.print(); window.close();" />
          </div>
        </div>

        <div class="requisites">
          <div class="req-box">
            <h3>გამგზავნი</h3>
            <p><strong>დასახელება:</strong> შპს ფარმა ვეტ ჯორჯია</p>
            <p><strong>საიდენტ. კოდი:</strong> 430048110</p>
            <p><strong>მისამართი:</strong> თბილისი, საქართველო</p>
          </div>
          <div class="req-box">
            <h3>მიმღები</h3>
            <p><strong>დასახელება:</strong> ${order.partner}</p>
            <p><strong>საიდენტ. კოდი:</strong> ${order.partnerTin || 'N/A'}</p>
            <p><strong>მისამართი:</strong> ${order.partnerAddress || 'N/A'}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th class="w-10 text-center">№</th>
              <th>პროდუქტის დასახელება</th>
              <th class="text-center">განზომილება</th>
              <th class="text-center">რაოდენობა</th>
              <th class="text-right">ფასი</th>
              <th class="text-right">თანხა</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((i, idx) => `
              <tr>
                <td class="text-center text-gray-500">${idx + 1}</td>
                <td class="font-bold">${i.product.name}</td>
                <td class="text-center">${i.product.volume || 'ცალი'}</td>
                <td class="text-center font-mono">${i.quantity}ც</td>
                <td class="text-right font-mono">${i.product.price.toFixed(2)} ₾</td>
                <td class="text-right font-mono font-bold">${(i.product.price * i.quantity).toFixed(2)} ₾</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="total-block">
          <table class="total-table">
            <tr class="total-row">
              <td>სულ გადასახდელი:</td>
              <td class="text-right font-mono">${order.totalPrice.toFixed(2)} ₾</td>
            </tr>
          </table>
        </div>

        <div class="signatures">
          <div class="sig-box">
            <div class="sig-line"></div>
            <p><strong>ჩააბარა (გამგზავნი):</strong></p>
            <p>თარიღი: _______________</p>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <p><strong>მიიღო (მიმღები):</strong></p>
            <p>თარიღი: _______________</p>
          </div>
        </div>
        
        </body>
    </html>
  `);
    printWindow.document.close();
  };

  const handleExportRS = (order) => {
    const headers = ['დასახელება', 'ზომის ერთეული', 'რაოდენობა', 'ფასი', 'თანხა'];
    const rows = order.items.map(i => [
      `"${i.product.name}"`,
      `"${i.product.volume || 'ცალი'}"`,
      i.quantity,
      i.product.price,
      (i.product.price * i.quantity).toFixed(2)
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `RS_${order.partner}_${order.createdAt.substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= ⚙️ ADMIN FUNCTIONS =================
  // ================= ⚙️ განახლებული პროდუქტის დამატება =================
  const handleAddProduct = async () => {
    // 🌟 1. ვალიდაციაში ვამოწმებთ ახალ ველებს (საცალო და საბითუმო ფასებს)
    if (!newProdName || !newProdRetailPrice || !newProdWholesalePrice || !newProdBarcode) {
      return alert('გთხოვთ შეავსოთ პროდუქტის სახელი, საცალო ფასი, საბითუმო ფასი და შტრიხკოდი!');
    }

    try {
      await addDoc(collection(db, "dist_products"), {
        name: newProdName,
        retailPrice: parseFloat(newProdRetailPrice) || 0,
        wholesalePrice: parseFloat(newProdWholesalePrice) || 0,
        category: newProdCategory || 'სხვა',
        volume: newProdVolume || 'ცალი',
        stock: parseInt(newProdStock) || 0,
        damaged: 0,
        barcode: newProdBarcode,
        unitId: parseInt(newProdUnit) || 1,
        vatType: parseInt(newProdVat) || 0,
        isMed: newProdIsMed
      });

      alert("✅ წამალი წარმატებით დაემატა!");

      // 🌟 2. ვასუფთავებთ სწორ ცვლადებს, რომ ფორმა დაცარიელდეს
      setNewProdName('');
      setNewProdRetailPrice('');
      setNewProdWholesalePrice('');
      setNewProdCategory('');
      setNewProdVolume('');
      setNewProdStock('');
      setNewProdBarcode('');
      setNewProdUnit('1');
      setNewProdVat('0');
      setNewProdIsMed(false);

    } catch (error) {
      alert("❌ შეცდომა: " + error.message);
    }
  };

  const startEditProduct = (product) => {
    setEditingProductId(product.id);
    setEditProdName(product.name);
    setEditProdRetailPrice(product.retailPrice || product.price || ''); // თავსებადობა ძველ ველთან
    setEditProdWholesalePrice(product.wholesalePrice || product.price || '');
    setEditProdCategory(product.category || '');
    setEditProdVolume(product.volume || '');
    setEditProdStock(product.stock);
    setEditProdDamaged(product.damaged || 0);
    setEditProdBarcode(product.barcode || '');
    setEditProdUnit(product.unitId?.toString() || '1');
    setEditProdVat(product.vatType?.toString() || '0');
    setEditProdIsMed(product.isMed || false);
  };

  const saveProductEdit = async (id) => {
    try {
      await updateDoc(doc(db, "dist_products", id), {
        name: editProdName,
        retailPrice: parseFloat(editProdRetailPrice) || 0, // 👈 საცალო
        wholesalePrice: parseFloat(editProdWholesalePrice) || 0, // 👈 საბითუმო
        category: editProdCategory,
        volume: editProdVolume,
        stock: parseInt(editProdStock) || 0,
        damaged: parseInt(editProdDamaged) || 0,
        barcode: editProdBarcode,
        unitId: parseInt(editProdUnit),
        vatType: parseInt(editProdVat),
        isMed: editProdIsMed
      });
      setEditingProductId(null);
      alert("✅ ცვლილებები წარმატებით შეინახა!");
    } catch (error) { alert("შეცდომა: " + error.message); }
  };

  const handleQuickStockUpdate = async (productId, field, value) => {
    try { await updateDoc(doc(db, "dist_products", productId), { [field]: parseInt(value) || 0 }); } catch (err) { console.error(err); }
  };

  const handleWipeDamaged = async (product) => {
    if (product.damaged <= 0) return alert("ამ პროდუქტს ბრაკი არ უფიქსირდება!");
    if (window.confirm(`ნამდვილად გსურთ ${product.damaged}ც ბრაკის სამუდამოდ ჩამოწერა მარაგებიდან?`)) {
      try {
        await updateDoc(doc(db, "dist_products", product.id), { damaged: 0 });
        alert("✅ ბრაკი წარმატებით ჩამოიწერა!");
      } catch (err) { alert(err.message); }
    }
  };

  const handleAddSupplier = async () => {
    if (!newSupplierName) return alert("შეავსეთ მომწოდებლის სახელი!");
    try {
      await addDoc(collection(db, "dist_suppliers"), { name: newSupplierName, phone: newSupplierPhone || 'N/A' });
      alert("✅ მომწოდებელი დაემატა!");
      setNewSupplierName(''); setNewSupplierPhone('');
    } catch (err) { alert(err.message); }
  };

  const handleReceiveStock = async () => {
    const qty = parseInt(qtyToReceive);
    if (!productToReceiveId || isNaN(qty) || qty <= 0 || !selectedSupplierForStock) {
      return alert("გთხოვთ აირჩიოთ წამალი, მომწოდებელი და მიუთითოთ სწორი რაოდენობა!");
    }
    try {
      const prodRef = doc(db, "dist_products", productToReceiveId);
      const currentProd = products.find(p => p.id === productToReceiveId);
      if (currentProd) {
        await updateDoc(prodRef, { stock: currentProd.stock + qty });
        alert(`✅ საწყობში წარმატებით მიღებულია ${qty}ც ახალი მარაგი!`);
        setQtyToReceive(''); setProductToReceiveId(''); setSelectedSupplierForStock('');
      }
    } catch (err) { alert(err.message); }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('ნამდვილად წავშალოთ პროდუქტი?')) await deleteDoc(doc(db, "dist_products", id));
  };

  const handleAddPartner = async () => {
    if (!newPartnerName || !newPartnerTin || !newPartnerAddress) return alert('შეავსეთ პარტნიორის ყველა ველი!');
    try {
      await addDoc(collection(db, "dist_partners"), { name: newPartnerName, tin: newPartnerTin, address: newPartnerAddress, type: newPartnerType });
      alert("✅ პარტნიორი დაემატა!");
      setNewPartnerName(''); setNewPartnerTin(''); setNewPartnerAddress('');
    } catch (error) { error.message; }
  };

  // ✏️ პარტნიორის რედაქტირების ფუნქციები (დაამატე ეს ბლოკი)
  const startEditPartner = (partner) => {
    setEditingPartnerId(partner.id);
    setEditPartnerName(partner.name);
    setEditPartnerTin(partner.tin || '');
    setEditPartnerAddress(partner.address || '');
    setEditPartnerType(partner.type || 'საცალო');
  };

  const savePartnerEdit = async (id) => {
    try {
      await updateDoc(doc(db, "dist_partners", id), {
        name: editPartnerName,
        tin: editPartnerTin,
        address: editPartnerAddress,
        type: editPartnerType
      });
      setEditingPartnerId(null);
      alert("✅ პარტნიორი წარმატებით განახლდა!");
    } catch (error) { alert("შეცდომა: " + error.message); }
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
    const partnerObj = partners.find(p => p.name === selectedPartner);
    if (!partnerObj) return alert('პარტნიორი ვერ მოიძებნა!');

    const orderTotal = cart.reduce((sum, item) => sum + (item.product.currentPrice * item.quantity), 0); // 👈 აქ
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}.${(now.getMonth() + 1).toString().padStart(2, '0')}.${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    try {
      await addDoc(collection(db, "dist_orders"), {
        partner: partnerObj.name,
        partnerTin: partnerObj.tin,
        partnerAddress: partnerObj.address,
        partnerType: partnerObj.type || 'საცალო',
        items: cart.map(item => ({
          product: {
            id: item.product.id, name: item.product.name, price: item.product.currentPrice, volume: item.product.volume,
            barcode: item.product.barcode || '0000', unitId: item.product.unitId || 1, vatType: item.product.vatType || 0,
            isMed: item.product.isMed || false // 👈 ეს დაგვავიწყდა!
          },
          originalQuantity: item.quantity, quantity: item.quantity
        })),
        totalPrice: orderTotal, status: 'მიმდინარე', createdAt: formattedDate, changesLog: [], rsUploaded: false
      });
      setPartnerSearchQuery('');
      alert('შეკვეთა გაიგზავნა საწყობში!');
    } catch (err) { alert("ვერ გაიგზავნა: " + err.message); }
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
    let wasEdited = false; const logs = [];

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
        items: order.items, totalPrice: order.totalPrice, status: wasEdited ? 'რედაქტირებული' : 'დასრულებული', changesLog: logs, completedAt: completedTime
      });
      alert('შეკვეთა ჩალაგდა!');
    } catch (err) { alert("შეცდომა ჩალაგებისას: " + err.message); }
  };
  // 💾 პრესელერის მიერ შეკვეთის რედაქტირების შენახვა
  const handleSaveOrderEdits = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    try {
      // ვითვლით ახალ ჯამურ თანხას და ვაახლებთ originalQuantity-საც (რადგან თვითონ გადაიფიქრა)
      const updatedItems = order.items.map(i => ({
        ...i,
        originalQuantity: i.quantity
      }));
      const newTotal = updatedItems.reduce((sum, i) => sum + ((i.product.currentPrice || i.product.price) * i.quantity), 0);

      await updateDoc(doc(db, "dist_orders", orderId), {
        items: updatedItems,
        totalPrice: newTotal
      });
      alert('✅ შეკვეთა წარმატებით განახლდა!');
    } catch (err) { alert('❌ შეცდომა: ' + err.message); }
  };
  // ❌ შეკვეთის გაუქმება/წაშლა
  const handleCancelOrder = async (orderId) => {
    if (window.confirm('ნამდვილად გსურთ ამ შეკვეთის გაუქმება და წაშლა?')) {
      try {
        await deleteDoc(doc(db, "dist_orders", orderId));
        alert('შეკვეთა წარმატებით გაუქმდა!');
      } catch (err) {
        alert('შეცდომა გაუქმებისას: ' + err.message);
      }
    }
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
          closedDate: today, ordersCount: history.length, totalSales: history.reduce((sum, o) => sum + o.totalPrice, 0), archivedOrders: history
        });

        for (const hOrder of history) await updateDoc(doc(db, "dist_orders", hOrder.id), { status: "დაარქივებული" });
        alert('მიმდინარე კვირა მუდმივად დაარქივდა! 📦');
      } catch (err) { alert("ვერ დაიხურა: " + err.message); }
    }
  };

  const totalQuantities = (() => {
    const totals = {};
    [...orders, ...history].forEach(o => o.items.forEach(i => totals[i.product.name] = (totals[i.product.name] || 0) + i.quantity));
    return totals;
  })();
  // 💰 1. მიმდინარე კვირის ჯამური შემოსავლის გამოთვლა (რეალური მიწოდებით)
  const totalWeeklyRevenue = history.reduce((sum, order) => {
    const orderTotal = order.items.reduce((itemSum, item) => {
      const price = item.product.price || 0;
      return itemSum + (item.quantity * price);
    }, 0);
    return sum + orderTotal;
  }, 0);

  // 💰 კურიერის მიერ შეგროვებული თანხა და ნისიები მიმდინარე კვირაში
  const totalWeeklyCollected = history.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  const totalWeeklyDebt = history.reduce((sum, o) => sum + (o.amountRemaining || 0), 0);

  // 🚚 კურიერის მონაცემების რედაქტირების შენახვა ადმინის მიერ
  const handleSaveDeliveryEdits = async (order) => {
    const paidNum = parseFloat(adminAmountPaid);
    if (isNaN(paidNum) || paidNum < 0) {
      return alert("გთხოვთ შეიყვანოთ ვალიდური გადახდილი თანხა!");
    }
    if (paidNum > order.totalPrice) {
      return alert("გადახდილი თანხა არ უნდა აღემატებოდეს შეკვეთის ჯამურ ღირებულებას!");
    }

    const remaining = Math.max(0, order.totalPrice - paidNum);
    let paymentStatus = 'paid';
    if (paidNum === 0) {
      paymentStatus = 'unpaid';
    } else if (remaining > 0) {
      paymentStatus = 'partial';
    }

    if (adminDeliveryStatus === 'failed') {
      paymentStatus = 'unpaid';
    }

    try {
      await updateDoc(doc(db, "dist_orders", order.id), {
        courierConfirmed: true,
        deliveryStatus: adminDeliveryStatus,
        amountPaid: adminDeliveryStatus === 'failed' ? 0 : paidNum,
        amountRemaining: adminDeliveryStatus === 'failed' ? order.totalPrice : remaining,
        paymentStatus: paymentStatus
      });

      alert("✅ მიწოდების მონაცემები წარმატებით განახლდა ადმინის მიერ!");
      setEditingDeliveryOrderId(null);
    } catch (err) {
      alert("❌ შეცდომა განახლებისას: " + err.message);
    }
  };

  // 🗑️ 2. რეესტრიდან (Firebase-დან) შეკვეთის სამუდამოდ წაშლის ფუნქცია
  const handleDeleteHistoryItem = async (id) => {
    if (window.confirm("ნამდვილად გსურთ ამ შეკვეთის სამუდამოდ წაშლა რეესტრიდან?")) {
      try {
        await deleteDoc(doc(db, "dist_orders", id));
        alert("✅ შეკვეთა წარმატებით წაიშალა ბაზიდან!");
      } catch (err) {
        alert("❌ წაშლის შეცდომა: " + err.message);
      }
    }
  };

  // 🔄 სრულყოფილი ორმხრივი ტრანსლიტერაციის ფუნქცია
  const transliterate = (text) => {
    const textLower = text.toLowerCase();
    const geoToEngMap = {
      'ა': 'a', 'ბ': 'b', 'გ': 'g', 'დ': 'd', 'ე': 'e', 'ვ': 'v', 'ზ': 'z', 'თ': 't', 'ი': 'i', 'კ': 'k',
      'ლ': 'l', 'მ': 'm', 'ნ': 'n', 'ო': 'o', 'პ': 'p', 'ჟ': 'zh', 'რ': 'r', 'ს': 's', 'ტ': 't', 'უ': 'u',
      'ფ': 'f', 'ქ': 'q', 'ღ': 'gh', 'ყ': 'q', 'შ': 'sh', 'ც': 'ts', 'ძ': 'dz', 'წ': 'ts', 'ჭ': 'ch', 'ხ': 'kh', 'ჯ': 'j', 'ჰ': 'h'
    };
    const engToGeoMap = {
      'a': 'ა', 'b': 'ბ', 'g': 'გ', 'დ': 'd', 'e': 'ე', 'v': 'ვ', 'z': 'ზ', 't': 'თ', 'i': 'ი', 'k': 'კ',
      'l': 'ლ', 'm': 'მ', 'n': 'ნ', 'o': 'ო', 'p': 'პ', 'r': 'რ', 's': 'ს', 'u': 'უ', 'f': 'ფ', 'q': 'ყ',
      'c': 'ც', 'h': 'ჰ', 'j': 'ჯ', 'x': 'ხ', 'w': 'ვ', 'y': 'ი'
    };
    let toEng = ""; for (let char of textLower) { toEng += geoToEngMap[char] !== undefined ? geoToEngMap[char] : char; }
    let toGeo = ""; for (let char of textLower) { toGeo += engToGeoMap[char] !== undefined ? engToGeoMap[char] : char; }
    let directEng = textLower.replace(/ც/g, 'c').replace(/ჰ/g, 'h').replace(/ხ/g, 'x').replace(/შ/g, 'sh').replace(/ჩ/g, 'ch');
    return { toEng, toGeo, directEng };
  };

  // პრესელერის ფილტრი
  // 👈 ვიგებთ არჩეული პარტნიორის ტიპს (საცალო თუ საბითუმო)
  const currentPartnerType = partners.find(p => p.name === selectedPartner)?.type || 'საცალო';
  const filteredProducts = products.filter(p => {
    const nameLower = p.name.toLowerCase(); const queryLower = searchQuery.toLowerCase();
    const { toEng, toGeo, directEng } = transliterate(queryLower);
    const matchesSearch = nameLower.includes(queryLower) || nameLower.includes(toEng) || nameLower.includes(toGeo) || nameLower.includes(directEng);
    return matchesSearch && (selectedCategory === 'ყველა' || p.category === selectedCategory);
  });

  // 🔍 ახალი ფილტრი ადმინის გვერდისთვის (საინიციაციო ძებნა)
  const adminFilteredProducts = products.filter(p => {
    const nameLower = p.name.toLowerCase(); const queryLower = adminSearchQuery.toLowerCase();
    const { toEng, toGeo, directEng } = transliterate(queryLower);
    return nameLower.includes(queryLower) || nameLower.includes(toEng) || nameLower.includes(toGeo) || nameLower.includes(directEng);
  });
  // 🔍 პარტნიორების ფილტრი პრესელერის ტაბისთვის (შეკვეთის გაფორმებისას)
  const filteredSelectPartners = partners.filter(p => {
    if (!partnerSearchQuery) return true;
    const queryLower = partnerSearchQuery.toLowerCase();
    const { toEng, toGeo, directEng } = transliterate(queryLower);
    const nameLower = (p.name || '').toLowerCase();
    return nameLower.includes(queryLower) || nameLower.includes(toEng) || nameLower.includes(toGeo) || nameLower.includes(directEng) || (p.tin && p.tin.includes(queryLower));
  });

  // 🔍 პარტნიორების ფილტრი ბაზის მართვის ტაბისთვის (სიის ფილტრაცია)
  const filteredListPartners = partners.filter(p => {
    if (!partnerListSearchQuery) return true;
    const queryLower = partnerListSearchQuery.toLowerCase();
    const { toEng, toGeo, directEng } = transliterate(queryLower);
    const nameLower = (p.name || '').toLowerCase();
    return nameLower.includes(queryLower) || nameLower.includes(toEng) || nameLower.includes(toGeo) || nameLower.includes(directEng) || (p.tin && p.tin.includes(queryLower));
  });

  // ================= 📊 ანალიტიკის ლოგიკა (არქივისთვის) =================
  const analytics = (() => {
    let globalSales = 0; const prodSales = {}; const clientSales = {};
    weeklyArchives.forEach(arch => {
      globalSales += arch.totalSales || 0;
      if (arch.archivedOrders) {
        arch.archivedOrders.forEach(o => {
          clientSales[o.partner] = (clientSales[o.partner] || 0) + (o.totalPrice || 0);
          if (o.items) { o.items.forEach(i => { prodSales[i.product.name] = (prodSales[i.product.name] || 0) + (i.quantity || 0); }); }
        });
      }
    });
    const topProduct = Object.entries(prodSales).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const topClient = Object.entries(clientSales).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    return { globalSales, topProduct, topClient };
  })();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border-t-4 border-emerald-500">
          <h2 className="text-2xl font-black mb-2 text-center text-slate-800">შიდა სისტემა</h2>
          <input type="password" value={authCode} onChange={(e) => setAuthCode(e.target.value)} className="w-full p-3 border rounded-xl mb-4 text-center text-xl tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none font-bold bg-slate-50" placeholder="****" />
          <button type="submit" disabled={isCheckingAuth} className={`w-full p-2.5 rounded-lg text-xs font-bold transition text-white ${isCheckingAuth ? 'bg-slate-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isCheckingAuth ? '⏳ მოწმდება RS.ge-ზე...' : 'მონაცემების შენახვა ✓'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-800 max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">🧬 PharmaVet Cloud</h1>
          <p className="text-emerald-600 text-xs mt-0.5 font-bold">🟢 Firebase ონლაინ რეჟიმი</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-full sm:w-auto overflow-x-auto">
          {/* პრესელერის ტაბი ყველასთვის ჩანს */}
          <button onClick={() => setActiveTab('preseller')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'preseller' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>🛒 პრესელერი</button>
          <button onClick={() => setActiveTab('partners_tab')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'partners_tab' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>🤝 პარტნიორები</button>
          {userRole === 'preseller' && (
            <button onClick={() => setActiveTab('preseller_orders')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'preseller_orders' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>📦 გაგზავნილი შეკვეთები ({orders.length})</button>
          )}
          {/* 🔒 დანარჩენი ტაბები გამოჩნდება მხოლოდ მაშინ, თუ მომხმარებელი არის 'admin' */}
          {userRole === 'admin' && (
            <>
              <button onClick={() => setActiveTab('warehouse')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'warehouse' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>🏬 საწყობი ({orders.length})</button>
              <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'history' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>📜 მიმდინარე კვირა</button>
              <button onClick={() => setActiveTab('archive')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'archive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>🗄️ არქივი & ანალიტიკა</button>
              <button onClick={() => setActiveTab('debts_tab')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'debts_tab' ? 'bg-white text-rose-600 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'}`}>🔴 ნისიები ({debtOrders.length})</button>
              <button onClick={() => setActiveTab('admin')} className={`px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap ${activeTab === 'admin' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>⚙️ ბაზის მართვა</button>
            </>
          )}
        </div>
      </div>

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
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredProducts.map(p => {
                const cartItem = cart.find(item => item.product.id === p.id);
                const isLowStock = p.stock <= 10;

                // 🌟 1. ვითვლით დინამიურ ფასს პარტნიორის ტიპის მიხედვით
                const activePrice = currentPartnerType === 'საბითუმო' ? (p.wholesalePrice || p.price || 0) : (p.retailPrice || p.price || 0);

                return (
                  <div key={p.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/40">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-800">{p.name}</h4>
                        {isLowStock && <span className="animate-pulse bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-md font-black">⚠️ კრიტიკული მარაგი!</span>}
                      </div>
                      <p className="text-[11px] text-gray-400">მოცულობა: {p.volume} | ხელმისაწვდომია: <span className={`font-bold ${isLowStock ? 'text-rose-600' : 'text-slate-600'}`}>{p.stock} ცალი</span></p>
                    </div>
                    <div className="flex items-center gap-4">

                      {/* 🌟 2. ეკრანზე ვაჩვენებთ სწორ (activePrice) ფასს */}
                      <span className="font-extrabold text-sm text-slate-700">{activePrice.toFixed(2)} ₾</span>

                      {/* 🌟 3. კალათაში ჩაგდებისას ვატანთ ამ სწორ ფასს (currentPrice-ის სახელით) */}
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={cartItem ? cartItem.quantity : ''}
                        onChange={e => addToCart({ ...p, currentPrice: activePrice }, e.target.value)}
                        className="w-16 p-1.5 border rounded-lg text-center font-bold bg-white"
                      />

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">შეკვეთის გაფორმება</h2>
            <div className="mb-4 relative">
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">პარტნიორი ობიექტი</label>

              {/* 🔍 საძიებო და ასარჩევი ველი ერთად (Autocomplete) */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 მოძებნე ობიექტი ან ს/ნ..."
                  value={partnerSearchQuery}
                  onChange={e => {
                    setPartnerSearchQuery(e.target.value);
                    setIsPartnerDropdownOpen(true); // აკრეფისთანავე იშლება სია
                    if (selectedPartner) setSelectedPartner(''); // თუ ახლიდან დაიწყო წერა, ძველი არჩევანი უქმდება
                  }}
                  onFocus={() => setIsPartnerDropdownOpen(true)} // კლიკზეც იშლება სია
                  className={`w-full p-2.5 border rounded-xl text-sm font-semibold outline-none transition ${selectedPartner ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-slate-50 focus:border-emerald-400'}`}
                />

                {/* ✕ ღილაკი გასასუფთავებლად */}
                {partnerSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPartner('');
                      setPartnerSearchQuery('');
                      setIsPartnerDropdownOpen(true);
                    }}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-rose-500 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* 📜 დინამიური ჩამოსაშლელი სია */}
              {isPartnerDropdownOpen && (
                <>
                  {/* INVISIBLE OVERLAY: უხილავი ფონი, რომელიც კეტავს სიას სხვაგან დაკლიკებისას */}
                  <div className="fixed inset-0 z-10" onClick={() => setIsPartnerDropdownOpen(false)}></div>

                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {filteredSelectPartners.length > 0 ? (
                      filteredSelectPartners.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            setSelectedPartner(p.name);
                            setPartnerSearchQuery(p.name); // არჩევისას ველში სახელი იწერება
                            setIsPartnerDropdownOpen(false); // სია იხურება
                          }}
                          className="p-3 border-b border-slate-100 last:border-0 hover:bg-emerald-50 cursor-pointer transition flex justify-between items-center"
                        >
                          <span className="font-bold text-slate-800 text-sm">{p.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">ს/ნ: {p.tin}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400 italic">ობიექტი ვერ მოიძებნა</div>
                    )}
                  </div>
                </>
              )}
            </div>
            {cart.length > 0 ? (
              <div className="bg-emerald-50/50 p-4 rounded-xl mb-4 border border-emerald-100/60">
                <div className="space-y-1.5 max-h-40 overflow-y-auto mb-3 text-xs">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between text-emerald-950">
                      <span>{item.product.name} x {item.quantity}</span>
                      {/* 🟢 item.product.price შეიცვალა item.product.currentPrice-ით ან item.product.price-ით თუ ისედაც currentPrice მივანიჭეთ */}
                      <span className="font-semibold">{((item.product.currentPrice || item.product.price || 0) * item.quantity).toFixed(2)} ₾</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-black text-emerald-900 text-sm border-t pt-2">
                  <span>ჯამური თანხა:</span>
                  <span>{cart.reduce((sum, item) => sum + ((item.product.currentPrice || item.product.price || 0) * item.quantity), 0).toFixed(2)} ₾</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 text-xs italic text-center py-6 bg-slate-50 rounded-xl mb-4">კალათა ცარიელია</p>
            )}
            <button type="button" onClick={submitOrder} className="w-full bg-emerald-600 text-white p-3 rounded-xl font-bold hover:bg-emerald-700 transition text-sm">გაგზავნა საწყობში 🚀</button>
          </div>
        </div>
      )}
      {/* 🤝 ახალი: პარტნიორების მართვის ტაბი (ჩანს ორივესთვის) */}
      {activeTab === 'partners_tab' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto animate-fadeIn mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">🤝 პარტნიორების მონაცემთა ბაზა</h2>

          <div className="flex flex-col gap-2 mb-6 bg-slate-50 p-4 rounded-xl border">
            <p className="text-[10px] font-bold text-gray-400 uppercase">ახალი ობიექტის რეგისტრაცია</p>
            <input type="text" placeholder="ობიექტის სახელი" value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} className="p-2 border rounded-lg text-xs outline-none bg-white" />
            <input type="text" placeholder="საიდენტიფიკაციო კოდი" value={newPartnerTin} onChange={e => setNewPartnerTin(e.target.value)} className="p-2 border rounded-lg text-xs outline-none bg-white" />
            <input type="text" placeholder="მიწოდების მისამართი" value={newPartnerAddress} onChange={e => setNewPartnerAddress(e.target.value)} className="p-2 border rounded-lg text-xs outline-none bg-white" />
            <select value={newPartnerType} onChange={e => setNewPartnerType(e.target.value)} className="p-2 border rounded-lg text-xs outline-none bg-white font-bold text-indigo-700">
              <option value="საცალო">🏪 საცალო (Retail)</option>
              <option value="საბითუმო">🏭 საბითუმო (Wholesale)</option>
            </select>
            <button type="button" onClick={handleAddPartner} className="bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-lg text-xs font-bold mt-1 transition">დამატება ბაზაში +</button>
          </div>

          {/* 🔍 სიის საძიებო ველი და სათაური */}
          <div className="flex justify-between items-center mb-3 bg-slate-100 p-2 rounded-xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase px-2">არსებული ობიექტები ({filteredListPartners.length}):</p>
            <input
              type="text"
              placeholder="🔍 მოძებნე სიაში..."
              value={partnerListSearchQuery}
              onChange={e => setPartnerListSearchQuery(e.target.value)}
              className="p-1.5 border rounded-lg text-xs bg-white outline-none w-1/2 focus:border-purple-400 transition"
            />
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {filteredListPartners.map(partner => (
              <div key={partner.id} className="p-3 border rounded-xl bg-slate-50/40 flex justify-between items-center text-xs transition-all">

                {editingPartnerId === partner.id ? (
                  <div className="w-full space-y-2 bg-white p-3 rounded-lg border border-amber-200 shadow-sm">
                    <p className="text-[10px] font-bold text-amber-600 uppercase">პარტნიორის რედაქტირება</p>
                    <div className="flex gap-2">
                      <input type="text" value={editPartnerName} onChange={e => setEditPartnerName(e.target.value)} className="w-full p-2 border rounded text-xs bg-slate-50 outline-none focus:border-amber-400" placeholder="სახელი" />
                      <input type="text" value={editPartnerTin} onChange={e => setEditPartnerTin(e.target.value)} className="w-full p-2 border rounded text-xs bg-slate-50 outline-none focus:border-amber-400" placeholder="საიდენტიფიკაციო კოდი" />
                    </div>
                    <div className="flex gap-2">
                      <input type="text" value={editPartnerAddress} onChange={e => setEditPartnerAddress(e.target.value)} className="w-full p-2 border rounded text-xs bg-slate-50 outline-none focus:border-amber-400" placeholder="მისამართი" />
                      <select value={editPartnerType} onChange={e => setEditPartnerType(e.target.value)} className="p-2 border rounded text-xs bg-white text-indigo-700 font-bold outline-none">
                        <option value="საცალო">საცალო</option>
                        <option value="საბითუმო">საბითუმო</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button type="button" onClick={() => setEditingPartnerId(null)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1.5 rounded font-bold transition">გაუქმება</button>
                      <button type="button" onClick={() => savePartnerEdit(partner.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded font-bold transition shadow-sm">შენახვა ✓</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-full">
                      <span className="font-bold text-slate-700 block text-sm">🏪 {partner.name}</span>
                      <span className="text-[11px] text-gray-400 mt-0.5 block">ს/ნ: {partner.tin} | 📍 {partner.address} | 🏷️ {partner.type || 'საცალო'}</span>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEditPartner(partner)} className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-2 py-1.5 rounded-lg font-bold transition-colors text-xs flex items-center" title="რედაქტირება">✏️</button>
                      <button type="button" onClick={() => handleDeletePartner(partner.id)} className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-2.5 py-1.5 rounded-lg font-black transition-colors text-xs flex items-center" title="წაშლა">✕</button>
                    </div>
                  </>
                )}

              </div>
            ))}
          </div>
        </div>
      )}
      {/* 📦 ახალი: პრესელერის მიერ გაგზავნილი შეკვეთების მართვა */}
      {activeTab === 'preseller_orders' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 max-w-4xl mx-auto animate-fadeIn mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-2">📦 გაგზავნილი (აქტიური) შეკვეთები</h2>
          <p className="text-xs text-gray-500 mb-6">აქ ჩანს საწყობში გადაგზავნილი შეკვეთები, რომლებიც ჯერ არ ჩალაგებულა. შეგიძლიათ შეცვალოთ რაოდენობა ან სრულად წაშალოთ.</p>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 border-dashed text-gray-400 italic text-sm">გაგზავნილი შეკვეთები არ მოიძებნა</div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 shadow-sm">
                  <div className="flex justify-between items-center mb-3 border-b pb-2">
                    <div>
                      <h3 className="font-black text-slate-800 text-sm">🏪 {order.partner}</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">📅 {order.createdAt}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-blue-600 font-black text-sm">{order.totalPrice.toFixed(2)} ₾</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto mb-3">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-500 font-bold">
                        <tr>
                          <th className="p-2 rounded-l-lg">პროდუქტი</th>
                          <th className="p-2 text-center">რაოდენობა</th>
                          <th className="p-2 text-right rounded-r-lg">ფასი</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {order.items.map(item => (
                          <tr key={item.product.id}>
                            <td className="p-2 font-bold text-slate-700">{item.product.name}</td>
                            <td className="p-2 text-center">
                              {/* ვიყენებთ არსებულ ფუნქციას რაოდენობის ლოკალურად შესაცვლელად */}
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={e => handleQuantityChangeInWarehouse(order.id, item.product.id, e.target.value)}
                                className="w-16 p-1 border rounded font-black text-center outline-none focus:border-blue-400"
                              />
                            </td>
                            <td className="p-2 text-right font-mono text-slate-600">{((item.product.currentPrice || item.product.price) * item.quantity).toFixed(2)} ₾</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-slate-100">
                    <button type="button" onClick={() => handleCancelOrder(order.id)} className="bg-rose-100 text-rose-700 px-4 py-2 rounded-lg hover:bg-rose-200 font-bold text-xs transition">
                      🗑️ სრულად გაუქმება
                    </button>
                    <button type="button" onClick={() => handleSaveOrderEdits(order.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-bold text-xs transition shadow-sm">
                      💾 ცვლილებების შენახვა
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

                  {/* 🆕 დამატებული ღილაკების ბლოკი */}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleCancelOrder(order.id)} className="w-1/3 bg-rose-100 text-rose-700 py-2.5 rounded-xl hover:bg-rose-200 font-bold text-xs transition">
                      ❌ გაუქმება
                    </button>
                    <button type="button" onClick={() => confirmOrder(order.id)} className="w-2/3 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 font-bold text-xs transition">
                      ჩალაგების დადასტურება ✓
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-base font-bold text-slate-900 mb-1">📦 საწყობის ინვენტარი</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 mt-4">
              {products.map(p => {
                const isLow = p.stock <= 10;
                return (
                  <div key={p.id} className={`p-3 border rounded-xl bg-slate-50/50 space-y-2 ${isLow ? 'border-l-4 border-l-rose-500 bg-rose-50/20' : ''}`}>
                    <div className="font-bold text-xs text-slate-800 flex justify-between">
                      <span>{p.name}</span>
                      {isLow && <span className="text-[9px] text-rose-600 font-black">⚠️ მცირეა!</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="block text-gray-400 mb-0.5 font-medium">✅ მარაგი:</label>
                        <input type="number" value={p.stock} onChange={e => handleQuickStockUpdate(p.id, 'stock', e.target.value)} className="w-full p-1 border rounded text-center font-bold text-slate-700" />
                      </div>
                      <div>
                        <label className="block text-rose-400 mb-0.5 font-medium">⚠️ ბრაკი:</label>
                        <input type="number" value={p.damaged || 0} onChange={e => handleQuickStockUpdate(p.id, 'damaged', e.target.value)} className="w-full p-1 border rounded text-center font-bold text-rose-700" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md">
              <h3 className="text-base font-bold mb-1">📅 კვირის ციკლის დახურვა</h3>
              <p className="text-purple-100 text-xs mb-4">დოკუმენტების მუდმივ არქივში გადატანა</p>
              <button type="button" onClick={handleCloseCurrentWeek} className="w-full bg-white text-purple-700 p-3 rounded-xl font-extrabold hover:bg-purple-50 transition text-xs shadow-sm mb-3">🔒 არქივში გადატანა</button>
              <button
                type="button"
                onClick={handleCloseAllRSWaybills}
                disabled={isClosingAllRS}
                className={`w-full p-3 rounded-xl font-extrabold transition text-xs shadow-sm flex items-center justify-center gap-2 border border-white/20 ${isClosingAllRS ? 'bg-indigo-400 text-white cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
              >
                {isClosingAllRS ? '⏳ მიმდინარეობს დახურვა...' : '✅ ყველა ზედნადების RS-ზე დასრულება'}
              </button>
            </div>

            {/* 📊 მიმდინარე კვირის ჯამური მოთხოვნა და თანხა */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-3">
                <h2 className="text-base font-bold text-slate-900">📊 მიმდინარე კვირის ფინანსური მონაცემები</h2>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 shadow-sm">
                    <span>💰 გაყიდვები:</span>
                    <span className="text-xs text-blue-600 font-black">{totalWeeklyRevenue.toLocaleString('ka-GE')} ₾</span>
                  </div>
                  <button
                    onClick={() => setActiveSummaryModal('collected')}
                    className="bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 shadow-sm transition-colors outline-none focus:ring-2 focus:ring-emerald-300"
                    title="დეტალური რეესტრის ნახვა"
                  >
                    <span>💵 შეგროვებული:</span>
                    <span className="text-xs text-emerald-600 font-black">{totalWeeklyCollected.toLocaleString('ka-GE')} ₾</span>
                  </button>
                  <button
                    onClick={() => setActiveSummaryModal('debts')}
                    className="bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 shadow-sm transition-colors outline-none focus:ring-2 focus:ring-rose-300"
                    title="დეტალური ვალების ნახვა"
                  >
                    <span>⚠️ ნისიები:</span>
                    <span className="text-xs text-rose-600 font-black">{totalWeeklyDebt.toLocaleString('ka-GE')} ₾</span>
                  </button>
                </div>
              </div>
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
              {/* 🚚 სატრანპორტო მონაცემების პანელი */}
              <div className="mb-6 bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-inner grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3 pb-1 border-b border-slate-800">
                  <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-1">局 აქ ჩაწერე ნამდვილი სატრანსპორტო მონაცემები გაგზავნამდე:</h3>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">🚗 მანქანის სახელმწიფო ნომერი</label>
                  <input type="text" placeholder="მაგ: LL111LL" value={rsCarNumber} onChange={e => setRsCarNumber(e.target.value)} className="w-full p-2 bg-slate-800 text-white text-xs rounded-lg border border-slate-700 outline-none focus:border-indigo-500 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">👤 მძღოლის პირადი ნომერი</label>
                  <input type="text" placeholder="11 ნიშნა კოდი" value={rsDriverTin} onChange={e => setRsDriverTin(e.target.value)} className="w-full p-2 bg-slate-800 text-white text-xs rounded-lg border border-slate-700 outline-none focus:border-indigo-500 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">✍️ მძღოლის სახელი, გვარი</label>
                  <input type="text" placeholder="მაგ: გიორგი გიორგაძე" value={rsDriverName} onChange={e => setRsDriverName(e.target.value)} className="w-full p-2 bg-slate-800 text-white text-xs rounded-lg border border-slate-700 outline-none focus:border-indigo-500" />
                </div>
              </div>
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
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[10px]">
                              <span className="text-gray-500">📅 {h.createdAt} ➜ 📦 {h.completedAt}</span>
                              {h.courierConfirmed ? (
                                h.deliveryStatus === 'failed' ? (
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-red-100 text-red-800">❌ ვერ ჩაბარდა</span>
                                ) : h.paymentStatus === 'paid' ? (
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-emerald-100 text-emerald-800">✅ გადახდილი: {h.amountPaid} ₾</span>
                                ) : h.paymentStatus === 'partial' ? (
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-amber-100 text-amber-800">⚠️ ნაწილობრივი: {h.amountPaid} ₾ (ნისია: {h.amountRemaining} ₾)</span>
                                ) : (
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-slate-100 text-slate-700">💵 ნისია: {h.amountRemaining} ₾</span>
                                )
                              ) : (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-slate-100 text-slate-400">⏳ კურიერის მოლოდინში</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${h.status === 'რედაქტირებული' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                              {h.status}
                            </span>
                            <span className="text-slate-400 font-bold bg-white border px-2 py-1 rounded-md">{isExpanded ? '▲' : '▼'}</span>
                            {/* 🗑️ წაშლის ახალი ღილაკი */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // აჩერებს ჩამოშლას
                                handleDeleteHistoryItem(h.id);
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                              title="შეკვეთის წაშლა"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                            <div className="flex flex-wrap justify-end gap-2 bg-slate-50 p-2 border-b">
                              <button onClick={() => handlePrintOrder(h)} className="bg-slate-800 text-white px-3 py-1.5 rounded text-[10px] font-bold hover:bg-slate-700 transition">🖨️ ბეჭდვა</button>
                              <button onClick={() => handleExportRS(h)} className="bg-emerald-600 text-white px-3 py-1.5 rounded text-[10px] font-bold hover:bg-emerald-700 transition">📥 CSV ექსპორტი</button>
                              <button onClick={() => uploadToRS(h)} disabled={isUploadingRS || h.rsUploaded} className={`px-3 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1 ${h.rsUploaded ? 'bg-emerald-100 text-emerald-800 cursor-not-allowed border border-emerald-300' : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'}`}>
                                {isUploadingRS && !h.rsUploaded ? 'იტვირთება...' : h.rsUploaded ? `✅ RS ატვირთულია (${h.rsWaybillId || '✓'})` : '🚀 RS-ზე ატვირთვა'}
                              </button>
                              <button onClick={() => closeRSWaybill(h)} disabled={isClosingRS || h.rsClosed} className={`px-3 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1 ml-2 ${h.rsClosed ? 'bg-purple-100 text-purple-800 border border-purple-300 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50'}`}>
                                {h.rsClosed ? '🔒 დასრულებულია' : '✅ RS დასრულება'}
                              </button>
                            </div>

                            {/* 🚚 კურიერის/მიმწოდებლის დეტალები */}
                            <div className="bg-slate-50/50 p-4 border-b text-xs space-y-2">
                              {editingDeliveryOrderId === h.id ? (
                                <div className="space-y-3">
                                  <div className="font-bold text-slate-700 mb-1">🚚 მიწოდების კორექტირება (ადმინი)</div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">მიწოდების სტატუსი</label>
                                      <select
                                        value={adminDeliveryStatus}
                                        onChange={e => setAdminDeliveryStatus(e.target.value)}
                                        className="p-2 border rounded bg-white w-full font-bold"
                                      >
                                        <option value="delivered">✅ ჩაბარდა წარმატებით</option>
                                        <option value="failed">❌ ვერ ჩაბარდა</option>
                                      </select>
                                    </div>
                                    {adminDeliveryStatus === 'delivered' && (
                                      <div>
                                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">გადახდილი თანხა (₾)</label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={adminAmountPaid}
                                          onChange={e => setAdminAmountPaid(e.target.value)}
                                          className="p-2 border rounded bg-white w-full font-bold text-slate-800"
                                        />
                                        <span className="block text-[9px] text-slate-400 mt-1 font-bold">
                                          ვალი: <span className="text-red-500">{(h.totalPrice - (parseFloat(adminAmountPaid) || 0)).toFixed(2)} ₾</span>
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => setEditingDeliveryOrderId(null)} className="px-3 py-1.5 rounded bg-slate-200 text-slate-700 font-bold hover:bg-slate-300">გაუქმება</button>
                                    <button onClick={() => handleSaveDeliveryEdits(h)} className="px-3 py-1.5 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700">შენახვა ✓</button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                  <div className="space-y-1">
                                    <span className="font-bold text-slate-500 uppercase text-[9px] tracking-wider block">🚚 მიწოდების სტატუსი</span>
                                    {h.courierConfirmed ? (
                                      <div className="flex flex-wrap items-center gap-3">
                                        {h.deliveryStatus === 'failed' ? (
                                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-800">❌ ვერ ჩაბარდა</span>
                                        ) : (
                                          <>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">✅ ჩაბარებულია</span>
                                            <span className="font-medium text-slate-700">💰 გადახდილი: <strong className="text-emerald-600 font-black">{h.amountPaid?.toFixed(2)} ₾</strong></span>
                                            <span className="font-medium text-slate-700">⚠️ დარჩენილი ვალი (ნისია): <strong className={h.amountRemaining > 0 ? 'text-red-600 font-black' : 'text-slate-500 font-bold'}>{h.amountRemaining?.toFixed(2)} ₾</strong></span>
                                          </>
                                        )}
                                        <span className="text-[10px] text-slate-400">📅 დადასტურდა: {h.courierConfirmedAt}</span>
                                      </div>
                                    ) : (
                                      <span className="text-slate-400 font-bold italic">⏳ კურიერის მოლოდინში... (გაგზავნილია მიწოდებაზე)</span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      setEditingDeliveryOrderId(h.id);
                                      setAdminAmountPaid((h.amountPaid !== undefined ? h.amountPaid : h.totalPrice).toString());
                                      setAdminDeliveryStatus(h.deliveryStatus || 'delivered');
                                    }}
                                    className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 transition"
                                  >
                                    ✏️ კორექტირება
                                  </button>
                                </div>
                              )}
                            </div>

                            <table className="w-full text-left text-[11px] sm:text-xs">
                              <thead className="bg-slate-100 text-slate-600 font-bold border-b">
                                <tr>
                                  <th className="p-2">პროდუქტი</th>
                                  <th className="p-2 text-center">მოთხოვნა</th>
                                  <th className="p-2 text-center">მიწოდება</th>
                                  <th className="p-2 text-center">სხვაობა</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {h.items.map((item, i) => {
                                  const diff = item.quantity - item.originalQuantity;
                                  const isFullMatch = diff === 0;
                                  return (
                                    <tr key={i} className={isFullMatch ? 'bg-white' : 'bg-rose-50/70'}>
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
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= 📊 TAB 5: მუდმივი არქივი (დეტალებით) ================= */}
      {activeTab === 'archive' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fadeIn min-h-[600px] space-y-8">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">🗄️ მუდმივი არქივი & ანალიტიკა</h2>
              <p className="text-xs text-gray-500 mt-1">დახურული კვირების ისტორია და ფინანსური მონაცემები</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">საერთო ბრუნვა (ჯამური)</span>
              <span className="text-2xl font-black text-emerald-950 block mt-2">{analytics.globalSales.toFixed(2)} ₾</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Top გაყიდვადი მედიკამენტი</span>
              <span className="text-sm font-black text-blue-950 block mt-3 truncate">{analytics.topProduct}</span>
            </div>
            <div className="bg-purple-50 border border-purple-100 p-5 rounded-2xl">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block">ყველაზე მსხვილი პარტნიორი</span>
              <span className="text-sm font-black text-purple-950 block mt-3 truncate">{analytics.topClient}</span>
            </div>
          </div>

          {weeklyArchives.length === 0 ? (
            <div className="text-center py-20 text-gray-400 italic">არქივი ჯერ ცარიელია.</div>
          ) : (
            <div className="space-y-4">
              {weeklyArchives.map(arch => {
                const isWeekOpen = expandedArchiveWeek === arch.id;
                return (
                  <div key={arch.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/20">
                    <div onClick={() => toggleArchiveWeek(arch.id)} className={`flex justify-between items-center p-4 cursor-pointer transition ${isWeekOpen ? 'bg-indigo-50/60 border-b border-indigo-100' : 'bg-slate-50 hover:bg-slate-100'}`}>
                      <div>
                        <span className="font-black text-slate-800 text-sm">კვირის დახურვა: <span className="text-indigo-600 ml-1">{arch.closedDate}</span></span>
                        <div className="flex gap-4 text-[11px] text-gray-500 mt-1 font-medium">
                          <span>📦 შეკვეთები: {arch.ordersCount}</span>
                          <span>💰 ბრუნვა: {arch.totalSales.toFixed(2)} ₾</span>
                        </div>
                      </div>
                      <span className="text-slate-400 bg-white border px-2 py-1 rounded-md text-[10px] font-bold">{isWeekOpen ? 'დამალვა ▲' : 'დეტალები ▼'}</span>
                    </div>

                    {/* 👁️ გააქტიურებული კვირის შეკვეთების სია */}
                    {isWeekOpen && (
                      <div className="p-4 bg-white space-y-3 border-t">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">📥 ამ კვირაში შესრულებული შეკვეთები:</p>
                        {arch.archivedOrders && arch.archivedOrders.map((order, oIdx) => {
                          const isOrderOpen = expandedArchiveOrder === order.id;
                          return (
                            <div key={order.id || oIdx} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/30">
                              <div onClick={() => toggleArchiveOrder(order.id)} className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-50">
                                <div>
                                  <span className="font-bold text-xs text-slate-800">🏪 {order.partner}</span>
                                  <span className="text-[10px] text-gray-400 ml-3">📅 {order.completedAt || order.createdAt}</span>
                                  {order.courierConfirmed ? (
                                    order.deliveryStatus === 'failed' ? (
                                      <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[8px] font-black bg-red-100 text-red-800 uppercase">❌ ვერ ჩაბარდა</span>
                                    ) : order.paymentStatus === 'paid' ? (
                                      <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[8px] font-black bg-emerald-100 text-emerald-800 uppercase">✅ გადახდილი</span>
                                    ) : order.paymentStatus === 'partial' ? (
                                      <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-100 text-amber-800 uppercase">⚠️ ნაწ. ვალი</span>
                                    ) : (
                                      <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[8px] font-black bg-slate-100 text-slate-700 uppercase">💵 ნისია</span>
                                    )
                                  ) : (
                                    <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[8px] font-black bg-slate-100 text-slate-400 uppercase">⏳ უცნობია</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-mono font-black text-indigo-600">{order.totalPrice.toFixed(2)} ₾</span>
                                  <span className="text-[10px] text-slate-400">{isOrderOpen ? '▲' : '▼'}</span>
                                </div>
                              </div>

                              {/* 💊 კონკრეტული შეკვეთის წამლების სია */}
                              {isOrderOpen && (
                                <div className="p-3 bg-white border-t space-y-3">
                                  {/* 🚚 ჩაბარების საინფორმაციო ბლოკი */}
                                  <div className="bg-slate-50 p-2.5 rounded-xl border text-[11px] text-slate-500 font-bold space-y-1">
                                    <span className="text-slate-400 font-black uppercase text-[9px] block">🚚 მიწოდების დეტალები:</span>
                                    {order.courierConfirmed ? (
                                      <div className="flex flex-wrap gap-4">
                                        {order.deliveryStatus === 'failed' ? (
                                          <span className="text-red-600 font-black">❌ მიწოდება ვერ განხორციელდა (უარი ჩაბარებაზე)</span>
                                        ) : (
                                          <>
                                            <span>✅ ჩაბარდა წარმატებით</span>
                                            <span>💵 გადახდილი: <strong className="text-emerald-600 font-black">{order.amountPaid?.toFixed(2)} ₾</strong></span>
                                            <span>⚠️ დარჩენილი ვალი (ნისია): <strong className={order.amountRemaining > 0 ? 'text-red-600 font-black' : 'text-slate-500 font-bold'}>{order.amountRemaining?.toFixed(2)} ₾</strong></span>
                                          </>
                                        )}
                                        <span>📅 დადასტურების თარიღი: {order.courierConfirmedAt}</span>
                                      </div>
                                    ) : (
                                      <span className="text-slate-400 italic">⏳ კურიერის ინფორმაცია არ ფიქსირდება</span>
                                    )}
                                  </div>
                                  <table className="w-full text-left text-[11px]">
                                    <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                                      <tr>
                                        <th className="p-2">მედიკამენტი</th>
                                        <th className="p-2 text-center">რაოდენობა</th>
                                        <th className="p-2 text-right">ფასი</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                      {order.items && order.items.map((item, iIdx) => (
                                        <tr key={iIdx}>
                                          <td className="p-2 font-medium text-slate-700">{item.product.name}</td>
                                          <td className="p-2 text-center font-mono font-bold text-slate-600">{item.quantity}ც</td>
                                          <td className="p-2 text-right font-mono text-slate-600">{(item.product.price).toFixed(2)} ₾</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: მართვის პანელი (განახლებული სერჩით) ================= */}
      {activeTab === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-4">💊 პროდუქციის ბაზის მართვა</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-slate-50 p-4 rounded-xl border">
                <div className="col-span-2 sm:col-span-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">ძირითადი ინფორმაცია (ახალი პროდუქტი)</p>
                  <div className="flex gap-2">
                    <input type="text" placeholder="პროდუქტის დასახელება" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="w-full p-2 border rounded-lg text-xs outline-none" />
                    <input type="text" placeholder="შტრიხკოდი / სარეგ. N" value={newProdBarcode} onChange={e => setNewProdBarcode(e.target.value)} className="w-full p-2 border rounded-lg text-xs outline-none border-blue-200" />
                  </div>
                </div>

                {/* ახალი პროდუქტის დამატებისას 2 ფასი */}
                <input type="number" step="0.01" placeholder="საცალო ფასი" value={newProdRetailPrice} onChange={e => setNewProdRetailPrice(e.target.value)} className="p-2 border rounded-lg text-xs outline-none border-emerald-200" />
                <input type="number" step="0.01" placeholder="საბითუმო ფასი" value={newProdWholesalePrice} onChange={e => setNewProdWholesalePrice(e.target.value)} className="p-2 border rounded-lg text-xs outline-none border-blue-200" />
                <input type="number" placeholder="საწყისი მარაგი" value={newProdStock} onChange={e => setNewProdStock(e.target.value)} className="p-2 border rounded-lg text-xs outline-none" />
                <input type="text" placeholder="მოცულობა (მაგ: 1ლ)" value={newProdVolume} onChange={e => setNewProdVolume(e.target.value)} className="p-2 border rounded-lg text-xs outline-none" />
                <input type="text" placeholder="კატეგორია" value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="p-2 border rounded-lg text-xs outline-none" />

                <select value={newProdUnit} onChange={e => setNewProdUnit(e.target.value)} className="p-2 border rounded-lg text-xs outline-none bg-white">
                  <option value="1">ცალი (1)</option>
                  <option value="2">კგ (2)</option>
                  <option value="3">ლიტრი (3)</option>
                </select>

                <select value={newProdVat} onChange={e => setNewProdVat(e.target.value)} className="p-2 border rounded-lg text-xs outline-none bg-white">
                  <option value="0">დღგ 18% (0)</option>
                  <option value="1">ნულოვანი (1)</option>
                  <option value="2">დაუბეგრავი (2)</option>
                </select>
                {/* 👈 ახალი Checkbox */}
                <label className="flex items-center justify-center gap-2 p-2 border rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold cursor-pointer">
                  <input type="checkbox" checked={newProdIsMed} onChange={e => setNewProdIsMed(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                  💊 არის მედიკამენტი?
                </label>

                <button type="button" onClick={handleAddProduct} className="col-span-2 sm:col-span-4 bg-indigo-600 text-white p-2.5 rounded-lg text-xs font-bold hover:bg-indigo-700 mt-2">ახალი პროდუქტის დამატება +</button>
              </div>

              {/* 🔍 ახალი ორენოვანი საძიებო ველი ადმინის გვერდისთვის */}
              <div className="mb-4 bg-slate-100 p-2 rounded-xl">
                <input
                  type="text"
                  placeholder="🔍 მოძებნე მედიკამენტი ბაზაში დასარედაქტირებლად..."
                  value={adminSearchQuery}
                  onChange={e => setAdminSearchQuery(e.target.value)}
                  className="w-full p-2 border rounded-lg bg-white text-xs outline-none font-medium"
                />
              </div>

              {/* 📋 პროდუქტების სია დინამიური რედაქტირების ფორმით */}

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">

                {adminFilteredProducts.map(p => (

                  <div key={p.id} className="p-4 border rounded-xl bg-slate-50/30 shadow-sm border-slate-100 transition-all">

                    {editingProductId === p.id ? (

                      /* ✍️ აქ იხსნება სრული რედაქტირების ფორმა */

                      <div className="space-y-3 bg-white p-3 rounded-xl border border-amber-200">

                        <p className="text-[10px] font-bold text-amber-600 uppercase">პროდუქტის რედაქტირება</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                          <input type="text" value={editProdName} onChange={e => setEditProdName(e.target.value)} className="p-2 border rounded-lg text-xs font-bold bg-slate-50" placeholder="სახელი" />

                          <input type="text" value={editProdBarcode} onChange={e => setEditProdBarcode(e.target.value)} className="p-2 border rounded-lg text-xs font-mono" placeholder="შტრიხკოდი" />

                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">

                          {/* რედაქტირებისას 2 ფასი */}
                          <div>
                            <label className="text-[9px] text-gray-400 block font-bold">საცალო</label>
                            <input type="number" step="0.01" value={editProdRetailPrice} onChange={e => setEditProdRetailPrice(e.target.value)} className="w-full p-2 border rounded-lg text-xs text-center font-bold text-emerald-600" />
                          </div>
                          <div>
                            <label className="text-[9px] text-gray-400 block font-bold">საბითუმო</label>
                            <input type="number" step="0.01" value={editProdWholesalePrice} onChange={e => setEditProdWholesalePrice(e.target.value)} className="w-full p-2 border rounded-lg text-xs text-center font-bold text-blue-600" />
                          </div>

                          <div>

                            <label className="text-[9px] text-gray-400 block font-bold">მარაგი</label>

                            <input type="number" value={editProdStock} onChange={e => setEditProdStock(e.target.value)} className="w-full p-2 border rounded-lg text-xs text-center font-bold" />

                          </div>

                          <div>

                            <label className="text-[9px] text-gray-400 block font-bold">ბრაკი</label>

                            <input type="number" value={editProdDamaged} onChange={e => setEditProdDamaged(e.target.value)} className="w-full p-2 border rounded-lg text-xs text-center font-bold text-rose-600" />

                          </div>

                          <div>

                            <label className="text-[9px] text-gray-400 block font-bold">მოცულობა</label>

                            <input type="text" value={editProdVolume} onChange={e => setEditProdVolume(e.target.value)} className="w-full p-2 border rounded-lg text-xs text-center" />

                          </div>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

                          <input type="text" value={editProdCategory} onChange={e => setEditProdCategory(e.target.value)} className="p-2 border rounded-lg text-xs" placeholder="კატეგორია" />



                          <select value={editProdUnit} onChange={e => setEditProdUnit(e.target.value)} className="p-2 border rounded-lg text-xs bg-white">

                            <option value="1">ცალი (1)</option>

                            <option value="2">კგ (2)</option>

                            <option value="3">ლიტრი (3)</option>

                          </select>



                          <select value={editProdVat} onChange={e => setEditProdVat(e.target.value)} className="p-2 border rounded-lg text-xs bg-white">

                            <option value="0">დღგ 18% (0)</option>

                            <option value="1">ნულოვანი (1)</option>

                            <option value="2">დაუბეგრავი (2)</option>

                          </select>
                          {/* 👈 ახალი Checkbox */}
                          <label className="flex items-center gap-2 p-2 border rounded-lg bg-amber-50 text-amber-700 text-xs font-bold cursor-pointer">
                            <input type="checkbox" checked={editProdIsMed} onChange={e => setEditProdIsMed(e.target.checked)} className="w-4 h-4 cursor-pointer" />
                            💊 მედიკამენტია
                          </label>

                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t">

                          <button type="button" onClick={() => setEditingProductId(null)} className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold">გაუქმება</button>

                          <button type="button" onClick={() => saveProductEdit(p.id)} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm">შენახვა ✓</button>

                        </div>

                      </div>

                    ) : (

                      /* 👁️ ჩვეულებრივი ჩვენების რეჟიმი */

                      <div className="flex justify-between items-center">

                        <div>

                          <span className="font-bold text-sm text-slate-800">{p.name}</span>

                          <span className="text-[10px] text-gray-500 block mt-0.5">

                            შტრიხკოდი: <span className="font-mono text-slate-700 font-bold">{p.barcode || 'N/A'}</span> |

                            მოცულობა: <span className="font-bold">{p.volume || 'N/A'}</span> |

                            მარაგი: <span className="text-emerald-600 font-bold">{p.stock}ც</span> |

                            ბრაკი: <span className="text-rose-600 font-bold">{p.damaged || 0}ც</span>

                          </span>

                          <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mt-1 inline-block font-medium">

                            დღგ: {p.vatType === 2 ? 'დაუბეგრავი' : p.vatType === 1 ? 'ნულოვანი' : '18%'} | ერთეული კოდი: {p.unitId || 1}

                          </span>

                        </div>

                        <div className="flex gap-2">

                          <button type="button" onClick={() => startEditProduct(p)} className="bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1.5 rounded-md text-[10px] font-bold transition">შეცვლა</button>

                          <button type="button" onClick={() => handleDeleteProduct(p.id)} className="bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1.5 rounded-md text-[10px] font-bold transition">წაშლა</button>

                        </div>

                      </div>

                    )}

                  </div>

                ))}

              </div>
            </div>
          </div>

          <div className="space-y-8">

            {/* 1. 🔐 RS.ge-ს ავტორიზაციის პანელი (ახლა უკვე სულ ზემოთ არის) */}
            <form onSubmit={(e) => { e.preventDefault(); saveRSCredentials(); }} className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 text-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2"><span>🛡️</span> RS.ge ავტორიზაცია</h2>
                  <p className="text-[10px] text-emerald-400 mt-1">მიმდინარე იუზერი: <span className="font-bold">{savedRsUser}</span></p>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="მომხმარებელი (მაგ: tbilisi)"
                  value={rsUsername}
                  onChange={e => setRsUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full p-2.5 border border-slate-700 rounded-lg text-xs bg-slate-800 text-white outline-none focus:border-blue-500"
                />
                <input
                  type="password"
                  placeholder="პაროლი (მაგ: 123456)"
                  value={rsPassword}
                  onChange={e => setRsPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full p-2.5 border border-slate-700 rounded-lg text-xs bg-slate-800 text-white outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                >
                  მონაცემების შენახვა ✓
                </button>
              </div>
            </form>

            {/* 2. 🤝 პარტნიორების ბაზა (ლიმიტით და "ყველას ნახვა" ფუნქციით) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-4">🤝 პარტნიორების ბაზა</h2>
              <div className="flex flex-col gap-2 mb-4 bg-slate-50 p-3 rounded-xl border">
                <input type="text" placeholder="ობიექტის სახელი" value={newPartnerName} onChange={e => setNewPartnerName(e.target.value)} className="p-2 border rounded-lg text-xs outline-none bg-white" />
                <input type="text" placeholder="საიდენტიფიკაციო კოდი" value={newPartnerTin} onChange={e => setNewPartnerTin(e.target.value)} className="p-2 border rounded-lg text-xs outline-none border-blue-200 bg-white" />
                <input type="text" placeholder="მიწოდების მისამართი" value={newPartnerAddress} onChange={e => setNewPartnerAddress(e.target.value)} className="p-2 border rounded-lg text-xs outline-none bg-white" />
                <select value={newPartnerType} onChange={e => setNewPartnerType(e.target.value)} className="p-2 border rounded-lg text-xs outline-none bg-white font-bold text-indigo-700">
                  <option value="საცალო">🏪 საცალო (Retail)</option>
                  <option value="საბითუმო">🏭 საბითუმო (Wholesale)</option>
                </select>
                <button type="button" onClick={handleAddPartner} className="bg-purple-600 text-white px-3 py-2 rounded-lg text-xs font-bold mt-1">დამატება</button>
              </div>

              <div className="space-y-2">
                {partners.slice(0, showAllPartners ? partners.length : 3).map(partner => (
                  <div key={partner.id} className="p-2.5 border rounded-xl bg-slate-50/30 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-700 block">{partner.name}</span>
                      <span className="text-[10px] text-gray-400">ს/ნ: {partner.tin}</span>
                    </div>
                    <button type="button" onClick={() => handleDeletePartner(partner.id)} className="bg-rose-500 text-white px-2 py-1 rounded-md text-[10px] font-bold">X</button>
                  </div>
                ))}
              </div>

              {partners.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllPartners(!showAllPartners)}
                  className="w-full mt-3 text-center text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 p-2 rounded-xl transition"
                >
                  {showAllPartners ? '▲ დამალვა' : `▼ ყველა პარტნიორის ნახვა (${partners.length})`}
                </button>
              )}
            </div>

            {/* 3. 🚚 მომწოდებლების კატალოგი (ლიმიტით და "ყველას ნახვა" ფუნქციით) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-900 mb-4">🚚 მომწოდებლების კატალოგი</h2>
              <div className="flex gap-1 mb-4 bg-slate-50 p-2 rounded-xl border">
                <input type="text" placeholder="მომწოდებლის სახელი" value={newSupplierName} onChange={e => setNewSupplierName(e.target.value)} className="flex-1 p-2 border rounded-lg text-xs outline-none bg-white" />
                <button type="button" onClick={handleAddSupplier} className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700">დამატება</button>
              </div>

              <div className="space-y-2">
                {suppliers.slice(0, showAllSuppliers ? suppliers.length : 3).map(s => (
                  <div key={s.id} className="p-2.5 bg-slate-50/30 border rounded-xl flex justify-between items-center text-xs font-medium text-slate-700">
                    <span>🏢 {s.name}</span>
                    {/* აქაც შეგიძლია მომავალში წაშლის ღილაკი ჩაამატო თუ დაგჭირდება */}
                  </div>
                ))}
              </div>

              {suppliers.length > 3 && (
                <button
                  type="button"
                  onClick={() => setShowAllSuppliers(!showAllSuppliers)}
                  className="w-full mt-3 text-center text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 p-2 rounded-xl transition"
                >
                  {showAllSuppliers ? '▲ დამალვა' : `▼ ყველა მომწოდებლის ნახვა (${suppliers.length})`}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ================= 🔴 TAB: გრძელვადიანი ნისიები & ვალები ================= */}
      {activeTab === 'debts_tab' && (
        <div className="space-y-6 animate-fadeIn">
          {/* ვალების ჯამური პანელი */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">🔴 ჯამური გადაუხდელი ვალები (ნისიები)</span>
              <span className="text-2xl font-black text-rose-950 block mt-2">
                {debtOrders.reduce((sum, o) => sum + (o.amountRemaining || 0), 0).toFixed(2)} ₾
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">👥 აქტიური მევალეები</span>
              <span className="text-2xl font-black text-slate-800 block mt-2">
                {new Set(debtOrders.map(o => o.partner)).size} კომპანია
              </span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block">💵 ჯამური რეალური გაყიდვები (ვალების გარდა)</span>
              <span className="text-2xl font-black text-emerald-950 block mt-2">
                {history.reduce((sum, o) => sum + (o.amountPaid || 0), 0).toFixed(2)} ₾
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[500px] space-y-6">
            <div>
              <h2 className="text-lg font-black text-slate-900">🔴 კლიენტების ნისიების (ვალების) ჟურნალი</h2>
              <p className="text-xs text-gray-500 mt-1">ყველა მიმდინარე და დაარქივებული კვირის აქტიური ვალები</p>
            </div>

            {(() => {
              const groupedDebts = (() => {
                const groups = {};
                debtOrders.forEach(order => {
                  const pName = order.partner || 'უცნობი პარტნიორი';
                  if (!groups[pName]) {
                    groups[pName] = {
                      partnerName: pName,
                      partnerAddress: order.partnerAddress || 'არ არის მითითებული',
                      partnerType: order.partnerType || 'საცალო',
                      orders: [],
                      totalDebt: 0
                    };
                  }
                  groups[pName].orders.push(order);
                  groups[pName].totalDebt += (order.amountRemaining || 0);
                });
                return Object.values(groups).sort((a, b) => b.totalDebt - a.totalDebt);
              })();

              if (groupedDebts.length === 0) {
                return (
                  <div className="text-center py-20 border border-dashed rounded-2xl border-slate-200 text-gray-400 italic text-sm">
                    აქტიური ნისიები (ვალები) არ ფიქსირდება! 🎉 ყველა შეკვეთა გადახდილია.
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {groupedDebts.map((debtor, idx) => {
                    const isExpanded = expandedDebtorPartner === debtor.partnerName;

                    return (
                      <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/20">
                        {/* Debtor header row */}
                        <div
                          onClick={() => setExpandedDebtorPartner(isExpanded ? null : debtor.partnerName)}
                          className="p-4 bg-white hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100"
                        >
                          <div>
                            <h3 className="font-black text-slate-800 text-sm sm:text-base flex items-center gap-2">
                              🏪 {debtor.partnerName}
                              <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase bg-rose-100 text-rose-800">
                                {debtor.partnerType}
                              </span>
                            </h3>
                            <p className="text-[10px] text-gray-400 mt-1">📍 მისამართი: {debtor.partnerAddress}</p>
                          </div>
                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase">ჯამური ვალი:</span>
                              <span className="text-base font-black text-rose-600">
                                {debtor.totalDebt.toFixed(2)} ₾
                              </span>
                            </div>
                            <span className="text-slate-400 font-bold bg-slate-100 border px-2.5 py-1 rounded-lg text-xs text-center">
                              {isExpanded ? 'დამალვა ▲' : `დეტალები (${debtor.orders.length} შეკვეთა) ▼`}
                            </span>
                          </div>
                        </div>

                        {/* Debtor orders sublist */}
                        {isExpanded && (
                          <div className="p-4 bg-slate-50/20 space-y-4 border-t divide-y divide-slate-100">
                            {debtor.orders.map((o, oIdx) => {
                              const isEditing = editingDeliveryOrderId === o.id;

                              return (
                                <div key={o.id || oIdx} className="pt-4 first:pt-0 space-y-3">
                                  <div className="flex justify-between items-start text-xs gap-3">
                                    <div>
                                      <span className="font-bold text-slate-700">📦 შეკვეთა #{o.id.substring(0, 6)}...</span>
                                      <p className="text-[10px] text-slate-400 mt-0.5">
                                        📅 გაფორმდა: {o.createdAt} | 🚚 ჩაბარდა: {o.courierConfirmedAt || 'უცნობია'}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <span className="font-bold block text-slate-800">ღირებულება: {o.totalPrice.toFixed(2)} ₾</span>
                                      <span className="text-[10px] text-emerald-600 font-bold block">გადახდილი: {o.amountPaid?.toFixed(2) || 0} ₾</span>
                                      <span className="text-[10px] text-rose-600 font-black block">დარჩენილი: {o.amountRemaining?.toFixed(2)} ₾</span>
                                    </div>
                                  </div>

                                  {/* Order products summary in debt row */}
                                  <div className="bg-white/60 p-2.5 rounded-xl border text-[10px] text-slate-500 font-medium">
                                    <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">შეკვეთილი მედიკამენტები:</span>
                                    {o.items.map((it, itIdx) => (
                                      <span key={itIdx} className="inline-block bg-slate-100/80 px-2 py-0.5 rounded mr-2 mb-1">
                                        {it.product.name} ({it.quantity}ც)
                                      </span>
                                    ))}
                                  </div>

                                  {/* Payment Reconciliation Block */}
                                  {isEditing ? (
                                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 max-w-md shadow-inner">
                                      <div className="font-black text-slate-700 text-[10px] uppercase tracking-wide border-b pb-1.5 mb-2">💸 ვალის დაფარვა/კორექტირება:</div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">გადახდის სტატუსი</label>
                                          <select
                                            value={adminDeliveryStatus}
                                            onChange={e => setAdminDeliveryStatus(e.target.value)}
                                            className="w-full p-2 border rounded bg-white font-bold text-xs outline-none focus:ring-1 focus:ring-rose-500"
                                          >
                                            <option value="delivered">✅ ჩაბარდა (მიეწოდა)</option>
                                            <option value="failed">❌ ვერ ჩაბარდა (გაუქმება)</option>
                                          </select>
                                        </div>
                                        {adminDeliveryStatus === 'delivered' && (
                                          <div>
                                            <label className="block text-[9px] text-slate-400 font-bold uppercase mb-1">ახალი გადახდილი თანხა (₾)</label>
                                            <input
                                              type="number"
                                              step="0.01"
                                              value={adminAmountPaid}
                                              onChange={e => setAdminAmountPaid(e.target.value)}
                                              className="w-full p-2 border rounded bg-white font-black text-xs text-slate-800 outline-none focus:ring-1 focus:ring-rose-500"
                                            />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => setEditingDeliveryOrderId(null)}
                                          className="px-3 py-1.5 rounded bg-slate-200 text-slate-700 font-bold hover:bg-slate-300 text-[10px] transition"
                                        >
                                          გაუქმება
                                        </button>
                                        <button
                                          onClick={() => handleSaveDeliveryEdits(o)}
                                          className="px-3 py-1.5 rounded bg-rose-600 text-white font-black hover:bg-rose-700 text-[10px] transition shadow-md shadow-rose-100"
                                        >
                                          გადახდის შენახვა ✓
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex justify-end pt-1">
                                      <button
                                        onClick={() => {
                                          setEditingDeliveryOrderId(o.id);
                                          setAdminAmountPaid((o.amountPaid || 0).toString());
                                          setAdminDeliveryStatus(o.deliveryStatus || 'delivered');
                                        }}
                                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg text-[10px] transition shadow-sm hover:shadow flex items-center gap-1"
                                      >
                                        💰 ვალის დაფარვა / რედაქტირება
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ================= 📊 MODALS FOR WEEKLY SUMMARY BREAKDOWNS ================= */}
      {activeSummaryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto border border-slate-100 animate-scaleIn">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-900">
                {activeSummaryModal === 'collected' ? '💵 მიმდინარე კვირაში შეგროვებული თანხები' : '⚠️ მიმდინარე კვირის ნისიები (ვალები)'}
              </h3>
              <button
                onClick={() => setActiveSummaryModal(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
              >
                დახურვა ✕
              </button>
            </div>

            <div className="space-y-2">
              {(() => {
                const modalOrders = history.filter(o => {
                  if (activeSummaryModal === 'collected') {
                    return o.courierConfirmed && (o.amountPaid || 0) > 0;
                  } else {
                    return (o.amountRemaining || 0) > 0;
                  }
                });

                if (modalOrders.length === 0) {
                  return <p className="text-gray-400 italic text-center py-6 text-xs">შესაბამისი შეკვეთები არ იძებნება.</p>;
                }

                return (
                  <div className="divide-y max-h-[50vh] overflow-y-auto pr-1">
                    {modalOrders.map((o, idx) => (
                      <div key={o.id || idx} className="py-3 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                        <div>
                          <span className="font-bold text-slate-800 text-sm">🏪 {o.partner}</span>
                          <div className="text-[10px] text-gray-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                            <span>📍 მისამართი: {o.partnerAddress || 'არ არის'}</span>
                            <span>📅 თარიღი: {o.courierConfirmedAt || o.completedAt || o.createdAt}</span>
                          </div>
                        </div>
                        <div className="text-right whitespace-nowrap bg-slate-100/50 p-2 rounded-xl border border-slate-200/40">
                          <span className="block font-bold text-slate-400 text-[9px] uppercase">შეკვეთის ჯამი: {o.totalPrice.toFixed(2)} ₾</span>
                          {activeSummaryModal === 'collected' ? (
                            <span className="font-black text-emerald-600 block text-xs">💵 გადახდილი: {o.amountPaid?.toFixed(2)} ₾</span>
                          ) : (
                            <span className="font-black text-rose-600 block text-xs">⚠️ დარჩენილი: {o.amountRemaining?.toFixed(2)} ₾</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}