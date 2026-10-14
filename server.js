const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. मिडलवेयर कॉन्फ़िगरेशन (Middleware Setup)
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ==========================================
// 2. डेटाबेस फाइल्स के रास्ते (File Paths)
// ==========================================
const PRODUCTS_FILE = './products.json';
const ORDERS_FILE = './orders.json';
const USERS_FILE = './users.json';

// ==========================================
// 3. डिफ़ॉल्ट 25 प्रोडक्ट्स की विस्तृत लिस्ट
// ==========================================
const defaultProductsList = [
    {
        id: 101,
        name: "उत्तम रिचार्ज NPK 0:52:34 (1kg)",
        price: 240,
        stock: 50,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400"
    },
    {
        id: 102,
        name: "सेमिनिस अभिलाष हाइब्रिड टमाटर बीज",
        price: 450,
        stock: 30,
        category: "beej",
        image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400"
    },
    {
        id: 103,
        name: "क्रॉस-एक्स कीटनाशक दवा (150ml)",
        price: 380,
        stock: 40,
        category: "dawai",
        image: "https://images.pexels.com/photos/2581077/pexels-photo-2581077.jpeg?w=400"
    },
    {
        id: 104,
        name: "आनंददाता मैग्नीशियम सल्फेट (25kg)",
        price: 420,
        stock: 25,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400"
    },
    {
        id: 105,
        name: "सेमिनिस शारदा हाइब्रिड लौकी बीज",
        price: 220,
        stock: 35,
        category: "beej",
        image: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?w=400"
    },
    {
        id: 106,
        name: "सेमिनिस जामिनी हाइब्रिड खीरा बीज",
        price: 250,
        stock: 40,
        category: "beej",
        image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=400"
    },
    {
        id: 107,
        name: "उत्तम सल्फीनो गोल्ड सल्फर 90% (3kg)",
        price: 290,
        stock: 45,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=400"
    },
    {
        id: 108,
        name: "ऑर्गेनिक कार्बन जैव उर्वरक (1kg)",
        price: 320,
        stock: 20,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
    },
    {
        id: 109,
        name: "श्रीराम वरदान मोनो जिंक 33% (5kg)",
        price: 480,
        stock: 30,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400"
    },
    {
        id: 110,
        name: "यूनिसेम USM-प्रिंस हाइब्रिड पत्तागोभी",
        price: 260,
        stock: 50,
        category: "beej",
        image: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400"
    },
    {
        id: 111,
        name: "उन्नति NPK 20-20-10 (50kg)",
        price: 2450,
        stock: 60,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400"
    },
    {
        id: 112,
        name: "उन्नति NPK 12-32-16 (50kg)",
        price: 2100,
        stock: 55,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400"
    },
    {
        id: 113,
        name: "श्रीफल कैल्शियम मैग्नीशियम सल्फर",
        price: 250,
        stock: 70,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=400"
    },
    {
        id: 114,
        name: "प्रगति PROM ऑर्गेनिक कार्बन (50kg)",
        price: 1350,
        stock: 40,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
    },
    {
        id: 115,
        name: "कृषि उन्नति पोटाश POTASH (50kg)",
        price: 2350,
        stock: 50,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400"
    },
    {
        id: 116,
        name: "प्रगति सुपर उर्वरक (50kg)",
        price: 300,
        stock: 65,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400"
    },
    {
        id: 117,
        name: "एनएफएल किसान बेंटोनाइट सल्फर 90%",
        price: 850,
        stock: 40,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?w=400"
    },
    {
        id: 118,
        name: "ऑर्गेनिक कार्बन नेचुरल (25kg Drum)",
        price: 1400,
        stock: 20,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
    },
    {
        id: 119,
        name: "अमीनो एसिड 80% पाउडर (1kg)",
        price: 350,
        stock: 30,
        category: "dawai",
        image: "https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?w=400"
    },
    {
        id: 120,
        name: "फल्विक एसिड पाउडर (1kg)",
        price: 380,
        stock: 25,
        category: "dawai",
        image: "https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?w=400"
    },
    {
        id: 121,
        name: "सीवीड एक्सट्रैक्ट फ्लेक्स (1kg)",
        price: 400,
        stock: 35,
        category: "khaad",
        image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400"
    },
    {
        id: 122,
        name: "हाइब्रिड धान बीज (3kg)",
        price: 1350,
        stock: 40,
        category: "beej",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
    },
    {
        id: 123,
        name: "रिसर्च धान बीज (10kg)",
        price: 1250,
        stock: 35,
        category: "beej",
        image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=400"
    },
    {
        id: 124,
        name: "उत्तम गेहूं बीज (40kg)",
        price: 1750,
        stock: 50,
        category: "beej",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400"
    },
    {
        id: 125,
        name: "रिसर्च गेहूं बीज (20kg)",
        price: 1450,
        stock: 45,
        category: "beej",
        image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400"
    }
];

// ==========================================
// 4. सेफ़ फाइल रीडर और राइटर फंक्शंस
// ==========================================

// JSON फाइल से सुरक्षित तरीके से डेटा पढ़ना
const readJSON = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
            return [];
        }
        
        const fileData = fs.readFileSync(filePath, 'utf8').trim();
        
        if (!fileData) {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
            return [];
        }
        
        return JSON.parse(fileData);
    } catch (error) {
        console.error(`फाइल पढ़ने में गड़बड़ी हुई (${filePath}):`, error);
        return [];
    }
};

// JSON फाइल में डेटा सुरक्षित तरीके से लिखना
const writeJSON = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`फाइल सेव करने में त्रुटि (${filePath}):`, error);
    }
};

// ==========================================
// 5. फाइलों का ऑटोमैटिक सेटअप
// ==========================================

if (!fs.existsSync(PRODUCTS_FILE)) {
    writeJSON(PRODUCTS_FILE, defaultProductsList);
    console.log("👉 products.json फाइल सफलता से बन गई!");
}

if (!fs.existsSync(ORDERS_FILE)) {
    writeJSON(ORDERS_FILE, []);
    console.log("👉 orders.json फाइल सफलता से बन गई!");
}

if (!fs.existsSync(USERS_FILE)) {
    writeJSON(USERS_FILE, []);
    console.log("👉 users.json फाइल सफलता से बन गई!");
}

// ==========================================
// 6. एपीआई राउट्स (CUSTOMER APIS)
// ==========================================

// 6.1 उत्पादों की सूची प्राप्त करें (कैटेगरी फ़िल्टर के साथ)
app.get('/api/products', (req, res) => {
    try {
        let products = readJSON(PRODUCTS_FILE);
        
        if (req.query.category) {
            products = products.filter(function (product) {
                return product.category === req.query.category;
            });
        }
        
        res.json(products);
    } catch (error) {
        console.error("Products Fetch Error:", error);
        res.status(500).json({
            success: false,
            message: "उत्पाद लोड करने में आंतरिक त्रुटि!"
        });
    }
});

// 6.2 ग्राहक रजिस्ट्रेशन एपीआई
app.post('/api/user/register', (req, res) => {
    try {
        const name = req.body.name;
        const phone = req.body.phone;
        const address = req.body.address;
        const password = req.body.password;

        if (!name || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "कृपया नाम, मोबाइल नंबर और पासवर्ड पूरा भरें!"
            });
        }

        let users = readJSON(USERS_FILE);
        let existingUser = users.find(function (user) {
            return user.phone === phone;
        });

        if (existingUser && existingUser.password) {
            return res.status(400).json({
                success: false,
                message: "यह मोबाइल नंबर पहले से रजिस्टर है! कृपया लॉगिन करें।"
            });
        }

        if (existingUser) {
            existingUser.name = name;
            existingUser.address = address || existingUser.address || "";
            existingUser.password = password;
        } else {
            const newUser = {
                id: Date.now(),
                name: name,
                phone: phone,
                address: address || "",
                password: password
            };
            users.push(newUser);
        }

        writeJSON(USERS_FILE, users);

        res.json({
            success: true,
            message: "रजिस्ट्रेशन सफलतापूर्वक हो गया!",
            user: {
                name: name,
                phone: phone,
                address: address || ""
            }
        });
    } catch (error) {
        console.error("User Register Error:", error);
        res.status(500).json({
            success: false,
            message: "रजिस्ट्रेशन में सर्वर त्रुटि!"
        });
    }
});

// 6.3 ग्राहक लॉगिन एपीआई
app.post('/api/user/login', (req, res) => {
    try {
        const phone = req.body.phone;
        const password = req.body.password;

        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "मोबाइल नंबर और पासवर्ड दोनों भरना आवश्यक है!"
            });
        }

        let users = readJSON(USERS_FILE);
        let user = users.find(function (u) {
            return u.phone === phone && u.password === password;
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "गलत मोबाइल नंबर या पासवर्ड!"
            });
        }

        res.json({
            success: true,
            message: "लॉगिन सफलता से हो गया!",
            user: {
                name: user.name,
                phone: user.phone,
                address: user.address || ""
            }
        });
    } catch (error) {
        console.error("User Login Error:", error);
        res.status(500).json({
            success: false,
            message: "लॉगिन में सर्वर त्रुटि!"
        });
    }
});

// 6.4 नया आर्डर बुक करने की एपीआई
app.post('/api/orders', (req, res) => {
    try {
        const userPhone = req.body.userPhone;
        const userName = req.body.userName;
        const address = req.body.address;
        const pincode = req.body.pincode;
        const items = req.body.items;
        const totalAmount = req.body.totalAmount;
        const paymentMethod = req.body.paymentMethod;

        if (!userPhone || !userName || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "आर्डर की जानकारी अधूरी है!"
            });
        }

        let products = readJSON(PRODUCTS_FILE);
        let orders = readJSON(ORDERS_FILE);

        // आर्डर किए गए सामान का स्टॉक घटाना
        items.forEach(function (item) {
            let p = products.find(function (prod) {
                return prod.id == item.id;
            });
            if (p) {
                p.stock = Math.max(0, p.stock - parseInt(item.quantity || 1));
            }
        });
        writeJSON(PRODUCTS_FILE, products);

        const newOrder = {
            orderId: "AK" + Math.floor(100000 + Math.random() * 900000),
            userPhone: userPhone,
            userName: userName,
            address: address || "",
            pincode: pincode || "",
            items: items,
            totalAmount: totalAmount,
            paymentMethod: paymentMethod || "Cash on Delivery",
            status: "Pending",
            date: new Date().toLocaleString('hi-IN')
        };

        orders.unshift(newOrder);
        writeJSON(ORDERS_FILE, orders);

        res.json({
            success: true,
            message: "आर्डर सफलता पूर्वक दर्ज हो गया है!",
            order: newOrder
        });
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(500).json({
            success: false,
            message: "आर्डर दर्ज करने में सर्वर त्रुटि!"
        });
    }
});

// 6.5 ग्राहक के पुराने आर्डर देखने की एपीआई (Profile)
app.get('/api/orders/user/:phone', (req, res) => {
    try {
        let orders = readJSON(ORDERS_FILE);
        let userOrders = orders.filter(function (order) {
            return order.userPhone === req.params.phone;
        });
        res.json(userOrders);
    } catch (error) {
        console.error("User Orders Load Error:", error);
        res.status(500).json({
            success: false,
            message: "आर्डर लोड करने में समस्या आई!"
        });
    }
});

// ==========================================
// 7. एपीआई राउट्स (ADMIN APIS)
// ==========================================

// 7.1 एडमिन: सभी आर्डर्स की लिस्ट प्राप्त करें
app.get('/api/admin/orders', (req, res) => {
    try {
        let orders = readJSON(ORDERS_FILE);
        res.json(orders);
    } catch (error) {
        console.error("Admin Orders Load Error:", error);
        res.status(500).json({
            success: false,
            message: "एडमिन आर्डर्स लोड करने में विफल!"
        });
    }
});

// 7.2 एडमिन: आर्डर की स्थिति बदलें (Pending -> Confirmed -> Shipped -> Delivered)
app.put('/api/admin/orders/:id/status', (req, res) => {
    try {
        const newStatus = req.body.status;
        let orders = readJSON(ORDERS_FILE);

        let order = orders.find(function (o) {
            return o.orderId === req.params.id;
        });

        if (order) {
            order.status = newStatus;
            writeJSON(ORDERS_FILE, orders);
            res.json({
                success: true,
                message: "आर्डर स्थिति सफलतापूर्वक अपडेट हो गई!"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "आर्डर नहीं मिला!"
            });
        }
    } catch (error) {
        console.error("Order Status Update Error:", error);
        res.status(500).json({
            success: false,
            message: "स्टेटस अपडेट करने में सर्वर त्रुटि!"
        });
    }
});

// 7.3 एडमिन: आर्डर हमेशा के लिए डिलीट करें (Safe POST Method)
app.post('/api/admin/delete-order', (req, res) => {
    try {
        const orderIdTarget = req.body.orderId;
        let orders = readJSON(ORDERS_FILE);
        const initialCount = orders.length;

        orders = orders.filter(function (order) {
            return order.orderId !== orderIdTarget;
        });

        if (orders.length < initialCount) {
            writeJSON(ORDERS_FILE, orders);
            res.json({
                success: true,
                message: "आर्डर सफलतापूर्वक डिलीट कर दिया गया है!"
            });
        } else {
            res.status(404).json({
                success: false,
                message: "डिलीट के लिए आर्डर ID नहीं मिली!"
            });
        }
    } catch (error) {
        console.error("Order Delete Error:", error);
        res.status(500).json({
            success: false,
            message: "आर्डर डिलीट करने में सर्वर त्रुटि!"
        });
    }
});

// 7.4 एडमिन: नया उत्पाद जोड़ें या पुराना उत्पाद अपडेट करें
app.post('/api/admin/products', (req, res) => {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const price = req.body.price;
        const stock = req.body.stock;
        const category = req.body.category;
        const image = req.body.image;

        let products = readJSON(PRODUCTS_FILE);

        if (id) {
            let p = products.find(function (prod) {
                return prod.id == id;
            });
            if (p) {
                p.name = name;
                p.price = Number(price);
                p.stock = Number(stock);
                p.category = category;
                if (image) {
                    p.image = image;
                }
            }
        } else {
            const newProd = {
                id: Date.now(),
                name: name,
                price: Number(price),
                stock: Number(stock),
                category: category,
                image: image || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400"
            };
            products.push(newProd);
        }

        writeJSON(PRODUCTS_FILE, products);
        res.json({
            success: true,
            message: "उत्पाद सफलता से सुरक्षित हो गया है!"
        });
    } catch (error) {
        console.error("Admin Product Save Error:", error);
        res.status(500).json({
            success: false,
            message: "उत्पाद सुरक्षित करने में त्रुटि!"
        });
    }
});

// ==========================================
// 8. सर्वर स्टार्ट एवं लिसनर
// ==========================================
app.listen(PORT, () => {
    console.log("=================================================");
    console.log(`🚀 अनन्या कृषि सेवा सर्वर पोर्ट ${PORT} पर चालू है!`);
    console.log(`👉 लोकल यूआरएल: http://localhost:${PORT}`);
    console.log("=================================================");
});