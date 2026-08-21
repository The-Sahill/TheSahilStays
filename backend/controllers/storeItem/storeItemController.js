const StoreItem = require('../../models/storeItem/storeItem');

// إضافة عنصر جديد للمخزن
exports.addStoreItem = async (req, res) => {
  try {
    const { itemName, quantity, category } = req.body;

    if (!itemName) {
      return res.status(400).json({ error: 'اسم العنصر مطلوب' });
    }

    const newItem = await StoreItem.create({
      itemName,
      quantity: quantity || 1,
      category: category || 'عام'
    });

    res.status(201).json({ message: 'تم إضافة العنصر بنجاح', data: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
};

// عرض جميع عناصر المخزن
exports.getAllStoreItems = async (req, res) => {
  try {
    const items = await StoreItem.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
};

// تحديث كمية العنصر (زيادة أو نقصان)
exports.updateItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body; // الكمية الجديدة أو التغيير المطلوب

    if (quantity === undefined || quantity < 0) {
      return res.status(400).json({ error: 'الكمية غير صالحة' });
    }

    const updatedItem = await StoreItem.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'العنصر غير موجود' });
    }

    res.status(200).json({ message: 'تم تحديث الكمية بنجاح', data: updatedItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطأ في الخادم الداخلي' });
  }
};